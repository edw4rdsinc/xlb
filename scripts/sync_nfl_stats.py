#!/usr/bin/env python3
"""
Sync NFL Player Stats from nflreadpy to Supabase

Usage:
    python scripts/sync_nfl_stats.py --week 8
    python scripts/sync_nfl_stats.py --week 8 --season 2024
    python scripts/sync_nfl_stats.py --week 8 --dry-run

This script:
1. Fetches weekly player stats from nflreadpy (free, no API key needed)
2. Matches players to your database using fuzzy matching
3. Transforms stats to your schema (player_weekly_stats table)
4. Upserts to Supabase database
5. Returns summary of players updated
"""

import argparse
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional

import nflreadpy as nfl
import pandas as pd
from fuzzywuzzy import fuzz
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Supabase client
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Use service role for admin operations

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials in .env.local")
    print("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_bye_week_teams(season: int, week: int) -> List[str]:
    """
    Fetch list of teams on bye for a given week

    Returns list of team abbreviations (e.g., ['BAL', 'PIT'])
    """
    print(f"\n🗓️  Checking for bye weeks in {season} Week {week}...")

    try:
        # Load schedule data
        schedule = nfl.load_schedules([season])

        # Convert Polars to Pandas if needed
        if hasattr(schedule, 'to_pandas'):
            schedule = schedule.to_pandas()

        # Get all teams that played this week
        week_schedule = schedule[schedule['week'] == week]
        teams_playing = set()

        if 'home_team' in week_schedule.columns:
            teams_playing.update(week_schedule['home_team'].dropna().tolist())
        if 'away_team' in week_schedule.columns:
            teams_playing.update(week_schedule['away_team'].dropna().tolist())

        # Get all 32 NFL teams (approximate - nflreadpy has team data)
        all_teams_schedule = schedule[schedule['week'].between(1, 18)]
        all_teams = set()
        if 'home_team' in all_teams_schedule.columns:
            all_teams.update(all_teams_schedule['home_team'].dropna().unique())
        if 'away_team' in all_teams_schedule.columns:
            all_teams.update(all_teams_schedule['away_team'].dropna().unique())

        # Teams on bye = all teams - teams playing
        bye_teams = list(all_teams - teams_playing)

        if bye_teams:
            print(f"✅ Found {len(bye_teams)} teams on bye: {', '.join(sorted(bye_teams))}")
        else:
            print(f"✅ No bye weeks for Week {week}")

        return bye_teams

    except Exception as e:
        print(f"⚠️  Warning: Could not fetch bye weeks: {e}")
        print(f"   Continuing without bye week detection...")
        return []


def fetch_nfl_stats(season: int, week: int) -> pd.DataFrame:
    """
    Fetch weekly player stats from nflreadpy

    Returns DataFrame with columns:
    - player_name, position, team
    - passing_tds, passing_yards
    - rushing_tds, rushing_yards
    - receiving_tds, receptions, receiving_yards
    - etc.
    """
    print(f"\n📊 Fetching NFL stats for {season} Week {week} from nflreadpy...")

    try:
        # Load player stats for the season
        stats = nfl.load_player_stats([season])

        # Convert Polars to Pandas if needed
        if hasattr(stats, 'to_pandas'):
            stats = stats.to_pandas()

        # Filter to specific week
        week_stats = stats[stats['week'] == week].copy()

        print(f"✅ Found {len(week_stats)} players with stats for Week {week}")

        return week_stats

    except Exception as e:
        print(f"❌ Error fetching stats from nflreadpy: {e}")
        sys.exit(1)


def aggregate_team_defense_stats(nfl_stats: pd.DataFrame, week: int) -> pd.DataFrame:
    """
    Aggregate individual defensive player stats by team to create team defense stats

    Returns DataFrame with team defense aggregated stats:
    - team, def_tds (sum), interceptions (sum), safeties (sum), sacks (sum)
    """
    print(f"\n🛡️  Aggregating team defense stats...")

    # Get team column name (can vary)
    team_col = 'recent_team' if 'recent_team' in nfl_stats.columns else 'team'

    if team_col not in nfl_stats.columns:
        print(f"⚠️  Warning: No team column found, skipping defense aggregation")
        return pd.DataFrame()

    # Aggregate defensive stats by team
    # Try different possible column names from nflreadpy
    def_td_col = 'def_tds' if 'def_tds' in nfl_stats.columns else 'def_td' if 'def_td' in nfl_stats.columns else None

    agg_dict = {}
    if def_td_col:
        agg_dict[def_td_col] = 'sum'
    if 'interceptions' in nfl_stats.columns:
        agg_dict['interceptions'] = 'sum'
    if 'safeties' in nfl_stats.columns:
        agg_dict['safeties'] = 'sum'
    if 'sacks' in nfl_stats.columns:
        agg_dict['sacks'] = 'sum'

    if not agg_dict:
        print(f"⚠️  Warning: No defensive stat columns found")
        return pd.DataFrame()

    defense_stats = nfl_stats.groupby(team_col).agg(agg_dict).reset_index()

    # Rename columns to standardize
    rename_map = {team_col: 'team'}
    if def_td_col:
        rename_map[def_td_col] = 'def_tds'

    defense_stats = defense_stats.rename(columns=rename_map)

    # Add week number
    defense_stats['week'] = week

    # Add position
    defense_stats['position'] = 'DEF'

    # Add player_display_name (team name for defense)
    defense_stats['player_display_name'] = defense_stats['team'] + ' Defense'

    # Add default values for missing columns (to match player stats schema)
    for col in ['def_tds', 'interceptions', 'safeties', 'sacks']:
        if col not in defense_stats.columns:
            defense_stats[col] = 0

    # Filter out teams with no defensive stats
    defense_stats = defense_stats[
        (defense_stats.get('def_tds', 0) > 0) |
        (defense_stats.get('interceptions', 0) > 0) |
        (defense_stats.get('safeties', 0) > 0) |
        (defense_stats.get('sacks', 0) > 0)
    ]

    print(f"✅ Aggregated defense stats for {len(defense_stats)} teams")

    return defense_stats


def get_database_players() -> List[Dict]:
    """
    Fetch all players from database for name matching
    """
    print("\n🔍 Fetching players from database...")

    try:
        response = supabase.table('players').select('*').execute()
        players = response.data

        print(f"✅ Found {len(players)} players in database")
        return players

    except Exception as e:
        print(f"❌ Error fetching players from database: {e}")
        sys.exit(1)


def match_player_to_database(nfl_name: str, nfl_position: str, db_players: List[Dict]) -> Optional[str]:
    """
    Match NFL player name to database player using fuzzy matching

    Returns player_id if match found, None otherwise
    """
    # Filter by position first
    position_matches = [p for p in db_players if p['position'] == nfl_position]

    if not position_matches:
        return None

    # Find best name match
    best_match = None
    best_score = 0

    for player in position_matches:
        db_name = player['name']

        # Try exact match first
        if nfl_name.lower() == db_name.lower():
            return player['id']

        # Fuzzy match
        score = fuzz.ratio(nfl_name.lower(), db_name.lower())

        if score > best_score and score >= 85:  # 85% similarity threshold
            best_score = score
            best_match = player['id']

    return best_match


def transform_stats_to_schema(nfl_stats: pd.DataFrame, db_players: List[Dict], week: int, bye_teams: List[str]) -> List[Dict]:
    """
    Transform nflreadpy stats to your database schema

    Maps columns and matches players to database IDs
    """
    print(f"\n🔄 Transforming stats to database schema...")

    records = []
    matched_count = 0
    unmatched_players = []
    bye_week_count = 0

    for idx, row in nfl_stats.iterrows():
        player_name = row.get('player_display_name') or row.get('player_name', '')
        position = row.get('position', '')
        team = row.get('recent_team', '') or row.get('team', '')

        # Map position codes (nflreadpy uses different codes sometimes)
        position_map = {
            'QB': 'QB',
            'RB': 'RB',
            'WR': 'WR',
            'TE': 'TE',
            'K': 'K',
            'DEF': 'DEF'
        }
        position = position_map.get(position, position)

        # Match to database player
        player_id = match_player_to_database(player_name, position, db_players)

        if not player_id:
            unmatched_players.append(f"{player_name} ({position})")
            continue

        matched_count += 1

        # Check if player's team is on bye
        is_bye_week = team in bye_teams

        if is_bye_week:
            bye_week_count += 1
            # Create zero-stats record for bye week
            record = {
                'player_id': player_id,
                'week_number': week,
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
                'def_tds': 0,
                'interceptions': 0,
                'safeties': 0,
                'sacks': 0,
                'calculated_points': 0.0,
            }
        else:
            # Helper function to safely convert to int, handling NaN
            def safe_int(value, default=0):
                if pd.isna(value):
                    return default
                try:
                    return int(value or default)
                except (ValueError, TypeError):
                    return default

            # Transform stats to your schema
            record = {
                'player_id': player_id,
                'week_number': week,
                'passing_tds': safe_int(row.get('passing_tds', 0)),
                'passing_yards': safe_int(row.get('passing_yards', 0)),
                'rushing_tds': safe_int(row.get('rushing_tds', 0)),
                'rushing_yards': safe_int(row.get('rushing_yards', 0)),
                'receiving_tds': safe_int(row.get('receiving_tds', 0)),
                'receptions': safe_int(row.get('receptions', 0)),
                'receiving_yards': safe_int(row.get('receiving_yards', 0)),
                'two_point_conversions': safe_int(row.get('two_point_conversions', 0)),
                # Kicker stats
                'field_goals': safe_int(row.get('fg_made', 0)),
                'pats': safe_int(row.get('pat_made', 0)),
                # Defense stats (if DEF position)
                'def_tds': safe_int(row.get('def_tds', 0)),
                'interceptions': safe_int(row.get('interceptions', 0)),
                'safeties': safe_int(row.get('safeties', 0)),
                'sacks': safe_int(row.get('sacks', 0)),
            }

            # Calculate points using your PPR scoring rules
            record['calculated_points'] = calculate_points(record)

        records.append(record)

    print(f"✅ Matched {matched_count} players to database")
    if bye_week_count > 0:
        print(f"📅 Set {bye_week_count} players to 0 points (bye week)")

    if unmatched_players:
        print(f"\n⚠️  {len(unmatched_players)} players not matched:")
        for player in unmatched_players[:10]:  # Show first 10
            print(f"   - {player}")
        if len(unmatched_players) > 10:
            print(f"   ... and {len(unmatched_players) - 10} more")

    return records


def calculate_points(stats: Dict) -> float:
    """
    Calculate fantasy points using PPR scoring rules
    Matches the logic in lib/scoring/calculator.ts
    """
    points = 0.0

    # Passing: 6 pts/TD, 1 pt per 25 yards (rounded)
    points += stats['passing_tds'] * 6
    points += round(stats['passing_yards'] / 25)

    # Rushing: 6 pts/TD, 1 pt per 10 yards (rounded)
    points += stats['rushing_tds'] * 6
    points += round(stats['rushing_yards'] / 10)

    # Receiving (PPR): 6 pts/TD, 1 pt/reception, 1 pt per 10 yards (rounded)
    points += stats['receiving_tds'] * 6
    points += stats['receptions'] * 1  # PPR
    points += round(stats['receiving_yards'] / 10)

    # Two-point conversions
    points += stats['two_point_conversions'] * 2

    # Kicker: 3 pts/FG, 1 pt/PAT
    points += stats['field_goals'] * 3
    points += stats['pats'] * 1

    # Defense: 6 pts/TD, 2 pts/INT, 2 pts/safety, 3 pts/sack
    points += stats['def_tds'] * 6
    points += stats['interceptions'] * 2
    points += stats['safeties'] * 2
    points += stats['sacks'] * 3

    return round(points, 2)


def upsert_stats_to_database(records: List[Dict], dry_run: bool = False) -> int:
    """
    Upsert player stats to database

    Uses upsert to handle both new and updated stats
    """
    if dry_run:
        print(f"\n🔍 DRY RUN: Would upsert {len(records)} records")
        print("\nSample records:")
        for record in records[:3]:
            print(f"  Player ID: {record['player_id']}, Week: {record['week_number']}, Points: {record['calculated_points']}")
        return len(records)

    print(f"\n💾 Upserting {len(records)} records to database...")

    try:
        # Batch upsert (Supabase handles conflicts with unique constraint on player_id, week_number)
        response = supabase.table('player_weekly_stats').upsert(
            records,
            on_conflict='player_id,week_number'
        ).execute()

        print(f"✅ Successfully upserted {len(records)} player stats")
        return len(records)

    except Exception as e:
        print(f"❌ Error upserting to database: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='Sync NFL player stats from nflreadpy')
    parser.add_argument('--week', type=int, required=True, help='NFL week number (1-18)')
    parser.add_argument('--season', type=int, default=2025, help='NFL season year (default: 2025)')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without writing to database')

    args = parser.parse_args()

    print("=" * 60)
    print("🏈 XL Benefits Fantasy Football - NFL Stats Sync")
    print("=" * 60)
    print(f"Season: {args.season}")
    print(f"Week: {args.week}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Step 1: Check for bye weeks
    bye_teams = fetch_bye_week_teams(args.season, args.week)

    # Step 2: Fetch NFL stats
    nfl_stats = fetch_nfl_stats(args.season, args.week)

    # Step 3: Aggregate team defense stats
    defense_stats = aggregate_team_defense_stats(nfl_stats, args.week)

    # Step 4: Combine player stats with defense stats
    if not defense_stats.empty:
        # Append defense stats to player stats
        combined_stats = pd.concat([nfl_stats, defense_stats], ignore_index=True)
        print(f"✅ Combined {len(nfl_stats)} player stats + {len(defense_stats)} team defense stats")
    else:
        combined_stats = nfl_stats
        print(f"⚠️  No team defense stats aggregated, using player stats only")

    # Step 5: Get database players
    db_players = get_database_players()

    # Step 6: Transform and match (with bye week detection)
    records = transform_stats_to_schema(combined_stats, db_players, args.week, bye_teams)

    # Step 7: Upsert to database
    count = upsert_stats_to_database(records, dry_run=args.dry_run)

    # Summary
    print("\n" + "=" * 60)
    print("✅ SYNC COMPLETE")
    print("=" * 60)
    print(f"Records processed: {count}")
    print(f"Week: {args.week}")
    print(f"Next steps: Go to /admin/scoring and click 'Calculate Scores'")
    print("=" * 60)


if __name__ == '__main__':
    main()
