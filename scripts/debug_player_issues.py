#!/usr/bin/env python3
"""
Debug player issues:
1. Why is Baker Mayfield marked as custom?
2. Why is Ameer Abdullah elite?
3. Check all elite rankings
"""

import os
import sys
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def check_baker_mayfield():
    """Check Baker Mayfield's data"""
    print("\n" + "=" * 60)
    print("1. BAKER MAYFIELD INVESTIGATION")
    print("=" * 60)

    response = supabase.table('players').select('*').ilike('name', '%Baker Mayfield%').execute()

    if response.data:
        for player in response.data:
            print(f"\nPlayer found:")
            print(f"  Name: {player['name']}")
            print(f"  Position: {player['position']}")
            print(f"  Team: {player['team']}")
            print(f"  Elite: {player['is_elite']}")
            print(f"  Custom: {player['is_custom']}")
            print(f"  API ID: {player['api_player_id']}")

            # Check stats
            stats_response = supabase.table('player_weekly_stats')\
                .select('week_number, calculated_points')\
                .eq('player_id', player['id'])\
                .execute()

            total = sum(float(s['calculated_points']) for s in stats_response.data)
            print(f"  Total Points: {total}")
            print(f"  Weeks with stats: {len(stats_response.data)}")
    else:
        print("Baker Mayfield NOT FOUND in database!")


def check_elite_rbs():
    """Check all elite RBs and their rankings"""
    print("\n" + "=" * 60)
    print("2. ELITE RB INVESTIGATION")
    print("=" * 60)

    # Get all RBs with their total points
    response = supabase.table('players').select('*').eq('position', 'RB').execute()
    rbs = response.data

    print(f"\nFound {len(rbs)} total RBs")

    # Get stats for each
    rb_stats = []
    for rb in rbs:
        stats = supabase.table('player_weekly_stats')\
            .select('calculated_points')\
            .eq('player_id', rb['id'])\
            .execute()

        total = sum(float(s['calculated_points']) for s in stats.data)
        rb_stats.append({
            'name': rb['name'],
            'team': rb['team'],
            'is_elite': rb['is_elite'],
            'is_custom': rb['is_custom'],
            'total_points': total,
            'weeks': len(stats.data)
        })

    # Sort by points
    rb_stats.sort(key=lambda x: x['total_points'], reverse=True)

    print(f"\nTop 10 RBs by points:")
    for i, rb in enumerate(rb_stats[:10], 1):
        elite_mark = "⭐ ELITE" if rb['is_elite'] else ""
        custom_mark = "📝 CUSTOM" if rb['is_custom'] else ""
        print(f"  {i:2d}. {rb['name']:25s} - {rb['total_points']:6.1f} pts ({rb['weeks']} weeks) {elite_mark} {custom_mark}")

    print(f"\nAll Elite RBs:")
    elite_rbs = [rb for rb in rb_stats if rb['is_elite']]
    for i, rb in enumerate(elite_rbs, 1):
        rank_in_all = rb_stats.index(rb) + 1
        print(f"  {i}. {rb['name']:25s} - Rank #{rank_in_all:2d} - {rb['total_points']:6.1f} pts")

    print(f"\n⚠️  Issue: Ameer Abdullah")
    ameer = [rb for rb in rb_stats if 'Ameer' in rb['name']]
    if ameer:
        ameer = ameer[0]
        rank = rb_stats.index(ameer) + 1
        print(f"  Name: {ameer['name']}")
        print(f"  Rank: #{rank} out of {len(rb_stats)}")
        print(f"  Points: {ameer['total_points']}")
        print(f"  Elite: {ameer['is_elite']}")
        print(f"  Problem: Should NOT be elite (rank > 6)")


def check_all_custom_players():
    """Find all players marked as custom"""
    print("\n" + "=" * 60)
    print("3. ALL CUSTOM PLAYERS")
    print("=" * 60)

    response = supabase.table('players').select('*').eq('is_custom', True).execute()

    print(f"\nFound {len(response.data)} custom players:")
    for player in response.data:
        print(f"  - {player['name']:25s} ({player['position']}) - {player['team']}")


def main():
    print("=" * 60)
    print("FANTASY FOOTBALL - PLAYER ISSUE DEBUG")
    print("=" * 60)

    check_baker_mayfield()
    check_elite_rbs()
    check_all_custom_players()

    print("\n" + "=" * 60)
    print("DEBUG COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
