-- Add client_logo_url and group_name columns to conflict_analysis_jobs table
-- These columns are optional and used for better client branding in reports

DO $$
BEGIN
  -- Add client_logo_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conflict_analysis_jobs'
    AND column_name = 'client_logo_url'
  ) THEN
    ALTER TABLE public.conflict_analysis_jobs
    ADD COLUMN client_logo_url TEXT;

    COMMENT ON COLUMN public.conflict_analysis_jobs.client_logo_url
    IS 'Optional client logo URL for report branding';
  END IF;

  -- Add group_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'conflict_analysis_jobs'
    AND column_name = 'group_name'
  ) THEN
    ALTER TABLE public.conflict_analysis_jobs
    ADD COLUMN group_name TEXT;

    COMMENT ON COLUMN public.conflict_analysis_jobs.group_name
    IS 'Optional group name for client identification';
  END IF;

  RAISE NOTICE 'Migration completed: Added client_logo_url and group_name columns';
END $$;