import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DiscountBanner() {
  return (
    <Alert className="bg-primary/10 border-primary/20 mb-8">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-primary font-medium">
        <span>
          Save £5 on your medical assessment! Use code <span className="font-bold">2025D</span> at checkout.
        </span>
        <span className="text-sm opacity-75">(Valid until Dec 31, 2025)</span>
      </AlertDescription>
    </Alert>
  )
} 