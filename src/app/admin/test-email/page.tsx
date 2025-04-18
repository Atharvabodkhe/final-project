'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [sandbox, setSandbox] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    details?: any;
  } | null>(null)

  const handleTestEmail = async () => {
    if (!email) {
      setResult({
        success: false,
        error: 'Email address is required'
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Try direct debugging approach without sandbox mode
      if (!sandbox) {
        // Direct test to debug SendGrid issues
        const debugResponse = await fetch('/api/debug-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
          }),
        });
        
        const debugData = await debugResponse.json();
        
        if (!debugResponse.ok) {
          throw new Error(debugData.error || 'Failed to send debug email');
        }
        
        setResult({
          success: true,
          message: debugData.message || 'Debug email sent successfully. Check your inbox and spam folder.'
        });
        setLoading(false);
        return;
      }
      
      // Use the newsletter API endpoint with a single recipient
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Test Email',
          content: `
            <h1>Test Email</h1>
            <p>This is a test email sent at ${new Date().toLocaleString()}</p>
            <p>If you're seeing this, your email configuration is working correctly!</p>
            <p><strong>Sandbox mode: ${sandbox ? 'Enabled (email not actually sent)' : 'Disabled (real email sent)'}</strong></p>
          `,
          testMode: sandbox,
          testRecipient: email
        }),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email')
      }

      setResult({
        success: true,
        message: data.message
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'An unknown error occurred'
      })
      console.error('Test email error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Test Email Sending</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-300">
          <p className="font-medium mb-2">⚠️ Important: Sender Verification Required</p>
          <p className="mb-2">You must verify your sender email address in SendGrid before sending real emails:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Go to <a href="https://app.sendgrid.com/settings/sender_auth" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">SendGrid Sender Authentication</a></li>
            <li>Click "Verify a Single Sender"</li>
            <li>Enter your details and verify your email: {process.env.EMAIL_FROM || "atharvarb12@gmail.com"}</li>
          </ol>
          <p className="mt-2 font-medium">Use Sandbox Mode below until verification is complete.</p>
        </div>
        
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Send a test email to verify your SendGrid configuration
        </p>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Recipient Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            disabled={loading}
          />
        </div>

        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center space-x-2">
            <input
              id="sandbox"
              type="checkbox"
              checked={sandbox}
              onChange={(e) => setSandbox(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 dark:text-blue-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              disabled={loading}
            />
            <label
              htmlFor="sandbox"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Enable Sandbox Mode (won't actually send emails)
            </label>
          </div>
          {!sandbox && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ Warning: You're trying to send a real email. This will fail if your sender email isn't verified.
            </p>
          )}
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded text-sm ${
            result.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            <p className="font-medium mb-1">
              {result.success ? 'Success' : 'Error'}
            </p>
            <p>{result.message || result.error}</p>
          </div>
        )}

        <button 
          onClick={handleTestEmail} 
          disabled={loading || !email}
          className={`w-full py-2 px-4 rounded text-white font-medium disabled:opacity-50 ${
            !sandbox 
              ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
          }`}
        >
          {loading
            ? 'Sending...'
            : sandbox 
              ? 'Test Email (Sandbox Mode)' 
              : 'Try Debug Email Send'
          }
        </button>
      </div>
    </div>
  )
} 