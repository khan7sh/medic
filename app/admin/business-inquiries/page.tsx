'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/app/appointed/components/AdminLayout'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Mail, Phone, Check, X, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BusinessInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
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
        
        <Card>
          <CardHeader>
            <CardTitle>Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry: any) => (
                  <div 
                    key={inquiry.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        inquiry.status === 'contacted' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}
                      >
                        {inquiry.status}
                      </span>
                    </div>

                    {/* Company & Name */}
                    <div>
                      <h3 className="font-medium">{inquiry.company}</h3>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.first_name} {inquiry.last_name}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>

                    {/* Enquiry Type */}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Enquiry Type: </span>
                      {inquiry.enquiry_type}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                        onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Contacted
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          window.open(`mailto:${inquiry.email}`, '_blank')
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 