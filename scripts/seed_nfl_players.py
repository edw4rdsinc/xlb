#!/usr/bin/env python3
"""
Seed NFL Players from nflreadpy Rosters

This script:
1. Fetches all NFL rosters for 2024 season from nflreadpy
2. Extracts all active players by position (QB, RB, WR, TE, K)
3. Creates defense entries for all 32 NFL teams
4. Inserts players into database (avoids duplicates)
5. Returns summary of players added

Usage:
    python scripts/seed_nfl_players.py
    python scripts/seed_nfl_players.py --season 2024
    python scripts/seed_nfl_players.py --dry-run
"""

import argparse
import os
import sys
from typing import Dict, List, Set
from supabase import create_client, Client
from dotenv import load_dotenv
import nflreadpy as nfl

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

# All 32 NFL teams
NFL_TEAMS = [
    'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
    'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC',
    'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG',
    'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
]

# Fantasy-relevant positions
FANTASY_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K']


def fetch_nfl_rosters(season: int) -> List[Dict]:
    """
    Fetch all NFL rosters from nflreadpy
    Returns list of player dicts with: name, position, team, api_player_id
    """
    print(f"\n📥 Fetching NFL rosters for {season} season...")

    try:
        rosters = nfl.load_rosters([season])

        # Convert Polars to Pandas if needed
        if hasattr(rosters, 'to_pandas'):
            rosters = rosters.to_pandas()

        print(f"✅ Loaded {len(rosters)} player records from nflreadpy")

        # Filter to fantasy-relevant positions
        rosters_filtered = rosters[rosters['position'].isin(FANTASY_POSITIONS)]

        print(f"✅ Filtered to {len(rosters_filtered)} fantasy-relevant players")

        # Convert to list of dicts
        players = []
        for _, row in rosters_filtered.iterrows():
            # Use player_id from API if available, otherwise generate from name
            api_id = str(row.get('player_id', row.get('gsis_id', row['full_name'].lower().replace(' ', '_'))))

            players.append({
                'name': row['full_name'],
                'position': row['position'],
                'team': row['team'],
                'api_player_id': api_id,
                'is_elite': False,  # Will be set later by ranking script
                'is_custom': False
            })

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
        print(f"❌ Error fetching rosters: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def create_defense_entries() -> List[Dict]:
    """
    Create defense entries for all 32 NFL teams
    """
    print(f"\n🛡️  Creating defense entries for all 32 NFL teams...")

    defenses = []
    for team in NFL_TEAMS:
        defenses.append({
            'name': f"{team} Defense",
            'position': 'DEF',
            'team': team,
            'api_player_id': f"def_{team.lower()}",
            'is_elite': False,
            'is_custom': False
        })

    print(f"✅ Created {len(defenses)} defense entries")
    return defenses


def get_existing_players() -> Set[str]:
    """
    Get set of existing player names in database to avoid duplicates
    """
    print(f"\n📋 Checking existing players in database...")

    try:
        response = supabase.table('players').select('name').execute()
        existing_names = {row['name'] for row in response.data}

        print(f"✅ Found {len(existing_names)} existing players")
        return existing_names

    except Exception as e:
        print(f"⚠️  Warning: Could not fetch existing players: {e}")
        print(f"   Continuing anyway...")
        return set()


def insert_players(players: List[Dict], dry_run: bool = False):
    """
    Insert players into database (skips duplicates)
    """
    print(f"\n💾 Inserting players into database...")

    if dry_run:
        print("🔍 DRY RUN MODE - No changes will be saved")

    # Get existing players to avoid duplicates
    existing_names = get_existing_players()

    # Filter out duplicates
    new_players = [p for p in players if p['name'] not in existing_names]

    if not new_players:
        print(f"✅ No new players to add (all {len(players)} already exist)")
        return

    print(f"📝 Will insert {len(new_players)} new players (skipping {len(players) - len(new_players)} duplicates)")

    if dry_run:
        print(f"\nFirst 20 players that would be added:")
        for player in new_players[:20]:
            print(f"  {player['name']:30s} ({player['position']}) - {player['team']}")
        if len(new_players) > 20:
            print(f"  ... and {len(new_players) - 20} more")
        return

    # Insert in batches of 100 to avoid timeouts
    batch_size = 100
    total_inserted = 0
    errors = 0

    for i in range(0, len(new_players), batch_size):
        batch = new_players[i:i + batch_size]

        try:
            response = supabase.table('players').insert(batch).execute()
            total_inserted += len(batch)
            print(f"  Inserted batch {i // batch_size + 1}: {len(batch)} players")

        except Exception as e:
            errors += len(batch)
            print(f"  ❌ Error inserting batch {i // batch_size + 1}: {e}")

    print(f"\n✅ Summary:")
    print(f"   Successfully inserted: {total_inserted} players")
    if errors > 0:
        print(f"   Errors: {errors} players")


def main():
    parser = argparse.ArgumentParser(description='Seed NFL players into database')
    parser.add_argument('--season', type=int, default=2025,
                       help='NFL season year (default: 2025)')
    parser.add_argument('--dry-run', action='store_true',
                       help='Preview changes without saving to database')
    args = parser.parse_args()

    print("=" * 60)
    print("FANTASY FOOTBALL - SEED NFL PLAYERS")
    print("=" * 60)

    # Step 1: Fetch NFL rosters
    players = fetch_nfl_rosters(args.season)

    # Step 2: Create defense entries
    defenses = create_defense_entries()

    # Step 3: Combine
    all_players = players + defenses
    print(f"\n✅ Total players to seed: {len(all_players)}")

    # Step 4: Insert into database
    insert_players(all_players, dry_run=args.dry_run)

    print("\n" + "=" * 60)
    if args.dry_run:
        print("DRY RUN COMPLETE - Run without --dry-run to apply changes")
    else:
        print("COMPLETE - Players seeded successfully!")
        print("\nNext steps:")
        print("  1. Run: python scripts/rank_and_update_elite_players.py")
        print("  2. This will rank all players and mark elite status")
    print("=" * 60)


if __name__ == '__main__':
    main()
