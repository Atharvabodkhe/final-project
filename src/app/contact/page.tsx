"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle
} from "lucide-react"
// Import animations from lib
import { staggerContainer, fadeIn, fadeInUp } from "@/lib/animations"

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

// Add gradient animation effect for background
const gradientColors = [
  "rgba(59, 130, 246, 0.4)", // blue
  "rgba(99, 102, 241, 0.4)", // indigo
  "rgba(139, 92, 246, 0.4)", // purple
  "rgba(217, 70, 239, 0.4)", // fuchsia
  "rgba(139, 92, 246, 0.4)", // back to purple
  "rgba(99, 102, 241, 0.4)", // back to indigo
  "rgba(59, 130, 246, 0.4)", // back to blue
];

// Add dot pattern positions
const dotPositions = [
  { top: 10, left: 20, scale: 0.8 },
  { top: 15, left: 65, scale: 0.7 },
  { top: 25, left: 40, scale: 0.9 },
  { top: 35, left: 85, scale: 0.7 },
  { top: 45, left: 30, scale: 0.8 },
  { top: 55, left: 10, scale: 0.6 },
  { top: 65, left: 50, scale: 0.9 },
  { top: 75, left: 80, scale: 0.7 },
  { top: 85, left: 25, scale: 0.8 },
  { top: 95, left: 60, scale: 0.6 },
  { top: 5, left: 90, scale: 0.7 },
  { top: 20, left: 70, scale: 0.8 },
  { top: 30, left: 15, scale: 0.9 },
  { top: 40, left: 55, scale: 0.7 },
  { top: 50, left: 35, scale: 0.8 },
  { top: 60, left: 75, scale: 0.9 },
  { top: 70, left: 45, scale: 0.7 },
  { top: 80, left: 5, scale: 0.8 },
  { top: 90, left: 30, scale: 0.9 },
  { top: 8, left: 50, scale: 0.7 },
  { top: 18, left: 85, scale: 0.8 },
  { top: 28, left: 25, scale: 0.7 },
  { top: 38, left: 60, scale: 0.9 },
  { top: 48, left: 15, scale: 0.8 },
  { top: 58, left: 40, scale: 0.7 },
  { top: 68, left: 80, scale: 0.9 },
  { top: 78, left: 35, scale: 0.7 },
  { top: 88, left: 70, scale: 0.8 },
  { top: 12, left: 45, scale: 0.9 },
  { top: 22, left: 75, scale: 0.7 },
  { top: 32, left: 20, scale: 0.8 },
  { top: 42, left: 65, scale: 0.9 },
  { top: 52, left: 10, scale: 0.7 },
  { top: 62, left: 55, scale: 0.8 },
  { top: 72, left: 30, scale: 0.9 },
  { top: 82, left: 75, scale: 0.7 },
  { top: 92, left: 40, scale: 0.8 },
  { top: 7, left: 65, scale: 0.7 },
  { top: 17, left: 35, scale: 0.9 },
  { top: 27, left: 85, scale: 0.8 }
];

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
          <motion.div
            className="absolute top-[-5%] left-[10%] right-[10%] h-[200px] -z-10 opacity-20 dark:opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.2] }}
            transition={{ duration: 5, times: [0, 0.5, 1], repeat: Infinity, repeatType: "reverse" }}
          >
            {dotPositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-indigo-600"
                initial={{ 
                  top: `${pos.top}%`, 
                  left: `${pos.left}%`,
                  scale: pos.scale
                }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </motion.div>
          
          {/* Animated title with letters animation */}
          <motion.h1 
            variants={titleVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-8"
          >
            {Array.from("Get in Touch").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Have a question or want to work together? Drop us a message using the form below.
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
          {/* Contact Form Card */}
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
                <MessageSquare className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Send a Message
              </h2>
            </div>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-4"
                >
                  <CheckCircle size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Thank you for reaching out. We'll get back to you shortly.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSubmitted(false)
                  }}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md transition-colors duration-300"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        error ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                      } rounded-lg bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all`}
                      placeholder="Your name"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        error ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                      } rounded-lg bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all`}
                      placeholder="Your email address"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        error ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                      } rounded-lg bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all`}
                      placeholder="Subject"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        error ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                      } rounded-lg bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all resize-none`}
                      placeholder="Your message"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-800 dark:text-white font-medium mb-4">What to expect:</h3>
              <ul className="space-y-3">
                {[
                  "A response within 24-48 hours",
                  "Professional and helpful guidance",
                  "Detailed answers to your questions",
                  "Follow-up support when needed"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-start"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-3 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Contact Info Cards */}
          <motion.div 
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* Image Card */}
            <motion.div 
              variants={fadeIn}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/20 dark:border-slate-700/50"
            >
              <div className="relative h-56 md:h-72">
                <Image
                  src="/images/contactus.avif"
                  alt="Contact Us"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 to-purple-600/40" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Reach Out to Us</h3>
                  <p className="text-white/90 text-sm md:text-base drop-shadow-md">We're here to help with any questions or inquiries</p>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Methods Card */}
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
                  <Mail className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Contact Methods
                </h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
                    title: "Email",
                    value: "contact@bytehighlight.com",
                    href: "mailto:contact@bytehighlight.com"
                  },
                  { 
                    icon: <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
                    title: "Location",
                    value: "Worldwide",
                  },
                  { 
                    icon: <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
                    title: "Business Hours",
                    value: "Mon-Fri, 9AM-5PM (UTC)",
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (i * 0.15) }}
                    className="flex items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-700/50"
                  >
                    <div className="mt-1 mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 