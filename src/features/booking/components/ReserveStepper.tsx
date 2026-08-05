interface ReserveStepperProps {
  currentStep?: number
}

const steps = [
  { number: 1, label: 'Your Selection' },
  { number: 2, label: 'Your Details' },
  { number: 3, label: 'Finish booking' },
]

export function ReserveStepper({ currentStep = 3 }: ReserveStepperProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-center">
          {steps.map((step, i) => {
            const isCompleted = step.number < currentStep
            const isCurrent = step.number === currentStep
            return (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted || isCurrent
                      ? 'bg-[#1A3C5E] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.number}
                  </span>
                  <span className={`text-sm font-semibold ${
                    isCompleted || isCurrent ? 'text-[#1A3C5E]' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-4 min-w-[60px] max-w-[120px] ${
                    step.number < currentStep ? 'bg-[#1A3C5E]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
