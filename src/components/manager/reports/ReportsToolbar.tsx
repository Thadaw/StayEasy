import { useState } from 'react'
import { Calendar, FileDown, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const buttonOutline: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '9px 14px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

interface ReportsToolbarProps {
  onExport: () => void
  onDownload: () => void
}

const RANGES = [
  'Apr 01, 2025 – Apr 30, 2025',
  'Mar 01, 2025 – Mar 31, 2025',
  'Jan 01, 2025 – Apr 30, 2025',
]

export default function ReportsToolbar({ onExport, onDownload }: ReportsToolbarProps) {
  const [rangeIndex, setRangeIndex] = useState(0)

  const cycleRange = () => {
    const next = (rangeIndex + 1) % RANGES.length
    setRangeIndex(next)
    toast.success(`Date range: ${RANGES[next]}`)
  }

  return (
    <div className="r-toolbar">
      <button onClick={cycleRange} style={buttonOutline}>
        <Calendar size={15} />
        {RANGES[rangeIndex]}
      </button>
      <div className="r-toolbar-actions">
        <button onClick={onExport} style={buttonOutline}>
          <FileDown size={15} />
          Export Report
        </button>
        <button
          onClick={onDownload}
          style={{
            ...buttonOutline,
            background: '#111827',
            border: '1px solid #111827',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          <FileText size={15} />
          Download PDF
        </button>
      </div>
    </div>
  )
}
