#!/usr/bin/env python3
"""
Import Round 2 Rosters to Supabase
This script will:
1. Create/update users
2. Match player names to database IDs
3. Create Round 2 lineups
4. Handle custom players if needed
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional
from difflib import SequenceMatcher

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase import create_client, Client

# Supabase configuration - using correct URL and key from .env.local
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', 'https://exzeayeoosiabwhgyquq.supabase.co')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4emVheWVvb3NpYWJ3aGd5cXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQ3MDksImV4cCI6MjA2OTU1MDcwOX0.9xwKT8fyCH7GTPOEFh-1eP-l3Myfv-nwJpsAwvjEW0s')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class PlayerMatcher:
    """Handles fuzzy matching of player names to database IDs."""

    def __init__(self):
        self.players_cache = {}
        self.load_players()

    def load_players(self):
        """Load all players from database."""
        try:
            # Supabase defaults to 1000 limit, need to explicitly set higher or paginate
            all_players = []
            offset = 0
            limit = 1000

            while True:
                response = supabase.table('players').select('*').range(offset, offset + limit - 1).execute()
                all_players.extend(response.data)
                if len(response.data) < limit:
                    break
                offset += limit

            for player in all_players:
                pos = player['position']
                if pos not in self.players_cache:
                    self.players_cache[pos] = []
                self.players_cache[pos].append(player)
            print(f"Loaded {sum(len(p) for p in self.players_cache.values())} players from database")
        except Exception as e:
            print(f"Error loading players: {e}")
            sys.exit(1)

    def find_player(self, name: str, position: str, threshold: float = 0.85) -> Optional[Dict]:
        """Find player by name with fuzzy matching."""
        if not name:
            return None

        # For defenses, try multiple formats
        if position == 'DEF':
            for player in self.players_cache.get('DEF', []):
                # Try exact match first
                if player['name'] == name:
                    return player
                # Try with " Defense" suffix
                if player['name'] == f"{name} Defense":
                    return player
                # Try matching team code
                if player.get('team') == name:
                    return player
            return None

        # Try exact match first (case-insensitive)
        for player in self.players_cache.get(position, []):
            if player['name'].lower() == name.lower():
                return player

        # For special cases like "AJ Brown" vs "A.J. Brown"
        normalized_name = name.replace('.', '').replace(' ', '').lower()
        for player in self.players_cache.get(position, []):
            normalized_player = player['name'].replace('.', '').replace(' ', '').lower()
            if normalized_player == normalized_name:
                return player

        # Fuzzy match only as last resort
        best_match = None
        best_score = 0

        for player in self.players_cache.get(position, []):
            # Compare full names
            score = SequenceMatcher(None, name.lower(), player['name'].lower()).ratio()

            # For single-word names (like kickers), be more strict
            if ' ' not in name and ' ' in player['name']:
                # Only match if the single word matches last name exactly
                player_last = player['name'].split()[-1]
                if name.lower() == player_last.lower():
                    score = 1.0  # Perfect match for last name only
                else:
                    continue  # Skip this player

            if score > best_score and score >= threshold:
                best_score = score
                best_match = player

        return best_match

    def create_custom_player(self, name: str, position: str) -> Optional[str]:
        """Create a custom player if not found in database."""
        try:
            response = supabase.table('players').insert({
                'name': name,
                'position': position,
                'team': None,
                'is_custom': True,
                'is_elite': False
            }).execute()

            if response.data:
                player_id = response.data[0]['id']
                print(f"  Created custom player: {name} ({position}) - ID: {player_id}")
                # Add to cache
                if position not in self.players_cache:
                    self.players_cache[position] = []
                self.players_cache[position].append(response.data[0])
                return player_id
        except Exception as e:
            print(f"  Error creating custom player {name}: {e}")
        return None


def get_or_create_user(user_data: Dict) -> Optional[str]:
    """Get existing user or create new one."""
    email = user_data['email']

    try:
        # Check if user exists
        response = supabase.table('users').select('*').eq('email', email).execute()

        if response.data:
            # User exists - update info
            user = response.data[0]
            update_response = supabase.table('users').update({
                'name': user_data['name'],
                'team_name': user_data['team_name'],
                'updated_at': datetime.now().isoformat()
            }).eq('id', user['id']).execute()
            return user['id']
        else:
            # Create new user
            response = supabase.table('users').insert({
                'email': email,
                'name': user_data['name'],
                'team_name': user_data['team_name']
            }).execute()

            if response.data:
                return response.data[0]['id']
    except Exception as e:
        print(f"Error with user {email}: {e}")
    return None


def get_round_id(round_number: int = 2) -> Optional[str]:
    """Get the round ID for Round 2."""
    try:
        response = supabase.table('rounds').select('*').eq('round_number', round_number).execute()
        if response.data:
            return response.data[0]['id']
    except Exception as e:
        print(f"Error getting round: {e}")
    return None


def import_team(team_data: Dict, matcher: PlayerMatcher, round_id: str, dry_run: bool = False) -> bool:
    """Import a single team's lineup."""

    print(f"\nProcessing: {team_data['user']['team_name']} ({team_data['user']['name']})")

    if dry_run:
        print("  [DRY RUN - not saving]")

    # Get or create user
    user_id = get_or_create_user(team_data['user'])
    if not user_id:
        print(f"  ERROR: Could not create/find user")
        return False

    print(f"  User ID: {user_id}")

    # Match players to IDs
    player_ids = {}
    position_map = {
        'qb': 'QB', 'rb1': 'RB', 'rb2': 'RB',
        'wr1': 'WR', 'wr2': 'WR', 'te': 'TE',
        'defense': 'DEF', 'kicker': 'K'
    }

    for lineup_pos, player_name in team_data['lineup'].items():
        if not player_name:
            print(f"  WARNING: No player for {lineup_pos}")
            continue

        position = position_map[lineup_pos]
        player = matcher.find_player(player_name, position)

        if player:
            player_ids[lineup_pos] = player['id']
            if player['name'] != player_name:
                print(f"  {lineup_pos:8}: {player_name} → {player['name']}")
            else:
                print(f"  {lineup_pos:8}: {player['name']} ✓")
        else:
            # Create custom player
            print(f"  {lineup_pos:8}: {player_name} NOT FOUND")
            if not dry_run:
                custom_id = matcher.create_custom_player(player_name, position)
                if custom_id:
                    player_ids[lineup_pos] = custom_id

    # Check if lineup already exists
    try:
        existing = supabase.table('lineups').select('*').eq('user_id', user_id).eq('round_id', round_id).execute()

        if existing.data:
            print(f"  Lineup already exists for Round 2 - updating...")
            if not dry_run:
                # Update existing lineup
                update_data = {
                    'qb_id': player_ids.get('qb'),
                    'rb1_id': player_ids.get('rb1'),
                    'rb2_id': player_ids.get('rb2'),
                    'wr1_id': player_ids.get('wr1'),
                    'wr2_id': player_ids.get('wr2'),
                    'te_id': player_ids.get('te'),
                    'k_id': player_ids.get('kicker'),
                    'def_id': player_ids.get('defense'),
                    'updated_at': datetime.now().isoformat()
                }
                response = supabase.table('lineups').update(update_data).eq('id', existing.data[0]['id']).execute()
                print(f"  ✓ Lineup updated")
        else:
            print(f"  Creating new Round 2 lineup...")
            if not dry_run:
                # Create new lineup
                lineup_data = {
                    'user_id': user_id,
                    'round_id': round_id,
                    'qb_id': player_ids.get('qb'),
                    'rb1_id': player_ids.get('rb1'),
                    'rb2_id': player_ids.get('rb2'),
                    'wr1_id': player_ids.get('wr1'),
                    'wr2_id': player_ids.get('wr2'),
                    'te_id': player_ids.get('te'),
                    'k_id': player_ids.get('kicker'),
                    'def_id': player_ids.get('defense'),
                    'is_locked': False,
                    'submitted_at': datetime.now().isoformat()
                }
                response = supabase.table('lineups').insert(lineup_data).execute()
                print(f"  ✓ Lineup created")

        return True

    except Exception as e:
        print(f"  ERROR creating lineup: {e}")
        return False


