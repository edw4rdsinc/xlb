#!/usr/bin/env node

/**
 * Quick check for is_locked column
 * Run with: node check-lineup-schema.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local file
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔍 Checking lineups table schema...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Try to fetch a lineup with is_locked column
const { data, error } = await supabase
  .from('lineups')
  .select('id, is_locked')
  .limit(1);

if (error) {
  if (error.message.includes('is_locked')) {
    console.log('❌ The is_locked column does NOT exist in the lineups table!\n');
    console.log('To fix this issue:\n');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Open the SQL Editor');
    console.log('3. Run this SQL command:\n');
    console.log('   ALTER TABLE public.lineups');
    console.log('   ADD COLUMN is_locked BOOLEAN DEFAULT false NOT NULL;\n');
    console.log('See FIX_IS_LOCKED_COLUMN.md for detailed instructions.');
  } else {
    console.error('❌ Error:', error.message);
  }
} else {
  console.log('✅ The is_locked column exists!\n');

  // Get some stats
  const { count: total } = await supabase
    .from('lineups')
    .select('*', { count: 'exact', head: true });

  const { count: locked } = await supabase
    .from('lineups')
    .select('*', { count: 'exact', head: true })
    .eq('is_locked', true);

  console.log(`📊 Lineup Statistics:`);
  console.log(`   Total lineups: ${total || 0}`);
  console.log(`   Locked: ${locked || 0}`);
  console.log(`   Unlocked: ${(total || 0) - (locked || 0)}`);
}