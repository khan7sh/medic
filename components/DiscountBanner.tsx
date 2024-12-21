import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DiscountBanner() {
  return (
    <Alert className="bg-primary/10 border-primary/20 mb-8">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="text-primary font-medium">
        Use code <span className="font-bold">2025D</span> at checkout to save £5 on your medical assessment!
      </AlertDescription>
    </Alert>
  )
} 