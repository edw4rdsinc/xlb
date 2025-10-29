import { NextRequest, NextResponse } from 'next/server';
import { validateMagicLink } from '@/lib/auth/magic-link';
import { cookies } from 'next/headers';

/**
 * GET /api/auth/magic-link?token=abc123
 *
 * Validates a magic link token and creates a session
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    );
  }

  try {
    const validation = await validateMagicLink(token);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid token' },
        { status: 401 }
      );
    }

    // Create session cookie (expires in 6 weeks = 42 days)
    const sessionData = {
      userId: validation.userId,
      roundId: validation.roundId,
      email: validation.userEmail,
      teamName: validation.teamName,
      token, // Store token for later when marking as used
    };

    const cookieStore = await cookies();
    cookieStore.set('ff_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 42, // 42 days (6 weeks)
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: validation.userId,
        email: validation.userEmail,
        teamName: validation.teamName,
      },
      roundId: validation.roundId,
    });
  } catch (error) {
    console.error('Magic link validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate magic link' },
      { status: 500 }
    );
  }
}
