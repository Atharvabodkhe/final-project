import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    console.log("Supabase URL:", supabaseUrl)
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection with a simple query
    const { data, error } = await supabase.from('subscribers').select('count').limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist yet, which is expected
        return NextResponse.json({ 
          message: 'Connection successful, but subscribers table needs to be created',
          status: 'warning'
        })
      }
      
      throw error
    }
    
    return NextResponse.json({ 
      message: 'Supabase connection successful',
      status: 'success',
      data
    })
  } catch (error: any) {
    console.error('Supabase connection test error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to connect to Supabase',
      status: 'error'
    }, { status: 500 })
  }
} 