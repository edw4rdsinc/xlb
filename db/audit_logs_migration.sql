-- Audit Logs Table for tracking calculator API usage
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT NOW(),
  calculator VARCHAR(20) NOT NULL CHECK (calculator IN ('fie', 'deductible', 'assessment')),
  action VARCHAR(255) NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  email VARCHAR(255),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  response_time INTEGER, -- in milliseconds
  captcha_score DECIMAL(3,2), -- 0.00 to 1.00
  input_summary JSONB, -- Sanitized input data
  result_summary JSONB, -- Key results (not full calculation)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_calculator ON audit_logs(calculator);
CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON audit_logs(email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_captcha ON audit_logs(captcha_score);

-- Index for suspicious activity monitoring
CREATE INDEX IF NOT EXISTS idx_audit_logs_suspicious
  ON audit_logs(captcha_score)
  WHERE captcha_score < 0.5;

-- Row-level security (optional - enable if you want to restrict access)
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create a view for usage statistics
CREATE OR REPLACE VIEW audit_statistics AS
SELECT
  calculator,
  COUNT(*) as total_requests,
  SUM(CASE WHEN success = true THEN 1 ELSE 0 END) as successful_requests,
  ROUND(AVG(CASE WHEN success = true THEN 100 ELSE 0 END), 2) as success_rate,
  ROUND(AVG(response_time), 2) as avg_response_time,
  COUNT(CASE WHEN captcha_score < 0.5 THEN 1 END) as suspicious_requests,
  MIN(timestamp) as first_request,
  MAX(timestamp) as last_request
FROM audit_logs
GROUP BY calculator;

-- View for recent activity
CREATE OR REPLACE VIEW recent_audit_activity AS
SELECT
  timestamp,
  calculator,
  action,
  ip,
  email,
  success,
  error_message,
  response_time,
  captcha_score
FROM audit_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC
LIMIT 100;