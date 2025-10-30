import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

/**
 * GET /api/admin/auth/verify
 *
 * Verify if current admin session is valid
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request);

    if (!auth.authorized) {
      return NextResponse.json(
        {
          authenticated: false,
          error: 'Not authenticated'
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      userId: auth.userId,
      email: auth.email,
    });
  } catch (error) {
    console.error('Admin verify error:', error);
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Verification failed'
      },
      { status: 500 }
    );
  }
}