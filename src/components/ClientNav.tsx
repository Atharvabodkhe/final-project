"use client"

import Link from "next/link"
import { useState } from "react"

export default function ClientNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <nav className="bg-white shadow-sm py-4 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-end">
            <span className="text-3xl md:text-4xl font-bold text-[#FF6B00]">T</span>
            <span className="text-3xl md:text-4xl font-bold text-[#0038B8]">B</span>
            <span className="text-3xl md:text-4xl font-bold text-[#009B3A]">H</span>
          </span>
          <span className="text-lg md:text-xl font-bold tracking-wide text-slate-900 ml-1">THE BYTE HIGHLIGHT</span>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
          >
            About
          </Link>
          <Link 
            href="/subscribe" 
            className="text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
          >
            Subscribe
          </Link>
          <Link 
            href="/contact" 
            className="text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
          >
            Contact
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex flex-col space-y-1 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-slate-800 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-800 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-800 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-2 flex flex-col space-y-3 border-t border-slate-100 mt-2">
          <Link 
            href="/" 
            className="py-2 text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="py-2 text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/subscribe" 
            className="py-2 text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Subscribe
          </Link>
          <Link 
            href="/contact" 
            className="py-2 text-base font-medium text-slate-800 hover:text-slate-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
} 