import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DateRangePickerDropdownProps {
  onDateChange?: (start: Date, end: Date) => void
}

const presets: { label: string; getRange: () => [Date, Date] }[] = [
  {
    label: 'This Month',
    getRange: () => {
      const now = new Date()
      return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)] as [Date, Date]
    },
  },
  {
    label: 'Last Month',
    getRange: () => {
      const now = new Date()
      return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)] as [Date, Date]
    },
  },
  {
    label: 'Last 7 Days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end] as [Date, Date]
    },
  },
  {
    label: 'Last 30 Days',
    getRange: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return [start, end] as [Date, Date]
    },
  },
]

function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start || !end) return 'Select dates'
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

export default function DateRangePickerDropdown({ onDateChange }: DateRangePickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const now = new Date()
  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  ])
  const [appliedRange, setAppliedRange] = useState<[Date | null, Date | null]>(tempRange)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setTempRange(appliedRange)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [appliedRange])

  const handlePreset = (getRange: () => [Date, Date]) => {
    const range = getRange()
    setTempRange(range)
  }

  const handleApply = () => {
    if (tempRange[0] && tempRange[1]) {
      setAppliedRange(tempRange)
      onDateChange?.(tempRange[0], tempRange[1])
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempRange(appliedRange)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--muted)',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--brand-dark)',
        }}
      >
        <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
        <span>{formatDateRange(appliedRange[0], appliedRange[1])}</span>
        <ChevronDown size={14} style={{ color: 'var(--muted-foreground)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--card)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            zIndex: 50,
            width: 340,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset.getRange)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: tempRange[0]?.getTime() === preset.getRange()[0].getTime() ? 'var(--primary)' : 'var(--muted)',
                    color: tempRange[0]?.getTime() === preset.getRange()[0].getTime() ? '#fff' : 'var(--brand-dark)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <DatePicker
              selected={tempRange[0]}
              onChange={(dates: [Date | null, Date | null] | null) => {
                if (dates) setTempRange(dates)
              }}
              startDate={tempRange[0]}
              endDate={tempRange[1]}
              selectsRange
              inline
              calendarClassName="dashboard-calendar"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--muted)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--brand-dark)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--primary)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#fff',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
