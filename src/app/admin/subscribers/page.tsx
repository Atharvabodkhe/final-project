"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Subscriber {
  id: string
  email: string
  created_at: string
  status: string
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setSubscribers(data || [])
      } catch (err: any) {
        console.error('Error fetching subscribers:', err)
        setError(err.message || 'Failed to fetch subscribers')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSubscribers()
  }, [])
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/admin/dashboard')}
            className="mr-4 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Newsletter Subscribers</h1>
        </div>
        
        {isLoading ? (
          <p className="text-slate-300">Loading subscribers...</p>
        ) : error ? (
          <div className="p-4 bg-red-900/30 text-red-400 border border-red-800 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-400">Total subscribers: {subscribers.length}</p>
            </div>
            
            <div className="bg-[#0f172a] rounded-lg border border-[#1e293b] overflow-hidden">
              <table className="min-w-full divide-y divide-[#1e293b]">
                <thead className="bg-[#1e293b]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      EMAIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      DATE
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-slate-400">
                        No subscribers yet
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-[#1e293b]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscriber.status === 'active' 
                              ? 'bg-green-950/50 text-green-400 border border-green-800' 
                              : 'bg-red-950/50 text-red-400 border border-red-800'
                          }`}>
                            {subscriber.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 