def main():
    """Main import function."""

    # Load prepared data
    if not os.path.exists('round2_import_data.json'):
        print("Error: round2_import_data.json not found!")
        print("Run import_round2_rosters.py first")
        sys.exit(1)

    with open('round2_import_data.json', 'r') as f:
        teams = json.load(f)

    print(f"Loaded {len(teams)} teams for import")

    # Get Round 2 ID
    round_id = get_round_id(2)
    if not round_id:
        print("Error: Could not find Round 2 in database!")
        sys.exit(1)
    print(f"Round 2 ID: {round_id}")

    # Initialize player matcher
    print("\nLoading players from database...")
    matcher = PlayerMatcher()

    # Ask for confirmation
    response = input(f"\nReady to import {len(teams)} teams to Round 2? (yes/dry-run/no): ").lower()

    if response == 'no':
        print("Import cancelled")
        return

    dry_run = (response == 'dry-run')
    if dry_run:
        print("\n=== DRY RUN MODE - NO DATA WILL BE SAVED ===")

    # Import teams
    success_count = 0
    error_count = 0

    for i, team in enumerate(teams, 1):
        print(f"\n[{i}/{len(teams)}]", end="")
        if import_team(team, matcher, round_id, dry_run):
            success_count += 1
        else:
            error_count += 1

    # Summary
    print("\n" + "=" * 60)
    print(f"IMPORT COMPLETE {'(DRY RUN)' if dry_run else ''}")
    print(f"Success: {success_count}")
    print(f"Errors: {error_count}")
    print("=" * 60)

    if not dry_run:
        print("\nNext steps:")
        print("1. Set Round 3 as active in database")
        print("2. Use admin interface to edit lineups for Round 3")
        print("3. Lock lineups before Thursday midnight")


if __name__ == '__main__':
    main()