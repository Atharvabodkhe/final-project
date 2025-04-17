import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Initialize Supabase admin client with service role key for table creation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Missing Supabase environment variables',
        status: 'error'
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if table already exists
    const { error: checkError } = await supabase.from('subscribers').select('count').limit(1)
    
    if (!checkError || checkError.code !== '42P01') {
      return NextResponse.json({
        message: 'subscribers table already exists',
        status: 'info'
      })
    }
    
    // Create the table using SQL (requires service role)
    const { error: createError } = await supabase.rpc('create_subscribers_table', {})
    
    if (createError) {
      // If RPC doesn't exist, create the SQL function first
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION create_subscribers_table()
        RETURNS void AS $$
        BEGIN
          CREATE TABLE IF NOT EXISTS subscribers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            status VARCHAR(50) DEFAULT 'active'
          );
          
          -- Add row-level security policies
          ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
          
          -- Allow anyone to insert new subscribers (for the subscribe form)
          CREATE POLICY "Allow anonymous inserts" ON subscribers
            FOR INSERT WITH CHECK (true);
            
          -- Only allow service role to select all data
          CREATE POLICY "Allow service role to read all data" ON subscribers
            FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
        END;
        $$ LANGUAGE plpgsql;
      `
      
      const { error: functionError } = await supabase.rpc('create_subscribers_table_function', { sql: createFunctionSQL })
      
      if (functionError) {
        // If function creation fails, directly execute SQL
        const { error: sqlError } = await supabase.from('subscribers').select('*')
        
        if (sqlError && sqlError.code === '42P01') {
          // Table doesn't exist, create it using SQL queries instead of RPC
          const createTableSQL = `
            CREATE TABLE subscribers (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              email VARCHAR(255) NOT NULL UNIQUE,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              status VARCHAR(50) DEFAULT 'active'
            );
            
            -- Add row-level security policies
            ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
            
            -- Allow anyone to insert new subscribers (for the subscribe form)
            CREATE POLICY "Allow anonymous inserts" ON subscribers
              FOR INSERT WITH CHECK (true);
              
            -- Only allow service role to select all data
            CREATE POLICY "Allow service role to read all data" ON subscribers
              FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
          `
          
          // Execute raw SQL
          const { error: directSqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
          
          if (directSqlError) {
            throw new Error(`Failed to create table directly: ${directSqlError.message}`)
          }
        } else {
          throw new Error(`Failed to create function: ${functionError.message}`)
        }
      } else {
        // Call the newly created function
        const { error: callError } = await supabase.rpc('create_subscribers_table', {})
        if (callError) {
          throw callError
        }
      }
    }
    
    return NextResponse.json({
      message: 'subscribers table created successfully',
      status: 'success'
    })
  } catch (error: any) {
    console.error('Failed to set up subscribers table:', error)
    return NextResponse.json({
      error: error.message || 'Failed to set up subscribers table',
      status: 'error',
      details: error
    }, { status: 500 })
  }
} 