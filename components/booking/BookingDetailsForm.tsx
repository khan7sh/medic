'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { createBooking } from '@/services/bookingService'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Invalid date format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  postcode: z.string().min(5, 'Invalid postcode'),
  license: z.string().optional(),
  vehicleType: z.string().optional(),
  employer: z.string().optional(),
  voucherCode: z.string().optional(),
  hearAboutUs: z.string().min(1, 'Please tell us how you heard about us'),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
  marketingConsent: z.boolean().optional(),
})

export default function BookingDetailsForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const location = searchParams.get('location')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAccepted: false,
      marketingConsent: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const locationName = searchParams.get('locationName')

      const bookingData = {
        service_id: serviceId || '',
        service_title: decodeURIComponent(serviceTitle || ''),
        location: decodeURIComponent(locationName || ''),
        date: searchParams.get('date') || '',
        time: searchParams.get('time') || '',
        price: Number(servicePrice) || 0,
        first_name: values.firstName,
        last_name: values.lastName,
        date_of_birth: values.dateOfBirth,
        email: values.email,
        phone: values.phone,
        postcode: values.postcode,
        license: values.license,
        vehicle_type: values.vehicleType,
        employer: values.employer,
        voucher_code: values.voucherCode,
        hear_about_us: values.hearAboutUs,
        marketing_consent: values.marketingConsent || false,
        payment_method: undefined,
        payment_status: 'pending'
      }

      console.log('Attempting to create booking with data:', bookingData)
      await createBooking(bookingData)
      
      router.push(`/booking/payment?service=${serviceId}&title=${encodeURIComponent(serviceTitle || '')}&price=${servicePrice}&location=${encodeURIComponent(locationName || '')}&date=${searchParams.get('date')}&time=${searchParams.get('time')}&name=${encodeURIComponent(`${values.firstName} ${values.lastName}`)}&email=${encodeURIComponent(values.email)}`)
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "There was an error creating your booking. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBack = () => {
    router.push(`/booking/datetime?service=${serviceId}&title=${encodeURIComponent(serviceTitle || '')}&price=${servicePrice}&location=${location}&locationName=${encodeURIComponent(searchParams.get('locationName') || '')}&date=${searchParams.get('date')}&time=${searchParams.get('time')}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth *</FormLabel>
                <FormControl>
                  <Input placeholder="DD/MM/YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="07123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode *</FormLabel>
                <FormControl>
                  <Input placeholder="SW1A 1AA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License</FormLabel>
                <FormControl>
                  <Input placeholder="License number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hgv">HGV</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Employer</FormLabel>
                <FormControl>
                  <Input placeholder="Employer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voucherCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter voucher code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hearAboutUs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us? *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Terms and Marketing Consent */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to Medical D4's{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Yes please, I would like to receive updates, offers and discounts
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleBack}
          >
            Back to Choose Time
          </Button>
          <Button type="submit" className="w-full">
            Complete Booking
          </Button>
        </div>
      </form>
    </Form>
  )
} 