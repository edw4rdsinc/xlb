#!/usr/bin/env python3
"""
Calculate Fantasy Football Scores

This script calculates fantasy football scores for all lineups based on
player stats already imported into the player_weekly_stats table.

Usage:
    python calculate_scores.py --week 8 --season 2025
    python calculate_scores.py --week 8 --season 2025 --dry-run

Environment Variables Required:
    SUPABASE_URL - Your Supabase project URL
    SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key
"""

import os
import sys
import argparse
from datetime import datetime
from typing import List, Dict, Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Supabase configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase credentials")
    print("   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
    sys.exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_lineups() -> List[Dict]:
    """
    Fetch all lineups from the database with user_id for direct user association.

    Returns:
        List of lineup dictionaries with player IDs for each position and user_id
    """
    print("📋 Fetching all lineups from database...")

    response = supabase.table('lineups').select('*, users(id)').execute()

    if not response.data:
        print("⚠️  No lineups found in database")
        return []

    print(f"✅ Found {len(response.data)} lineups")
    return response.data


def fetch_player_stats(week: int) -> Dict[str, float]:
    """
    Fetch all player stats for the given week.

    Args:
        week: NFL week number (1-18)

    Returns:
        Dictionary mapping player_id to calculated_points
    """
    print(f"📊 Fetching player stats for Week {week}...")

    response = supabase.table('player_weekly_stats') \
        .select('player_id, calculated_points') \
        .eq('week_number', week) \
        .execute()

    if not response.data:
        print(f"⚠️  No player stats found for Week {week}")
        print("   Make sure stats have been synced first (run sync_nfl_stats.py)")
        return {}

    # Create dictionary mapping player_id to points
    stats_map = {
        str(stat['player_id']): float(stat['calculated_points'] or 0)
        for stat in response.data
    }

    print(f"✅ Found stats for {len(stats_map)} players")
    return stats_map


def calculate_lineup_scores(lineups: List[Dict], player_stats: Dict[str, float], week: int) -> List[Dict]:
    """
    Calculate scores for all lineups based on player stats.

    Args:
        lineups: List of lineup dictionaries
        player_stats: Dictionary mapping player_id to calculated_points
        week: NFL week number

    Returns:
        List of weekly_scores records ready to insert
    """
    print(f"\n🔢 Calculating scores for {len(lineups)} lineups...")

    positions = ['qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def']
    weekly_scores = []

    for lineup in lineups:
        position_points = {}
        total_points = 0.0

        # Calculate points for each position
        for pos in positions:
            player_id = lineup.get(f'{pos}_id')

            if player_id:
                player_id_str = str(player_id)
                points = player_stats.get(player_id_str, 0.0)
                position_points[f'{pos}_points'] = points
                total_points += points
            else:
                position_points[f'{pos}_points'] = 0.0

        # Get user_id from the joined users data
        user_id = lineup.get('users', {}).get('id') if lineup.get('users') else lineup.get('user_id')

        # Create weekly_scores record with both lineup_id and user_id
        score_record = {
            'lineup_id': lineup['id'],
            'user_id': user_id,
            'week_number': week,
            'qb_points': position_points['qb_points'],
            'rb1_points': position_points['rb1_points'],
            'rb2_points': position_points['rb2_points'],
            'wr1_points': position_points['wr1_points'],
            'wr2_points': position_points['wr2_points'],
            'te_points': position_points['te_points'],
            'k_points': position_points['k_points'],
            'def_points': position_points['def_points'],
            'total_points': round(total_points, 2),
        }

        weekly_scores.append(score_record)

    print(f"✅ Calculated scores for {len(weekly_scores)} lineups")
    return weekly_scores


def calculate_cumulative_scores(weekly_scores: List[Dict], week: int, season: int) -> List[Dict]:
    """
    Calculate cumulative scores for round and season.

    Args:
        weekly_scores: List of weekly_scores records
        week: NFL week number
        season: Season year

    Returns:
        Updated weekly_scores with cumulative scores
    """
    print("\n📈 Calculating cumulative scores...")

    # Fetch round information
    response = supabase.table('rounds') \
        .select('*') \
        .lte('start_week', week) \
        .gte('end_week', week) \
        .execute()

    current_round = response.data[0] if response.data else None

    if not current_round:
        print("⚠️  No active round found for this week")
        # Just return weekly scores without cumulative
        for score in weekly_scores:
            score['round_cumulative_points'] = score['total_points']
            score['season_cumulative_points'] = score['total_points']
        return weekly_scores

    print(f"✅ Found Round {current_round['round_number']} (Weeks {current_round['start_week']}-{current_round['end_week']})")

    # For each lineup, calculate cumulative scores using user_id
    for score in weekly_scores:
        user_id = score['user_id']

        if not user_id:
            # Fallback to lineup_id if no user_id (shouldn't happen)
            print(f"⚠️  No user_id for lineup {score['lineup_id']}, skipping cumulative")
            score['round_cumulative_points'] = score['total_points']
            score['season_cumulative_points'] = score['total_points']
            continue

        # Calculate round cumulative (sum of all weeks in current round) using user_id
        round_response = supabase.table('weekly_scores') \
            .select('total_points') \
            .eq('user_id', user_id) \
            .gte('week_number', current_round['start_week']) \
            .lte('week_number', week) \
            .execute()

        round_cumulative = sum(float(r['total_points'] or 0) for r in round_response.data)

        # Calculate season cumulative (sum of all weeks in season) using user_id
        season_response = supabase.table('weekly_scores') \
            .select('total_points') \
            .eq('user_id', user_id) \
            .lte('week_number', week) \
            .execute()

        season_cumulative = sum(float(r['total_points'] or 0) for r in season_response.data)

        score['round_cumulative_points'] = round(round_cumulative, 2)
        score['season_cumulative_points'] = round(season_cumulative, 2)

    print(f"✅ Calculated cumulative scores")
    return weekly_scores


def upsert_scores(weekly_scores: List[Dict], dry_run: bool = False) -> None:
    """
    Upsert weekly scores to the database.

    Args:
        weekly_scores: List of weekly_scores records
        dry_run: If True, don't actually insert to database
    """
    if dry_run:
        print("\n🔍 DRY RUN - Not inserting to database")
        print(f"   Would insert {len(weekly_scores)} score records")

        # Show preview of first 3 records
        print("\n   Preview of first 3 records:")
        for score in weekly_scores[:3]:
            print(f"     - Lineup {score['lineup_id']}: {score['total_points']} pts")
        return

    print(f"\n💾 Upserting {len(weekly_scores)} score records to database...")

    # Upsert scores one by one (Supabase upsert with conflict resolution)
    success_count = 0
    error_count = 0

    for score in weekly_scores:
        try:
            # Use user_id and week_number for conflict resolution
            # This allows scores to be tracked by user rather than lineup
            supabase.table('weekly_scores').upsert(
                score,
                on_conflict='user_id,week_number'
            ).execute()
            success_count += 1
        except Exception as e:
            print(f"⚠️  Failed to upsert score for user {score.get('user_id')}: {e}")
            error_count += 1

    print(f"✅ Successfully upserted {success_count} score records")
    if error_count > 0:
        print(f"⚠️  Failed to upsert {error_count} records")


def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description='Calculate Fantasy Football Scores')
    parser.add_argument('--week', type=int, required=True, help='NFL week number (1-18)')
    parser.add_argument('--season', type=int, required=True, help='Season year (e.g., 2025)')
    parser.add_argument('--dry-run', action='store_true', help='Preview without saving to database')

    args = parser.parse_args()

    # Validate week
    if not 1 <= args.week <= 18:
        print("❌ Error: Week must be between 1 and 18")
        sys.exit(1)

    print("=" * 60)
    print("🏈 XL Benefits Fantasy Football - Score Calculation")
    print("=" * 60)
    print(f"Season: {args.season}")
    print(f"Week: {args.week}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()

    try:
        # Step 1: Fetch all lineups
        lineups = fetch_lineups()
        if not lineups:
            print("\n❌ No lineups found. Exiting.")
            sys.exit(1)

        # Step 2: Fetch player stats for the week
        player_stats = fetch_player_stats(args.week)
        if not player_stats:
            print("\n❌ No player stats found for this week. Run sync_nfl_stats.py first.")
            sys.exit(1)

        # Step 3: Calculate scores for all lineups
        weekly_scores = calculate_lineup_scores(lineups, player_stats, args.week)

        # Step 4: Calculate cumulative scores
        weekly_scores = calculate_cumulative_scores(weekly_scores, args.week, args.season)

        # Step 5: Upsert to database
        upsert_scores(weekly_scores, args.dry_run)

        print("\n" + "=" * 60)
        print("✅ SCORE CALCULATION COMPLETE")
        print("=" * 60)
        print(f"Lineups processed: {len(lineups)}")
        print(f"Week: {args.week}")

        if not args.dry_run:
            print("Next steps: Scores are now visible to users via their magic links")

        print("=" * 60)
        print()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
