"use client"

import React, { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "cd57ed84-713f-493a-af5e-2f6901a2c064",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "The Byte Highlight Contact Form"
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setError("Something went wrong. Please try again later.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          Contact Us
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
          Get in touch with The Byte Highlight team
        </p>
      </header>
      
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        {submitted ? (
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-slate-900 dark:text-slate-100">Thank You!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Your message has been sent successfully. We'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-slate-900 dark:text-slate-100">Send Us a Message</h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6">
              Have a question, suggestion, or feedback? Fill out the form below and we'll respond promptly.
            </p>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md mb-6 text-sm md:text-base">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm md:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm md:text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm md:text-base"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm md:text-base"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
} 