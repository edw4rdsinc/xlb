import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Lock all fantasy football lineups
 * POST /api/admin/lock-all-lineups
 */
export async function POST(request: Request) {
  try {
    // Get count of unlocked lineups first
    const { count: unlockedCount, error: countError } = await supabase
      .from('lineups')
      .select('*', { count: 'exact', head: true })
      .eq('is_locked', false);

    if (countError) {
      console.error('Error counting unlocked lineups:', countError);
      return NextResponse.json(
        { error: 'Failed to count unlocked lineups', details: countError },
        { status: 500 }
      );
    }

    console.log(`Found ${unlockedCount} unlocked lineups`);

    if (unlockedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'All lineups are already locked',
        lockedCount: 0,
        totalLocked: 0,
      });
    }

    // Lock all unlocked lineups
    const { data: updatedLineups, error: updateError } = await supabase
      .from('lineups')
      .update({
        is_locked: true,
        updated_at: new Date().toISOString(),
      })
      .eq('is_locked', false)
      .select('id');

    if (updateError) {
      console.error('Error locking lineups:', updateError);
      return NextResponse.json(
        { error: 'Failed to lock lineups', details: updateError },
        { status: 500 }
      );
    }

    // Verify final count
    const { count: totalLocked, error: verifyError } = await supabase
      .from('lineups')
      .select('*', { count: 'exact', head: true })
      .eq('is_locked', true);

    if (verifyError) {
      console.error('Error verifying locks:', verifyError);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully locked ${updatedLineups?.length || 0} lineups`,
      lockedCount: updatedLineups?.length || 0,
      totalLocked,
      lineupIds: updatedLineups?.map(l => l.id) || [],
    });
  } catch (error: any) {
    console.error('Error in lock-all-lineups:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check lock status
 * GET /api/admin/lock-all-lineups
 */
export async function GET() {
  try {
    const { count: totalLineups, error: totalError } = await supabase
      .from('lineups')
      .select('*', { count: 'exact', head: true });

    const { count: lockedLineups, error: lockedError } = await supabase
      .from('lineups')
      .select('*', { count: 'exact', head: true })
      .eq('is_locked', true);

    const { count: unlockedLineups, error: unlockedError } = await supabase
      .from('lineups')
      .select('*', { count: 'exact', head: true })
      .eq('is_locked', false);

    if (totalError || lockedError || unlockedError) {
      return NextResponse.json(
        { error: 'Failed to fetch lineup status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      total: totalLineups || 0,
      locked: lockedLineups || 0,
      unlocked: unlockedLineups || 0,
      allLocked: unlockedLineups === 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
