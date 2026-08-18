import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface ReserveStepperProps {
  currentStep?: number
}

const steps = [
  { number: 1, label: 'Your Selection' },
  { number: 2, label: 'Your Details' },
  { number: 3, label: 'Finish booking' },
]

export function ReserveStepper({ currentStep = 3 }: ReserveStepperProps) {
  const navigate = useNavigate()
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[60px] md:top-[68px] z-40">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5 relative">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-[#1A3C5E] hover:border-[#1A3C5E] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
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
