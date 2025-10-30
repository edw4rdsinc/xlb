-- Fix sacks column data type from INTEGER to DECIMAL
-- Sacks in NFL can be fractional (0.5 when two players share a sack)

ALTER TABLE player_weekly_stats
ALTER COLUMN sacks TYPE DECIMAL(5,1);

-- Update default value
ALTER TABLE player_weekly_stats
ALTER COLUMN sacks SET DEFAULT 0.0;

COMMENT ON COLUMN player_weekly_stats.sacks IS 'Number of sacks (can be fractional, e.g., 0.5 for shared sacks)';
