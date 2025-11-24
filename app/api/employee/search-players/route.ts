import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const position = searchParams.get('position')

    if (!query || query.length < 2) {
      return NextResponse.json({ players: [] })
    }

    // Build the query
    let dbQuery = supabaseAdmin
      .from('players')
      .select('id, name, team, position, is_elite')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(10)

    // Filter by position if provided
    if (position) {
      dbQuery = dbQuery.eq('position', position.toUpperCase())
    }

    const { data: players, error } = await dbQuery

    if (error) {
      console.error('Error searching players:', error)
      return NextResponse.json(
        { error: 'Failed to search players' },
        { status: 500 }
      )
    }

    return NextResponse.json({ players: players || [] })
  } catch (error: any) {
    console.error('Search players error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
