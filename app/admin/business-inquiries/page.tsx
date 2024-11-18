'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/app/appointed/components/AdminLayout'
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
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry: any) => (
                <tr key={inquiry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inquiry.first_name} {inquiry.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inquiry.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inquiry.enquiry_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      inquiry.status === 'contacted' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Contacted
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.open(`mailto:${inquiry.email}`, '_blank')
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
} 