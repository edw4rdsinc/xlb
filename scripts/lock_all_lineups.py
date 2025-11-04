#!/usr/bin/env python3
"""
Lock all existing fantasy football lineups
This prevents users from editing their lineups after they've been submitted
"""

import os
import sys
from supabase import create_client, Client

# Get Supabase credentials from environment
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase credentials")
    print("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")
    sys.exit(1)

def main():
    """Lock all lineups in the database"""
    print("🔒 Locking all fantasy football lineups...")
    print(f"📍 Supabase URL: {SUPABASE_URL}")

    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Get count of unlocked lineups
    response = supabase.table('lineups').select('id', count='exact').eq('is_locked', False).execute()
    unlocked_count = response.count

    print(f"📊 Found {unlocked_count} unlocked lineups")

    if unlocked_count == 0:
        print("✅ All lineups are already locked!")
        return

    # Lock all lineups
    update_response = supabase.table('lineups').update({
        'is_locked': True
    }).eq('is_locked', False).execute()

    # Verify
    verify_response = supabase.table('lineups').select('id', count='exact').eq('is_locked', True).execute()
    locked_count = verify_response.count

    print(f"\n✅ Successfully locked {unlocked_count} lineups!")
    print(f"📊 Total locked lineups: {locked_count}")
    print("\n🔒 All lineups are now locked and cannot be modified")
    print("Users will receive: 'Lineup is locked and cannot be modified' error if they try to edit")

if __name__ == '__main__':
    main()
