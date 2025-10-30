-- Add is_locked field to lineups table
-- Migration: 20251030_add_lineup_lock

ALTER TABLE lineups
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- Add index for locked lineups
CREATE INDEX IF NOT EXISTS idx_lineups_locked ON lineups(is_locked);

-- Comment
COMMENT ON COLUMN lineups.is_locked IS 'Whether the lineup is locked and cannot be modified';
