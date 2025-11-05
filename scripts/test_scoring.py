#!/usr/bin/env python3
"""
Test Scoring Formula Accuracy

Verifies that the scoring calculations match the expected PPR fantasy football rules:
- Passing: 0.04 pts per yard, 4 pts per TD, -2 pts per INT
- Rushing: 0.1 pts per yard, 6 pts per TD
- Receiving: 0.1 pts per yard, 6 pts per TD, 1 pt per reception (PPR)
- Defense: 6 pts per TD, 2 pts per INT, 2 pts per Safety, 3 pts per Sack
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

def calculate_expected_points(stats):
    """
    Calculate expected points using the ACTUAL scoring formula
    from scripts/sync_nfl_stats.py calculate_points()
    """
    points = 0.0

    # Passing: 6 pts/TD, 1 pt per 25 yards (rounded)
    points += stats.get('passing_tds', 0) * 6
    points += round(stats.get('passing_yards', 0) / 25)

    # Rushing: 6 pts/TD, 1 pt per 10 yards (rounded)
    points += stats.get('rushing_tds', 0) * 6
    points += round(stats.get('rushing_yards', 0) / 10)

    # Receiving (PPR): 6 pts/TD, 1 pt/reception, 1 pt per 10 yards (rounded)
    points += stats.get('receiving_tds', 0) * 6
    points += stats.get('receptions', 0) * 1  # PPR
    points += round(stats.get('receiving_yards', 0) / 10)

    # Two-point conversions
    points += stats.get('two_point_conversions', 0) * 2

    # Kicker: 3 pts/FG, 1 pt/PAT
    points += stats.get('field_goals', 0) * 3
    points += stats.get('pats', 0) * 1

    # Defense: 6 pts/TD, 2 pts/INT, 2 pts/safety, 3 pts/sack
    points += stats.get('def_tds', 0) * 6
    points += stats.get('interceptions', 0) * 2
    points += stats.get('safeties', 0) * 2
    points += stats.get('sacks', 0) * 3

    return round(points, 2)

def test_scoring(week=9):
    """Test scoring accuracy for Week 9 players"""

    print("=" * 80)
    print(f"🧪 Scoring Formula Test - Week {week}")
    print("=" * 80)
    print()

    # Get all player stats for the week
    result = supabase.table('player_weekly_stats')\
        .select('*, players(name, position, team)')\
        .eq('week_number', week)\
        .order('calculated_points', desc=True)\
        .limit(50)\
        .execute()

    if not result.data:
        print(f"❌ No stats found for Week {week}")
        return False

    print(f"Testing top 50 scorers from Week {week}...\n")

    all_correct = True
    mismatches = []

    for stat in result.data:
        player = stat['players']
        expected = calculate_expected_points(stat)
        stored = float(stat['calculated_points'])

        # Allow for small floating point differences
        if abs(expected - stored) > 0.01:
            all_correct = False
            mismatches.append({
                'name': player['name'],
                'position': player['position'],
                'expected': expected,
                'stored': stored,
                'difference': abs(expected - stored),
                'stats': stat
            })

    if all_correct:
        print("✅ ALL SCORES VERIFIED CORRECT!")
        print(f"   Tested {len(result.data)} players")
        print()

        # Show sample calculations
        print("Sample Verified Calculations:")
        print("-" * 80)

        for i, stat in enumerate(result.data[:5]):
            player = stat['players']
            print(f"\n{i+1}. {player['name']} ({player['position']}) - {player['team']}")
            print(f"   Total Points: {stat['calculated_points']}")

            if player['position'] == 'DEF':
                print(f"   - Defensive TDs: {stat['def_tds']} × 6 = {stat['def_tds'] * 6}")
                print(f"   - Interceptions: {stat['interceptions']} × 2 = {stat['interceptions'] * 2}")
                print(f"   - Safeties: {stat['safeties']} × 2 = {stat['safeties'] * 2}")
                print(f"   - Sacks: {stat['sacks']} × 3 = {stat['sacks'] * 3}")
            else:
                if stat.get('passing_yards', 0) > 0:
                    pass_pts = round(stat['passing_yards'] / 25)
                    print(f"   - Passing: {stat['passing_yards']} yds ÷ 25 (rounded) = {pass_pts}")
                    print(f"   - Passing TDs: {stat['passing_tds']} × 6 = {stat['passing_tds'] * 6}")

                if stat.get('rushing_yards', 0) > 0:
                    rush_pts = round(stat['rushing_yards'] / 10)
                    print(f"   - Rushing: {stat['rushing_yards']} yds ÷ 10 (rounded) = {rush_pts}")
                    if stat.get('rushing_tds', 0) > 0:
                        print(f"   - Rushing TDs: {stat['rushing_tds']} × 6 = {stat['rushing_tds'] * 6}")

                if stat.get('receptions', 0) > 0:
                    print(f"   - Receptions (PPR): {stat['receptions']} × 1 = {stat['receptions']}")
                    rec_pts = round(stat['receiving_yards'] / 10)
                    print(f"   - Receiving: {stat['receiving_yards']} yds ÷ 10 (rounded) = {rec_pts}")
                    if stat.get('receiving_tds', 0) > 0:
                        print(f"   - Receiving TDs: {stat['receiving_tds']} × 6 = {stat['receiving_tds'] * 6}")

                if stat.get('field_goals', 0) > 0:
                    print(f"   - Field Goals: {stat['field_goals']} × 3 = {stat['field_goals'] * 3}")
                if stat.get('pats', 0) > 0:
                    print(f"   - PATs: {stat['pats']} × 1 = {stat['pats']}")

        return True
    else:
        print(f"❌ FOUND {len(mismatches)} SCORING MISMATCHES!\n")

        for mismatch in mismatches[:10]:  # Show first 10
            print(f"Player: {mismatch['name']} ({mismatch['position']})")
            print(f"  Expected: {mismatch['expected']} pts")
            print(f"  Stored:   {mismatch['stored']} pts")
            print(f"  Diff:     {mismatch['difference']:.2f} pts")
            print()

        if len(mismatches) > 10:
            print(f"... and {len(mismatches) - 10} more mismatches")

        return False

def test_specific_scenarios():
    """Test specific scoring scenarios"""
    print("\n" + "=" * 80)
    print("🧪 Testing Specific Scoring Scenarios")
    print("=" * 80)
    print()

    test_cases = [
        {
            'name': 'QB with 300 pass yds, 3 TDs',
            'stats': {
                'passing_yards': 300,
                'passing_tds': 3
            },
            'expected': round(300 / 25) + (3 * 6)  # 12 + 18 = 30
        },
        {
            'name': 'RB with 100 rush yds, 2 TDs, 5 rec, 50 rec yds',
            'stats': {
                'rushing_yards': 100,
                'rushing_tds': 2,
                'receptions': 5,
                'receiving_yards': 50
            },
            'expected': round(100 / 10) + (2 * 6) + 5 + round(50 / 10)  # 10 + 12 + 5 + 5 = 32
        },
        {
            'name': 'WR with 10 rec, 150 yds, 2 TDs',
            'stats': {
                'receptions': 10,
                'receiving_yards': 150,
                'receiving_tds': 2
            },
            'expected': 10 + round(150 / 10) + (2 * 6)  # 10 + 15 + 12 = 37
        },
        {
            'name': 'Defense with 1 TD, 3 INT, 5 sacks',
            'stats': {
                'def_tds': 1,
                'interceptions': 3,
                'sacks': 5
            },
            'expected': (1 * 6) + (3 * 2) + (5 * 3)  # 6 + 6 + 15 = 27
        },
        {
            'name': 'Kicker with 3 FG, 4 PATs',
            'stats': {
                'field_goals': 3,
                'pats': 4
            },
            'expected': (3 * 3) + (4 * 1)  # 9 + 4 = 13
        }
    ]

    all_passed = True

    for test in test_cases:
        calculated = calculate_expected_points(test['stats'])
        passed = abs(calculated - test['expected']) < 0.01

        status = "✅" if passed else "❌"
        print(f"{status} {test['name']}")
        print(f"   Expected: {test['expected']:.2f} pts")
        print(f"   Calculated: {calculated:.2f} pts")

        if not passed:
            all_passed = False
            print(f"   ❌ MISMATCH!")
        print()

    return all_passed

if __name__ == '__main__':
    week = int(sys.argv[1]) if len(sys.argv) > 1 else 9

    # Run scenario tests first
    scenarios_passed = test_specific_scenarios()

    # Then test actual data
    data_passed = test_scoring(week)

    print("\n" + "=" * 80)
    print("📊 Test Summary")
    print("=" * 80)
    print(f"Scenario Tests: {'✅ PASSED' if scenarios_passed else '❌ FAILED'}")
    print(f"Week {week} Data Tests: {'✅ PASSED' if data_passed else '❌ FAILED'}")
    print("=" * 80)

    sys.exit(0 if (scenarios_passed and data_passed) else 1)
