'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Mail, AlertTriangle, CheckCircle2 } from "lucide-react"

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      const authToken = localStorage.getItem("admin-auth")
      const hasCookie = document.cookie.includes("admin-auth=true")
      
      console.log("Test Email page - Auth check:", { 
        localStorageAuth: authToken === "true", 
        cookieAuth: hasCookie 
      })
      
      if (authToken !== "true" || !hasCookie) {
        // Authentication failed, redirect to login
        console.log("Test Email page - Auth failed, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("Test Email page - Auth successful")
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [router])

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
      // Use the POST endpoint for better security
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          sandbox
        }),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email')
      }

      setResult({
        success: true,
        message: data.message || 'Email sent successfully!'
      })
      
      toast({
        title: "Success",
        description: data.message || "Email sent successfully!",
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'An unknown error occurred'
      })
      console.error('Test email error:', error)
      
      toast({
        title: "Error",
        description: error.message || "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Authentication Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You need to sign in to access this page.</p>
          <Button 
            onClick={() => router.push('/admin/login')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Test Email Sending</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin')}
            className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Card className="max-w-lg mx-auto bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/30 border border-gray-100 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Send Test Email</CardTitle>
            <CardDescription>Verify your SendGrid configuration</CardDescription>
          </CardHeader>
          
          <CardContent>
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
                <div className="flex items-center gap-2 font-medium mb-1">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span>{result.success ? 'Success' : 'Error'}</span>
                </div>
                <p>{result.message || result.error}</p>
              </div>
            )}

            <Button 
              onClick={handleTestEmail} 
              disabled={loading || !email}
              className={`w-full py-2 px-4 disabled:opacity-50 ${
                !sandbox 
                  ? 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {sandbox ? 'Send Test Email (Sandbox Mode)' : 'Send Real Email'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 