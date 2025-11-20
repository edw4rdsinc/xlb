-- Roster Upload Tables
-- Teams, members, upload jobs, and fuzzy match approvals

-- Teams table
CREATE TABLE IF NOT EXISTS roster_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Team info
  name TEXT NOT NULL,
  company_name TEXT,

  -- Owner
  created_by UUID REFERENCES auth.users(id),

  -- Metadata
  member_count INTEGER DEFAULT 0
);

-- Team members table
CREATE TABLE IF NOT EXISTS roster_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Team reference
  team_id UUID REFERENCES roster_teams(id) ON DELETE CASCADE,

  -- Employee data (common fields from roster PDFs)
  employee_id TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT,

  -- Employment info
  hire_date DATE,
  termination_date DATE,
  department TEXT,
  job_title TEXT,
  employment_status TEXT, -- Full-time, Part-time, etc.

  -- Compensation
  salary DECIMAL(12,2),
  salary_frequency TEXT, -- Annual, Monthly, Hourly

  -- Benefits info
  coverage_tier TEXT, -- Employee Only, EE+Spouse, EE+Children, Family
  benefit_class TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Source tracking
  source_job_id UUID, -- Which upload job created this record

  -- Raw data from PDF (preserve original)
  raw_data JSONB
);

-- Roster upload jobs table
CREATE TABLE IF NOT EXISTS roster_upload_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Job status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'extracting',
    'parsing',
    'matching',
    'awaiting_approval',
    'importing',
    'complete',
    'error'
  )),

  -- User who created the job
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,

  -- Target team
  team_id UUID REFERENCES roster_teams(id),
  team_name TEXT, -- For creating new team

  -- Input file
  pdf_url TEXT NOT NULL,
  pdf_filename TEXT,
  file_size BIGINT,

  -- Progress tracking
  progress JSONB DEFAULT '{"step": "pending", "percent": 0}'::jsonb,

  -- Extracted data
  extracted_text TEXT,
  page_count INTEGER,

  -- Parsed records
  parsed_records JSONB, -- Array of parsed employee records
  total_records INTEGER DEFAULT 0,

  -- Matching results
  exact_matches INTEGER DEFAULT 0,
  fuzzy_matches INTEGER DEFAULT 0,
  new_records INTEGER DEFAULT 0,

  -- Import results
  imported_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,

  -- Column mapping (for structured PDFs/tables)
  column_mapping JSONB,

  -- Error tracking
  error_message TEXT,
  error_details JSONB,

  -- Completion
  completed_at TIMESTAMP WITH TIME ZONE,
  processing_time_seconds INTEGER
);

