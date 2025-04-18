"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Zap, FileText, Users, Mail, Pencil } from "lucide-react"

// Define the Article interface
interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  // Add other properties as needed
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("admin-auth")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchArticles()
    }
  }, [router])
  
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    document.cookie = "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/admin/login")
  }
  
  if (!isAuthenticated) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <motion.div 
            className="relative h-8 w-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <motion.h1
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              Admin Dashboard
            </motion.h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-[-3px]">
              Manage content and subscribers
            </p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Article Management Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden group">
          <CardHeader className="pb-4">
            <div className="flex items-center mb-1">
              <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 text-blue-600 dark:text-blue-400">
                <FileText className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Article Management</CardTitle>
            </div>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Create, edit and manage your articles
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              {articles.length > 0 
                ? `${articles.length} article${articles.length !== 1 ? 's' : ''} in your database.` 
                : 'Start creating your first article.'}
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              onClick={() => router.push('/admin/articles')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all"
            >
              <Pencil className="mr-2 h-4 w-4" /> 
              Manage Articles
            </Button>
          </CardFooter>
        </Card>
        
        {/* Newsletter Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden group">
          <CardHeader className="pb-4">
            <div className="flex items-center mb-1">
              <div className="w-7 h-7 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400">
                <Mail className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Newsletters</CardTitle>
            </div>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Manage and send newsletters
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Create and schedule newsletter content to your subscribers.</p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              onClick={() => router.push('/admin/newsletters')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all"
            >
              <Mail className="mr-2 h-4 w-4" /> 
              Manage Newsletters
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Subscribers Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <div className="flex items-center mb-1">
              <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-2 text-amber-600 dark:text-amber-400">
                <Users className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Subscribers</CardTitle>
            </div>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Manage your newsletter subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              View, export or remove subscribers from your mailing list.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push('/admin/subscribers')}
              variant="outline"
              className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
            >
              <Users className="mr-2 h-4 w-4" /> 
              Manage Subscribers
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}