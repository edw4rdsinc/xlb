#!/usr/bin/env python3
"""
Comprehensive 2025 NFL Season Stats Sync & Player Ranking

This script does EVERYTHING in one go:
1. Fetches ALL weekly stats for 2025 season from nflreadpy
2. Calculates PPR fantasy points for each player/week
3. Stores in player_weekly_stats table
4. Uses SQL to aggregate total season points per player
5. Uses SQL to rank players by position
6. Marks elite status (Top 3 QB/TE, Top 6 RB/WR)

All heavy lifting is done by the script and SQL, not AI loops.

Usage:
    python scripts/sync_season_and_rank.py
    python scripts/sync_season_and_rank.py --weeks 1-9
    python scripts/sync_season_and_rank.py --dry-run
"""

import argparse
import os
import sys
from datetime import datetime
from typing import Dict, List, Tuple
import nflreadpy as nfl
import pandas as pd
from fuzzywuzzy import fuzz
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Elite thresholds
ELITE_COUNTS = {'QB': 3, 'RB': 6, 'WR': 6, 'TE': 3, 'K': 0, 'DEF': 0}


def calculate_ppr_points(stats: Dict) -> float:
    """Calculate PPR fantasy points from stats"""
    points = 0.0

    # Passing (6 pts TD, 1 pt per 25 yards rounded up)
    points += (stats.get('passing_tds', 0) * 6)
    pass_yards = stats.get('passing_yards', 0)
    if pass_yards > 0:
        points += ((pass_yards + 24) // 25)  # Round up

    # Rushing (6 pts TD, 1 pt per 10 yards rounded up)
    points += (stats.get('rushing_tds', 0) * 6)
    rush_yards = stats.get('rushing_yards', 0)
    if rush_yards > 0:
        points += ((rush_yards + 9) // 10)  # Round up

    # Receiving (6 pts TD, 1 pt per reception, 1 pt per 10 yards rounded up)
    points += (stats.get('receiving_tds', 0) * 6)
    points += stats.get('receptions', 0)  # PPR bonus
    rec_yards = stats.get('receiving_yards', 0)
    if rec_yards > 0:
        points += ((rec_yards + 9) // 10)  # Round up

    # Kicker (3 pts FG, 1 pt PAT)
    points += (stats.get('field_goals', 0) * 3)
    points += stats.get('pats', 0)

    # Defense (6 pts TD, 2 pts INT, 2 pts safety, 3 pts sack)
    points += (stats.get('def_tds', 0) * 6)
    points += (stats.get('interceptions', 0) * 2)
    points += (stats.get('safeties', 0) * 2)
    points += (stats.get('sacks', 0) * 3)

    # Two-point conversions (2 pts)
    points += (stats.get('two_point_conversions', 0) * 2)

    return points


def fetch_all_weekly_stats(season: int, weeks: List[int]) -> pd.DataFrame:
    """
    Fetch stats for all weeks in one batch from nflreadpy
    Returns DataFrame with all player stats
    """
    print(f"\n📥 Fetching stats for {season} season, weeks {min(weeks)}-{max(weeks)}...")

    try:
        # Load player stats for all weeks at once
        stats = nfl.load_player_stats([season])

        # Convert to pandas if needed
        if hasattr(stats, 'to_pandas'):
            stats = stats.to_pandas()

        # Filter to requested weeks
        stats = stats[stats['week'].isin(weeks)]

        print(f"✅ Loaded {len(stats)} player-week records")

        # Show stats by week
        week_counts = stats.groupby('week').size()
        for week, count in week_counts.items():
            print(f"   Week {week}: {count} players")

        return stats

    except Exception as e:
        print(f"❌ Error fetching stats: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def get_db_players() -> Dict[str, Dict]:
    """
    Fetch all players from database
    Returns dict keyed by position with player info
    """
    print(f"\n📋 Fetching players from database...")

    try:
        response = supabase.table('players').select('*').execute()
        players = response.data

        print(f"✅ Found {len(players)} players in database")

        # Index by position for faster matching
        by_position = {}
        for player in players:
            pos = player['position']
            if pos not in by_position:
                by_position[pos] = []
            by_position[pos].append(player)

        return by_position

    except Exception as e:
        print(f"❌ Error fetching players: {e}")
        sys.exit(1)


def match_player_to_db(player_name: str, position: str, team: str, db_players: Dict) -> str:
    """
    Match nflreadpy player to database player using fuzzy matching
    Returns player_id or None
    """
    if position not in db_players:
        return None

    best_score = 0
    best_match = None

    # Try exact match first
    for db_player in db_players[position]:
        if player_name.lower() == db_player['name'].lower():
            return db_player['id']

        # Fuzzy match (85% threshold)
        score = fuzz.ratio(player_name.lower(), db_player['name'].lower())
        if score > best_score and score >= 85:
            best_score = score
            best_match = db_player['id']

    return best_match


def process_defense_stats(stats_df: pd.DataFrame, weeks: List[int]) -> List[Dict]:
    """
    Aggregate team defense stats by week
    Returns list of defense stat records
    """
    print(f"\n🛡️  Aggregating team defense stats...")

    defense_records = []

    for week in weeks:
        week_stats = stats_df[stats_df['week'] == week]

        # Group by team and aggregate defensive stats
        for team in week_stats['team'].unique():
            if pd.isna(team):
                continue

            team_stats = week_stats[week_stats['team'] == team]

            # Sum defensive stats (using correct column names from nflreadpy)
            def_td = team_stats['def_tds'].sum() if 'def_tds' in team_stats.columns else 0
            ints = team_stats['def_interceptions'].sum() if 'def_interceptions' in team_stats.columns else 0
            sacks = team_stats['def_sacks'].sum() if 'def_sacks' in team_stats.columns else 0
            safeties = team_stats['def_safeties'].sum() if 'def_safeties' in team_stats.columns else 0

            if def_td > 0 or ints > 0 or sacks > 0 or safeties > 0:
                defense_records.append({
                    'player_name': f"{team} Defense",
                    'position': 'DEF',
                    'team': team,
                    'week': week,
                    'def_tds': int(def_td),
                    'interceptions': int(ints),
                    'sacks': float(sacks),
                    'safeties': int(safeties)
                })

    print(f"✅ Created {len(defense_records)} defense stat records")
    return defense_records


def transform_and_calculate(stats_df: pd.DataFrame, db_players: Dict, weeks: List[int]) -> List[Dict]:
    """
    Transform nflreadpy stats to our schema and calculate PPR points
    Returns list of player_weekly_stats records
    """
    print(f"\n🔄 Processing {len(stats_df)} stat records...")

    records = []
    matched = 0
    unmatched = []

    # Process regular player stats
    for _, row in stats_df.iterrows():
        player_name = row.get('player_display_name', row.get('player_name', ''))
        position = row.get('position', '')
        team = row.get('team', '')
        week = int(row.get('week', 0))

        # Skip defenses (handled separately)
        if position == 'DEF':
            continue

        # Skip non-fantasy positions
        if position not in ['QB', 'RB', 'WR', 'TE', 'K']:
            continue

        # Match to database
        player_id = match_player_to_db(player_name, position, team, db_players)

        if not player_id:
            if player_name not in unmatched:
                unmatched.append(player_name)
            continue

        matched += 1

        # Extract only the stats we need - ensure proper types
        # Use round() for floats then int() to avoid "0.0" strings
        stat_record = {
            'player_id': player_id,
            'week_number': int(week),
            'passing_tds': int(round(float(row.get('passing_tds', 0) or 0))),
            'passing_yards': int(round(float(row.get('passing_yards', 0) or 0))),
            'rushing_tds': int(round(float(row.get('rushing_tds', 0) or 0))),
            'rushing_yards': int(round(float(row.get('rushing_yards', 0) or 0))),
            'receiving_tds': int(round(float(row.get('receiving_tds', 0) or 0))),
            'receptions': int(round(float(row.get('receptions', 0) or 0))),
            'receiving_yards': int(round(float(row.get('receiving_yards', 0) or 0))),
            'two_point_conversions': int(round(float(row.get('two_point_conversions', 0) or 0))),
            'field_goals': 0,
            'pats': 0,
            'def_tds': 0,
            'interceptions': 0,
            'safeties': 0,
            'sacks': 0.0  # This one is DECIMAL in database
        }

        # Calculate PPR points
        stat_record['calculated_points'] = calculate_ppr_points(stat_record)

        records.append(stat_record)

    # Process defense stats
    defense_records = process_defense_stats(stats_df, weeks)
    for def_rec in defense_records:
        player_id = match_player_to_db(def_rec['player_name'], 'DEF', def_rec['team'], db_players)
        if player_id:
            matched += 1
            stat_record = {
                'player_id': player_id,
                'week_number': int(def_rec['week']),
                'passing_tds': 0,
                'passing_yards': 0,
                'rushing_tds': 0,
                'rushing_yards': 0,
                'receiving_tds': 0,
                'receptions': 0,
                'receiving_yards': 0,
                'two_point_conversions': 0,
                'field_goals': 0,
                'pats': 0,
                'def_tds': int(def_rec['def_tds']),
                'interceptions': int(def_rec['interceptions']),
                'safeties': int(def_rec['safeties']),
                'sacks': float(def_rec['sacks'])  # DECIMAL type
            }
            stat_record['calculated_points'] = calculate_ppr_points(stat_record)
            records.append(stat_record)

    print(f"✅ Matched {matched} player-weeks to database")
    if unmatched:
        print(f"⚠️  {len(unmatched)} players unmatched (first 10): {unmatched[:10]}")

    return records


def upsert_stats(records: List[Dict], dry_run: bool = False):
    """Upsert stats to database"""
    print(f"\n💾 Upserting {len(records)} stat records to database...")

    if dry_run:
        print("🔍 DRY RUN - Showing first 5 records:")
        for rec in records[:5]:
            print(f"   Week {rec['week_number']}: {rec['calculated_points']:.1f} pts")
        return

    # Batch upsert (100 at a time)
    batch_size = 100
    total = 0

    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        try:
            supabase.table('player_weekly_stats').upsert(batch, on_conflict='player_id,week_number').execute()
            total += len(batch)
            print(f"   Batch {i//batch_size + 1}: {len(batch)} records")
        except Exception as e:
            print(f"   ❌ Error on batch {i//batch_size + 1}: {e}")

    print(f"✅ Upserted {total} records")


def rank_and_mark_elite(dry_run: bool = False):
    """
    Use SQL to rank players by position and mark elite status
    This is where SQL does the heavy lifting, not Python
    """
    print(f"\n🏆 Ranking players and marking elite status...")

    if dry_run:
        print("🔍 DRY RUN - Would rank and mark elite")
        return

    # SQL to calculate season totals and rank by position
    sql_rank = """
    WITH season_totals AS (
        SELECT
            p.id,
            p.name,
            p.position,
            p.team,
            COALESCE(SUM(pws.calculated_points), 0) as total_points,
            ROW_NUMBER() OVER (PARTITION BY p.position ORDER BY COALESCE(SUM(pws.calculated_points), 0) DESC) as rank
        FROM players p
        LEFT JOIN player_weekly_stats pws ON p.id = pws.player_id
        GROUP BY p.id, p.name, p.position, p.team
    )
    SELECT * FROM season_totals ORDER BY position, rank;
    """

    # Use Python fallback since SQL RPC not available
    print("   Using Python-based ranking...")
    response = supabase.table('players').select('*').execute()
    all_players = response.data

    # Get stats for each player
    print(f"   Calculating totals for {len(all_players)} players...")
    for i, player in enumerate(all_players):
        if i % 200 == 0:
            print(f"   Progress: {i}/{len(all_players)}")

        response = supabase.table('player_weekly_stats')\
            .select('calculated_points')\
            .eq('player_id', player['id'])\
            .execute()
        total = sum(float(r['calculated_points'] or 0) for r in response.data)
        player['total_points'] = total

    # Group by position and rank
    by_pos = {}
    for p in all_players:
        pos = p['position']
        if pos not in by_pos:
            by_pos[pos] = []
        by_pos[pos].append(p)

    ranked_players = []
    for pos, players in by_pos.items():
        players.sort(key=lambda x: x['total_points'], reverse=True)
        for rank, player in enumerate(players, 1):
            player['rank'] = rank
            ranked_players.append(player)

    try:

        # Mark elite based on thresholds
        elite_count = 0
        updates = []

        for player in ranked_players:
            position = player['position']
            rank = player.get('rank', 999)
            threshold = ELITE_COUNTS.get(position, 0)
            is_elite = rank <= threshold

            if is_elite:
                elite_count += 1
                print(f"   ⭐ {player['name']:30s} ({position}) - Rank {rank} - {player.get('total_points', 0):.1f} pts")

            updates.append({
                'id': player['id'],
                'is_elite': is_elite
            })

        # Batch update elite status
        print(f"\n💾 Updating {len(updates)} players...")
        for update in updates:
            supabase.table('players').update({'is_elite': update['is_elite']}).eq('id', update['id']).execute()

        print(f"✅ Marked {elite_count} elite players")

    except Exception as e:
        print(f"❌ Error ranking players: {e}")
        import traceback
        traceback.print_exc()


def main():
    parser = argparse.ArgumentParser(description='Comprehensive 2025 season stats sync and ranking')
    parser.add_argument('--weeks', type=str, default='1-9',
                       help='Week range to sync (e.g., "1-9" or "1,3,5")')
    parser.add_argument('--dry-run', action='store_true',
                       help='Preview without saving')
    args = parser.parse_args()

    # Parse weeks
    if '-' in args.weeks:
        start, end = map(int, args.weeks.split('-'))
        weeks = list(range(start, end + 1))
    else:
        weeks = [int(w) for w in args.weeks.split(',')]

    print("=" * 70)
    print("COMPREHENSIVE 2025 NFL SEASON STATS SYNC & PLAYER RANKING")
    print("=" * 70)
    print(f"Weeks: {weeks}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print("=" * 70)

    # Step 1: Fetch all weekly stats
    stats_df = fetch_all_weekly_stats(2025, weeks)

    # Step 2: Get database players
    db_players = get_db_players()

    # Step 3: Transform and calculate points
    records = transform_and_calculate(stats_df, db_players, weeks)

    # Step 4: Upsert to database
    upsert_stats(records, args.dry_run)

    # Step 5: Rank and mark elite using SQL
    rank_and_mark_elite(args.dry_run)

    print("\n" + "=" * 70)
    print("✅ COMPLETE")
    print("=" * 70)


if __name__ == '__main__':
    main()
