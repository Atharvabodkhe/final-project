"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Book, 
  Mail, 
  Users,
  MessageSquare,
  Newspaper,
  PenTool,
  ChevronRight
} from "lucide-react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

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

export default function Home() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
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

      <div className="container mx-auto max-w-6xl">
        <motion.header 
          className="mb-8 sm:mb-12 md:mb-16 text-center relative"
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
          
          {/* Main headline */}
          <div className="relative z-10">
            <motion.h1 
              variants={titleVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 mb-4 sm:mb-6 md:mb-8"
            >
              {Array.from("The Byte Highlight").map((letter, i) => (
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
              className="text-sm sm:text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-4"
            >
              Your source for the latest tech news and insights delivered directly to your inbox
            </motion.p>
            
            {/* Enhanced decorative element */}
            <div className="flex justify-center mt-6 sm:mt-8 md:mt-12">
              <motion.div 
                className="h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '6rem' }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </div>
          </div>
        </motion.header>
        
        {/* Hero section */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20"
        >
          <motion.div variants={fadeIn} className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Breaking Down Complex Tech Concepts
            </h2>
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6">
              The Byte Highlight brings you weekly newsletters that take complex software and technology concepts and break them down into easy-to-understand pieces with real-world examples.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <Newspaper className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-slate-700 dark:text-slate-300">Weekly updates</span>
              </div>
              <div className="flex items-center">
                <PenTool className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-slate-700 dark:text-slate-300">Expert writers</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-slate-700 dark:text-slate-300">Growing community</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/subscribe" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md inline-flex items-center font-medium">
                  Subscribe Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/articles" className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-6 py-3 rounded-lg shadow-sm inline-flex items-center font-medium">
                  Browse Articles
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            className="rounded-lg shadow-xl overflow-hidden"
          >
            <Image 
              src="/images/aboutus1.avif" 
              alt="Newsletter Example" 
              width={600} 
              height={400} 
              className="w-full h-full object-cover"
              unoptimized={true} // Remove this in production
            />
          </motion.div>
        </motion.div>
        
        {/* Featured Articles Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 max-w-5xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Featured Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-40 bg-blue-500 relative">
                <Image 
                  src="/images/Ai-image.avif" 
                  alt="AI in 2024" 
                  width={400} 
                  height={200} 
                  className="w-full h-full object-cover"
                  unoptimized={true} // Remove this in production
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full mb-3">AI & ML</span>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  The State of AI in 2024
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Exploring how artificial intelligence is reshaping industries and what to expect next.
                </p>
                <motion.a 
                  whileHover={{ x: 5 }}
                  className="text-blue-500 text-sm font-medium flex items-center"
                  href="#"
                >
                  Read article <ArrowRight className="ml-1 h-3 w-3" />
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-40 bg-blue-500 relative">
                <Image 
                  src="/images/Cloud Architecture.avif" 
                  alt="Cloud Architecture" 
                  width={400} 
                  height={200} 
                  className="w-full h-full object-cover"
                  unoptimized={true} // Remove this in production
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full mb-3">Cloud</span>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Modern Cloud Architecture
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Best practices for designing scalable and resilient cloud infrastructure.
                </p>
                <motion.a 
                  whileHover={{ x: 5 }}
                  className="text-blue-500 text-sm font-medium flex items-center"
                  href="#"
                >
                  Read article <ArrowRight className="ml-1 h-3 w-3" />
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-40 bg-blue-500 relative">
                <Image 
                  src="/images/Frontend Trends.avif" 
                  alt="Web Development" 
                  width={400} 
                  height={200} 
                  className="w-full h-full object-cover"
                  unoptimized={true} // Remove this in production
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full mb-3">Web Dev</span>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Frontend Trends in 2024
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  The latest frameworks, tools, and techniques driving modern web development.
                </p>
                <motion.a 
                  whileHover={{ x: 5 }}
                  className="text-blue-500 text-sm font-medium flex items-center"
                  href="#"
                >
                  Read article <ArrowRight className="ml-1 h-3 w-3" />
                </motion.a>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-10 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/articles" className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-6 py-3 rounded-lg shadow-sm inline-flex items-center font-medium">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Educational Content</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Learn complex tech concepts explained in simple, engaging ways with real-world examples.
            </p>
            <motion.div
              whileHover={{ y: -3 }}
            >
              <Link href="/about" className="text-blue-500 font-medium inline-flex items-center">
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Weekly Newsletter</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Get the latest tech trends, tutorials, and industry insights delivered straight to your inbox.
            </p>
            <motion.div
              whileHover={{ y: -3 }}
            >
              <Link href="/subscribe" className="text-blue-500 font-medium inline-flex items-center">
                Subscribe now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Community Support</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
              Join our community of tech enthusiasts and get answers to your most challenging questions.
        </p>
            <motion.div
              whileHover={{ y: -3 }}
            >
              <Link href="/contact" className="text-blue-500 font-medium inline-flex items-center">
                Contact us
                <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 sm:p-8 md:p-10 text-center shadow-xl max-w-4xl mx-auto mb-6 sm:mb-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4"
          >
            Ready to stay updated?
          </motion.h2>
          <p className="mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of tech professionals and enthusiasts who receive our weekly newsletter packed with insights, tutorials, and industry trends.
          </p>
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/subscribe" className="bg-white text-blue-600 font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-full inline-flex items-center shadow-md text-sm sm:text-base">
              Subscribe Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
