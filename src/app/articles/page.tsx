"use client"

import React, { useState, useEffect, Fragment } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, User, Tag, ArrowRight, X, Newspaper, BookOpen } from "lucide-react"
import Link from "next/link"

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
      staggerChildren: 0.1
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
  created_at: string
}

interface FilterOption {
  value: string
  label: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(9)
  
  // Filter options
  const [authors, setAuthors] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [topics, setTopics] = useState<FilterOption[]>([])
  
  // Selected filters
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  
  // Function to fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true)
      
      // Use the real API call instead of mock data
      const response = await fetch('/api/articles')
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      
      const data = await response.json()
      setArticles(data)
      setFilteredArticles(data)
      
      // Extract unique filter options from the real data
      const uniqueAuthors = [...new Set(data.map((article: Article) => article.author))]
        .filter(Boolean)
        .map(author => ({ value: author as string, label: author as string }))
      
      const uniqueCategories = [...new Set(data.map((article: Article) => article.category))]
        .filter(Boolean)
        .map(category => ({ value: category as string, label: category as string }))
      
      const uniqueTopics = [...new Set(data.map((article: Article) => article.topic))]
        .filter(Boolean)
        .map(topic => ({ value: topic as string, label: topic as string }))
      
      setAuthors([{ value: 'all', label: 'All Authors' }, ...uniqueAuthors])
      setCategories([{ value: 'all', label: 'All Categories' }, ...uniqueCategories])
      setTopics([{ value: 'all', label: 'All Topics' }, ...uniqueTopics])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Mock filter options (remove in production)
      setAuthors([
        { value: 'Author 1', label: 'Author 1' },
        { value: 'Author 2', label: 'Author 2' },
        { value: 'Author 3', label: 'Author 3' }
      ]);
      
      setCategories([
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Backend', label: 'Backend' },
        { value: 'DevOps', label: 'DevOps' },
        { value: 'AI', label: 'AI' },
        { value: 'Mobile', label: 'Mobile' }
      ]);
      
      setTopics([
        { value: 'React', label: 'React' },
        { value: 'NextJS', label: 'NextJS' },
        { value: 'AWS', label: 'AWS' },
        { value: 'Docker', label: 'Docker' },
        { value: 'TensorFlow', label: 'TensorFlow' }
      ]);
      
