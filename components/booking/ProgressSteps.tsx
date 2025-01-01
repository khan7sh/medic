'use client'

interface ProgressStepsProps {
  currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  // Don't show progress steps on confirmation page
  if (currentStep === 5) {
    return null;
  }

  const steps = [
    { number: 1, label: 'Choose Service' },
    { number: 2, label: 'Select Location' },
    { number: 3, label: 'Choose Time' },
    { number: 4, label: 'Your Details' },
    { number: 5, label: 'Payment' },
    { number: 6, label: 'Confirmation' }
  ]

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="mb-8 sm:mb-10">
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Progress Bar Background */}
        <div 
          className="absolute top-4 h-0.5 bg-muted/50"
          style={{ 
            left: 'calc(10% + 15px)',
            right: 'calc(10% + 15px)',
            width: '80%'
          }}
        />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-4 h-0.5 bg-primary transition-all duration-500 ease-in-out"
          style={{ 
            left: 'calc(10% + 15px)',
            width: `${progressPercentage * 0.8}%`
          }}
        />
        
        {/* Steps */}
        <div className="relative z-10 grid grid-cols-6 w-full">
          {steps.map(({ number, label }) => (
            <div key={number} className="flex flex-col items-center w-full px-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out bg-background ${
                  number === currentStep 
                    ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                    : number < currentStep 
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted/50 text-muted-foreground'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full text-sm">
                  {number < currentStep ? '✓' : number}
                </div>
              </div>
              <span 
                className={`mt-2 text-[11px] sm:text-xs font-medium text-center leading-tight ${
                  number === currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 