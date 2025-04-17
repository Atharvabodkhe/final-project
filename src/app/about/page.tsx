"use client"

import React from "react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          About Us
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
          Learn more about The Byte Highlight
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              About our newsletter
            </h2>
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-4">
              Welcome to The Byte Highlight, your go-to source for tech insights, educational content, and engaging updates! Whether you're a college student just stepping into the world of technology or a tech professional looking to sharpen your skills, our newsletter is designed to bridge the gap between academia and industry.
            </p>
          </div>
          <div className="bg-slate-900 p-6 md:p-8 rounded-lg flex flex-col justify-center">
            {/* This div represents the image in the design */}
          </div>
        </div>
        
        <hr className="border-t border-slate-200 dark:border-slate-700 my-12 md:my-16" />
        
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
            Our Mission
          </h2>
          <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-4">
            At The Byte Highlight, we aim to make complex software concepts accessible and enjoyable. We break down intricate topics using real-world analogies and practical examples, ensuring you can understand and apply these concepts to your own work and studies.
          </p>
        </div>
      </div>
    </div>
  )
} 