import { Button } from "@/components/ui/button"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentMethodSelectorProps {
  onSelect: (method: 'online' | 'inPerson') => void
  selectedMethod?: 'online' | 'inPerson'
}

export default function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button
        variant={selectedMethod === 'online' ? 'default' : 'outline'}
        className="h-auto py-6 flex flex-col items-center"
        onClick={() => onSelect('online')}
      >
        <CreditCard className="h-6 w-6 mb-2" />
        <div className="text-lg font-medium">Pay Online Now</div>
        <p className="text-sm text-muted-foreground mt-1">Secure payment via Stripe</p>
      </Button>

      <Button
        variant={selectedMethod === 'inPerson' ? 'default' : 'outline'}
        className="h-auto py-6 flex flex-col items-center"
        onClick={() => onSelect('inPerson')}
      >
        <Wallet className="h-6 w-6 mb-2" />
        <div className="text-lg font-medium">Pay in Person</div>
        <p className="text-sm text-muted-foreground mt-1">Pay at the clinic</p>
      </Button>
    </div>
  )
}