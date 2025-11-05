# Fix for "is_locked column not found" Error

## Problem
The `lineups` table in your Supabase database is missing the `is_locked` column, which is required for the lineup lock/unlock functionality.

## Solution
You need to add the `is_locked` column to your database. Follow these steps:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor (usually in the left sidebar)

### Step 2: Run this SQL Command
Copy and paste the following SQL into the editor and click "Run":

```sql
-- Add is_locked column to lineups table
ALTER TABLE public.lineups
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false NOT NULL;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_lineups_is_locked ON public.lineups(is_locked);

-- Optional: Update any existing lineups to be unlocked
UPDATE public.lineups
SET is_locked = false
WHERE is_locked IS NULL;
```

### Step 3: Verify the Column was Added
Run this query to verify the column exists:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'lineups'
AND column_name = 'is_locked';
```

You should see a result showing the `is_locked` column with type `boolean` and default `false`.

### Step 4: Test the Functionality
After adding the column:
1. Go back to the Fantasy Football admin page
2. Try locking/unlocking individual lineups
3. Try the bulk lock action

## Alternative: Using Supabase CLI
If you have Supabase CLI installed, you can also apply the migration file:

```bash
# From the xlb directory
supabase migration up
```

The migration file is already created at: `supabase/migrations/add_is_locked_to_lineups.sql`

## Why This Happened
The `is_locked` column was likely not included in the initial database schema. This is a one-time fix - once the column is added, the lock/unlock functionality will work permanently.