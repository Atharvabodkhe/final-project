import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }
    
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Insert subscriber into database
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select()
    
    if (error) {
      // Check if error is a duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter' },
          { status: 200 }
        )
      }
      
      console.error('Error inserting subscriber:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter', data },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 