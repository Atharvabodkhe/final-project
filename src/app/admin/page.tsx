"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  BarChart, 
  Newspaper,
  Zap,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

// Dashboard cards data
const dashboardCards = [
  {
    title: "Total Subscribers",
    value: "2,845",
    description: "Increase of 12% from last month",
    icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Newsletters Sent",
    value: "124",
    description: "Latest: Tech Trends May 2023",
    icon: <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "Articles Published",
    value: "86",
    description: "Increase of 18% from last quarter",
    icon: <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Engagement Rate",
    value: "28.3%",
    description: "Average newsletter open rate",
    icon: <BarChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
    color: "from-pink-500 to-pink-600"
  }
];

// Quick Actions
const quickActions = [
  {
    title: "New Newsletter",
    description: "Compose and send a new newsletter",
    icon: <Newspaper className="h-5 w-5" />,
    path: "/admin/newsletters",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  {
    title: "Manage Articles",
    description: "View, edit and publish articles",
    icon: <FileText className="h-5 w-5" />,
    path: "/admin/articles",
    color: "bg-gradient-to-br from-blue-600 to-purple-500"
  },
  {
    title: "Manage Subscribers",
    description: "View and edit subscriber lists",
    icon: <Users className="h-5 w-5" />,
    path: "/admin/subscribers",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600"
  },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      const authToken = localStorage.getItem("admin-auth")
      const hasCookie = document.cookie.includes("admin-auth=true")
      
      console.log("Admin page - Auth check:", { 
        localStorageAuth: authToken === "true", 
        cookieAuth: hasCookie 
      })
      
      if (authToken !== "true" || !hasCookie) {
        // Authentication failed, redirect to login
        console.log("Admin page - Auth failed, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("Admin page - Auth successful")
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("admin-auth")
    // Remove auth cookie with proper settings
    document.cookie = "admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;"
    
    console.log("Logged out - Auth cookie removed")
    
    // Redirect to login
    router.push("/admin/login")
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Authentication Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">You need to sign in to access the admin dashboard.</p>
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

  // Main dashboard UI
  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-6 sm:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Admin Dashboard</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage your newsletter content, subscribers, and settings</p>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Log Out
          </Button>
        </div>
        
        {/* Dashboard Overview */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
            Dashboard Overview
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dashboardCards.map((card, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl font-bold mb-2">{card.value}</CardTitle>
                  <CardDescription className="text-sm font-medium text-slate-700 dark:text-slate-300">{card.title}</CardDescription>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => router.push(action.path)}
                className="cursor-pointer"
              >
                <div className="relative h-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20">
                    <div className={`h-full w-full rounded-full ${action.color}`} />
                  </div>
                  
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${action.color} mb-4 shadow-sm`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-white">
                      {action.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {action.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      <span>Get started</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[1, 2, 3].map((_, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 border-b border-slate-100 dark:border-slate-700 pb-4 last:border-none last:pb-0"
                  >
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-r ${
                      index === 0 ? "from-blue-500 to-blue-600" : 
                      index === 1 ? "from-indigo-500 to-indigo-600" : 
                      "from-purple-500 to-purple-600"
                    } flex items-center justify-center flex-shrink-0`}>
                      {index === 0 ? <Mail className="h-4 w-4 text-white" /> : 
                       index === 1 ? <Newspaper className="h-4 w-4 text-white" /> : 
                       <Users className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {index === 0 ? "Newsletter sent to 845 subscribers" : 
                         index === 1 ? "New article published: Tech Trends 2023" : 
                         "12 new subscribers joined"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {index === 0 ? "Today at 9:42 AM" : 
                         index === 1 ? "Yesterday at 2:13 PM" : 
                         "2 days ago at 11:30 AM"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}