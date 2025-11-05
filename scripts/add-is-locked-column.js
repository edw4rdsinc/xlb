#!/usr/bin/env node

/**
 * Script to add is_locked column to lineups table
 * Run with: node scripts/add-is-locked-column.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addIsLockedColumn() {
  try {
    console.log('Checking if is_locked column exists...');

    // First, let's try to select the column to see if it exists
    const { data: testData, error: testError } = await supabase
      .from('lineups')
      .select('id, is_locked')
      .limit(1);

    if (testError) {
      if (testError.message.includes('is_locked')) {
        console.log('Column is_locked does not exist. Adding it now...');

        // Since we can't run raw SQL through the client library,
        // we'll provide instructions for manual execution
        console.log('\n================================');
        console.log('MANUAL ACTION REQUIRED:');
        console.log('================================');
        console.log('Please run the following SQL in your Supabase SQL Editor:');
        console.log('');
        console.log('ALTER TABLE public.lineups');
        console.log('ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false NOT NULL;');
        console.log('');
        console.log('CREATE INDEX IF NOT EXISTS idx_lineups_is_locked ON public.lineups(is_locked);');
        console.log('');
        console.log('================================');
        console.log('');
        console.log('Navigate to your Supabase project dashboard:');
        console.log('1. Go to the SQL Editor');
        console.log('2. Paste and run the SQL above');
        console.log('3. The column will be added immediately');
        console.log('');
      } else {
        console.error('Error checking column:', testError);
      }
    } else {
      console.log('✅ Column is_locked already exists!');

      // Get counts
      const { count: totalCount } = await supabase
        .from('lineups')
        .select('*', { count: 'exact', head: true });

      const { count: lockedCount } = await supabase
        .from('lineups')
        .select('*', { count: 'exact', head: true })
        .eq('is_locked', true);

      console.log(`Total lineups: ${totalCount || 0}`);
      console.log(`Locked lineups: ${lockedCount || 0}`);
      console.log(`Unlocked lineups: ${(totalCount || 0) - (lockedCount || 0)}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

addIsLockedColumn();