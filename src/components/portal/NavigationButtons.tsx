import { ArrowLeft, ArrowRight } from 'lucide-react'

interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  onSaveDraft?: () => void
  backLabel?: string
  nextLabel?: string
  showSaveDraft?: boolean
}

export default function NavigationButtons({
  onBack, onNext, onSaveDraft,
  backLabel = 'Previous Step',
  nextLabel = 'Next Step',
  showSaveDraft = false,
}: NavigationButtonsProps) {
  return (
    <div className="navigation-buttons">
      {onBack ? (
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={16} /> {backLabel}
        </button>
      ) : <div />}

      <div className="navigation-buttons-right">
        {showSaveDraft && onSaveDraft && (
          <button onClick={onSaveDraft} className="btn-save-draft-inline">
            Save as Draft
          </button>
        )}
        {onNext && (
          <button onClick={onNext} className="btn-next">
            {nextLabel} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
