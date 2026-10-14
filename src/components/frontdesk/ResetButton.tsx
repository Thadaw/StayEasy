import { RotateCcw } from "lucide-react"

interface ResetButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function ResetButton({ onClick, label = "Reset", className = "" }: ResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    >
      <RotateCcw size={14} />
      {label}
    </button>
  )
}
