import { NextRequest, NextResponse } from 'next/server';
import { validateMagicLink } from '@/lib/auth/magic-link';
import { cookies } from 'next/headers';
import { ApiResponses } from '@/lib/api/utils/responses';
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/auth/magic-link?token=abc123
 *
 * Validates a magic link token and creates a session
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return ApiResponses.badRequest('Token is required');
  }

  try {
    const validation = await validateMagicLink(token);

    if (!validation.valid) {
      return ApiResponses.unauthorized(validation.error || 'Invalid token');
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

    return ApiResponses.success({
      user: {
        id: validation.userId,
        email: validation.userEmail,
        teamName: validation.teamName,
      },
      roundId: validation.roundId,
    });
  } catch (error) {
    logger.error('Magic link validation error', error);
    return ApiResponses.serverError('Failed to validate magic link');
  }
}
