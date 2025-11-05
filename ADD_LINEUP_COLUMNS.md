# Add Player Position Columns to Lineups Table

## Problem
The `lineups` table is missing columns for storing player selections (qb, rb1, rb2, wr1, wr2, te, k, def).

## Solution
Run this SQL in your Supabase SQL Editor to add all the missing columns:

```sql
-- Add all player position columns to lineups table
ALTER TABLE public.lineups
ADD COLUMN IF NOT EXISTS qb TEXT,
ADD COLUMN IF NOT EXISTS rb1 TEXT,
ADD COLUMN IF NOT EXISTS rb2 TEXT,
ADD COLUMN IF NOT EXISTS wr1 TEXT,
ADD COLUMN IF NOT EXISTS wr2 TEXT,
ADD COLUMN IF NOT EXISTS te TEXT,
ADD COLUMN IF NOT EXISTS k TEXT,
ADD COLUMN IF NOT EXISTS def TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.lineups.qb IS 'Quarterback player ID';
COMMENT ON COLUMN public.lineups.rb1 IS 'Running Back 1 player ID';
COMMENT ON COLUMN public.lineups.rb2 IS 'Running Back 2 player ID';
COMMENT ON COLUMN public.lineups.wr1 IS 'Wide Receiver 1 player ID';
COMMENT ON COLUMN public.lineups.wr2 IS 'Wide Receiver 2 player ID';
COMMENT ON COLUMN public.lineups.te IS 'Tight End player ID';
COMMENT ON COLUMN public.lineups.k IS 'Kicker player ID';
COMMENT ON COLUMN public.lineups.def IS 'Defense/Special Teams player ID';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lineups_players ON public.lineups(qb, rb1, rb2, wr1, wr2, te, k, def);
```

## Verify the Columns Were Added
After running the above, verify with:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'lineups'
ORDER BY ordinal_position;
```

You should see all the new columns (qb, rb1, rb2, wr1, wr2, te, k, def) listed as type `text`.