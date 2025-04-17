import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Please run the following SQL in your Supabase SQL Editor:',
      sql: `
-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active'
);

-- Add row-level security policies
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new subscribers (for the subscribe form)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT WITH CHECK (true);
  
-- Only allow authenticated users and service role to read data
CREATE POLICY "Allow authenticated to read all data" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
`,
      steps: [
        '1. Go to your Supabase dashboard',
        '2. Click on "SQL Editor" in the left sidebar',
        '3. Create a "New query"',
        '4. Paste the SQL shown above',
        '5. Click "Run" to execute the SQL',
        '6. Verify the table was created in the Table Editor'
      ]
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'An error occurred',
    }, { status: 500 })
  }
} 