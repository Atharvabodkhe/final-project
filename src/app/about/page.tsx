"use client"

import React from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Users, Award, BookOpen, ArrowRight, Calendar, BookOpen as BookIcon, Code } from "lucide-react"
import Link from "next/link"

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
  hidden: { opacity: 0, y: 50 },
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

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      delay: 0.4 
    }
  }
}

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

const subtitleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 1.2 + (i * 0.1),
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

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

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  interface TeamMemberProps {
    name: string;
    role: string;
    delay: number;
    imagePath: string;
  }
  
  function TeamMember({ name, role, delay, imagePath }: TeamMemberProps) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
    
    return (
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
      >
        <div className="w-24 h-24 rounded-full mb-4 mx-auto overflow-hidden">
          <Image 
            src={imagePath} 
            alt={name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-white mb-1">{name}</h3>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">{role}</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
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
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
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
          className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
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
        <motion.div
          className="absolute bottom-[-20%] left-[30%] w-[40%] h-[40%] rounded-full blur-[120px]"
          animate={{ 
            background: gradientColors.slice(2),
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </motion.div>
      
      {/* Progress bar with enhanced gradient */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <div className="container mx-auto">
        <motion.header 
          className="mb-24 md:mb-32 text-center relative pt-12"
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
          
          {/* Decorative dot pattern - exactly like contact page */}
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
            {Array.from("About Us").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block"
                style={{ display: letter === " " ? "inline" : "inline-block" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Animated subtitle with staggered words */}
          <div className="overflow-hidden">
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              {["Learn", "more", "about", "The", "Byte", "Highlight", "and", "our", "mission", "to", "make", "technology", "accessible", "to", "everyone"].map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </div>
          
          {/* Enhanced decorative element */}
          <div className="flex justify-center mt-12">
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 96 }}
              transition={{ duration: 1, delay: 1.8 }}
            />
          </div>
          
          {/* Animated scroll indicator */}
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 1 }}
          >
            <motion.div
              className="w-8 h-12 rounded-full border-2 border-slate-400 dark:border-slate-500 flex justify-center p-1"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            >
              <motion.div 
                className="w-1 h-2 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"
                animate={{ 
                  height: [8, 16, 8],
                  y: [0, 16, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  times: [0, 0.5, 1]
                }}
              />
            </motion.div>
          </motion.div>
        </motion.header>
        
        <motion.div 
          variants={staggerContainer}
          className="max-w-6xl mx-auto relative"
        >
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20"
          >
            <motion.div variants={fadeIn} className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                About our newsletter
              </h2>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6">
                Welcome to The Byte Highlight, your go-to source for tech insights, educational content, and engaging updates! Whether you're a college student just stepping into the world of technology or a tech professional looking to sharpen your skills, our newsletter is designed to bridge the gap between academia and industry.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-slate-700 dark:text-slate-300">Weekly updates</span>
                </div>
                <div className="flex items-center">
                  <BookIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-slate-700 dark:text-slate-300">Easy-to-follow tutorials</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-slate-700 dark:text-slate-300">Code samples included</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              whileHover={{ scale: 1.03 }}
              className="rounded-lg shadow-xl overflow-hidden"
            >
              <Image 
                src="/images/newsletter.jpg" 
                alt="Newsletter example" 
                width={600} 
                height={400} 
                className="w-full h-full object-cover"
                unoptimized={true} // Remove this in production and use proper images
              />
            </motion.div>
          </motion.div>
          
          <motion.hr 
            variants={fadeIn}
            className="border-t border-slate-200 dark:border-slate-700 my-16 max-w-4xl mx-auto" 
          />
          
          {/* Mission section with matching style */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20"
          >
            <motion.div 
              variants={fadeIn}
              className="rounded-lg shadow-xl overflow-hidden order-2 md:order-1"
            >
              <Image 
                src="/images/mission.jpg" 
                alt="Our mission" 
                width={600} 
                height={400} 
                className="w-full h-full object-cover"
                unoptimized={true} // Remove this in production and use proper images
              />
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col justify-center order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-6"
              >
                At The Byte Highlight, we aim to make complex software concepts accessible and enjoyable. We break down intricate topics using real-world analogies and practical examples, ensuring you can understand and apply these concepts to your own work and studies.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base md:text-lg text-slate-700 dark:text-slate-300"
              >
                Our goal is to empower the next generation of tech leaders by providing clear, concise, and practical knowledge that bridges the gap between theoretical learning and real-world application.
              </motion.p>
            </motion.div>
          </motion.div>
          
          {/* Stats section with uniform styling */}
          <motion.div
            variants={statsVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-4xl mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-3"
              >
                <Users className="h-10 w-10 mx-auto" />
              </motion.div>
              <motion.h3 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-3xl font-bold mb-1"
              >
                5,000+
              </motion.h3>
              <p className="text-sm">Active Subscribers</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-3"
              >
                <BookOpen className="h-10 w-10 mx-auto" />
              </motion.div>
              <motion.h3 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="text-3xl font-bold mb-1"
              >
                100+
              </motion.h3>
              <p className="text-sm">Educational Articles</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center shadow-lg"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-3"
              >
                <Award className="h-10 w-10 mx-auto" />
              </motion.div>
              <motion.h3 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="text-3xl font-bold mb-1"
              >
                3
              </motion.h3>
              <p className="text-sm">Industry Awards</p>
            </motion.div>
          </motion.div>
          
          {/* Team section with uniform styling */}
          <div className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center"
            >
              Meet Our Team
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <TeamMember 
                name="Alex Johnson" 
                role="Founder & Editor" 
                delay={0.1} 
                imagePath="/images/team-1.jpg" 
              />
              <TeamMember 
                name="Sarah Parker" 
                role="Tech Writer" 
                delay={0.2} 
                imagePath="/images/team-2.jpg" 
              />
              <TeamMember 
                name="Michael Chen" 
                role="Industry Analyst" 
                delay={0.3} 
                imagePath="/images/team-3.jpg" 
              />
            </div>
          </div>
          
          {/* Values section with updated styling */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20 bg-blue-50 dark:bg-slate-800/50 rounded-xl p-10 shadow-sm max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Our Values
            </h2>
            
            <div className="space-y-8">
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex-shrink-0 mr-6 bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Accessibility</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    We believe that knowledge should be accessible to everyone. Our content is written with clarity and simplicity without sacrificing depth.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex-shrink-0 mr-6 bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">02</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Relevance</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    We're committed to providing content that is immediately applicable to your studies and career. No fluff, just practical insights.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex-shrink-0 mr-6 bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">03</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Community</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    We foster a community of learners and professionals who support each other's growth and development in technology.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Featured content section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Featured Content
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-40 bg-blue-500 relative">
                  <Image 
                    src="/images/article-1.jpg" 
                    alt="Article 1" 
                    width={400} 
                    height={200} 
                    className="w-full h-full object-cover"
                    unoptimized={true} // Remove this in production
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Getting Started with React
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    A beginner's guide to building modern web applications with React.
                  </p>
                  <motion.a 
                    whileHover={{ x: 5 }}
                    className="text-blue-500 text-sm font-medium flex items-center"
                    href="#"
                  >
                    Read more <ArrowRight className="ml-1 h-3 w-3" />
                  </motion.a>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-40 bg-blue-500 relative">
                  <Image 
                    src="/images/article-2.jpg" 
                    alt="Article 2" 
                    width={400} 
                    height={200} 
                    className="w-full h-full object-cover"
                    unoptimized={true} // Remove this in production
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Understanding Algorithms
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Breaking down complex algorithms with simple, real-world examples.
                  </p>
                  <motion.a 
                    whileHover={{ x: 5 }}
                    className="text-blue-500 text-sm font-medium flex items-center"
                    href="#"
                  >
                    Read more <ArrowRight className="ml-1 h-3 w-3" />
                  </motion.a>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-40 bg-blue-500 relative">
                  <Image 
                    src="/images/article-3.jpg" 
                    alt="Article 3" 
                    width={400} 
                    height={200} 
                    className="w-full h-full object-cover"
                    unoptimized={true} // Remove this in production
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    The Future of AI
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Exploring how artificial intelligence is reshaping the tech landscape.
                  </p>
                  <motion.a 
                    whileHover={{ x: 5 }}
                    className="text-blue-500 text-sm font-medium flex items-center"
                    href="#"
                  >
                    Read more <ArrowRight className="ml-1 h-3 w-3" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA Section with consistent styling */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-10 text-center shadow-xl max-w-4xl mx-auto mb-10"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Join Our Newsletter Community
            </motion.h2>
            <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
              Stay updated with the latest in tech education and industry insights delivered directly to your inbox
            </p>
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                href="/subscribe" 
                className="bg-white text-blue-600 font-medium py-3 px-8 rounded-full inline-flex items-center shadow-md"
              >
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
} 