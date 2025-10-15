import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      teamName,
      roundId,
      qb,
      rb1,
      rb2,
      wr1,
      wr2,
      te,
      k,
      def,
    } = body;

    // Validation
    if (!name || !email || !teamName || !roundId) {
      return NextResponse.json(
        { error: 'Missing required personal information' },
        { status: 400 }
      );
    }

    if (!qb || !rb1 || !rb2 || !wr1 || !wr2 || !te || !k || !def) {
      return NextResponse.json(
        { error: 'All lineup positions must be filled' },
        { status: 400 }
      );
    }

    // Validate elite player limit (max 2)
    const playerIds = [qb, rb1, rb2, wr1, wr2, te, k, def];
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, is_elite')
      .in('id', playerIds);

    if (playersError) throw playersError;

    const eliteCount = players?.filter(p => p.is_elite).length || 0;
    if (eliteCount > 2) {
      return NextResponse.json(
        { error: 'Maximum 2 elite players allowed per lineup' },
        { status: 400 }
      );
    }

    // Check if round is active
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .eq('is_active', true)
      .single();

    if (roundError || !round) {
      return NextResponse.json(
        { error: 'Round is not active for submissions' },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    let userId: string;

    if (existingUser) {
      // User exists - update their info
      userId = existingUser.id;
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name,
          team_name: teamName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    } else {
      // Create new user
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          name,
          team_name: teamName,
        })
        .select()
        .single();

      if (createUserError) throw createUserError;
      userId = newUser.id;
    }

    // Check if lineup already exists for this user and round
    const { data: existingLineup, error: lineupCheckError } = await supabase
      .from('lineups')
      .select('*')
      .eq('user_id', userId)
      .eq('round_id', roundId)
      .single();

    let lineupId: string;

    if (existingLineup) {
      // Update existing lineup
      lineupId = existingLineup.id;
      const { error: updateLineupError } = await supabase
        .from('lineups')
        .update({
          qb_id: qb,
          rb1_id: rb1,
          rb2_id: rb2,
          wr1_id: wr1,
          wr2_id: wr2,
          te_id: te,
          k_id: k,
          def_id: def,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', lineupId);

      if (updateLineupError) throw updateLineupError;
    } else {
      // Create new lineup
      const { data: newLineup, error: createLineupError } = await supabase
        .from('lineups')
        .insert({
          user_id: userId,
          round_id: roundId,
          qb_id: qb,
          rb1_id: rb1,
          rb2_id: rb2,
          wr1_id: wr1,
          wr2_id: wr2,
          te_id: te,
          k_id: k,
          def_id: def,
        })
        .select()
        .single();

      if (createLineupError) throw createLineupError;
      lineupId = newLineup.id;
    }

    // TODO: Send confirmation email
    // This will be implemented when we build the email system
    // await sendLineupConfirmationEmail({ email, name, teamName, lineupId, round });

    return NextResponse.json({
      success: true,
      lineupId,
      userId,
      message: existingLineup
        ? 'Lineup updated successfully'
        : 'Lineup submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting lineup:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit lineup' },
      { status: 500 }
    );
  }
}
