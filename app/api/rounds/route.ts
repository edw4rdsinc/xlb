import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/rounds
 *
 * Get all rounds ordered by round number
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: rounds, error } = await supabase
      .from('rounds')
      .select('*')
      .order('round_number', { ascending: true });

    if (error) {
      console.error('Rounds fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rounds' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rounds: rounds || [],
    });
  } catch (error) {
    console.error('Rounds error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rounds' },
      { status: 500 }
    );
  }
}
