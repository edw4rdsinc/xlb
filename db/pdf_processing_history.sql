-- PDF Processing History Table
-- Tracks all PDF processing jobs for the employee portal

CREATE TABLE IF NOT EXISTS pdf_processing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User who processed the document
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,

  -- File information
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,

  -- Processing details
  status TEXT CHECK (status IN ('uploading', 'extracting', 'emailing', 'complete', 'error')),
  extracted_text TEXT,
  page_count INTEGER,

  -- Email details
  recipient_emails TEXT[], -- Array of email addresses
  emails_sent INTEGER DEFAULT 0,

  -- Error tracking
  error_message TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pdf_processing_user_id ON pdf_processing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_processing_created_at ON pdf_processing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_processing_status ON pdf_processing_history(status);

-- Enable Row Level Security
ALTER TABLE pdf_processing_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own processing history
CREATE POLICY "Users can view own processing history"
  ON pdf_processing_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own processing records
CREATE POLICY "Users can create own processing records"
  ON pdf_processing_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_pdf_processing_updated_at ON pdf_processing_history;
CREATE TRIGGER update_pdf_processing_updated_at
  BEFORE UPDATE ON pdf_processing_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON pdf_processing_history TO authenticated;
GRANT ALL ON pdf_processing_history TO service_role;

COMMENT ON TABLE pdf_processing_history IS 'Tracks PDF text extraction jobs from the employee portal';
COMMENT ON COLUMN pdf_processing_history.status IS 'Current status: uploading, extracting, emailing, complete, error';
COMMENT ON COLUMN pdf_processing_history.recipient_emails IS 'Array of email addresses that received the processed document';
