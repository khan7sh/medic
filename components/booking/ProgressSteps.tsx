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
    { number: 4, label: 'Your Details' }
  ]

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="mb-12">
      <div className="relative flex justify-between max-w-3xl mx-auto px-4">
        {/* Progress Bar Background */}
        <div 
          className="absolute top-5 h-0.5 bg-muted"
          style={{ 
            left: 'calc(12.5% + 5px)',
            right: 'calc(12.5% + 5px)',
            width: '75%'
          }}
        />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
          style={{ 
            left: 'calc(12.5% + 5px)',
            width: `${progressPercentage * 0.75}%`
          }}
        />
        
        {/* Steps */}
        <div className="relative z-10 grid grid-cols-4 w-full">
          {steps.map(({ number, label }) => (
            <div key={number} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background ${
                  number === currentStep 
                    ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/25' 
                    : number < currentStep 
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted text-muted-foreground'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full">
                  {number < currentStep ? '✓' : number}
                </div>
              </div>
              <span 
                className={`mt-4 text-sm font-medium text-center ${
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