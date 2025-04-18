import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { isAuthenticated, getUser } from '@/auth'

export async function GET(request: Request) {
  try {
    // Check authentication
    const isAuth = await isAuthenticated(request)
    console.log('GET /api/test-email - Auth check:', isAuth)
    
    if (!isAuth) {
      console.log('GET /api/test-email - Unauthorized access attempt')
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

export async function POST(request: Request) {
  try {
    // Check authentication with detailed logging
    const cookies = request.headers.get('cookie') || ''
    console.log('POST /api/test-email - Cookie header:', cookies)
    
    const isAuth = await isAuthenticated(request)
    console.log('POST /api/test-email - Auth check result:', isAuth)
    
    if (!isAuth) {
      console.log('POST /api/test-email - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('POST /api/test-email - Authentication successful')
    
    // Get request body
    const data = await request.json()
    const { email, sandbox = true } = data
    
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }
    
    // Ensure SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('POST /api/test-email - Missing SendGrid API key')
      return NextResponse.json({
        error: 'SendGrid API key not configured',
        message: 'Set SENDGRID_API_KEY in your environment variables'
      }, { status: 500 })
    }
    
    // Log configuration for debugging
    console.log(`[TEST EMAIL] Configuration:`)
    console.log(`[TEST EMAIL] - From Email: ${process.env.EMAIL_FROM || 'Not set'}`)
    console.log(`[TEST EMAIL] - Recipient: ${email}`)
    console.log(`[TEST EMAIL] - Sandbox Mode: ${sandbox ? 'Enabled' : 'Disabled'}`)
    
    // Send test email
    const result = await sendEmail({
      to: email,
      subject: 'Test Email from Your Newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">This is a test email</h1>
          <p>This email was sent at ${new Date().toLocaleString()}</p>
          <p>If you're seeing this, email sending is working correctly!</p>
          <p><strong>Sandbox mode: ${sandbox ? 'Enabled (email not actually sent)' : 'Disabled (real email sent)'}</strong></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">This is a test email from your newsletter application.</p>
        </div>
      `,
      sandbox
    })
    
    console.log('POST /api/test-email - Send result:', result)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email ${sandbox ? '(SANDBOX MODE)' : ''} successfully sent to ${email}`,
        sandbox,
        details: result
      })
    } else {
      throw new Error(result.error || 'Failed to send email')
    }
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