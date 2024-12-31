'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import StripeReturn from '@/components/booking/StripeReturn'

export default function StripeReturnPage() {
  return <StripeReturn />
}