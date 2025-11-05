-- Add columns for chunked processing support
ALTER TABLE conflict_analysis_jobs
ADD COLUMN IF NOT EXISTS processing_state JSONB,
ADD COLUMN IF NOT EXISTS executive_summary JSONB;

-- Add new status values for staged processing
ALTER TABLE conflict_analysis_jobs
DROP CONSTRAINT IF EXISTS conflict_analysis_jobs_status_check;

ALTER TABLE conflict_analysis_jobs
ADD CONSTRAINT conflict_analysis_jobs_status_check
CHECK (status IN ('pending', 'processing', 'extracting', 'analyzing', 'complete', 'error'));

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_conflict_jobs_status_updated
ON conflict_analysis_jobs(status, updated_at);

-- Add comment explaining the new columns
COMMENT ON COLUMN conflict_analysis_jobs.processing_state IS
'Stores the state of chunked processing including chunk counts, extracted sections, and progress';

COMMENT ON COLUMN conflict_analysis_jobs.executive_summary IS
'Stores the executive summary of the conflict analysis including risk levels and key findings';