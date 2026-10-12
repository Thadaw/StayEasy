import { useEffect, useState } from 'react'
import { DEPARTMENT_OPTIONS } from './demoStaff'

interface ExportStaffReportModalProps {
  onClose: () => void
  onExport: (format: string) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
}

const DATE_RANGE_OPTIONS = [
  'Apr 01 — Apr 28, 2025',
  'Mar 01 — Mar 31, 2025',
  'Feb 01 — Feb 28, 2025',
  'Jan 01 — Mar 31, 2025',
]

const REPORT_TYPE_OPTIONS = [
  'Staff Operations Summary',
  'Attendance Report',
  'Leave & Approvals Report',
  'Shift Coverage Report',
]

const FORMAT_OPTIONS = ['PDF', 'Excel (XLSX)', 'CSV']

export default function ExportStaffReportModal({ onClose, onExport }: ExportStaffReportModalProps) {
  const [department, setDepartment] = useState('All Departments')
  const [dateRange, setDateRange] = useState('Apr 01 — Apr 28, 2025')
  const [reportType, setReportType] = useState('Staff Operations Summary')
  const [format, setFormat] = useState('PDF')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const field = (
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void,
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: 460,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#111827' }}>
          Export Staff Report
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9ca3af' }}>
          Choose report scope and export format.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {field('Department', department, DEPARTMENT_OPTIONS, setDepartment)}
          {field('Date Range', dateRange, DATE_RANGE_OPTIONS, setDateRange)}
          {field('Report Type', reportType, REPORT_TYPE_OPTIONS, setReportType)}
          {field('Format', format, FORMAT_OPTIONS, setFormat)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#111827',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onExport(format)}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#111827',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}
