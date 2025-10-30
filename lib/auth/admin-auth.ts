/**
 * Admin Authentication Middleware
 * Provides secure server-side authentication for admin endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Admin session configuration
const ADMIN_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const ADMIN_TOKEN_SECRET = process.env.ADMIN_JWT_SECRET || crypto.randomBytes(64).toString('hex');

// Rate limiting for admin login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Clean up old login attempts periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of loginAttempts.entries()) {
    if (now - data.lastAttempt.getTime() > LOCKOUT_DURATION) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

/**
 * Verify admin JWT token
 */
export function verifyAdminToken(token: string): { valid: boolean; userId?: string; email?: string } {
  try {
    const decoded = jwt.verify(token, ADMIN_TOKEN_SECRET) as any;

    // Check expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Generate admin JWT token
 */
export function generateAdminToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + ADMIN_SESSION_DURATION) / 1000),
    },
    ADMIN_TOKEN_SECRET
  );
}

/**
 * Check if IP is locked out from too many attempts
 */
function isLockedOut(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return false;

  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();

  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Record login attempt
 */
function recordLoginAttempt(ip: string, success: boolean) {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: new Date() };
  attempts.count++;
  attempts.lastAttempt = new Date();
  loginAttempts.set(ip, attempts);
}

/**
 * Authenticate admin user
 */
export async function authenticateAdmin(
  email: string,
  password: string,
  ip: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check lockout
  if (isLockedOut(ip)) {
    return {
      success: false,
      error: 'Too many failed attempts. Please try again in 15 minutes.',
    };
  }

  const supabase = await createClient();

  // Check admin users table
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, is_active, last_login')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !adminUser || !adminUser.is_active) {
    recordLoginAttempt(ip, false);
    return {
      success: false,
      error: 'Invalid credentials',
    };
  }

  // Verify password using bcrypt (you'll need to install bcrypt)
  const bcrypt = require('bcryptjs');
  const passwordValid = await bcrypt.compare(password, adminUser.password_hash);

  if (!passwordValid) {
    recordLoginAttempt(ip, false);

    // Log failed attempt
    await supabase.from('admin_audit_logs').insert({
      user_id: adminUser.id,
      action: 'login_failed',
      ip_address: ip,
      metadata: { email },
    });

    return {
      success: false,
      error: 'Invalid credentials',
    };
  }

  // Success - generate token
  recordLoginAttempt(ip, true);
  const token = generateAdminToken(adminUser.id, adminUser.email);

  // Update last login and log success
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminUser.id);

  await supabase.from('admin_audit_logs').insert({
    user_id: adminUser.id,
    action: 'login_success',
    ip_address: ip,
    metadata: { email },
  });

  return {
    success: true,
    token,
  };
}

/**
 * Middleware to protect admin routes
 */
export async function requireAdminAuth(
  request: NextRequest
): Promise<{ authorized: boolean; response?: NextResponse; userId?: string; email?: string }> {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);
  const verification = verifyAdminToken(token);

  if (!verification.valid) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Verify admin still exists and is active
  const supabase = await createClient();
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('is_active')
    .eq('id', verification.userId!)
    .single();

  if (error || !adminUser || !adminUser.is_active) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Admin access revoked' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    userId: verification.userId,
    email: verification.email,
  };
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(
  userId: string,
  action: string,
  metadata: any,
  ip?: string
) {
  const supabase = await createClient();

  await supabase.from('admin_audit_logs').insert({
    user_id: userId,
    action,
    ip_address: ip,
    metadata,
    created_at: new Date().toISOString(),
  });
}