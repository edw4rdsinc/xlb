import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Create a magic link for a user to access their lineup
 */
export async function createMagicLink(
  userId: string,
  roundId: string,
  expiresInDays: number = 7
): Promise<{ token: string; expiresAt: Date }> {
  const supabase = await createClient();

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const { error } = await supabase
    .from('magic_links')
    .insert({
      user_id: userId,
      round_id: roundId,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create magic link: ${error.message}`);
  }

  return { token, expiresAt };
}

/**
 * Validate a magic link token and return user + round info
 */
export async function validateMagicLink(token: string): Promise<{
  valid: boolean;
  userId?: string;
  roundId?: string;
  userEmail?: string;
  teamName?: string;
  error?: string;
}> {
  const supabase = await createClient();

  // Get magic link with user info
  const { data: link, error } = await supabase
    .from('magic_links')
    .select(`
      id,
      user_id,
      round_id,
      expires_at,
      used_at,
      users (
        email,
        team_name
      )
    `)
    .eq('token', token)
    .single();

  if (error || !link) {
    return {
      valid: false,
      error: 'Invalid token',
    };
  }

  // Check if expired
  if (new Date(link.expires_at) < new Date()) {
    return {
      valid: false,
      error: 'Token has expired',
    };
  }

  // Check if already used
  if (link.used_at) {
    return {
      valid: false,
      error: 'Token has already been used',
    };
  }

  return {
    valid: true,
    userId: link.user_id,
    roundId: link.round_id,
    userEmail: link.users?.[0]?.email || '',
    teamName: link.users?.[0]?.team_name || '',
  };
}

/**
 * Mark a magic link as used after lineup submission
 */
export async function markMagicLinkUsed(token: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('magic_links')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);

  if (error) {
    throw new Error(`Failed to mark magic link as used: ${error.message}`);
  }
}

/**
 * Generate magic link URL for a user
 */
export function generateMagicLinkUrl(token: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base}/fantasy-football/lineup?token=${token}`;
}

/**
 * Bulk create magic links for all users in a round
 */
export async function createMagicLinksForRound(
  roundId: string,
  expiresInDays: number = 7
): Promise<Array<{ userId: string; email: string; teamName: string; token: string; url: string }>> {
  const supabase = await createClient();

  // Get all users who don't have a lineup for this round yet
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, team_name')
    .not('id', 'in',
      supabase
        .from('lineups')
        .select('user_id')
        .eq('round_id', roundId)
    );

  if (usersError) {
    throw new Error(`Failed to fetch users: ${usersError.message}`);
  }

  const results = [];

  for (const user of users || []) {
    const { token } = await createMagicLink(user.id, roundId, expiresInDays);
    const url = generateMagicLinkUrl(token);

    results.push({
      userId: user.id,
      email: user.email,
      teamName: user.team_name,
      token,
      url,
    });
  }

  return results;
}
