#!/usr/bin/env python3
"""
Rank Players and Update Elite Status

This script:
1. Fetches all players and their cumulative season stats from database
2. Ranks players by position based on total fantasy points
3. Marks elite status:
   - QB: Top 3
   - RB: Top 6
   - WR: Top 6
   - TE: Top 3
   - K: None (all standard)
   - DEF: None (all standard)
4. Updates the database with elite flags

Usage:
    python scripts/rank_and_update_elite_players.py
    python scripts/rank_and_update_elite_players.py --dry-run
"""

import argparse
import os
import sys
from typing import Dict, List
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Supabase client
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials in .env.local")
    print("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Elite player thresholds by position
ELITE_THRESHOLDS = {
    'QB': 3,
    'RB': 6,
    'WR': 6,
    'TE': 3,
    'K': 0,   # No elite kickers
    'DEF': 0  # No elite defenses
}


def get_all_players():
    """Fetch all players from database"""
    print("\n📋 Fetching all players from database...")

    try:
        response = supabase.table('players').select('*').execute()
        players = response.data

        print(f"✅ Found {len(players)} players in database")

        # Group by position
        by_position = {}
        for player in players:
            pos = player['position']
            if pos not in by_position:
                by_position[pos] = []
            by_position[pos].append(player)

        print(f"\nPlayers by position:")
        for pos in sorted(by_position.keys()):
            print(f"  {pos}: {len(by_position[pos])} players")

        return players

    except Exception as e:
        print(f"❌ Error fetching players: {e}")
        sys.exit(1)


def get_player_season_stats(player_id: str) -> float:
    """
    Get total season fantasy points for a player
    Sums calculated_points from player_weekly_stats across all weeks
    """
    try:
        response = supabase.table('player_weekly_stats')\
            .select('calculated_points')\
            .eq('player_id', player_id)\
            .execute()

        if not response.data:
            return 0.0

        total = sum(float(row['calculated_points'] or 0) for row in response.data)
        return total

    except Exception as e:
        print(f"⚠️  Warning: Could not fetch stats for player {player_id}: {e}")
        return 0.0


def rank_players_by_position(players: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Rank players by position based on total season fantasy points

    Returns dict with structure:
    {
        'QB': [
            {'player': {...}, 'total_points': 245.3, 'rank': 1, 'is_elite': True},
            ...
        ],
        'RB': [...],
        ...
    }
    """
    print("\n🏆 Ranking players by position based on season stats...")

    # Group by position
    by_position = {}
    for player in players:
        pos = player['position']
        if pos not in by_position:
            by_position[pos] = []
        by_position[pos].append(player)

    ranked = {}

    for position, position_players in by_position.items():
        print(f"\n{position} - Fetching stats for {len(position_players)} players...")

        # Get season stats for each player
        player_stats = []
        for player in position_players:
            total_points = get_player_season_stats(player['id'])
            player_stats.append({
                'player': player,
                'total_points': total_points,
                'rank': 0,  # Will set after sorting
                'is_elite': False  # Will set based on threshold
            })

        # Sort by total points descending
        player_stats.sort(key=lambda x: x['total_points'], reverse=True)

        # Assign ranks and elite status
        elite_threshold = ELITE_THRESHOLDS.get(position, 0)

        for i, stat in enumerate(player_stats):
            stat['rank'] = i + 1
            stat['is_elite'] = (i < elite_threshold)

        ranked[position] = player_stats

        # Print top performers
        print(f"\nTop {position}s (by total season points):")
        for stat in player_stats[:10]:  # Show top 10
            elite_marker = "⭐ ELITE" if stat['is_elite'] else ""
            print(f"  {stat['rank']:2d}. {stat['player']['name']:25s} - {stat['total_points']:6.1f} pts {elite_marker}")

    return ranked


def update_elite_status(ranked_players: Dict[str, List[Dict]], dry_run: bool = False):
    """
    Update is_elite flag in database for all players
    """
    print("\n💾 Updating elite status in database...")

    if dry_run:
        print("🔍 DRY RUN MODE - No changes will be saved")

    total_elite = 0
    total_updated = 0

    for position, players_list in ranked_players.items():
        for stat in players_list:
            player = stat['player']
            new_elite_status = stat['is_elite']
            old_elite_status = player.get('is_elite', False)

            # Only update if status changed
            if new_elite_status != old_elite_status:
                total_updated += 1

                if new_elite_status:
                    total_elite += 1
                    action = "→ ELITE ⭐"
                else:
                    action = "→ Standard"

                print(f"  {player['name']:25s} ({position}): {action}")

                if not dry_run:
                    try:
                        supabase.table('players')\
                            .update({'is_elite': new_elite_status})\
                            .eq('id', player['id'])\
                            .execute()
                    except Exception as e:
                        print(f"    ❌ Error updating {player['name']}: {e}")
            elif new_elite_status:
                total_elite += 1

    print(f"\n✅ Summary:")
    print(f"   Total elite players: {total_elite}")
    print(f"   Players updated: {total_updated}")

    if dry_run:
        print(f"\n🔍 DRY RUN - No changes were saved. Run without --dry-run to apply updates.")
    else:
        print(f"\n✅ Database updated successfully!")


def main():
    parser = argparse.ArgumentParser(description='Rank players and update elite status')
    parser.add_argument('--dry-run', action='store_true',
                       help='Preview changes without saving to database')
    args = parser.parse_args()

    print("=" * 60)
    print("FANTASY FOOTBALL - PLAYER RANKING & ELITE STATUS UPDATE")
    print("=" * 60)

    # Step 1: Get all players
    players = get_all_players()

    # Step 2: Rank by position
    ranked_players = rank_players_by_position(players)

    # Step 3: Update elite status
    update_elite_status(ranked_players, dry_run=args.dry_run)

    print("\n" + "=" * 60)
    print("COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
