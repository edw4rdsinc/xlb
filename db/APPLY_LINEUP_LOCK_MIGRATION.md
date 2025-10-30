# Apply Lineup Lock Migration

## Quick Instructions

Run this SQL in your Supabase SQL Editor to add the `is_locked` field to lineups:

```sql
-- Add is_locked field to lineups table
ALTER TABLE lineups
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- Add index for locked lineups
CREATE INDEX IF NOT EXISTS idx_lineups_locked ON lineups(is_locked);

-- Lock the current 3 lineups
UPDATE lineups
SET is_locked = TRUE
WHERE id IN (
  SELECT id FROM lineups LIMIT 3
);
```

## Steps

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Copy and paste the SQL above
4. Click **Run**
5. Verify: Go to **Table Editor** → **lineups** → should see `is_locked` column

## What This Does

- Adds `is_locked` boolean field to lineups table (default: FALSE)
- Creates an index for performance
- Sets `is_locked = TRUE` for the 3 remaining lineups (Happy Cows 2, Cup O' Joe, Throwball FC)

## After Running

The 3 current lineups will be locked and cannot be edited. This is the UX change requested to lock lineups for the mock season.
