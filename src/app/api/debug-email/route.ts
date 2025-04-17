import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.error('SENDGRID_API_KEY not configured!');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { to } = data;
    
    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }
    
    // Log configuration for debugging
    console.log('Debug email configuration:');
    console.log(`- Recipient: ${to}`);
    console.log(`- From: ${process.env.EMAIL_FROM || 'atharvarb12@gmail.com'}`);
    console.log(`- SendGrid API Key: ${process.env.SENDGRID_API_KEY ? 'Set (Masked)' : 'Not Set'}`);
    
    // Create email message with minimal HTML to avoid spam filters
    const msg = {
      to,
      from: {
        email: "noreply@sendgrid.net", // SendGrid domain
        name: "Your App via atharvarb12@gmail.com" // Mentions original sender
      },
      subject: 'Debug Test Email',
      text: `This is a simple test email sent at ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Debug Test Email</h2>
          <p>This is a simple test email sent at ${new Date().toLocaleString()}</p>
          <p>If you're seeing this, we're getting closer to solving the email issue!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a debug test. No action required.</p>
        </div>
      `,
    };
    
    // Try to send the email directly with SendGrid
    try {
      const response = await sgMail.send(msg);
      
      // Log the SendGrid response for debugging
      console.log('SendGrid Response:', response[0]?.statusCode);
      console.log('SendGrid Headers:', response[0]?.headers);
      
      return NextResponse.json({
        success: true,
        message: `Debug email sent to ${to}. Check your inbox and spam folder.`,
        details: {
          statusCode: response[0]?.statusCode,
        }
      });
    } catch (sendError: any) {
      console.error('SendGrid Error:', sendError);
      
      // Special handling for sender identity errors
      if (sendError.toString().includes('from address does not match a verified Sender Identity')) {
        console.error('SENDER VERIFICATION ERROR: You need to verify the sender email in SendGrid');
        
        return NextResponse.json({
          error: 'Sender email not verified',
          message: 'The sender email must be verified in your SendGrid account',
          solution: 'Go to SendGrid > Settings > Sender Authentication and verify your email',
          details: sendError.response?.body || {}
        }, { status: 403 });
      }
      
      return NextResponse.json({
        error: 'SendGrid error',
        message: sendError.message || 'Failed to send debug email',
        details: sendError.response?.body || {}
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Debug email error:', error);
    
    return NextResponse.json({
      error: 'Server error',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
} 