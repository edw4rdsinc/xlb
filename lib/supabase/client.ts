import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if environment variables are available
// This allows the build to succeed even without Supabase credentials
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Runtime checks will catch missing client

// Database types
export type User = {
  id: string;
  email: string;
  name: string;
  team_name: string;
  created_at: string;
  updated_at: string;
};

export type Player = {
  id: string;
  api_player_id?: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team?: string;
  is_elite: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
};

export type Round = {
  id: string;
  round_number: number;
  start_week: number;
  end_week: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

export type Lineup = {
  id: string;
  user_id: string;
  round_id: string;
  qb_id: string;
  rb1_id: string;
  rb2_id: string;
  wr1_id: string;
  wr2_id: string;
  te_id: string;
  k_id: string;
  def_id: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type WeeklyScore = {
  id: string;
  lineup_id: string;
  week_number: number;
  qb_points: number;
  rb1_points: number;
  rb2_points: number;
  wr1_points: number;
  wr2_points: number;
  te_points: number;
  k_points: number;
  def_points: number;
  total_points: number;
  round_cumulative_points: number;
  season_cumulative_points: number;
  created_at: string;
  updated_at: string;
};
