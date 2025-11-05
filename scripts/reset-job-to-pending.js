require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetJob() {
  const jobId = 'b5ee8eb2-1549-4371-a8a4-9181af3e796d';

  console.log(`Resetting job ${jobId} to pending...`);

  const { data, error } = await supabase
    .from('conflict_analysis_jobs')
    .update({
      status: 'pending',
      error_message: null,
      progress: null,
      processing_state: null,
      spd_text: null,
      handbook_text: null,
      completed_at: null
    })
    .eq('id', jobId)
    .select();

  if (error) {
    console.error('Error resetting job:', error);
  } else {
    console.log('Job reset successfully!');
    console.log('New status:', data[0]?.status);

    // Now trigger V2 processing
    console.log('\nTriggering V2 processing...');
    const fetch = require('node-fetch');
    const testResponse = await fetch('https://xlb.vercel.app/api/employee/test-v2-processing', {
      method: 'GET'
    });
    const result = await testResponse.json();
    console.log('V2 Processing Response:', JSON.stringify(result, null, 2));
  }
}

resetJob();