interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  percentage: number
  title: string
  onStepClick?: (stepNumber: number) => void
  clickableSteps?: number[]
}

const STEP_LABELS = ['Property Details', 'Room Details', 'Pricing & Offers']

export default function ProgressBar({ currentStep, totalSteps, percentage, title, onStepClick, clickableSteps = [] }: ProgressBarProps) {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-header">
        <div className="progress-header-left">
          <h1 className="progress-title">{title}</h1>
          <span className="progress-step-text">Step {currentStep} of {totalSteps}</span>
        </div>
        <span className="progress-percentage">{percentage}% Complete</span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="progress-steps">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1
          const isCompleted = currentStep > stepNum
          const isCurrent = currentStep === stepNum
          const isUpcoming = currentStep < stepNum
          const isClickable = clickableSteps.includes(stepNum)

          return (
            <div
              key={label}
              className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={isClickable && onStepClick ? () => onStepClick(stepNum) : undefined}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable && onStepClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onStepClick(stepNum) } : undefined}
            >
              <div className="progress-step-circle">
                {isCompleted ? (
                  <span className="check-icon">&#10003;</span>
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <span className="progress-step-label">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
