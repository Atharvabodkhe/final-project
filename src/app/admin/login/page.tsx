"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Zap, Lock } from "lucide-react"

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
];

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

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Dummy authentication - in a real app, this would be a server request
    setTimeout(() => {
      if (username === "admin" && password === "password123") {
        try {
          // Set a session token in localStorage
          localStorage.setItem("admin-auth", "true")
          
          // Set a cookie for middleware authentication
          // Set a more secure cookie with explicit attributes
          const secure = window.location.protocol === 'https:' ? 'Secure;' : ''
          document.cookie = `admin-auth=true; path=/; ${secure} SameSite=Lax; max-age=86400;`
          
          console.log("Login successful - Auth cookie set:", document.cookie)
          
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          })
          
          // Redirect to admin dashboard
          router.push("/admin")
        } catch (error) {
          console.error("Authentication error:", error)
          toast({
            title: "Login error",
            description: "There was a problem setting your session. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
      
      {/* Decorative dot pattern */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-10"
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
      
      <motion.div 
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <motion.div 
              className="relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md overflow-hidden mb-3 sm:mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              BYTE HIGHLIGHT
            </motion.h1>
            <motion.p 
              className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Admin Login
            </motion.p>
          </div>
        </div>
        
        <motion.form 
          className="space-y-4 sm:space-y-6"
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="space-y-2">
            <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-md"
              />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-md"
              />
            </motion.div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </motion.div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </div>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}