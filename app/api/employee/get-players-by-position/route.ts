import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    if (!position) {
      return NextResponse.json(
        { error: 'Position parameter required' },
        { status: 400 }
      )
    }

    // Get players for the specified position
    const { data: players, error } = await supabaseAdmin
      .from('players')
      .select('id, name, team, is_elite')
      .eq('position', position.toUpperCase())
      .order('name')

    if (error) {
      console.error('Error fetching players:', error)
      return NextResponse.json(
        { error: 'Failed to fetch players' },
        { status: 500 }
      )
    }

    return NextResponse.json({ players: players || [] })
  } catch (error: any) {
    console.error('Get players error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
