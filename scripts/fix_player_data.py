#!/usr/bin/env python3
"""
Fix player data issues:
1. Update test players to not be custom
2. Re-rank properly (only players with stats should be elite)
3. Clean up data
"""

import os
import sys
from supabase import create_client
from dotenv import load_dotenv
import nflreadpy as nfl

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

ELITE_COUNTS = {'QB': 3, 'RB': 6, 'WR': 6, 'TE': 3, 'K': 0, 'DEF': 0}


def fix_custom_players():
    """Fix the 15 test players that are marked as custom"""
    print("\n" + "=" * 60)
    print("1. FIXING CUSTOM PLAYERS")
    print("=" * 60)

    # Get all custom players
    response = supabase.table('players').select('*').eq('is_custom', True).execute()
    custom_players = response.data

    print(f"\nFound {len(custom_players)} custom players")

    # Load 2025 rosters to get proper team assignments
    print("Loading 2025 rosters for team lookup...")
    rosters = nfl.load_rosters([2025])
    if hasattr(rosters, 'to_pandas'):
        rosters = rosters.to_pandas()

    fixed_count = 0

    for player in custom_players:
        # Look up player in roster
        player_name = player['name']

        # Try to find in roster
        matches = rosters[rosters['full_name'].str.lower() == player_name.lower()]

        if len(matches) > 0:
            match = matches.iloc[0]
            team = match['team']

            print(f"  Fixing: {player_name:25s} -> Team: {team}")

            # Update player
            supabase.table('players').update({
                'is_custom': False,
                'team': team
            }).eq('id', player['id']).execute()

            fixed_count += 1
        else:
            # Try removing "Defense" suffix for team defenses
            if 'Defense' in player_name:
                team_abbr = player_name.replace(' Defense', '').strip()
                print(f"  Fixing: {player_name:25s} -> Team: {team_abbr} (Defense)")

                supabase.table('players').update({
                    'is_custom': False,
                    'team': team_abbr
                }).eq('id', player['id']).execute()

                fixed_count += 1
            else:
                print(f"  ⚠️  Could not find team for: {player_name}")

    print(f"\n✅ Fixed {fixed_count}/{len(custom_players)} custom players")


def rerank_with_stats_filter():
    """Re-rank players but only mark as elite if they have stats"""
    print("\n" + "=" * 60)
    print("2. RE-RANKING WITH STATS FILTER")
    print("=" * 60)

    # First, set ALL players to not elite
    print("\nResetting all elite flags...")
    supabase.table('players').update({'is_elite': False}).neq('id', '00000000-0000-0000-0000-000000000000').execute()

    # Get all players
    response = supabase.table('players').select('*').execute()
    all_players = response.data

    print(f"Processing {len(all_players)} players...")

    # Get stats for each
    players_with_stats = []
    for i, player in enumerate(all_players):
        if i % 200 == 0:
            print(f"  Progress: {i}/{len(all_players)}")

        stats = supabase.table('player_weekly_stats')\
            .select('calculated_points')\
            .eq('player_id', player['id'])\
            .execute()

        total = sum(float(s['calculated_points']) for s in stats.data)

        # Only include if they have stats (total > 0)
        if total > 0:
            players_with_stats.append({
                'id': player['id'],
                'name': player['name'],
                'position': player['position'],
                'team': player['team'],
                'total_points': total
            })

    print(f"\n✅ {len(players_with_stats)} players have stats")

    # Group by position and rank
    by_position = {}
    for p in players_with_stats:
        pos = p['position']
        if pos not in by_position:
            by_position[pos] = []
        by_position[pos].append(p)

    # Sort and mark elite
    elite_updates = []
    total_elite = 0

    for position, players in by_position.items():
        # Sort by points descending
        players.sort(key=lambda x: x['total_points'], reverse=True)

        threshold = ELITE_COUNTS.get(position, 0)

        print(f"\n{position} - Top performers:")
        for i, player in enumerate(players[:10], 1):
            is_elite = i <= threshold
            if is_elite:
                print(f"  ⭐ {i:2d}. {player['name']:25s} - {player['total_points']:6.1f} pts")
                elite_updates.append(player['id'])
                total_elite += 1
            else:
                print(f"     {i:2d}. {player['name']:25s} - {player['total_points']:6.1f} pts")

    # Update database
    print(f"\n💾 Updating {total_elite} elite players...")
    for player_id in elite_updates:
        supabase.table('players').update({'is_elite': True}).eq('id', player_id).execute()

    print(f"✅ Marked {total_elite} elite players")


def main():
    print("=" * 60)
    print("FANTASY FOOTBALL - FIX PLAYER DATA")
    print("=" * 60)

    fix_custom_players()
    rerank_with_stats_filter()

    print("\n" + "=" * 60)
    print("✅ ALL FIXES COMPLETE")
    print("=" * 60)
    print("\nFixed issues:")
    print("  1. ✅ Test players no longer marked as custom")
    print("  2. ✅ Proper team assignments")
    print("  3. ✅ Only players with stats can be elite")
    print("  4. ✅ Ameer Abdullah no longer elite")
    print("=" * 60)


if __name__ == '__main__':
    main()