-- Pending fuzzy matches for human approval
CREATE TABLE IF NOT EXISTS roster_pending_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Job reference
  job_id UUID REFERENCES roster_upload_jobs(id) ON DELETE CASCADE,

  -- Parsed record from PDF
  parsed_record JSONB NOT NULL,
  parsed_name TEXT, -- For display

  -- Potential match from existing team
  existing_member_id UUID REFERENCES roster_members(id),
  existing_name TEXT, -- For display

  -- Match details
  match_score DECIMAL(5,4), -- 0.0000 to 1.0000 similarity score
  match_fields JSONB, -- Which fields triggered the fuzzy match
  match_reason TEXT, -- Human-readable explanation

  -- User decision
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
  decision_by UUID REFERENCES auth.users(id),
  decision_at TIMESTAMP WITH TIME ZONE,
  decision_notes TEXT,

  -- Action to take
  action TEXT CHECK (action IN ('update', 'create_new', 'skip'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_roster_teams_created_by ON roster_teams(created_by);
CREATE INDEX IF NOT EXISTS idx_roster_members_team_id ON roster_members(team_id);
CREATE INDEX IF NOT EXISTS idx_roster_members_email ON roster_members(email);
CREATE INDEX IF NOT EXISTS idx_roster_members_employee_id ON roster_members(team_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_roster_members_name ON roster_members(team_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_roster_jobs_user_id ON roster_upload_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_roster_jobs_team_id ON roster_upload_jobs(team_id);
CREATE INDEX IF NOT EXISTS idx_roster_jobs_status ON roster_upload_jobs(status);
CREATE INDEX IF NOT EXISTS idx_roster_jobs_pending ON roster_upload_jobs(status, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_roster_jobs_awaiting ON roster_upload_jobs(status, created_at) WHERE status = 'awaiting_approval';
CREATE INDEX IF NOT EXISTS idx_pending_matches_job_id ON roster_pending_matches(job_id);
CREATE INDEX IF NOT EXISTS idx_pending_matches_status ON roster_pending_matches(job_id, status) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE roster_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_upload_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_pending_matches ENABLE ROW LEVEL SECURITY;

-- Policies for roster_teams
CREATE POLICY "Users can view own teams"
  ON roster_teams FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create teams"
  ON roster_teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own teams"
  ON roster_teams FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own teams"
  ON roster_teams FOR DELETE
  USING (auth.uid() = created_by);

-- Policies for roster_members
CREATE POLICY "Users can view members of own teams"
  ON roster_members FOR SELECT
  USING (
    team_id IN (SELECT id FROM roster_teams WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can manage members of own teams"
  ON roster_members FOR ALL
  USING (
    team_id IN (SELECT id FROM roster_teams WHERE created_by = auth.uid())
  );

-- Policies for roster_upload_jobs
CREATE POLICY "Users can view own jobs"
  ON roster_upload_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own jobs"
  ON roster_upload_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON roster_upload_jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for roster_pending_matches
CREATE POLICY "Users can view matches for own jobs"
  ON roster_pending_matches FOR SELECT
  USING (
    job_id IN (SELECT id FROM roster_upload_jobs WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update matches for own jobs"
  ON roster_pending_matches FOR UPDATE
  USING (
    job_id IN (SELECT id FROM roster_upload_jobs WHERE user_id = auth.uid())
  );

-- Service role policies (for background processing)
CREATE POLICY "Service role full access to teams"
  ON roster_teams FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to members"
  ON roster_members FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to jobs"
  ON roster_upload_jobs FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to matches"
  ON roster_pending_matches FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE TRIGGER update_roster_teams_updated_at
  BEFORE UPDATE ON roster_teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roster_members_updated_at
  BEFORE UPDATE ON roster_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roster_jobs_updated_at
  BEFORE UPDATE ON roster_upload_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update team member count
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE roster_teams
    SET member_count = (
      SELECT COUNT(*) FROM roster_members
      WHERE team_id = NEW.team_id AND is_active = true
    )
    WHERE id = NEW.team_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE roster_teams
    SET member_count = (
      SELECT COUNT(*) FROM roster_members
      WHERE team_id = OLD.team_id AND is_active = true
    )
    WHERE id = OLD.team_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON roster_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_member_count();

-- Grant permissions
GRANT ALL ON roster_teams TO authenticated;
GRANT ALL ON roster_teams TO service_role;
GRANT ALL ON roster_members TO authenticated;
GRANT ALL ON roster_members TO service_role;
GRANT ALL ON roster_upload_jobs TO authenticated;
GRANT ALL ON roster_upload_jobs TO service_role;
GRANT ALL ON roster_pending_matches TO authenticated;
GRANT ALL ON roster_pending_matches TO service_role;

-- Comments
COMMENT ON TABLE roster_teams IS 'Teams/organizations for roster management';
COMMENT ON TABLE roster_members IS 'Team members imported from roster PDFs';
COMMENT ON TABLE roster_upload_jobs IS 'Tracks roster PDF upload and import jobs';
COMMENT ON TABLE roster_pending_matches IS 'Fuzzy matches awaiting human approval';
COMMENT ON COLUMN roster_pending_matches.match_score IS 'Similarity score from 0 to 1, where 1 is exact match';
COMMENT ON COLUMN roster_upload_jobs.status IS 'Job workflow: pending -> extracting -> parsing -> matching -> awaiting_approval -> importing -> complete';
