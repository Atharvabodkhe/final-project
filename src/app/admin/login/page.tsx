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
    <div className="flex items-center justify-center min-h-[80vh] relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
        className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <motion.div 
              className="relative h-14 w-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md overflow-hidden mb-4"
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
                <Zap className="h-7 w-7 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              BYTE HIGHLIGHT
            </motion.h1>
            <motion.p 
              className="mt-2 text-sm text-slate-500 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Admin Authentication
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 ml-2" />
          </motion.div>
        </div>

        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500 bg-white/90 dark:bg-slate-900/90"
                placeholder="Enter your username"
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-300 dark:border-slate-600 focus-visible:ring-blue-500 bg-white/90 dark:bg-slate-900/90"
                placeholder="Enter your password"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : null}
              {loading ? "Logging in..." : "Sign in"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}