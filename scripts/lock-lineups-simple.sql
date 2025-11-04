-- Lock All Fantasy Football Lineups
-- Run this in Supabase SQL Editor
-- Updated: 2025-11-03

-- Step 1: Check current status
SELECT
  COUNT(*) as total_lineups,
  SUM(CASE WHEN is_locked THEN 1 ELSE 0 END) as currently_locked,
  SUM(CASE WHEN NOT is_locked THEN 1 ELSE 0 END) as currently_unlocked
FROM lineups;

-- Step 2: Lock all lineups
UPDATE lineups
SET
  is_locked = TRUE,
  updated_at = NOW()
WHERE is_locked = FALSE;

-- Step 3: Verify all are locked
SELECT
  COUNT(*) as total_lineups,
  SUM(CASE WHEN is_locked THEN 1 ELSE 0 END) as now_locked,
  SUM(CASE WHEN NOT is_locked THEN 1 ELSE 0 END) as still_unlocked
FROM lineups;

-- Step 4: Show locked lineups with team names
SELECT
  l.id,
  u.team_name,
  u.email,
  l.is_locked,
  l.submitted_at,
  l.updated_at
FROM lineups l
JOIN users u ON l.user_id = u.id
ORDER BY u.team_name;
