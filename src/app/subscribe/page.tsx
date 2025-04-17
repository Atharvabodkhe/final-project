"use client"

import React, { useState } from "react"

export default function SubscribePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Subscription data:", { email })
    setSubmitted(true)
  }
  
  return (
    <div className="bg-[#00384d] min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Newsletter Archive Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-8">Newsletter Archive</h1>
            
            {/* August 2024 newsletter */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">August 2024</h2>
              <p className="text-slate-700">Launch Introduction, Solid State Batteries, AAA Gaming In Cars, SearchGPT, and More.</p>
            </div>
            
            {/* September 2024 newsletter */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900">September 2024</h2>
              <p className="text-slate-700">600,000 New Jobs At Apple India, Meta's Serverless Platform, A Reality Check On AI Tools And More.</p>
            </div>
          </div>
          
          {/* Subscribe Form Section - 1/3 width on large screens */}
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Subscribe To Our Newsletter</h2>
            
            <p className="text-center text-slate-700 mb-6">
              Get the latest tech news and updates delivered to your inbox.
            </p>
            
            {submitted ? (
              <div className="text-center text-slate-700">
                <p>Thank you for subscribing! You'll start receiving our newsletter soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#005e80] hover:bg-[#004c66] text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 