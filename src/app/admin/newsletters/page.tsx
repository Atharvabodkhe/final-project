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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Compose Newsletter</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-300">
          <p className="font-medium mb-2">⚠️ Important: Sender Verification Required</p>
          <p className="mb-2">You must verify your sender email address in SendGrid before sending real emails:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Go to <a href="https://app.sendgrid.com/settings/sender_auth" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">SendGrid Sender Authentication</a></li>
            <li>Click "Verify a Single Sender"</li>
            <li>Enter your details and verify your email address</li>
          </ol>
          <p className="mt-2 font-medium">Use Test Mode below until verification is complete.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700">
          {/* Test Mode Toggle */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="testMode"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 bg-white dark:bg-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400 mr-2"
              />
              <label htmlFor="testMode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Test Mode (emails won't actually be sent)
              </label>
              {testMode && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                  Testing
                </span>
              )}
            </div>
            {!testMode && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                ⚠️ Warning: You're trying to send real emails. This will fail if your sender email isn't verified.
              </p>
            )}
          </div>
          
          {/* Test Email Input */}
          <div className="mb-4">
            <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Test Recipient Email (optional)
            </label>
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Send test only to this email (leave empty to send to all subscribers)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              If provided, the newsletter will only be sent to this email address
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Newsletter Content (HTML)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 font-mono text-sm"
              required
              disabled={isLoading}
              placeholder="<h1>Newsletter Title</h1>\n<p>Your content here...</p>"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter HTML content for your newsletter. You can use HTML tags to format your newsletter.
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/subscribers')}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
              disabled={isLoading}
            >
              View Subscribers
            </button>
            
            <button
              type="submit"
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 ${
                testMode 
                  ? 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
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