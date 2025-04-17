"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

interface Subscriber {
  id: string
  email: string
  created_at: string
  status: string
}

export default function SubscribersPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Newsletter Subscribers</h1>
      
      {isLoading ? (
        <p>Loading subscribers...</p>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-slate-600">Total subscribers: {subscribers.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-slate-500">
                      No subscribers yet
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
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
  )
} 