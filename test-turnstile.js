/**
 * Test script for Cloudflare Turnstile implementation
 * Run with: node test-turnstile.js
 */

const API_URL = 'http://localhost:3000/api/calculators/fie/calculate';

// Test data for FIE Calculator
const testData = {
  plans: [
    {
      name: 'Test Plan',
      differential: 0,
      census: { tier1: 10, tier2: 5 },
      currentRates: { tier1: 500, tier2: 1000 }
    }
  ],
  costs: {
    adminCostMode: 'perEmployee',
    adminPEPM: 35,
    specificDeductible: 100000,
    specificRates: { tier1: 50, tier2: 100 },
    aggregateCorridor: 1.25,
    aggregateRate: 15,
    aggregateFactors: { tier1: 1.0, tier2: 2.0 },
    lasers: []
  },
  numberOfTiers: 2,
  email: 'test@example.com',
  companyName: 'Test Company'
};

async function testWithoutCaptcha() {
  console.log('\n1️⃣ Testing WITHOUT Turnstile token...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Request succeeded without Turnstile (expected in dev mode)');
      console.log('   Response:', JSON.stringify(result, null, 2).substring(0, 200) + '...');
    } else {
      console.log('❌ Request failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testWithDevToken() {
  console.log('\n2️⃣ Testing WITH development Turnstile token...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-turnstile-token': 'development-token'
      },
      body: JSON.stringify({
        ...testData,
        captchaToken: 'development-token'
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Request succeeded with dev token');
      console.log('   Savings:', result.data?.annualSavings ? `$${result.data.annualSavings}` : 'N/A');
    } else {
      console.log('❌ Request failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testRateLimit() {
  console.log('\n3️⃣ Testing RATE LIMITING (5 requests per minute)...');

  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-skip-captcha': 'development'
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`   Request ${i}: ✅ Success`);
      } else if (response.status === 429) {
        console.log(`   Request ${i}: 🚫 Rate limited (expected after 5 requests)`);
        console.log(`   Error: ${result.error}`);
      } else {
        console.log(`   Request ${i}: ❌ Failed - ${result.error}`);
      }
    } catch (error) {
      console.log(`   Request ${i}: ❌ Network error - ${error.message}`);
    }
  }
}

async function testInvalidData() {
  console.log('\n4️⃣ Testing INVALID DATA validation...');

  const invalidData = {
    plans: [], // Empty plans array (invalid)
    costs: testData.costs,
    numberOfTiers: 2,
    email: 'not-an-email', // Invalid email
    companyName: 'Test'
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-skip-captcha': 'development'
      },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();

    if (response.status === 400) {
      console.log('✅ Validation correctly rejected invalid data');
      console.log('   Errors:', JSON.stringify(result.details || result.error, null, 2));
    } else {
      console.log('❌ Validation should have rejected invalid data');
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function checkAuditLog() {
  console.log('\n5️⃣ Checking AUDIT LOGGING...');
  console.log('   📝 Check your Supabase dashboard for audit_logs table');
  console.log('   📝 Or check server console for audit log messages');
}

async function testTurnstileAPIDirectly() {
  console.log('\n6️⃣ Testing Turnstile API directly...');

  const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || 'your_secret_key';

  if (TURNSTILE_SECRET === 'your_secret_key') {
    console.log('   ⚠️ TURNSTILE_SECRET_KEY not set in environment');
    return;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: 'test-invalid-token'
      })
    });

    const result = await response.json();
    console.log('   Turnstile API response:', result);

    if (!result.success) {
      console.log('   ✅ Turnstile correctly rejected invalid token');
    }
  } catch (error) {
    console.log('   ❌ Could not reach Turnstile API:', error.message);
  }
}

async function runTests() {
  console.log('========================================');
  console.log('🛡️ Turnstile Security Testing Suite');
  console.log('========================================');
  console.log('Make sure the Next.js dev server is running: npm run dev');
  console.log('');
  console.log('Turnstile vs reCAPTCHA:');
  console.log('✅ More privacy-friendly (no user tracking)');
  console.log('✅ Better UX (invisible or managed modes)');
  console.log('✅ No "I\'m not a robot" puzzles');
  console.log('✅ Works with Cloudflare CDN');

  await testWithoutCaptcha();
  await testWithDevToken();
  await testInvalidData();
  await testRateLimit();
  await checkAuditLog();
  await testTurnstileAPIDirectly();

  console.log('\n========================================');
  console.log('✅ Testing complete!');
  console.log('========================================');
  console.log('\n📋 Next steps:');
  console.log('1. Get your Turnstile keys from Cloudflare Dashboard');
  console.log('2. Add keys to .env.local:');
  console.log('   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...');
  console.log('   TURNSTILE_SECRET_KEY=...');
  console.log('3. Run the audit_logs migration in Supabase');
  console.log('4. Set requireCaptcha: true in API routes when ready');
  console.log('5. Choose widget mode: invisible (auto) or managed (shows when suspicious)');
}

// Run tests
runTests().catch(console.error);