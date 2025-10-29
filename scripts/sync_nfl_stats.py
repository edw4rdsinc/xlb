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


def transform_stats_to_schema(nfl_stats: pd.DataFrame, db_players: List[Dict], week: int) -> List[Dict]:
    """
    Transform nflreadpy stats to your database schema

    Maps columns and matches players to database IDs
    """
    print(f"\n🔄 Transforming stats to database schema...")

    records = []
    matched_count = 0
    unmatched_players = []

    for idx, row in nfl_stats.iterrows():
        player_name = row.get('player_display_name') or row.get('player_name', '')
        position = row.get('position', '')

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

        # Transform stats to your schema
        record = {
            'player_id': player_id,
            'week_number': week,
            'passing_tds': int(row.get('passing_tds', 0) or 0),
            'passing_yards': int(row.get('passing_yards', 0) or 0),
            'rushing_tds': int(row.get('rushing_tds', 0) or 0),
            'rushing_yards': int(row.get('rushing_yards', 0) or 0),
            'receiving_tds': int(row.get('receiving_tds', 0) or 0),
            'receptions': int(row.get('receptions', 0) or 0),
            'receiving_yards': int(row.get('receiving_yards', 0) or 0),
            'two_point_conversions': int(row.get('two_point_conversions', 0) or 0),
            # Kicker stats
            'field_goals': int(row.get('fg_made', 0) or 0),
            'pats': int(row.get('pat_made', 0) or 0),
            # Defense stats (if DEF position)
            'def_tds': int(row.get('def_tds', 0) or 0),
            'interceptions': int(row.get('interceptions', 0) or 0),
            'safeties': int(row.get('safeties', 0) or 0),
            'sacks': int(row.get('sacks', 0) or 0),
        }

        # Calculate points using your PPR scoring rules
        record['calculated_points'] = calculate_points(record)

        records.append(record)

    print(f"✅ Matched {matched_count} players to database")

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
    parser.add_argument('--season', type=int, default=2024, help='NFL season year (default: 2024)')
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

    # Step 1: Fetch NFL stats
    nfl_stats = fetch_nfl_stats(args.season, args.week)

    # Step 2: Get database players
    db_players = get_database_players()

    # Step 3: Transform and match
    records = transform_stats_to_schema(nfl_stats, db_players, args.week)

    # Step 4: Upsert to database
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
