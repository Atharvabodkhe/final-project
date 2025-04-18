"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Filter, 
  ArrowUpDown,
  Loader2,
  X,
  AlertTriangle,
  Link as LinkIcon,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { toast } from "@/components/ui/use-toast"

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Define the Article interface based on the Supabase table schema
interface Article {
  id: string
  title: string
  subtitle: string
  url: string
  author: string
  channel: string
  category: string
  newsletter: string
  topic: string
  created_at?: string
}

export default function ArticlesManagement() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{key: keyof Article, direction: 'asc' | 'desc'}>({
    key: 'created_at',
    direction: 'desc'
  })
  
  // Dialogs state
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [articleToView, setArticleToView] = useState<Article | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    url: "",
    author: "",
    channel: "",
    category: "",
    newsletter: "",
    topic: ""
  })
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
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
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      if (data) {
        setArticles(data)
      }
      
      setIsLoading(false)
    } catch (err: any) {
      console.error("Failed to fetch articles:", err)
      setError(err.message || "Failed to load articles. Please try again later.")
      setIsLoading(false)
    }
  }
  
  const handleSort = (key: keyof Article) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  
  const sortedArticles = () => {
    const sortableArticles = [...articles]
    if (sortConfig.key) {
      sortableArticles.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableArticles
  }
  
  const filteredArticles = () => {
    return sortedArticles().filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAuthor = selectedAuthor === 'all' || article.author === selectedAuthor
      
      return matchesSearch && matchesAuthor
    })
  }
  
  const uniqueAuthors = () => {
    const authors = articles.map(article => article.author)
    return [...new Set(authors)]
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear the specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear the specific error
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.subtitle.trim()) errors.subtitle = "Subtitle is required"
    if (!formData.author.trim()) errors.author = "Author is required"
    if (!formData.channel.trim()) errors.channel = "Channel is required"
    if (!formData.category.trim()) errors.category = "Category is required"
    if (!formData.newsletter.trim()) errors.newsletter = "Newsletter is required"
    if (!formData.topic.trim()) errors.topic = "Topic is required"
    
    // Simple URL validation
    if (formData.url.trim()) {
      try {
        new URL(formData.url)
      } catch {
        errors.url = "Please enter a valid URL"
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      url: "",
      author: "",
      channel: "",
      category: "",
      newsletter: "",
      topic: ""
    })
    setFormErrors({})
  }
  
  const openEditDialog = (article: Article) => {
    setArticleToEdit(article)
    setFormData({
      title: article.title,
      subtitle: article.subtitle || "",
      url: article.url || "",
      author: article.author,
      channel: article.channel || "",
      category: article.category || "",
      newsletter: article.newsletter || "",
      topic: article.topic || ""
    })
    setShowEditDialog(true)
  }
  
  const handleAddArticle = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Check if Supabase URL and key are properly set
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add article with data:", formData)
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title: formData.title,
            subtitle: formData.subtitle,
            url: formData.url,
            author: formData.author,
            channel: formData.channel,
            category: formData.category,
            newsletter: formData.newsletter,
            topic: formData.topic
          }
        ])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add article to database")
      }
      
      console.log("Article added successfully:", data)
      
      toast({
        title: "Article added",
        description: "The article has been added successfully",
      })
      
      // Refresh articles list
      await fetchArticles()
      
      resetForm()
      setShowAddDialog(false)
    } catch (err: any) {
      console.error("Failed to add article:", err)
      const errorMessage = err.message || "Failed to add article. Please try again later."
      setError(errorMessage)
      
      toast({
        title: "Error adding article",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleUpdateArticle = async () => {
    if (!articleToEdit || !validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Check if Supabase URL and key are properly set
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to update article with data:", formData)
      
      // Update data in Supabase
      const { data, error } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          url: formData.url,
          author: formData.author,
          channel: formData.channel,
          category: formData.category,
          newsletter: formData.newsletter,
          topic: formData.topic
        })
        .eq('id', articleToEdit.id)
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to update article in database")
      }
      
      console.log("Article updated successfully:", data)
      
      toast({
        title: "Article updated",
        description: "The article has been updated successfully",
      })
      
      // Refresh articles list
      await fetchArticles()
      
      resetForm()
      setArticleToEdit(null)
      setShowEditDialog(false)
    } catch (err: any) {
      console.error("Failed to update article:", err)
      const errorMessage = err.message || "Failed to update article. Please try again later."
      setError(errorMessage)
      
      toast({
        title: "Error updating article",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return
    
    setIsLoading(true)
    
    try {
      // Check if Supabase URL and key are properly set
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to delete article with ID:", articleToDelete.id)
      
      // Delete from Supabase
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleToDelete.id)
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to delete article from database")
      }
      
      console.log("Article deleted successfully")
      
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully",
      })
      
      // Refresh articles list
      await fetchArticles()
      
      setArticleToDelete(null)
      setShowDeleteDialog(false)
    } catch (err: any) {
      console.error("Failed to delete article:", err)
      const errorMessage = err.message || "Failed to delete article. Please try again later."
      setError(errorMessage)
      
      toast({
        title: "Error deleting article",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/admin/dashboard')}
            className="mr-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <motion.div 
            className="relative h-8 w-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileText className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              Article Management
            </motion.h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-[-3px]">
              Create, edit and manage articles
            </p>
          </div>
        </div>
        <Button 
          onClick={() => {
            resetForm()
            setShowAddDialog(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> 
          Add Article
        </Button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..." 
              className="pl-10 w-full" 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="w-full md:w-48">
              <Select 
                value={selectedAuthor}
                onValueChange={(value) => setSelectedAuthor(value)}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder="Filter by author" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {uniqueAuthors().map(author => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('title')}>
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('author')}>
                  Author {sortConfig.key === 'author' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('created_at')}>
                  Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Loading articles...</p>
          </div>
        ) : filteredArticles().length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <FileText className="h-10 w-10 mb-4" />
            <p className="mb-2">No articles found</p>
            <p className="text-sm">
              {searchTerm || selectedAuthor !== 'all' 
                ? "Try changing your search or filter criteria" 
                : "Get started by adding your first article"}
            </p>
          </div>
        ) : (
          <motion.div 
            className="overflow-x-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th onClick={() => handleSort('title')} className="text-left py-3 px-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center">
                      Title
                      {sortConfig.key === 'title' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center">
                      Subtitle
                    </div>
                  </th>
                  <th onClick={() => handleSort('author')} className="text-left py-3 px-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center">
                      Author
                      {sortConfig.key === 'author' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th onClick={() => handleSort('created_at')} className="text-left py-3 px-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center">
                      Date
                      {sortConfig.key === 'created_at' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-slate-800 dark:text-slate-200">URL</th>
                  <th className="text-left py-3 px-4 text-slate-800 dark:text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredArticles().map((article) => (
                    <motion.tr 
                      key={article.id} 
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20"
                      variants={item}
                      exit={{ opacity: 0, y: -10 }}
                      layout
                    >
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{article.title}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{article.subtitle}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{article.author}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{formatDate(article.created_at)}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {article.url ? (
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Link
                          </a>
                        ) : 'No URL'}
                      </td>
                      <td className="py-3 px-4 flex space-x-1">
                        <Button 
                          onClick={() => {
                            setArticleToView(article)
                            setShowViewDialog(true)
                          }}
                          size="icon" 
                          variant="ghost"
                          className="h-8 w-8 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => openEditDialog(article)}
                          size="icon" 
                          variant="ghost"
                          className="h-8 w-8 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => {
                            setArticleToDelete(article)
                            setShowDeleteDialog(true)
                          }}
                          size="icon" 
                          variant="ghost"
                          className="h-8 w-8 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
      
      {/* Add Article Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 overflow-hidden bg-[#0f172a] border border-[#1e293b] text-slate-200 rounded-lg">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#1e293b] rounded-md p-2 border border-[#334155]">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-100">Add New Article</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in the details to create a new article for your newsletter.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`${formErrors.title ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="Enter article title"
              />
              {formErrors.title && (
                <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="subtitle" className="text-sm font-medium text-slate-300">
                Subtitle
              </Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className={`${formErrors.subtitle ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="Enter article subtitle"
              />
              {formErrors.subtitle && (
                <p className="text-red-400 text-xs mt-1">{formErrors.subtitle}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="url" className="text-sm font-medium text-slate-300">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className={`${formErrors.url ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="https://example.com/article"
              />
              {formErrors.url && (
                <p className="text-red-400 text-xs mt-1">{formErrors.url}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-sm font-medium text-slate-300">
                  Author
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="author"
                    value={formData.author}
                    onValueChange={(value) => handleSelectChange(value, "author")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.author ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      {uniqueAuthors().map(author => (
                        <SelectItem key={author} value={author} className="focus:bg-[#334155]">
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.author && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.author}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="channel" className="text-sm font-medium text-slate-300">
                  Channel
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="channel"
                    value={formData.channel}
                    onValueChange={(value) => handleSelectChange(value, "channel")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.channel ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="news" className="focus:bg-[#334155]">News</SelectItem>
                      <SelectItem value="tech" className="focus:bg-[#334155]">Tech</SelectItem>
                      <SelectItem value="sports" className="focus:bg-[#334155]">Sports</SelectItem>
                      <SelectItem value="entertainment" className="focus:bg-[#334155]">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.channel && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.channel}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-sm font-medium text-slate-300">
                  Category
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.category ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="technology" className="focus:bg-[#334155]">Technology</SelectItem>
                      <SelectItem value="business" className="focus:bg-[#334155]">Business</SelectItem>
                      <SelectItem value="health" className="focus:bg-[#334155]">Health</SelectItem>
                      <SelectItem value="science" className="focus:bg-[#334155]">Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.category && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="newsletter" className="text-sm font-medium text-slate-300">
                  Newsletter
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="newsletter"
                    value={formData.newsletter}
                    onValueChange={(value) => handleSelectChange(value, "newsletter")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.newsletter ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select newsletter" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="weekly" className="focus:bg-[#334155]">Weekly</SelectItem>
                      <SelectItem value="monthly" className="focus:bg-[#334155]">Monthly</SelectItem>
                      <SelectItem value="quarterly" className="focus:bg-[#334155]">Quarterly</SelectItem>
                      <SelectItem value="special" className="focus:bg-[#334155]">Special</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.newsletter && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.newsletter}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-sm font-medium text-slate-300">
                Topic
              </Label>
              <div className="flex gap-1">
                <Select
                  name="topic"
                  value={formData.topic}
                  onValueChange={(value) => handleSelectChange(value, "topic")}
                >
                  <SelectTrigger className={`w-full ${formErrors.topic ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                    <SelectItem value="ai" className="focus:bg-[#334155]">AI</SelectItem>
                    <SelectItem value="climate change" className="focus:bg-[#334155]">Climate Change</SelectItem>
                    <SelectItem value="finance" className="focus:bg-[#334155]">Finance</SelectItem>
                    <SelectItem value="politics" className="focus:bg-[#334155]">Politics</SelectItem>
                    <SelectItem value="healthcare" className="focus:bg-[#334155]">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formErrors.topic && (
                <p className="text-red-400 text-xs mt-1">{formErrors.topic}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-2 p-3 border-t border-[#1e293b]">
            <Button variant="outline" className="border-[#334155] hover:bg-[#1e293b] text-slate-300 h-9 px-3" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddArticle} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 overflow-hidden bg-[#0f172a] border border-[#1e293b] text-slate-200 rounded-lg">
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#1e293b] rounded-md p-2 border border-[#334155]">
                <Edit2 className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-slate-100">Edit Article</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update the details for the selected article.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title" className="text-sm font-medium text-slate-300">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`${formErrors.title ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="Enter article title"
              />
              {formErrors.title && (
                <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="edit-subtitle" className="text-sm font-medium text-slate-300">
                Subtitle
              </Label>
              <Input
                id="edit-subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className={`${formErrors.subtitle ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="Enter article subtitle"
              />
              {formErrors.subtitle && (
                <p className="text-red-400 text-xs mt-1">{formErrors.subtitle}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="edit-url" className="text-sm font-medium text-slate-300">
                URL
              </Label>
              <Input
                id="edit-url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className={`${formErrors.url ? "border-red-500" : "border-[#334155]"} rounded-md bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20 h-9`}
                placeholder="https://example.com/article"
              />
              {formErrors.url && (
                <p className="text-red-400 text-xs mt-1">{formErrors.url}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-author" className="text-sm font-medium text-slate-300">
                  Author
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="author"
                    value={formData.author}
                    onValueChange={(value) => handleSelectChange(value, "author")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.author ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      {uniqueAuthors().map(author => (
                        <SelectItem key={author} value={author} className="focus:bg-[#334155]">
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.author && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.author}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="edit-channel" className="text-sm font-medium text-slate-300">
                  Channel
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="channel"
                    value={formData.channel}
                    onValueChange={(value) => handleSelectChange(value, "channel")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.channel ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="news" className="focus:bg-[#334155]">News</SelectItem>
                      <SelectItem value="tech" className="focus:bg-[#334155]">Tech</SelectItem>
                      <SelectItem value="sports" className="focus:bg-[#334155]">Sports</SelectItem>
                      <SelectItem value="entertainment" className="focus:bg-[#334155]">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.channel && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.channel}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-category" className="text-sm font-medium text-slate-300">
                  Category
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.category ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="technology" className="focus:bg-[#334155]">Technology</SelectItem>
                      <SelectItem value="business" className="focus:bg-[#334155]">Business</SelectItem>
                      <SelectItem value="health" className="focus:bg-[#334155]">Health</SelectItem>
                      <SelectItem value="science" className="focus:bg-[#334155]">Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.category && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="edit-newsletter" className="text-sm font-medium text-slate-300">
                  Newsletter
                </Label>
                <div className="flex gap-1">
                  <Select
                    name="newsletter"
                    value={formData.newsletter}
                    onValueChange={(value) => handleSelectChange(value, "newsletter")}
                  >
                    <SelectTrigger className={`w-full ${formErrors.newsletter ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                      <SelectValue placeholder="Select newsletter" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                      <SelectItem value="weekly" className="focus:bg-[#334155]">Weekly</SelectItem>
                      <SelectItem value="monthly" className="focus:bg-[#334155]">Monthly</SelectItem>
                      <SelectItem value="quarterly" className="focus:bg-[#334155]">Quarterly</SelectItem>
                      <SelectItem value="special" className="focus:bg-[#334155]">Special</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formErrors.newsletter && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.newsletter}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="edit-topic" className="text-sm font-medium text-slate-300">
                Topic
              </Label>
              <div className="flex gap-1">
                <Select
                  name="topic"
                  value={formData.topic}
                  onValueChange={(value) => handleSelectChange(value, "topic")}
                >
                  <SelectTrigger className={`w-full ${formErrors.topic ? "border-red-500" : "border-[#334155]"} bg-[#1e293b] text-slate-100 focus:ring-blue-600/20 h-9`}>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border border-[#334155] text-slate-100">
                    <SelectItem value="ai" className="focus:bg-[#334155]">AI</SelectItem>
                    <SelectItem value="climate change" className="focus:bg-[#334155]">Climate Change</SelectItem>
                    <SelectItem value="finance" className="focus:bg-[#334155]">Finance</SelectItem>
                    <SelectItem value="politics" className="focus:bg-[#334155]">Politics</SelectItem>
                    <SelectItem value="healthcare" className="focus:bg-[#334155]">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formErrors.topic && (
                <p className="text-red-400 text-xs mt-1">{formErrors.topic}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-2 p-3 border-t border-[#1e293b]">
            <Button variant="outline" className="border-[#334155] hover:bg-[#1e293b] text-slate-300 h-9 px-3" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateArticle} 
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white h-9 px-4"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Article Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{articleToView?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>{articleToView?.author}</Badge>
                <Badge variant="outline">{articleToView?.channel}</Badge>
                <Badge variant="secondary">{articleToView?.category}</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  {articleToView?.newsletter}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                  {articleToView?.topic}
                </Badge>
              </div>
              <span className="text-sm text-slate-500">
                {articleToView?.created_at && formatDate(articleToView.created_at)}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-4">{articleToView?.subtitle}</p>
            {articleToView?.url && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
                <a 
                  href={articleToView.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  {articleToView.url}
                </a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowViewDialog(false)
              openEditDialog(articleToView!)
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">
              Are you sure you want to delete the article <span className="font-medium">{articleToDelete?.title}</span>?
            </p>
            <p className="text-center text-sm text-slate-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 