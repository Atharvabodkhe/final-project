"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Generate random dot positions
const generateDotPositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    scale: 0.5 + Math.random() * 0.5,
  }))
}

export default function AnimatedDots() {
  const [dots, setDots] = useState<Array<{top: string, left: string, scale: number}>>([])
  
  // Only generate dots on the client side to avoid hydration mismatch
  useEffect(() => {
    setDots(generateDotPositions(30))
  }, [])
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {dots.map((dot, index) => (
        <motion.div 
          key={index}
          className="absolute h-1 w-1 rounded-full bg-indigo-600"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0.2],
            scale: [0, dot.scale, dot.scale * 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.1,
          }}
          style={{
            top: dot.top,
            left: dot.left,
          }}
        />
      ))}
    </div>
  )
} 