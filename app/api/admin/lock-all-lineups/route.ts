import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Lock all fantasy football lineups
 * POST /api/admin/lock-all-lineups
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get unlocked lineups (fetch actual data to avoid count issues)
    const { data: unlockedLineups, error: fetchError } = await supabase
      .from('lineups')
      .select('id, is_locked')
      .eq('is_locked', false);

    if (fetchError) {
      console.error('Error fetching unlocked lineups:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch unlocked lineups', details: fetchError },
        { status: 500 }
      );
    }

    const unlockedCount = unlockedLineups?.length || 0;
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
      lineupIds: updatedLineups?.map((l: { id: string }) => l.id) || [],
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
    const supabase = await createClient();

    // Fetch all lineups to count statuses
    const { data: allLineups, error: fetchError } = await supabase
      .from('lineups')
      .select('id, is_locked');

    if (fetchError) {
      console.error('Error fetching lineups for status:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch lineup status', details: fetchError },
        { status: 500 }
      );
    }

    const lineups = allLineups || [];
    const total = lineups.length;
    const locked = lineups.filter(l => l.is_locked).length;
    const unlocked = lineups.filter(l => !l.is_locked).length;

    return NextResponse.json({
      total,
      locked,
      unlocked,
      allLocked: unlocked === 0,
    });
  } catch (error: any) {
    console.error('Error in GET lock status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
