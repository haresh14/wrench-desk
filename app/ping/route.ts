import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Perform a lightweight query to keep the Supabase project active.
    // This executes a SELECT query against the database. Even if RLS 
    // blocks the read (returning 0 rows), the query still hits the 
    // database engine, preventing the project from pausing due to inactivity.
    await supabase.from('customers').select('id').limit(1)

    return NextResponse.json(
      { status: 'ok', message: 'pong' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ping error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to ping database' },
      { status: 500 }
    )
  }
}
