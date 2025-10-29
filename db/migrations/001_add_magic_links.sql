-- Migration: Add magic links table for passwordless authentication
-- Created: 2025-10-29
-- Description: Allows users to access their lineup via unique, time-limited links

-- Magic Links Table
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_user ON magic_links(user_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_user_round ON magic_links(user_id, round_id);

-- Comments
COMMENT ON TABLE magic_links IS 'Time-limited authentication tokens for passwordless lineup submission';
COMMENT ON COLUMN magic_links.token IS 'Cryptographically secure random token (32+ characters)';
COMMENT ON COLUMN magic_links.expires_at IS 'Token expiration timestamp (typically 7 days from creation)';
COMMENT ON COLUMN magic_links.used_at IS 'When user submitted their lineup (marks token as consumed)';
