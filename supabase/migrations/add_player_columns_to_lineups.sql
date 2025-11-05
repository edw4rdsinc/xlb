-- Add player position columns to lineups table
-- These columns store the player IDs for each position in a fantasy lineup

DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'qb') THEN
    ALTER TABLE public.lineups ADD COLUMN qb TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'rb1') THEN
    ALTER TABLE public.lineups ADD COLUMN rb1 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'rb2') THEN
    ALTER TABLE public.lineups ADD COLUMN rb2 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'wr1') THEN
    ALTER TABLE public.lineups ADD COLUMN wr1 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'wr2') THEN
    ALTER TABLE public.lineups ADD COLUMN wr2 TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'te') THEN
    ALTER TABLE public.lineups ADD COLUMN te TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'k') THEN
    ALTER TABLE public.lineups ADD COLUMN k TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lineups' AND column_name = 'def') THEN
    ALTER TABLE public.lineups ADD COLUMN def TEXT;
  END IF;

  RAISE NOTICE 'Player position columns added successfully';
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.lineups.qb IS 'Quarterback player ID';
COMMENT ON COLUMN public.lineups.rb1 IS 'Running Back 1 player ID';
COMMENT ON COLUMN public.lineups.rb2 IS 'Running Back 2 player ID';
COMMENT ON COLUMN public.lineups.wr1 IS 'Wide Receiver 1 player ID';
COMMENT ON COLUMN public.lineups.wr2 IS 'Wide Receiver 2 player ID';
COMMENT ON COLUMN public.lineups.te IS 'Tight End player ID';
COMMENT ON COLUMN public.lineups.k IS 'Kicker player ID';
COMMENT ON COLUMN public.lineups.def IS 'Defense/Special Teams player ID';

-- Create composite index for faster lineup queries
CREATE INDEX IF NOT EXISTS idx_lineups_players ON public.lineups(qb, rb1, rb2, wr1, wr2, te, k, def);

-- Grant appropriate permissions
GRANT SELECT, UPDATE ON public.lineups TO authenticated;
GRANT ALL ON public.lineups TO service_role;