import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminToken } from '@/lib/auth/admin-auth';

/**
 * POST /api/admin/auth/logout
 *
 * Log out admin user and invalidate session
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      // Verify token to get user info for logging
      const verification = verifyAdminToken(token);

      if (verification.valid && verification.userId) {
        const supabase = await createClient();

        // Log the logout action
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') || 'unknown';

        await supabase.from('admin_audit_logs').insert({
          user_id: verification.userId,
          action: 'logout',
          ip_address: ip,
          metadata: { email: verification.email },
        });

        // Invalidate session in database if using session tracking
        // This would require adding a session revocation mechanism
      }
    }

    // Clear the admin token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    // Still clear the cookie even if there's an error
    const response = NextResponse.json({
      success: true,
      message: 'Logged out',
    });

    response.cookies.set('admin_token', '', {
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}