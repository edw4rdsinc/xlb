#!/usr/bin/env python3
"""
Import Fantasy Football Rosters to Database

Usage:
    python scripts/import_rosters.py data/rosters/round_1_rosters.csv
    python scripts/import_rosters.py data/rosters/round_1_rosters.json
    python scripts/import_rosters.py data/rosters/round_1_rosters.csv --dry-run

This script:
1. Reads roster file (CSV or JSON)
2. Creates users if they don't exist
3. Creates/updates players if they don't exist
4. Creates lineups with player references
5. Validates elite player restrictions (max 2 per lineup)
"""

import argparse
import csv
import json
import os
import sys
from typing import Dict, List
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


def read_roster_file(file_path: str) -> List[Dict]:
    """Read CSV or JSON roster file"""
    if file_path.endswith('.csv'):
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            return list(reader)
    elif file_path.endswith('.json'):
        with open(file_path, 'r') as f:
            return json.load(f)
    else:
        print(f"ERROR: Unsupported file type. Use .csv or .json")
        sys.exit(1)


def validate_roster(roster: Dict) -> bool:
    """Validate roster has all required fields"""
    required = ['team_name', 'participant_name', 'participant_email', 'round_number',
                'qb', 'rb1', 'rb2', 'wr1', 'wr2', 'te', 'k', 'def']

    for field in required:
        if field not in roster or not roster[field]:
            print(f"❌ Missing required field: {field}")
            return False

    return True


def get_or_create_user(roster: Dict, dry_run: bool) -> str:
    """Get existing user or create new one"""
    email = roster['participant_email']

    # Check if user exists
    response = supabase.table('users').select('*').eq('email', email).execute()

    if response.data:
        return response.data[0]['id']

    # Create new user
    if dry_run:
        print(f"   [DRY RUN] Would create user: {roster['participant_name']} ({email})")
        return 'dry-run-user-id'

    user_data = {
        'email': email,
        'name': roster['participant_name'],
        'team_name': roster['team_name']
    }

    response = supabase.table('users').insert(user_data).execute()
    print(f"   ✅ Created user: {roster['participant_name']}")
    return response.data[0]['id']


def get_or_create_player(player_name: str, position: str, dry_run: bool) -> str:
    """Get existing player or create new one with fuzzy matching"""

    # Check exact match first
    response = supabase.table('players').select('*').eq('name', player_name).eq('position', position).execute()

    if response.data:
        return response.data[0]['id']

    # Try fuzzy match
    all_players = supabase.table('players').select('*').eq('position', position).execute()

    for player in all_players.data:
        score = fuzz.ratio(player_name.lower(), player['name'].lower())
        if score >= 90:  # 90% match
            print(f"   🔍 Fuzzy matched: '{player_name}' → '{player['name']}'")
            return player['id']

    # Create new player
    if dry_run:
        print(f"   [DRY RUN] Would create player: {player_name} ({position})")
        return f'dry-run-player-{position}'

    player_data = {
        'name': player_name,
        'position': position,
        'is_custom': True  # Mark as custom since not from official list
    }

    response = supabase.table('players').insert(player_data).execute()
    print(f"   ✅ Created player: {player_name} ({position})")
    return response.data[0]['id']


def get_round_id(round_number: int) -> str:
    """Get round ID from database"""
    response = supabase.table('rounds').select('*').eq('round_number', round_number).execute()

    if not response.data:
        print(f"❌ Round {round_number} not found in database")
        print("   Create rounds first in Supabase or run setup script")
        sys.exit(1)

    return response.data[0]['id']


def check_elite_players(player_ids: Dict[str, str]) -> int:
    """Check how many elite players in lineup"""
    # Get player details
    all_ids = list(player_ids.values())
    response = supabase.table('players').select('*').in_('id', all_ids).execute()

    elite_count = sum(1 for p in response.data if p.get('is_elite', False))
    return elite_count


def import_roster(roster: Dict, dry_run: bool) -> bool:
    """Import a single roster into database"""
    print(f"\n📋 Processing: {roster['team_name']} (Round {roster['round_number']})")

    if not validate_roster(roster):
        return False

    try:
        # Step 1: Get or create user
        user_id = get_or_create_user(roster, dry_run)

        # Step 2: Get or create players
        player_ids = {
            'qb': get_or_create_player(roster['qb'], 'QB', dry_run),
            'rb1': get_or_create_player(roster['rb1'], 'RB', dry_run),
            'rb2': get_or_create_player(roster['rb2'], 'RB', dry_run),
            'wr1': get_or_create_player(roster['wr1'], 'WR', dry_run),
            'wr2': get_or_create_player(roster['wr2'], 'WR', dry_run),
            'te': get_or_create_player(roster['te'], 'TE', dry_run),
            'k': get_or_create_player(roster['k'], 'K', dry_run),
            'def': get_or_create_player(roster['def'], 'DEF', dry_run),
        }

        # Step 3: Check elite player restriction
        if not dry_run:
            elite_count = check_elite_players(player_ids)
            if elite_count > 2:
                print(f"   ⚠️  WARNING: {elite_count} elite players (max is 2)")

        # Step 4: Get round ID
        round_id = get_round_id(int(roster['round_number']))

        # Step 5: Create lineup
        if dry_run:
            print(f"   [DRY RUN] Would create lineup for {roster['team_name']}")
            return True

        lineup_data = {
            'user_id': user_id,
            'round_id': round_id,
            'qb_id': player_ids['qb'],
            'rb1_id': player_ids['rb1'],
            'rb2_id': player_ids['rb2'],
            'wr1_id': player_ids['wr1'],
            'wr2_id': player_ids['wr2'],
            'te_id': player_ids['te'],
            'k_id': player_ids['k'],
            'def_id': player_ids['def'],
        }

        # Upsert (in case lineup already exists for this user/round)
        response = supabase.table('lineups').upsert(
            lineup_data,
            on_conflict='user_id,round_id'
        ).execute()

        print(f"   ✅ Lineup created successfully")
        return True

    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Import fantasy football rosters')
    parser.add_argument('file', help='Path to roster file (CSV or JSON)')
    parser.add_argument('--dry-run', action='store_true', help='Preview without writing to database')

    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"ERROR: File not found: {args.file}")
        sys.exit(1)

    print("=" * 60)
    print("🏈 XL Benefits Fantasy Football - Roster Import")
    print("=" * 60)
    print(f"File: {args.file}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print("=" * 60)

    # Read roster file
    rosters = read_roster_file(args.file)
    print(f"\n📊 Found {len(rosters)} rosters to import")

    # Import each roster
    success_count = 0
    for roster in rosters:
        if import_roster(roster, args.dry_run):
            success_count += 1

    # Summary
    print("\n" + "=" * 60)
    print("✅ IMPORT COMPLETE")
    print("=" * 60)
    print(f"Total rosters: {len(rosters)}")
    print(f"Successful: {success_count}")
    print(f"Failed: {len(rosters) - success_count}")
    print("=" * 60)


if __name__ == '__main__':
    main()
