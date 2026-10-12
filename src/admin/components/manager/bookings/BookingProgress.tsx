interface BookingProgressProps {
  currentStep: 1 | 2
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  const steps = [
    { num: 1, label: 'Guest & Stay' },
    { num: 2, label: 'Review & Payment' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((step, i) => {
        const isActive = currentStep === step.num
        const isComplete = currentStep > step.num
        return (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600,
                background: isComplete || isActive ? '#3b82f6' : '#e5e7eb',
                color: isComplete || isActive ? '#fff' : '#9ca3af',
              }}>
                {isComplete ? '✓' : step.num}
              </div>
              <span style={{
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#111827' : '#6b7280',
              }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 60, height: 2, margin: '0 16px',
                background: currentStep > step.num ? '#3b82f6' : '#e5e7eb',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
