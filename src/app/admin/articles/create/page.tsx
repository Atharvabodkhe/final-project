"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, FileText, Save, ArrowLeft } from "lucide-react"

export default function CreateArticlePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      const authToken = localStorage.getItem("admin-auth")
      const hasCookie = document.cookie.includes("admin-auth=true")
      
      console.log("Create Article page - Auth check:", { 
        localStorageAuth: authToken === "true", 
        cookieAuth: hasCookie 
      })
      
      if (authToken !== "true" || !hasCookie) {
        // Authentication failed, redirect to login
        console.log("Create Article page - Auth failed, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("Create Article page - Auth successful")
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [router])

  const handleSaveArticle = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your article",
        variant: "destructive",
      })
      return
    }

    if (!content) {
      toast({
        title: "Content required",
        description: "Please enter content for your article",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    // Simulate saving the article
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Article saved",
        description: "Your article has been saved successfully",
      })
      
      // Navigate back to articles list
      router.push('/admin/articles')
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Authentication Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You need to sign in to access this page.</p>
          <Button 
            onClick={() => router.push('/admin/login')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/admin/articles')}
              className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Article</h1>
          </div>
          <Button 
            onClick={handleSaveArticle}
            disabled={saving || !title || !content}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Article
              </>
            )}
          </Button>
        </div>
        
        <Card className="mb-6 bg-white dark:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Article Details</CardTitle>
            <CardDescription>Create a new article to publish on your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={12}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              ></textarea>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveArticle}
                disabled={saving || !title || !content}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Article...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Save and Publish Article
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
          This is a simple article editor. In a production environment, you would implement a rich text editor or markdown support.
        </div>
      </div>
    </div>
  )
} 