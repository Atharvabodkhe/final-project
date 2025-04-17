"use client"

import React, { useState } from "react"

export default function SubscribePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }
      
      setMessage(data.message || "Successfully subscribed to newsletter!")
      setSubmitted(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
      console.error("Subscribe error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="bg-[#00384d] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Newsletter Archive Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8">Newsletter Archive</h1>
            
            {/* August 2024 newsletter */}
            <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">August 2024</h2>
              <p className="text-sm md:text-base text-slate-700">Launch Introduction, Solid State Batteries, AAA Gaming In Cars, SearchGPT, and More.</p>
            </div>
            
            {/* September 2024 newsletter */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">September 2024</h2>
              <p className="text-sm md:text-base text-slate-700">600,000 New Jobs At Apple India, Meta's Serverless Platform, A Reality Check On AI Tools And More.</p>
            </div>
          </div>
          
          {/* Subscribe Form Section - 1/3 width on large screens */}
          <div className="bg-white rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-3xl font-bold text-center text-slate-900 mb-3 md:mb-4">Subscribe To Our Newsletter</h2>
            
            <p className="text-center text-sm md:text-base text-slate-700 mb-6">
              Get the latest tech news and updates delivered to your inbox.
            </p>
            
            {submitted ? (
              <div className="text-center text-sm md:text-base text-slate-700">
                <p className="text-green-600 font-medium">{message}</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-[#005e80] hover:text-[#004c66] underline"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#005e80] hover:bg-[#004c66] text-white font-medium py-2 md:py-3 px-4 rounded-md transition-colors text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 