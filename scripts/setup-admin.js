#!/usr/bin/env node

/**
 * Admin Setup Script
 * Creates initial admin user in the database
 *
 * Usage: node scripts/setup-admin.js <email> <password>
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Get command line arguments
const [,, email, password] = process.argv;

if (!email || !password) {
  console.log('Usage: node scripts/setup-admin.js <email> <password>');
  console.log('Example: node scripts/setup-admin.js admin@xlbenefits.com MySecurePassword123!');
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Invalid email address format');
  process.exit(1);
}

// Validate password strength
if (password.length < 8) {
  console.error('❌ Password must be at least 8 characters long');
  process.exit(1);
}

if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  console.error('❌ Password must contain lowercase, uppercase, and numbers');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      console.error('❌ Admin user with this email already exists');

      // Ask if they want to update the password
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Do you want to update the password? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          const { error } = await supabase
            .from('admin_users')
            .update({
              password_hash: passwordHash,
              password_changed_at: new Date().toISOString(),
              failed_login_attempts: 0,
              locked_until: null,
            })
            .eq('email', email.toLowerCase());

          if (error) {
            console.error('❌ Failed to update password:', error.message);
          } else {
            console.log('✅ Password updated successfully');
          }
        }
        readline.close();
        process.exit(0);
      });
      return;
    }

    // Create new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: 'Administrator',
        role: 'admin',
        is_active: true,
        is_super_admin: true,
        created_at: new Date().toISOString(),
        password_changed_at: new Date().toISOString(),
      })
      .select('id, email')
      .single();

    if (error) {
      console.error('❌ Failed to create admin user:', error.message);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email:', data.email);
    console.log('🆔 User ID:', data.id);
    console.log('');
    console.log('🔑 You can now login at: /admin');
    console.log('');
    console.log('⚠️  Security Recommendations:');
    console.log('   1. Use a strong, unique password');
    console.log('   2. Enable 2FA when available');
    console.log('   3. Regularly rotate passwords');
    console.log('   4. Monitor audit logs for suspicious activity');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the setup
createAdmin();