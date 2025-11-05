-- Add is_locked column to lineups table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'lineups'
    AND column_name = 'is_locked'
  ) THEN
    ALTER TABLE public.lineups
    ADD COLUMN is_locked BOOLEAN DEFAULT false NOT NULL;

    COMMENT ON COLUMN public.lineups.is_locked IS 'Whether the lineup is locked and cannot be edited by the user';

    -- Create an index for faster queries on lock status
    CREATE INDEX idx_lineups_is_locked ON public.lineups(is_locked);

    RAISE NOTICE 'Added is_locked column to lineups table';
  ELSE
    RAISE NOTICE 'is_locked column already exists in lineups table';
  END IF;
END $$;

-- Grant appropriate permissions (adjust based on your roles)
GRANT SELECT, UPDATE ON public.lineups TO authenticated;
GRANT ALL ON public.lineups TO service_role;