      // Uncomment for real API call
      /*
      const optionTypes = ['authors', 'categories', 'topics'];
      const optionsPromises = optionTypes.map(type => 
        fetch(`/api/options/${type}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch ${type} options`);
            }
            return res.json();
          })
          .catch(error => {
            console.error(`Error fetching ${type} options:`, error);
            return []; // Return empty array on error
          })
      );
      
      const optionsRes = await Promise.all(optionsPromises);
      
      setAuthors(optionsRes[0] || []);
      setCategories(optionsRes[1] || []);
      setTopics(optionsRes[2] || []);
      */
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }
  
  // Fetch articles and filter options on component mount
  useEffect(() => {
    fetchArticles()
    fetchFilterOptions()
  }, [])
  
  // Apply filters and search
  useEffect(() => {
    let result = [...articles]
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.title?.toLowerCase().includes(term) || 
        article.subtitle?.toLowerCase().includes(term)
      )
    }
    
    // Apply filters
    if (selectedAuthor && selectedAuthor !== "all") {
      result = result.filter(article => article.author === selectedAuthor)
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory)
    }
    
    if (selectedTopic && selectedTopic !== "all") {
      result = result.filter(article => article.topic === selectedTopic)
    }
    
    setFilteredArticles(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [articles, searchTerm, selectedAuthor, selectedCategory, selectedTopic])
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedAuthor("all")
    setSelectedCategory("all")
    setSelectedTopic("all")
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  
  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string, text: string, darkBg: string, darkText: string }> = {
      'Frontend': { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-300' },
      'Backend': { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-300' },
      'DevOps': { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900', darkText: 'dark:text-orange-300' },
      'AI': { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-300' },
      'Mobile': { bg: 'bg-pink-100', text: 'text-pink-800', darkBg: 'dark:bg-pink-900', darkText: 'dark:text-pink-300' },
      'default': { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-700', darkText: 'dark:text-gray-300' }
    };
    
    return colors[category] || colors['default'];
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen py-16 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.header 
          variants={fadeIn}
          className="mb-16 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Articles
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our collection of articles on various tech topics
          </p>
        </motion.header>
        
        {/* Search and filters */}
        <motion.div 
          variants={fadeIn}
          className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400"
                suppressHydrationWarning
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 h-10"
                suppressHydrationWarning
              >
                Reset Filters
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-blue-500" suppressHydrationWarning>
                  <SelectValue placeholder="Filter by Author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author.value} value={author.value}>
                      {author.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-blue-500" suppressHydrationWarning>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg focus:ring-blue-500" suppressHydrationWarning>
                  <SelectValue placeholder="Filter by Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
        
        {/* Articles grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading articles...</p>
            </div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            <motion.div 
              variants={staggerContainer}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentArticles.map((article, index) => {
                const categoryColor = getCategoryColor(article.category);
                return (
                  <motion.div
                    key={article.id}
                    variants={cardVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col"
                  >
                    <div className="mb-3 flex items-center space-x-2">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${categoryColor.bg} ${categoryColor.text} ${categoryColor.darkBg} ${categoryColor.darkText}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {article.topic}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{article.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">{article.subtitle}</p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {article.author}
                        </span>
                        <motion.a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium"
                          whileHover={{ x: 3 }}
                        >
                          Read article
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                variants={fadeIn}
                className="flex justify-center mt-12"
              >
                <nav className="flex items-center rounded-lg bg-white dark:bg-slate-800 shadow-md px-4 py-2 space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-slate-200 dark:border-slate-700 h-8 w-8 p-0"
                    suppressHydrationWarning
                  >
                    &laquo;
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(number => {
                        // Always show first and last page, and 1 page before and after current page
                        return (
                          number === 1 ||
                          number === totalPages ||
                          Math.abs(currentPage - number) <= 1
                        );
                      })
                      .map((number, i, array) => {
                        // Add ellipsis if there are gaps
                        const showEllipsisBefore = i > 0 && array[i - 1] !== number - 1;
                        const showEllipsisAfter = i < array.length - 1 && array[i + 1] !== number + 1;
                        
                        return (
                          <Fragment key={number}>
                            {showEllipsisBefore && <span className="px-2 text-slate-400">...</span>}
                            <Button
                              variant={currentPage === number ? "default" : "outline"}
                              size="sm"
                              onClick={() => paginate(number)}
                              className={currentPage === number
                                ? "bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0" 
                                : "border-slate-200 dark:border-slate-700 h-8 w-8 p-0"
                              }
                              suppressHydrationWarning
                            >
                              {number}
                            </Button>
                            {showEllipsisAfter && <span className="px-2 text-slate-400">...</span>}
                          </Fragment>
                        );
                      })
                    }
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-slate-200 dark:border-slate-700 h-8 w-8 p-0"
                    suppressHydrationWarning
                  >
                    &raquo;
                  </Button>
                </nav>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            variants={fadeIn}
            className="col-span-full bg-white dark:bg-slate-800 rounded-xl p-10 text-center shadow-lg mt-8 max-w-2xl mx-auto"
          >
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3">No articles found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filter criteria</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Reset All Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Call to action */}
        <motion.div 
          variants={fadeIn}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-10 text-center shadow-xl max-w-4xl mx-auto mt-20 mb-10"
        >
          <Newspaper className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            Never miss a new article
          </motion.h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest articles delivered directly to your inbox
          </p>
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/subscribe" className="bg-white text-blue-600 font-medium py-3 px-8 rounded-full inline-flex items-center shadow-md">
              Subscribe Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}