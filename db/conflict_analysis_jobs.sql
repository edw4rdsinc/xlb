-- Conflict Analysis Jobs Table
-- Tracks document comparison processing jobs

CREATE TABLE IF NOT EXISTS conflict_analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Job status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'error')),

  -- User who created the job
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,

  -- Input files (Wasabi URLs)
  spd_url TEXT NOT NULL,
  spd_filename TEXT,
  handbook_url TEXT NOT NULL,
  handbook_filename TEXT,

  -- Configuration
  focus_areas TEXT[], -- e.g., ['STD', 'LTD', 'Life Insurance']
  client_name TEXT,
  review_date DATE DEFAULT CURRENT_DATE,
  reviewer_name TEXT,

  -- Branding (can reference broker_profile or inline)
  broker_profile_id UUID REFERENCES broker_profiles(id),
  branding JSONB, -- {broker_name, logo_url, primary_color, secondary_color}

  -- Email recipients
  email_recipients TEXT[] NOT NULL,

  -- Progress tracking
  progress JSONB DEFAULT '{"step": "pending", "percent": 0}'::jsonb,

  -- Extracted text (store for analysis)
  spd_text TEXT,
  spd_pages INTEGER,
  handbook_text TEXT,
  handbook_pages INTEGER,

  -- Analysis results
  conflicts JSONB, -- Structured conflict data
  alignments JSONB, -- Structured alignment data
  report_html TEXT, -- Generated HTML report

  -- Error tracking
  error_message TEXT,
  error_details JSONB,

  -- Completion
  completed_at TIMESTAMP WITH TIME ZONE,
  processing_time_seconds INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conflict_jobs_user_id ON conflict_analysis_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_conflict_jobs_status ON conflict_analysis_jobs(status);
CREATE INDEX IF NOT EXISTS idx_conflict_jobs_created_at ON conflict_analysis_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conflict_jobs_pending ON conflict_analysis_jobs(status, created_at) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE conflict_analysis_jobs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own jobs"
  ON conflict_analysis_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own jobs"
  ON conflict_analysis_jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON conflict_analysis_jobs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can update any job (for background processing)
CREATE POLICY "Service role can update all jobs"
  ON conflict_analysis_jobs
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE TRIGGER update_conflict_jobs_updated_at
  BEFORE UPDATE ON conflict_analysis_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON conflict_analysis_jobs TO authenticated;
GRANT ALL ON conflict_analysis_jobs TO service_role;

COMMENT ON TABLE conflict_analysis_jobs IS 'Tracks SPD vs Handbook conflict analysis processing jobs';
COMMENT ON COLUMN conflict_analysis_jobs.status IS 'Job status: pending, processing, complete, error';
COMMENT ON COLUMN conflict_analysis_jobs.progress IS 'Real-time progress updates for UI';
COMMENT ON COLUMN conflict_analysis_jobs.conflicts IS 'Structured JSON of conflicts found';
