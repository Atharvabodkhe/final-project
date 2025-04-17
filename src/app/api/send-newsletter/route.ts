import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendNewsletterBatch, sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // This should be protected with authentication in production
    // Check if the request has a valid API key or admin session
    
    const data = await request.json()
    const { subject, content, testMode = false, testRecipient } = data
    
    // Validate input
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }
    
    // If we have a specific test recipient, we'll only send to that email
    if (testRecipient) {
      console.log(`Sending newsletter test to single recipient: ${testRecipient}`)
      
      const result = await sendEmail({
        to: testRecipient,
        subject,
        html: content,
        sandbox: testMode
      })
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send test newsletter' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        message: `Newsletter ${testMode ? '(TEST MODE) ' : ''}sent to test email: ${testRecipient}`,
        success: true
      })
    }
    
    // Otherwise send to all subscribers
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get all active subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active')
    
    if (error) {
      console.error('Error fetching subscribers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      )
    }
    
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers found' },
        { status: 200 }
      )
    }
    
    // Extract email addresses
    const emailAddresses = subscribers.map(sub => sub.email)
    
    // Log configuration info to help with debugging
    console.log('Newsletter sending config:', {
      recipientCount: emailAddresses.length,
      testMode,
      fromEmail: process.env.EMAIL_FROM,
      sendgridConfigured: !!process.env.SENDGRID_API_KEY
    })
    
    // Send newsletter, using sandbox mode if in test mode
    const result = await sendNewsletterBatch(
      emailAddresses,
      subject,
      content,
      testMode // Pass testMode as sandbox flag
    )
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send newsletter' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: `Newsletter ${testMode ? '(TEST MODE) ' : ''}sent to ${emailAddresses.length} subscribers`,
      success: true
    })
  } catch (error: any) {
    console.error('Newsletter sending error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 