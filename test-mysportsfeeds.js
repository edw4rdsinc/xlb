/**
 * Test MySportsFeeds API Connection
 * Run with: node test-mysportsfeeds.js
 */

// Load environment variables
const fs = require('fs');
const path = require('path');

// Simple .env.local parser
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const API_KEY = process.env.MYSPORTSFEEDS_API_KEY;
const PASSWORD = process.env.MYSPORTSFEEDS_PASSWORD;
const BASE_URL = 'https://api.mysportsfeeds.com/v2.1';

console.log('\n🏈 Testing MySportsFeeds API Connection...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('Password:', PASSWORD ? `${PASSWORD.substring(0, 5)}...` : 'NOT FOUND');
console.log('');

if (!API_KEY || !PASSWORD) {
  console.error('❌ ERROR: MySportsFeeds credentials not found in .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('Test 1: Testing basic connection (players endpoint)...');

    const url = `${BASE_URL}/pull/nfl/players.json?limit=1`;
    const auth = Buffer.from(`${API_KEY}:${PASSWORD}`).toString('base64');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log(`Sample data received: ${JSON.stringify(data).substring(0, 200)}...`);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Connection failed');
      console.log(`Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function testWeeklyStats(weekNumber = 8) {
  try {
    console.log(`\nTest 2: Fetching Week ${weekNumber} stats...`);

    const season = '2024-2025-regular';
    const url = `${BASE_URL}/pull/nfl/${season}/week/${weekNumber}/player_gamelogs.json`;
    const auth = Buffer.from(`${API_KEY}:${PASSWORD}`).toString('base64');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched weekly stats!');
      console.log(`Total player stats: ${data.gamelogs ? data.gamelogs.length : 0}`);

      // Show sample player
      if (data.gamelogs && data.gamelogs.length > 0) {
        const sample = data.gamelogs[0];
        console.log('\nSample player data:');
        console.log(`  Name: ${sample.player.firstName} ${sample.player.lastName}`);
        console.log(`  Position: ${sample.player.primaryPosition}`);
        console.log(`  Team: ${sample.player.currentTeam?.abbreviation || 'N/A'}`);
        console.log(`  Stats: ${JSON.stringify(sample.stats).substring(0, 150)}...`);
      }

      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to fetch weekly stats');
      console.log(`Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error fetching weekly stats:', error.message);
    return false;
  }
}

async function testCurrentWeekStats() {
  try {
    console.log('\nTest 3: Fetching current week stats...');

    // Get current week (approximate - NFL is in Week 8-9 around late October)
    const currentWeek = 8;
    const season = '2024-2025-regular';
    const url = `${BASE_URL}/pull/nfl/${season}/week/${currentWeek}/player_gamelogs.json`;
    const auth = Buffer.from(`${API_KEY}:${PASSWORD}`).toString('base64');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Current week (${currentWeek}) stats available!`);
      console.log(`Total players with stats: ${data.gamelogs ? data.gamelogs.length : 0}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`⚠️  Week ${currentWeek} stats not available yet`);
      console.log(`Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run all tests
(async () => {
  console.log('=' .repeat(60));

  const test1 = await testConnection();
  const test2 = await testWeeklyStats(7); // Test with Week 7 (likely available)
  const test3 = await testCurrentWeekStats();

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:');
  console.log(`  Basic Connection: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Week 7 Stats: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Current Week Stats: ${test3 ? '✅ PASS' : '⚠️  Not Available Yet'}`);

  if (test1 && test2) {
    console.log('\n🎉 MySportsFeeds API is working correctly!');
    console.log('You can now use the admin dashboard to sync stats.');
  } else if (test1 && !test2) {
    console.log('\n⚠️  API connected but stats not available for requested weeks.');
    console.log('This might be normal if the season hasn\'t started or data isn\'t synced yet.');
  } else {
    console.log('\n❌ API connection failed. Please check:');
    console.log('  1. Your subscription is active at mysportsfeeds.com');
    console.log('  2. Credentials in .env.local are correct');
    console.log('  3. MySportsFeeds backend has synced your subscription');
  }

  console.log('\n');
})();
