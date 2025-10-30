-- XL Benefits Fantasy Football Database Schema
-- This schema should be run in Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_team_name ON users(team_name);

-- Rounds Table
CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 3),
  start_week INTEGER NOT NULL CHECK (start_week BETWEEN 1 AND 18),
  end_week INTEGER NOT NULL CHECK (end_week BETWEEN 1 AND 18),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rounds_active ON rounds(is_active);

-- Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_player_id VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(10) NOT NULL CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'K', 'DEF')),
  team VARCHAR(50),
  is_elite BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_elite ON players(is_elite);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

-- Lineups Table
CREATE TABLE IF NOT EXISTS lineups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  qb_id UUID NOT NULL REFERENCES players(id),
  rb1_id UUID NOT NULL REFERENCES players(id),
  rb2_id UUID NOT NULL REFERENCES players(id),
  wr1_id UUID NOT NULL REFERENCES players(id),
  wr2_id UUID NOT NULL REFERENCES players(id),
  te_id UUID NOT NULL REFERENCES players(id),
  k_id UUID NOT NULL REFERENCES players(id),
  def_id UUID NOT NULL REFERENCES players(id),
  is_locked BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, round_id)
);

CREATE INDEX IF NOT EXISTS idx_lineups_user ON lineups(user_id);
CREATE INDEX IF NOT EXISTS idx_lineups_round ON lineups(round_id);
CREATE INDEX IF NOT EXISTS idx_lineups_locked ON lineups(is_locked);

-- Weekly_Scores Table
CREATE TABLE IF NOT EXISTS weekly_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lineup_id UUID NOT NULL REFERENCES lineups(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 18),
  qb_points DECIMAL(10,2) DEFAULT 0,
  rb1_points DECIMAL(10,2) DEFAULT 0,
  rb2_points DECIMAL(10,2) DEFAULT 0,
  wr1_points DECIMAL(10,2) DEFAULT 0,
  wr2_points DECIMAL(10,2) DEFAULT 0,
  te_points DECIMAL(10,2) DEFAULT 0,
  k_points DECIMAL(10,2) DEFAULT 0,
  def_points DECIMAL(10,2) DEFAULT 0,
  total_points DECIMAL(10,2) DEFAULT 0,
  round_cumulative_points DECIMAL(10,2) DEFAULT 0,
  season_cumulative_points DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(lineup_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_weekly_scores_week ON weekly_scores(week_number);
CREATE INDEX IF NOT EXISTS idx_weekly_scores_lineup ON weekly_scores(lineup_id);
CREATE INDEX IF NOT EXISTS idx_weekly_scores_total ON weekly_scores(total_points DESC);

-- Player_Weekly_Stats Table
CREATE TABLE IF NOT EXISTS player_weekly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 18),
  passing_tds INTEGER DEFAULT 0,
  rushing_tds INTEGER DEFAULT 0,
  receiving_tds INTEGER DEFAULT 0,
  receptions INTEGER DEFAULT 0,
  passing_yards INTEGER DEFAULT 0,
  rushing_yards INTEGER DEFAULT 0,
  receiving_yards INTEGER DEFAULT 0,
  two_point_conversions INTEGER DEFAULT 0,
  field_goals INTEGER DEFAULT 0,
  pats INTEGER DEFAULT 0,
  def_tds INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  safeties INTEGER DEFAULT 0,
  sacks INTEGER DEFAULT 0,
  calculated_points DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_player_stats_week ON player_weekly_stats(week_number);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_weekly_stats(player_id);

-- Admin_Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);

-- Insert initial round data (2024 season example)
INSERT INTO rounds (round_number, start_week, end_week, start_date, end_date, is_active) VALUES
(1, 1, 6, '2024-09-05', '2024-10-13', true),
(2, 7, 12, '2024-10-17', '2024-11-24', false),
(3, 13, 18, '2024-11-28', '2025-01-05', false)
ON CONFLICT DO NOTHING;
