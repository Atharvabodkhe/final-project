"use client"

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"
import { Code, Zap } from "lucide-react"

export default function ClientNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm py-4 relative z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative z-10"
            >
              <Zap className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col">
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.span
                className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                BYTE HIGHLIGHT
              </motion.span>
            </motion.div>
            <motion.span 
              className="text-xs tracking-widest text-slate-500 dark:text-slate-400 mt-[-2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              TECH INSIGHTS & NEWS
            </motion.span>
          </div>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            About
          </Link>
          <Link 
            href="/subscribe" 
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            Subscribe
          </Link>
          <Link 
            href="/contact" 
            className="text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            Contact
          </Link>
          <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button 
            className="flex flex-col space-y-1 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-2 flex flex-col space-y-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <Link 
            href="/" 
            className="py-2 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="py-2 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/subscribe" 
            className="py-2 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Subscribe
          </Link>
          <Link 
            href="/contact" 
            className="py-2 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
} 