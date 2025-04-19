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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"

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
  
  // Add states for sheet components
  const [showAddAuthorSheet, setShowAddAuthorSheet] = useState(false)
  const [showAddChannelSheet, setShowAddChannelSheet] = useState(false)
  const [showAddCategorySheet, setShowAddCategorySheet] = useState(false)
  const [showAddNewsletterSheet, setShowAddNewsletterSheet] = useState(false)
  const [showAddTopicSheet, setShowAddTopicSheet] = useState(false)
  
  // Add states for new entry values
  const [newAuthor, setNewAuthor] = useState("")
  const [newChannel, setNewChannel] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newNewsletter, setNewNewsletter] = useState("")
  const [newTopic, setNewTopic] = useState("")
  
  // Add states to track existing values
  const [authors, setAuthors] = useState<string[]>([])
  const [channels, setChannels] = useState<string[]>(["news", "tech", "sports", "entertainment"])
  const [categories, setCategories] = useState<string[]>(["technology", "business", "health", "science"])
  const [newsletters, setNewsletters] = useState<string[]>(["weekly", "monthly", "quarterly", "special"])
  const [topics, setTopics] = useState<string[]>(["ai", "climate change", "finance", "politics", "healthcare"])
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("admin-auth")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchArticles()
      fetchMetadata()
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
  
  const fetchMetadata = async () => {
    try {
      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase credentials are not properly configured")
        return
      }
      
      console.log("Fetching metadata from Supabase")
      
      // Fetch authors
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('value,label')
      
      if (authorsError) {
        console.error("Error fetching authors:", authorsError)
      } else if (authorsData && authorsData.length > 0) {
        const authorValues = authorsData.map(item => item.value)
        setAuthors(authorValues.length > 0 ? authorValues : ["John Doe", "Jane Smith", "Admin"])
      }
      
      // Fetch channels
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select('value,label')
      
      if (channelsError) {
        console.error("Error fetching channels:", channelsError)
      } else if (channelsData && channelsData.length > 0) {
        const channelValues = channelsData.map(item => item.value)
        setChannels(channelValues.length > 0 ? channelValues : ["news", "tech", "sports", "entertainment"])
      }
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('value,label')
      
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
      } else if (categoriesData && categoriesData.length > 0) {
        const categoryValues = categoriesData.map(item => item.value)
        setCategories(categoryValues.length > 0 ? categoryValues : ["technology", "business", "health", "science"])
      }
      
      // Fetch newsletters
      const { data: newslettersData, error: newslettersError } = await supabase
        .from('newsletters')
        .select('value,label')
      
      if (newslettersError) {
        console.error("Error fetching newsletters:", newslettersError)
      } else if (newslettersData && newslettersData.length > 0) {
        const newsletterValues = newslettersData.map(item => item.value)
        setNewsletters(newsletterValues.length > 0 ? newsletterValues : ["weekly", "monthly", "quarterly", "special"])
      }
      
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('value,label')
      
      if (topicsError) {
        console.error("Error fetching topics:", topicsError)
      } else if (topicsData && topicsData.length > 0) {
        const topicValues = topicsData.map(item => item.value)
        setTopics(topicValues.length > 0 ? topicValues : ["ai", "climate change", "finance", "politics", "healthcare"])
      }
      
      console.log("Metadata loaded successfully")
      
      // Also extract unique authors from articles as a fallback
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('author')
      
      if (articlesError) {
        console.error("Error fetching authors from articles:", articlesError)
        return
      }
      
      if (articlesData && articlesData.length > 0) {
        // Extract unique authors from articles and merge with existing authors
        const uniqueAuthorsFromArticles = [...new Set(articlesData.map(item => item.author))].filter(Boolean)
        setAuthors(prev => {
          const combinedAuthors = [...prev, ...uniqueAuthorsFromArticles]
          return [...new Set(combinedAuthors)] // Remove duplicates
        })
      }
      
    } catch (err) {
      console.error("Error fetching metadata:", err)
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
    return authors;
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
  
  // Add functions to handle adding new items
  const handleAddAuthor = async () => {
    if (!newAuthor.trim()) return
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add author:", newAuthor)
      
      // Insert into authors table with both value and label fields
      const { data, error } = await supabase
        .from('authors')
        .insert([{ 
          value: newAuthor,
          label: newAuthor // Adding the required label field
        }])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add author to database")
      }
      
      // Update the local state
      setAuthors(prev => [...prev, newAuthor])
      
      // Select the new value
      setFormData(prev => ({ ...prev, author: newAuthor }))
      
      // Reset form and close sheet
      setNewAuthor("")
      setShowAddAuthorSheet(false)
      
      toast({
        title: "Author added",
        description: `${newAuthor} has been added to the authors list`,
      })
      
    } catch (err: any) {
      console.error("Failed to add author:", err)
      toast({
        title: "Error adding author",
        description: err.message || "Failed to add author",
        variant: "destructive",
      })
    }
  }
  
  const handleAddChannel = async () => {
    if (!newChannel.trim()) return
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add channel:", newChannel)
      
      // Insert into channels table
      const { data, error } = await supabase
        .from('channels')
        .insert([{ 
          value: newChannel,
          label: newChannel // Adding the required label field
        }])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add channel to database")
      }
      
      // Update the local state
      setChannels(prev => [...prev, newChannel])
      
      // Select the new value
      setFormData(prev => ({ ...prev, channel: newChannel }))
      
      // Reset form and close sheet
      setNewChannel("")
      setShowAddChannelSheet(false)
      
      toast({
        title: "Channel added",
        description: `${newChannel} has been added to the channels list`,
      })
      
    } catch (err: any) {
      console.error("Failed to add channel:", err)
      toast({
        title: "Error adding channel",
        description: err.message || "Failed to add channel",
        variant: "destructive",
      })
    }
  }
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add category:", newCategory)
      
      // Insert into categories table
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          value: newCategory,
          label: newCategory // Adding the required label field
        }])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add category to database")
      }
      
      // Update the local state
      setCategories(prev => [...prev, newCategory])
      
      // Select the new value
      setFormData(prev => ({ ...prev, category: newCategory }))
      
      // Reset form and close sheet
      setNewCategory("")
      setShowAddCategorySheet(false)
      
      toast({
        title: "Category added",
        description: `${newCategory} has been added to the categories list`,
      })
      
    } catch (err: any) {
      console.error("Failed to add category:", err)
      toast({
        title: "Error adding category",
        description: err.message || "Failed to add category",
        variant: "destructive",
      })
    }
  }
  
  const handleAddNewsletter = async () => {
    if (!newNewsletter.trim()) return
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add newsletter:", newNewsletter)
      
      // Insert into newsletters table
      const { data, error } = await supabase
        .from('newsletters')
        .insert([{ 
          value: newNewsletter,
          label: newNewsletter // Adding the required label field
        }])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add newsletter to database")
      }
      
      // Update the local state
      setNewsletters(prev => [...prev, newNewsletter])
      
      // Select the new value
      setFormData(prev => ({ ...prev, newsletter: newNewsletter }))
      
      // Reset form and close sheet
      setNewNewsletter("")
      setShowAddNewsletterSheet(false)
      
      toast({
        title: "Newsletter added",
        description: `${newNewsletter} has been added to the newsletters list`,
      })
      
    } catch (err: any) {
      console.error("Failed to add newsletter:", err)
      toast({
        title: "Error adding newsletter",
        description: err.message || "Failed to add newsletter",
        variant: "destructive",
      })
    }
  }
  
  const handleAddTopic = async () => {
    if (!newTopic.trim()) return
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials are not properly configured")
      }
      
      console.log("Attempting to add topic:", newTopic)
      
      // Insert into topics table
      const { data, error } = await supabase
        .from('topics')
        .insert([{ 
          value: newTopic,
          label: newTopic // Adding the required label field
        }])
      
      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add topic to database")
      }
      
      // Update the local state
      setTopics(prev => [...prev, newTopic])
      
      // Select the new value
      setFormData(prev => ({ ...prev, topic: newTopic }))
      
      // Reset form and close sheet
      setNewTopic("")
      setShowAddTopicSheet(false)
      
      toast({
        title: "Topic added",
        description: `${newTopic} has been added to the topics list`,
      })
      
    } catch (err: any) {
      console.error("Failed to add topic:", err)
      toast({
        title: "Error adding topic",
        description: err.message || "Failed to add topic",
        variant: "destructive",
      })
    }
  }
  
  if (!isAuthenticated) {
    return <div>Loading...</div>
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-7xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
            Article Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add, edit, or remove articles for your newsletter
          </p>
        </div>
        
        <Button 
          onClick={() => {
            resetForm()
            setShowAddDialog(true)
          }}
          size="sm"
          className="px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
        >
          <Plus className="mr-1 h-4 w-4" /> New Article
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            
            <div className="flex flex-row gap-2 sm:gap-3">
              <Select value={selectedAuthor} onValueChange={(value) => setSelectedAuthor(value)}>
                <SelectTrigger className="w-[140px] sm:w-[180px] h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Filter by author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs sm:text-sm">All authors</SelectItem>
                  {uniqueAuthors().map(author => (
                    <SelectItem key={author} value={author} className="text-xs sm:text-sm">{author}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="text-left whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>
                    Title <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="text-left whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('subtitle')}>
                    Subtitle <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="text-left whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('author')}>
                    Author <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="text-left whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('channel')}>
                    Channel <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="text-left whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('created_at')}>
                    Created <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="text-right whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading articles...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500">
                    <div className="flex justify-center items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredArticles().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    {searchTerm || selectedAuthor !== 'all' 
                      ? "No articles match your filters"
                      : "No articles yet. Create your first article by clicking 'New Article'"}
                  </td>
                </tr>
              ) : (
                filteredArticles().map((article) => (
                  <tr key={article.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                      {article.title}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[200px] hidden md:table-cell">
                      {article.subtitle}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                      {article.author}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        {article.channel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                      {formatDate(article.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => {
                            setArticleToView(article)
                            setShowViewDialog(true)
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => openEditDialog(article)}
                        >
                          <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => {
                            setArticleToDelete(article)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
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
                      {authors.map((author) => (
                        <SelectItem key={author} value={author} className="focus:bg-[#334155]">{author}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddAuthorSheet(true)}
                  >
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
                      {channels.map((channel) => (
                        <SelectItem key={channel} value={channel} className="focus:bg-[#334155]">{channel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddChannelSheet(true)}
                  >
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-[#334155]">{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddCategorySheet(true)}
                  >
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
                      {newsletters.map((newsletter) => (
                        <SelectItem key={newsletter} value={newsletter} className="focus:bg-[#334155]">{newsletter}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddNewsletterSheet(true)}
                  >
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
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="focus:bg-[#334155]">{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                  onClick={() => setShowAddTopicSheet(true)}
                >
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
                      {authors.map((author) => (
                        <SelectItem key={author} value={author} className="focus:bg-[#334155]">{author}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddAuthorSheet(true)}
                  >
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
                      {channels.map((channel) => (
                        <SelectItem key={channel} value={channel} className="focus:bg-[#334155]">{channel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddChannelSheet(true)}
                  >
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
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="focus:bg-[#334155]">{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddCategorySheet(true)}
                  >
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
                      {newsletters.map((newsletter) => (
                        <SelectItem key={newsletter} value={newsletter} className="focus:bg-[#334155]">{newsletter}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                    onClick={() => setShowAddNewsletterSheet(true)}
                  >
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
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic} className="focus:bg-[#334155]">{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-9 w-9 rounded-md border-[#334155] bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-100"
                  onClick={() => setShowAddTopicSheet(true)}
                >
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
      
      {/* Add Sheet Components */}
      <Sheet open={showAddAuthorSheet} onOpenChange={setShowAddAuthorSheet}>
        <SheetContent className="bg-[#0f172a] border-l border-[#1e293b] text-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Add New Author</SheetTitle>
            <SheetDescription className="text-slate-400">
              Add a new author to the dropdown list.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Label htmlFor="new-author" className="text-sm font-medium text-slate-300">
              Author Name
            </Label>
            <Input
              id="new-author"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="mt-2 border-[#334155] bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="Enter author name"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddAuthor}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Author
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={showAddChannelSheet} onOpenChange={setShowAddChannelSheet}>
        <SheetContent className="bg-[#0f172a] border-l border-[#1e293b] text-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Add New Channel</SheetTitle>
            <SheetDescription className="text-slate-400">
              Add a new channel to the dropdown list.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Label htmlFor="new-channel" className="text-sm font-medium text-slate-300">
              Channel Name
            </Label>
            <Input
              id="new-channel"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              className="mt-2 border-[#334155] bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="Enter channel name"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddChannel}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Channel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={showAddCategorySheet} onOpenChange={setShowAddCategorySheet}>
        <SheetContent className="bg-[#0f172a] border-l border-[#1e293b] text-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Add New Category</SheetTitle>
            <SheetDescription className="text-slate-400">
              Add a new category to the dropdown list.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Label htmlFor="new-category" className="text-sm font-medium text-slate-300">
              Category Name
            </Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-2 border-[#334155] bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="Enter category name"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Category
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={showAddNewsletterSheet} onOpenChange={setShowAddNewsletterSheet}>
        <SheetContent className="bg-[#0f172a] border-l border-[#1e293b] text-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Add New Newsletter</SheetTitle>
            <SheetDescription className="text-slate-400">
              Add a new newsletter to the dropdown list.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Label htmlFor="new-newsletter" className="text-sm font-medium text-slate-300">
              Newsletter Name
            </Label>
            <Input
              id="new-newsletter"
              value={newNewsletter}
              onChange={(e) => setNewNewsletter(e.target.value)}
              className="mt-2 border-[#334155] bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="Enter newsletter name"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddNewsletter}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Newsletter
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={showAddTopicSheet} onOpenChange={setShowAddTopicSheet}>
        <SheetContent className="bg-[#0f172a] border-l border-[#1e293b] text-slate-200">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Add New Topic</SheetTitle>
            <SheetDescription className="text-slate-400">
              Add a new topic to the dropdown list.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Label htmlFor="new-topic" className="text-sm font-medium text-slate-300">
              Topic Name
            </Label>
            <Input
              id="new-topic"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="mt-2 border-[#334155] bg-[#1e293b] text-slate-100 focus:border-blue-600 focus:ring-blue-600/20"
              placeholder="Enter topic name"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={handleAddTopic}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Topic
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </motion.div>
  )
} 