#!/usr/bin/env python3
"""
Apply database migration to fix sacks column data type

The sacks column needs to be DECIMAL not INTEGER because
NFL sacks can be fractional (0.5 when two players share a sack).
"""

import os
import sys
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

migration_sql = """
-- Fix sacks column data type from INTEGER to DECIMAL
ALTER TABLE player_weekly_stats
ALTER COLUMN sacks TYPE DECIMAL(5,1);

ALTER TABLE player_weekly_stats
ALTER COLUMN sacks SET DEFAULT 0.0;
"""

print("=" * 60)
print("APPLYING SACKS DATA TYPE MIGRATION")
print("=" * 60)
print("\nThis will change the 'sacks' column from INTEGER to DECIMAL(5,1)")
print("because NFL sacks can be fractional (e.g., 0.5 for shared sacks).\n")

input("Press Enter to continue or Ctrl+C to cancel...")

try:
    # Execute migration using raw SQL
    # Note: This may not work with supabase-py, might need to run manually
    print("\nAttempting to apply migration...")

    # Try using postgrest
    response = supabase.postgrest.rpc('execute_sql', {'query': migration_sql}).execute()

    print("✅ Migration applied successfully!")

except Exception as e:
    print(f"\n❌ Could not apply migration automatically: {e}")
    print("\n" + "=" * 60)
    print("MANUAL MIGRATION REQUIRED")
    print("=" * 60)
    print("\nPlease run this SQL in your Supabase SQL Editor:")
    print("\n" + migration_sql)
    print("\nSteps:")
    print("1. Go to https://supabase.com/dashboard")
    print("2. Select your project")
    print("3. Click 'SQL Editor' in the left sidebar")
    print("4. Paste the SQL above")
    print("5. Click 'Run'")
    print("=" * 60)

