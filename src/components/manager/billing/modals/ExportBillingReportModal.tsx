import { useState } from 'react'
import ModalShell from './ModalShell'
import { modalCancelStyle, modalInputStyle, modalLabelStyle, modalPrimaryStyle } from './modalStyles'

interface ExportBillingReportModalProps {
  onClose: () => void
  onSubmit: (format: string) => void
}

const REPORT_TYPES = ['Invoice & Transactions', 'Payment Records', 'Refund Requests', 'Financial Summary']
const DATE_RANGES = ['Apr 1 – Apr 30, 2025', 'Mar 1 – Mar 31, 2025', 'Last 7 days', 'Year to date']
const STATUSES = ['All Status', 'Paid', 'Pending', 'Partially Paid', 'Overdue']
const FORMATS = ['PDF', 'Excel (XLSX)', 'CSV']

export default function ExportBillingReportModal({ onClose, onSubmit }: ExportBillingReportModalProps) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0])
  const [dateRange, setDateRange] = useState(DATE_RANGES[0])
  const [status, setStatus] = useState(STATUSES[0])
  const [format, setFormat] = useState(FORMATS[0])

  const field = (label: string, value: string, options: string[], onChange: (v: string) => void) => (
    <div>
      <label style={modalLabelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...modalInputStyle, cursor: 'pointer' }}
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
    <ModalShell
      title="Export Billing Report"
      subtitle="Download transactions as PDF"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={modalCancelStyle}>
            Cancel
          </button>
          <button onClick={() => onSubmit(format)} style={modalPrimaryStyle}>
            Export Report
          </button>
        </div>
      }
    >
      {field('Report Type', reportType, REPORT_TYPES, setReportType)}
      {field('Date Range', dateRange, DATE_RANGES, setDateRange)}
      {field('Payment Status', status, STATUSES, setStatus)}
      {field('Format', format, FORMATS, setFormat)}
    </ModalShell>
  )
}
