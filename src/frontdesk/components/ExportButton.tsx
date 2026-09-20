import { Download } from "lucide-react"

interface ExportButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function ExportButton({ onClick, label = "Export", className = "" }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors ${className}`}
    >
      <Download size={15} />
      {label}
    </button>
  )
}
