import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendNewsletterBatch } from '@/lib/email'

// This endpoint can be triggered by a cron job service like Vercel Cron
export async function GET(request: Request) {
  try {
    // Verify this is a valid cron request (using a secret)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && (!authHeader || authHeader !== `Bearer ${cronSecret}`)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get latest newsletter content
    // In a real implementation, you might fetch this from a CMS or database
    const newsletterSubject = `The Byte Highlight - Weekly Tech Update ${new Date().toLocaleDateString()}`
    const newsletterContent = generateNewsletterContent()
    
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
    
    // Send newsletter
    const result = await sendNewsletterBatch(
      emailAddresses,
      newsletterSubject,
      newsletterContent
    )
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send weekly newsletter' },
        { status: 500 }
      )
    }
    
    // In a real implementation, log the newsletter send to your database
    
    return NextResponse.json({
      message: `Weekly newsletter sent to ${emailAddresses.length} subscribers`,
      success: true
    })
  } catch (error: any) {
    console.error('Weekly newsletter error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// Helper function to generate newsletter content
// In a real implementation, this would fetch content from your CMS or database
function generateNewsletterContent() {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Byte Highlight - Weekly Newsletter</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; }
        .date { color: #666; margin-bottom: 20px; }
        .content { margin-bottom: 30px; }
        .footer { text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
        .button { display: inline-block; background-color: #0051a3; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <span style="color:#FF6B00">T</span><span style="color:#0038B8">B</span><span style="color:#009B3A">H</span>
          THE BYTE HIGHLIGHT
        </div>
        <div class="date">${date}</div>
      </div>
      
      <div class="content">
        <h1>This Week in Tech</h1>
        
        <h2>Featured Story</h2>
        <p>Microsoft makes quantum breakthrough, plans commercial offering through Azure. Microsoft and Atom Computing aim to capitalize on a qubit-virtualization system that has broken a logical-qubit creation record.</p>
        
        <h2>Latest Updates</h2>
        <ul>
          <li>Futuristic 6G internet speed will arrive sooner than you think</li>
          <li>Cabinet approves fifth semiconductor unit in India</li>
          <li>Google Play Store App Deletion—Now Just 5 Days Away</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yourdomain.com/articles" class="button">Read More Articles</a>
        </div>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} The Byte Highlight. All rights reserved.</p>
        <p>
          <a href="https://yourdomain.com/unsubscribe?email=[EMAIL]">Unsubscribe</a> | 
          <a href="https://yourdomain.com/preferences?email=[EMAIL]">Manage Preferences</a>
        </p>
      </div>
    </body>
    </html>
  `
} 