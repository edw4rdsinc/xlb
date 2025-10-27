-- Broker Profiles Table
-- Stores broker branding information for reuse in reports

CREATE TABLE IF NOT EXISTS broker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Broker information
  broker_name TEXT NOT NULL,
  logo_url TEXT, -- Wasabi URL to logo image
  primary_color TEXT DEFAULT '#0066cc',
  secondary_color TEXT DEFAULT '#003d7a',

  -- User ownership
  user_id UUID REFERENCES auth.users(id),

  -- Usage tracking
  last_used TIMESTAMP WITH TIME ZONE,
  use_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_broker_profiles_user_id ON broker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_profiles_last_used ON broker_profiles(last_used DESC);

-- Enable Row Level Security
ALTER TABLE broker_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own broker profiles"
  ON broker_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own broker profiles"
  ON broker_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own broker profiles"
  ON broker_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own broker profiles"
  ON broker_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_broker_profiles_updated_at
  BEFORE UPDATE ON broker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON broker_profiles TO authenticated;
GRANT ALL ON broker_profiles TO service_role;

COMMENT ON TABLE broker_profiles IS 'Stores broker branding information for conflict analysis reports';
