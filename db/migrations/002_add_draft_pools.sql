-- Migration: Add draft pool system for round-based player selection
-- Created: 2025-10-29
-- Description: Track available players and elite status per round

-- Draft Pools Table
-- Stores the ranked player list available for each round's draft
CREATE TABLE IF NOT EXISTS draft_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position VARCHAR(10) NOT NULL,
  rank INTEGER NOT NULL, -- 1-12 for QB, 1-10 for TE, 1-20 for RB/WR
  total_points DECIMAL(10,2) NOT NULL, -- Fantasy points from previous round (ranking criteria)
  is_elite BOOLEAN DEFAULT false, -- Elite status: Top 3 QB/TE or Top 6 RB/WR by fantasy points
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(round_id, player_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_draft_pools_round ON draft_pools(round_id);
CREATE INDEX IF NOT EXISTS idx_draft_pools_position ON draft_pools(position);
CREATE INDEX IF NOT EXISTS idx_draft_pools_rank ON draft_pools(rank);
CREATE INDEX IF NOT EXISTS idx_draft_pools_elite ON draft_pools(is_elite);
CREATE INDEX IF NOT EXISTS idx_draft_pools_round_position ON draft_pools(round_id, position);

-- Add elite tracking to lineups
-- Track which players in a lineup are elite for validation
ALTER TABLE lineups ADD COLUMN IF NOT EXISTS elite_count INTEGER DEFAULT 0;
ALTER TABLE lineups ADD COLUMN IF NOT EXISTS elite_player_ids UUID[] DEFAULT '{}';

-- Comments
COMMENT ON TABLE draft_pools IS 'Available players for each round draft, ranked by fantasy points';
COMMENT ON COLUMN draft_pools.rank IS 'Position rank (1-12 QB, 1-10 TE, 1-20 RB/WR)';
COMMENT ON COLUMN draft_pools.total_points IS 'Total fantasy points from previous round (ranking and elite criteria)';
COMMENT ON COLUMN draft_pools.is_elite IS 'Elite status: Top 3 QB/TE, Top 6 RB/WR by fantasy points';
COMMENT ON COLUMN lineups.elite_count IS 'Number of elite players in this lineup (max 2)';
COMMENT ON COLUMN lineups.elite_player_ids IS 'Array of elite player IDs for quick validation';
