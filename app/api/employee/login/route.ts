import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    // Get raw body text for debugging
    const bodyText = await request.text()
    console.log('Raw request body:', bodyText)

    let email, password
    try {
      const parsed = JSON.parse(bodyText)
      email = parsed.email
      password = parsed.password
    } catch (parseError: any) {
      console.error('JSON parse error:', parseError.message)
      return NextResponse.json(
        { error: 'Invalid request format', details: parseError.message },
        { status: 400 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client for server-side auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Server-side doesn't need session persistence
      }
    })

    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.json(
        { error: 'Invalid email or password', details: error.message },
        { status: 401 }
      )
    }

    // Return session data
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
