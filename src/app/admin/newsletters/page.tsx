"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ComposeNewsletterPage() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testMode, setTestMode] = useState(true) // Default to test mode for safety
  const [testEmail, setTestEmail] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // If test email is provided, send only to that email
      const payload = { 
        subject, 
        content, 
        testMode,
        ...(testEmail ? { testRecipient: testEmail } : {})
      }
      
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send newsletter')
      }
      
      setSuccess(data.message || `Newsletter ${testMode ? '(TEST MODE) ' : ''}sent successfully!`)
      // Only clear form if not in test mode
      if (!testMode) {
        setSubject('')
        setContent('')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      console.error('Send newsletter error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Compose Newsletter</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          <p className="font-medium mb-2">⚠️ Important: Sender Verification Required</p>
          <p className="mb-2">You must verify your sender email address in SendGrid before sending real emails:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Go to <a href="https://app.sendgrid.com/settings/sender_auth" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">SendGrid Sender Authentication</a></li>
            <li>Click "Verify a Single Sender"</li>
            <li>Enter your details and verify your email address</li>
          </ol>
          <p className="mt-2 font-medium">Use Test Mode below until verification is complete.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          {/* Test Mode Toggle */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="testMode"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <label htmlFor="testMode" className="block text-sm font-medium text-gray-700">
                Test Mode (emails won't actually be sent)
              </label>
              {testMode && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Testing
                </span>
              )}
            </div>
            {!testMode && (
              <p className="mt-2 text-xs text-red-600 font-medium">
                ⚠️ Warning: You're trying to send real emails. This will fail if your sender email isn't verified.
              </p>
            )}
          </div>
          
          {/* Test Email Input */}
          <div className="mb-4">
            <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Test Recipient Email (optional)
            </label>
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Send test only to this email (leave empty to send to all subscribers)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              If provided, the newsletter will only be sent to this email address
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Newsletter Content (HTML)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              required
              disabled={isLoading}
              placeholder="<h1>Newsletter Title</h1>\n<p>Your content here...</p>"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              Enter HTML content for your newsletter. You can use HTML tags to format your newsletter.
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/subscribers')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              View Subscribers
            </button>
            
            <button
              type="submit"
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 ${
                testMode 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              {isLoading 
                ? 'Sending...' 
                : testMode 
                  ? 'Send Test Newsletter' 
                  : 'Send Newsletter'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 