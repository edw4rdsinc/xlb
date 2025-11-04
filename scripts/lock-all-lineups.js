#!/usr/bin/env node
/**
 * Lock all existing fantasy football lineups
 * This prevents users from editing their lineups after they've been submitted
 *
 * Usage: node scripts/lock-all-lineups.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

// Get Supabase credentials from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

async function main() {
  console.log('🔒 Locking all fantasy football lineups...');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Get count of unlocked lineups
  const { count: unlockedCount, error: countError } = await supabase
    .from('lineups')
    .select('*', { count: 'exact', head: true })
    .eq('is_locked', false);

  if (countError) {
    console.error('❌ Error counting unlocked lineups:', countError);
    process.exit(1);
  }

  console.log(`📊 Found ${unlockedCount} unlocked lineups`);

  if (unlockedCount === 0) {
    console.log('✅ All lineups are already locked!');
    return;
  }

  // Lock all lineups
  const { data, error: updateError } = await supabase
    .from('lineups')
    .update({ is_locked: true })
    .eq('is_locked', false)
    .select('id');

  if (updateError) {
    console.error('❌ Error locking lineups:', updateError);
    process.exit(1);
  }

  // Verify
  const { count: lockedCount, error: verifyError } = await supabase
    .from('lineups')
    .select('*', { count: 'exact', head: true })
    .eq('is_locked', true);

  if (verifyError) {
    console.error('❌ Error verifying locks:', verifyError);
    process.exit(1);
  }

  console.log(`\n✅ Successfully locked ${data.length} lineups!`);
  console.log(`📊 Total locked lineups: ${lockedCount}`);
  console.log('\n🔒 All lineups are now locked and cannot be modified');
  console.log('Users will receive: "Lineup is locked and cannot be modified" error if they try to edit');
}

main().catch(console.error);
