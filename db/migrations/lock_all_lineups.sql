-- Lock all existing lineups
-- Run this in Supabase SQL Editor
-- Migration: 20251103_lock_all_lineups

-- Update all lineups to locked status
UPDATE lineups
SET
  is_locked = TRUE,
  updated_at = NOW()
WHERE is_locked = FALSE;

-- Verify the lock
SELECT
  COUNT(*) as total_lineups,
  SUM(CASE WHEN is_locked THEN 1 ELSE 0 END) as locked_lineups,
  SUM(CASE WHEN NOT is_locked THEN 1 ELSE 0 END) as unlocked_lineups
FROM lineups;
