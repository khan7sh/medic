'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '../components/AdminLayout'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Mail, Phone, Check, X } from 'lucide-react'

export default function BusinessInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    const { data, error } = await supabase
      .from('business_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive"
      })
      return
    }

    setInquiries(data)
  }

  async function updateInquiryStatus(id: string, status: string) {
    const { error } = await supabase
      .from('business_inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
      return
    }

    fetchInquiries()
    toast({
      title: "Updated",
      description: `Inquiry marked as ${status}`,
    })
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Business Inquiries</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table implementation */}
          </table>
        </div>
      </div>
    </AdminLayout>
  )
} 