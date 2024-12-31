'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  Loader2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'

interface Service {
  id: string
  title: string
  description: string | null
  price: number
  duration: number
  active: boolean | null
  icon: string
  slug: string
  created_at: string | null
  updated_at: string | null
}

interface ServiceFormData {
  title: string
  description: string
  price: number
  duration: number
  active: boolean
  icon: string
  slug: string
}

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  price: 0,
  duration: 60,
  active: true,
  icon: 'stethoscope',
  slug: ''
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedData = (data || []).map(service => ({
        ...service,
        duration: typeof service.duration === 'number' ? service.duration : 60
      }))

      setServices(transformedData)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch services',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const slug = formData.title.toLowerCase().replace(/\s+/g, '-')

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            ...formData,
            slug,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Service updated successfully',
        })
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{
            ...formData,
            slug,
            created_at: new Date().toISOString(),
          }])

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Service created successfully',
        })
      }

      setIsDialogOpen(false)
      setEditingService(null)
      setFormData(initialFormData)
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      })

      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(service: Service) {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      active: service.active || false,
      icon: service.icon,
      slug: service.slug
    })
    setIsDialogOpen(true)
  }

  async function handleToggleActive(service: Service) {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .update({
          active: !service.active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', service.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Service ${service.active ? 'disabled' : 'enabled'} successfully`,
      })

      fetchServices()
    } catch (error) {
      console.error('Error toggling service:', error)
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Service Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingService(null)
                setFormData(initialFormData)
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (£)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      min="15"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && services.length === 0 ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>£{service.price}</TableCell>
                      <TableCell>{service.duration} mins</TableCell>
                      <TableCell>
                        <Switch
                          checked={service.active || false}
                          onCheckedChange={() => handleToggleActive(service)}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(service)}
                            disabled={loading}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(service.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 