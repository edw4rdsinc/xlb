-- Migration: Make lineup player columns nullable
-- This allows admins to create empty lineups and fill them in later
-- Date: 2024-11-24

-- Make all player ID columns nullable
ALTER TABLE lineups
  ALTER COLUMN qb_id DROP NOT NULL,
  ALTER COLUMN rb1_id DROP NOT NULL,
  ALTER COLUMN rb2_id DROP NOT NULL,
  ALTER COLUMN wr1_id DROP NOT NULL,
  ALTER COLUMN wr2_id DROP NOT NULL,
  ALTER COLUMN te_id DROP NOT NULL,
  ALTER COLUMN k_id DROP NOT NULL,
  ALTER COLUMN def_id DROP NOT NULL;

-- Add comment explaining the change
COMMENT ON TABLE lineups IS 'Fantasy football lineups - player columns are nullable to support admin workflow of creating empty lineups first';