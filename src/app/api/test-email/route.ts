import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const url = new URL(request.url)
    const recipient = url.searchParams.get('recipient')
    const sandbox = url.searchParams.get('sandbox') !== 'false' // Default to true
    
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
    }
    
    // Log the current configuration
    console.log(`[TEST EMAIL] Configuration:`)
    console.log(`[TEST EMAIL] - From Email: ${process.env.EMAIL_FROM}`)
    console.log(`[TEST EMAIL] - Recipient: ${recipient}`)
    console.log(`[TEST EMAIL] - SendGrid API Key: ${process.env.SENDGRID_API_KEY ? 'Set (Masked)' : 'Not Set'}`)
    console.log(`[TEST EMAIL] - Sandbox Mode: ${sandbox ? 'Enabled' : 'Disabled'}`)
    
    // Send test email
    await sendEmail({
      to: recipient,
      subject: 'Test Email from YourSite',
      html: `
        <h1>This is a test email</h1>
        <p>This email was sent at ${new Date().toISOString()}</p>
        <p>If you're seeing this, email sending is working correctly.</p>
        <p><strong>Sandbox mode: ${sandbox ? 'Enabled (email not actually sent)' : 'Disabled (real email sent)'}</strong></p>
      `,
      sandbox
    })
    
    return NextResponse.json({
      success: true,
      message: `Test email ${sandbox ? '(SANDBOX MODE)' : ''} successfully sent to ${recipient}`,
      sandbox
    })
  } catch (error: any) {
    console.error('[TEST EMAIL] Error:', error)
    
    // Log detailed error information
    if (error.response) {
      console.error('[TEST EMAIL] SendGrid Response:', error.response.body)
    }
    
    return NextResponse.json({
      error: 'Failed to send test email',
      message: error.message || 'Unknown error',
      details: error.response?.body || {}
    }, { status: 500 })
  }
} 