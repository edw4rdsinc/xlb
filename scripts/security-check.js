#!/usr/bin/env node

/**
 * Security Check Script
 * Validates that all security measures are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 XL Benefits Security Check\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, condition, critical = true) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else if (critical) {
    console.log(`❌ ${name}`);
    failed++;
  } else {
    console.log(`⚠️  ${name}`);
    warnings++;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function envVarExists(varName) {
  return process.env[varName] && process.env[varName].length > 0;
}

// Check critical security files
console.log('\n📁 Security Files:');
check('Admin auth middleware exists', fileExists('lib/auth/admin-auth.ts'));
check('Input sanitizer exists', fileExists('lib/security/input-sanitizer.ts'));
check('Global middleware exists', fileExists('middleware.ts'));
check('Admin migration SQL exists', fileExists('db/migrations/003_admin_security.sql'));
check('Security audit documentation exists', fileExists('SECURITY_AUDIT.md'));

// Check environment variables
console.log('\n🔐 Environment Variables:');
check('Supabase URL configured', envVarExists('NEXT_PUBLIC_SUPABASE_URL'));
check('Supabase service key configured', envVarExists('SUPABASE_SERVICE_ROLE_KEY'));
check('Admin JWT secret configured', envVarExists('ADMIN_JWT_SECRET'), false);
check('Turnstile secret key configured', envVarExists('TURNSTILE_SECRET_KEY'), false);
check('Resend API key configured', envVarExists('RESEND_API_KEY'), false);

// Check for removed vulnerabilities
console.log('\n🚫 Vulnerability Removal:');

// Check if hardcoded password is removed
let adminPageContent = '';
try {
  adminPageContent = fs.readFileSync('app/admin/page.tsx', 'utf8');
} catch (e) {}
check('Hardcoded admin password removed', !adminPageContent.includes('xlb2024admin'));
check('localStorage auth removed', !adminPageContent.includes("localStorage.setItem('adminAuth'"));

// Check API endpoints for auth
console.log('\n🛡️ API Endpoint Protection:');
const apiFiles = [
  'app/api/admin/rounds/[roundId]/generate-draft-pool/route.ts',
  'app/api/admin/rounds/[roundId]/send-invites/route.ts',
  'app/api/admin/draft-pools/update-elite/route.ts'
];

apiFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasAuth = content.includes('requireAdminAuth');
    const noTodo = !content.includes('TODO: Add admin authentication');
    check(`${path.basename(file)} has auth`, hasAuth && noTodo);
  } catch (e) {
    check(`${path.basename(file)} exists`, false);
  }
});

// Check input sanitization
console.log('\n🧹 Input Sanitization:');
try {
  const lineupContent = fs.readFileSync('app/api/lineup/submit/route.ts', 'utf8');
  check('Lineup API uses sanitization', lineupContent.includes('sanitizePlayerName'));
  check('UUID validation implemented', lineupContent.includes('sanitizeUUID'));
} catch (e) {
  check('Lineup API file exists', false);
}

// Check middleware configuration
console.log('\n🌐 Security Headers:');
try {
  const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
  check('CORS headers configured', middlewareContent.includes('Access-Control-Allow-Origin'));
  check('CSP headers configured', middlewareContent.includes('Content-Security-Policy'));
  check('X-Frame-Options configured', middlewareContent.includes('X-Frame-Options'));
  check('HSTS configured', middlewareContent.includes('Strict-Transport-Security'));
} catch (e) {
  check('Middleware configuration', false);
}

// Check session security
console.log('\n🍪 Session Security:');
try {
  const magicLinkContent = fs.readFileSync('app/api/auth/magic-link/route.ts', 'utf8');
  check('HttpOnly cookies', magicLinkContent.includes('httpOnly: true'));
  check('Secure cookies in production', magicLinkContent.includes("secure: process.env.NODE_ENV === 'production'"));
  check('SameSite strict', magicLinkContent.includes("sameSite: 'strict'"));
  check('Reduced session duration', !magicLinkContent.includes('60 * 60 * 24 * 42'));
} catch (e) {
  check('Magic link API exists', false);
}

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 Security Check Summary:\n');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Failed: ${failed}`);
console.log();

if (failed === 0 && warnings === 0) {
  console.log('🎉 All security checks passed! The system is secure.');
} else if (failed === 0) {
  console.log('✅ Critical security measures are in place.');
  console.log('⚠️  Some optional security features could be improved.');
} else {
  console.log('⚠️  CRITICAL SECURITY ISSUES DETECTED!');
  console.log('Please address the failed checks before deploying to production.');
}

console.log('\n💡 For detailed security information, see:');
console.log('   - SECURITY_AUDIT.md');
console.log('   - SECURITY_FIXES_IMPLEMENTED.md');

process.exit(failed > 0 ? 1 : 0);