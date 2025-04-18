"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Send, CheckCircle, AlertCircle, Calendar, ArrowRight, Check, Star, Archive, RefreshCw } from "lucide-react"
import { staggerContainer, fadeIn, fadeInUp } from "@/lib/animations"
import SubscribeForm from "@/components/SubscribeForm"
import AnimatedDots from "./components/AnimatedDots"

// Add letter animation variants
const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

const titleVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
}

// Add new gradient animation effect for background
const gradientColors = [
  "rgba(59, 130, 246, 0.4)", // blue
  "rgba(99, 102, 241, 0.4)", // indigo
  "rgba(139, 92, 246, 0.4)", // purple
  "rgba(217, 70, 239, 0.4)", // fuchsia
  "rgba(139, 92, 246, 0.4)", // back to purple
  "rgba(99, 102, 241, 0.4)", // back to indigo
  "rgba(59, 130, 246, 0.4)", // back to blue
];

export default function SubscribePage() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      {/* Animated gradient background blobs */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-screen -z-10 opacity-50 dark:opacity-30 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          animate={{ 
            background: gradientColors,
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          animate={{ 
            background: [...gradientColors].reverse(),
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </motion.div>

      <div className="container mx-auto max-w-7xl px-6 py-12 md:py-24 z-10 relative">
        <motion.header 
          className="mb-16 md:mb-24 text-center relative"
        >
          {/* Enhanced background element */}
          <motion.div 
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0.2],
              scale: [0, 1.8, 1.4],
              rotate: [0, 15, -5],
            }}
            transition={{ 
              duration: 8,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              background: "radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(37,99,235,0.2) 50%, rgba(0,0,0,0) 100%)"
            }}
          />
          
          {/* Decorative dot pattern */}
          <div className="absolute top-[-5%] left-[10%] right-[10%] h-[200px] -z-10">
            <AnimatedDots />
          </div>
          
          {/* Animated title with letters animation */}
          <motion.h1 
            variants={titleVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-8"
          >
            {Array.from("Newsletter").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Subscribe to our weekly newsletter and get the latest tech news and insights delivered straight to your inbox.
          </motion.p>
          
          {/* Enhanced decorative element */}
          <div className="flex justify-center mt-12">
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 96 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Newsletter Subscribe Form Card */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 md:p-10 shadow-lg border border-white/20 dark:border-slate-700/50"
          >
            <div className="flex items-center mb-8">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full mr-4 shadow-md"
              >
                <Mail className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Sign Up Now
              </h2>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of developers and tech enthusiasts getting weekly updates on the latest programming tips, tech trends, and industry insights.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SubscribeForm />
            </motion.div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-800 dark:text-white font-medium mb-4">What to expect:</h3>
              <ul className="space-y-3">
                {[
                  "Exclusive technical insights and tutorials",
                  "Early access to new feature announcements",
                  "Special community events and opportunities",
                  "Weekly curated tech reading list"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-start"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Newsletter Archives & Info Card */}
          <motion.div 
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* Past Newsletters Card */}
            <motion.div 
              variants={fadeIn}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 dark:border-slate-700/50"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  initial={{ rotate: 10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full mr-4 shadow-md"
                >
                  <Archive className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Newsletter Archives
                </h2>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Browse our previous newsletters to see what you've been missing.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "The Future of Web Development", date: "May 15, 2023" },
                  { title: "AI Tools for Developers", date: "May 8, 2023" },
                  { title: "Modern Frontend Performance", date: "May 1, 2023" },
                ].map((newsletter, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (i * 0.15) }}
                    whileHover={{ x: 5 }}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{newsletter.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{newsletter.date}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                      Read →
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium"
              >
                View All Newsletters <RefreshCw className="h-4 w-4" />
              </motion.button>
            </motion.div>
            
            {/* Testimonials Card */}
            <motion.div 
              variants={fadeIn}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 dark:border-slate-700/50"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full mr-4 shadow-md"
                >
                  <Star className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  What Readers Say
                </h2>
              </div>
              
              <div className="space-y-6">
                <motion.blockquote 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="p-4 border-l-4 border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/20 rounded-r-lg italic text-slate-600 dark:text-slate-300"
                >
                  "This newsletter is the highlight of my Monday mornings. Always relevant content that helps me stay on the cutting edge."
                  <footer className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 not-italic">
                    — Sarah K., Senior Developer
                  </footer>
                </motion.blockquote>
                
                <motion.blockquote 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="p-4 border-l-4 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 rounded-r-lg italic text-slate-600 dark:text-slate-300"
                >
                  "I've discovered so many useful tools and techniques through these newsletters. Absolutely worth subscribing!"
                  <footer className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 not-italic">
                    — Michael T., Tech Lead
                  </footer>
                </motion.blockquote>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 