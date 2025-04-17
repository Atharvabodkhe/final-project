import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

type EmailOptions = {
  to: string
  subject: string
  html: string
  from?: string
  sandbox?: boolean // Add sandbox mode option
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail({ to, subject, html, from, sandbox = false }: EmailOptions) {
  // Make sure we have a valid 'from' email that's been verified in SendGrid
  // For testing, you can use the SendGrid sandbox mode with any from address
  const fromEmail = from || process.env.EMAIL_FROM || 'newsletter@thebytehighlight.com'
  
  // For testing/development without needing to verify sender
  if (sandbox) {
    console.log(`[SANDBOX MODE] Would send email to: ${to}`)
    console.log(`[SANDBOX MODE] From: ${fromEmail}`)
    console.log(`[SANDBOX MODE] Subject: ${subject}`)
    console.log(`[SANDBOX MODE] Email not actually sent in sandbox mode`)
    
    // Return success response for testing without sending
    return { 
      success: true, 
      response: { 
        statusCode: 200,
        body: { message: 'Sandbox mode - No email sent' }
      } 
    }
  }
  
  try {
    const msg: any = {
      to,
      from: fromEmail,
      subject,
      html,
    }
    
    // Enable sandbox mode for testing without sending real emails
    if (sandbox) {
      msg.mail_settings = {
        sandbox_mode: {
          enable: true
        }
      }
    }
    
    console.log(`Sending email to ${to} from ${fromEmail}${sandbox ? ' (SANDBOX MODE)' : ''}`)
    const response = await sgMail.send(msg)
    return { success: true, response }
  } catch (error: any) {
    console.error('Email sending error:', error.toString())
    // Log more details for debugging
    if (error.response) {
      console.error('SendGrid error details:', error.response.body)
    }
    
    // Special handling for sender identity errors
    if (error.toString().includes('from address does not match a verified Sender Identity')) {
      console.error('SENDER VERIFICATION ERROR: You need to verify the sender email in SendGrid')
      console.error('Visit https://app.sendgrid.com/settings/sender_auth to verify your sender identity')
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to send email' 
    }
  }
}

/**
 * Send a newsletter to multiple subscribers
 */
export async function sendNewsletterBatch(subscribers: string[], subject: string, htmlContent: string, sandbox = false) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Missing SendGrid API key')
    return { 
      success: false, 
      error: 'Email service not configured' 
    }
  }
  
  // For testing or development, only send to a few emails
  const isDevMode = process.env.NODE_ENV === 'development'
  const recipientEmails = isDevMode ? subscribers.slice(0, 2) : subscribers
  
  if (recipientEmails.length === 0) {
    return { success: true, message: 'No recipients to send to' }
  }
  
  // Make sure we're using a verified email in SendGrid
  const fromEmail = process.env.EMAIL_FROM || 'newsletter@thebytehighlight.com'
  
  try {
    console.log(`Attempting to send newsletter to ${recipientEmails.length} recipients${sandbox ? ' (SANDBOX MODE)' : ''}`)
    
    // For small lists, send individual emails instead of batch
    if (recipientEmails.length < 10) {
      console.log('Small recipient list, sending individual emails')
      for (const email of recipientEmails) {
        try {
          await sendEmail({
            to: email,
            subject,
            html: htmlContent,
            from: fromEmail,
            sandbox
          })
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err)
        }
      }
      return { success: true, message: 'Sent individual emails' }
    }
    
    // For larger lists, use batch sending (up to 1000 per batch)
    const messages = recipientEmails.map(email => {
      const msg: any = {
        to: email,
        from: fromEmail,
        subject,
        html: htmlContent,
      }
      
      // Enable sandbox mode for testing
      if (sandbox) {
        msg.mail_settings = {
          sandbox_mode: {
            enable: true
          }
        }
      }
      
      return msg
    })
    
    const response = await sgMail.send(messages)
    return { success: true, response }
  } catch (error: any) {
    console.error('Newsletter batch sending error:', error.toString())
    // Log more details for debugging
    if (error.response) {
      console.error('SendGrid error details:', error.response.body)
    }
    return { 
      success: false, 
      error: error.message || 'Failed to send newsletter batch' 
    }
  }
} 