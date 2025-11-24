#!/usr/bin/env python3
"""
Copy Round 2 lineups to Round 3
Preserves Round 2 as history and creates fresh Round 3 lineups for editing
"""

import sys
import os
from datetime import datetime
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://exzeayeoosiabwhgyquq.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4emVheWVvb3NpYWJ3aGd5cXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQ3MDksImV4cCI6MjA2OTU1MDcwOX0.9xwKT8fyCH7GTPOEFh-1eP-l3Myfv-nwJpsAwvjEW0s'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def main():
    """Copy all Round 2 lineups to Round 3."""

    # Get Round IDs
    print("Getting round IDs...")
    rounds = supabase.table('rounds').select('*').execute()

    round2_id = None
    round3_id = None

    for r in rounds.data:
        if r['round_number'] == 2:
            round2_id = r['id']
        elif r['round_number'] == 3:
            round3_id = r['id']

    if not round2_id or not round3_id:
        print("Error: Could not find Round 2 or Round 3")
        sys.exit(1)

    print(f"Round 2 ID: {round2_id}")
    print(f"Round 3 ID: {round3_id}")

    # Get all Round 2 lineups
    print("\nFetching Round 2 lineups...")
    round2_lineups = supabase.table('lineups').select('*').eq('round_id', round2_id).execute()

    print(f"Found {len(round2_lineups.data)} Round 2 lineups")

    # Check for existing Round 3 lineups
    existing_r3 = supabase.table('lineups').select('user_id').eq('round_id', round3_id).execute()
    existing_users = {lineup['user_id'] for lineup in existing_r3.data}

    if existing_users:
        print(f"\nWarning: {len(existing_users)} users already have Round 3 lineups")
        response = input("Skip existing users? (yes/no): ")
        if response.lower() != 'yes':
            print("Aborting...")
            return

    # Copy each lineup to Round 3
    success_count = 0
    skip_count = 0
    error_count = 0

    for lineup in round2_lineups.data:
        user_id = lineup['user_id']

        # Skip if user already has Round 3 lineup
        if user_id in existing_users:
            print(f"Skipping user {user_id} - already has Round 3 lineup")
            skip_count += 1
            continue

        # Create new Round 3 lineup
        new_lineup = {
            'user_id': user_id,
            'round_id': round3_id,
            'qb_id': lineup['qb_id'],
            'rb1_id': lineup['rb1_id'],
            'rb2_id': lineup['rb2_id'],
            'wr1_id': lineup['wr1_id'],
            'wr2_id': lineup['wr2_id'],
            'te_id': lineup['te_id'],
            'k_id': lineup['k_id'],
            'def_id': lineup['def_id'],
            'is_locked': False,  # Start unlocked for editing
            'submitted_at': datetime.now().isoformat()
        }

        try:
            response = supabase.table('lineups').insert(new_lineup).execute()
            success_count += 1
            print(f"✓ Copied lineup for user {user_id}")
        except Exception as e:
            error_count += 1
            print(f"✗ Error copying lineup for user {user_id}: {e}")

    # Summary
    print("\n" + "=" * 60)
    print("COPY COMPLETE")
    print(f"Success: {success_count}")
    print(f"Skipped: {skip_count}")
    print(f"Errors: {error_count}")
    print("=" * 60)

    if success_count > 0:
        print("\nNext steps:")
        print("1. Set Round 3 as active in database")
        print("2. Round 3 lineups are now ready for editing")
        print("3. Lock lineups before Thursday midnight")

        # Ask if we should set Round 3 as active
        response = input("\nSet Round 3 as active now? (yes/no): ")
        if response.lower() == 'yes':
            try:
                # Deactivate all rounds
                supabase.table('rounds').update({'is_active': False}).neq('id', '').execute()
                # Activate Round 3
                supabase.table('rounds').update({'is_active': True}).eq('id', round3_id).execute()
                print("✓ Round 3 is now active!")
            except Exception as e:
                print(f"Error setting Round 3 active: {e}")

if __name__ == '__main__':
    main()