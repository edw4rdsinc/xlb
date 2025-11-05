#!/usr/bin/env python3
"""
Verify Defensive Scoring for Week 9

This script checks all defensive stats and verifies the point calculations
are correct based on the scoring formula:
- 6 pts per Defensive TD
- 2 pts per Interception
- 2 pts per Safety
- 3 pts per Sack
"""

from supabase import create_client
from dotenv import load_dotenv
import os
import sys

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)

def verify_defense_scoring(week=9):
    """Verify defensive scoring for all defenses"""

    print("=" * 80)
    print(f"🛡️  Defensive Scoring Verification - Week {week}")
    print("=" * 80)
    print()

    # Get all DEF players
    result = supabase.table('players').select('id, name, team, position').eq('position', 'DEF').execute()
    defenses = result.data

    print(f"Found {len(defenses)} defensive units in database:\n")

    all_correct = True
    defenses_with_stats = 0

    for defense in defenses:
        # Get Week stats
        stats_result = supabase.table('player_weekly_stats')\
            .select('*')\
            .eq('player_id', defense['id'])\
            .eq('week_number', week)\
            .execute()

        if stats_result.data:
            defenses_with_stats += 1
            stats = stats_result.data[0]

            print(f"{defense['name']} ({defense['team']}):")
            print(f"  Defensive TDs:   {int(stats['def_tds']):2d} × 6 pts = {int(stats['def_tds']) * 6:3d} pts")
            print(f"  Interceptions:   {int(stats['interceptions']):2d} × 2 pts = {int(stats['interceptions']) * 2:3d} pts")
            print(f"  Safeties:        {int(stats['safeties']):2d} × 2 pts = {int(stats['safeties']) * 2:3d} pts")
            print(f"  Sacks:           {stats['sacks']:5.1f} × 3 pts = {stats['sacks'] * 3:5.1f} pts")
            print(f"  " + "-" * 40)

            # Calculate manually
            manual_calc = (
                (stats['def_tds'] * 6) +
                (stats['interceptions'] * 2) +
                (stats['safeties'] * 2) +
                (stats['sacks'] * 3)
            )

            stored_points = float(stats['calculated_points'])

            print(f"  Expected Total:  {manual_calc} pts")
            print(f"  Stored Total:    {stored_points} pts")

            if abs(manual_calc - stored_points) < 0.01:  # Allow for floating point precision
                print(f"  ✅ VERIFIED - Points are correct!")
            else:
                print(f"  ❌ ERROR - Points mismatch!")
                all_correct = False

            print()
        else:
            print(f"{defense['name']} ({defense['team']}): ⚠️  No Week {week} stats found")
            print()

    print("=" * 80)
    print(f"Summary:")
    print(f"  Total Defenses in DB:  {len(defenses)}")
    print(f"  Defenses with Week {week} stats: {defenses_with_stats}")
    print(f"  All calculations correct: {'✅ YES' if all_correct else '❌ NO'}")
    print("=" * 80)

    return all_correct


if __name__ == '__main__':
    week = int(sys.argv[1]) if len(sys.argv) > 1 else 9
    success = verify_defense_scoring(week)
    sys.exit(0 if success else 1)
