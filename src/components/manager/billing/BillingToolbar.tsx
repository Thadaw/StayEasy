import { Calendar, FilePlus2, Receipt, Download, Filter } from 'lucide-react'
import { INVOICE_METHODS } from './demoBilling'

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 13,
  color: '#374151',
  cursor: 'pointer',
  outline: 'none',
}

const buttonOutlineStyle: React.CSSProperties = {
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

interface BillingToolbarProps {
  status: string
  method: string
  dateRange: string
  onStatusChange: (value: string) => void
  onMethodChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onGenerateInvoice: () => void
  onRecordPayment: () => void
  onExport: () => void
  onFilter: () => void
}

export default function BillingToolbar({
  status,
  method,
  dateRange,
  onStatusChange,
  onMethodChange,
  onDateRangeChange,
  onGenerateInvoice,
  onRecordPayment,
  onExport,
  onFilter,
}: BillingToolbarProps) {
  return (
    <div className="b-toolbar">
      <div className="b-toolbar-filters">
        <select value={status} onChange={(e) => onStatusChange(e.target.value)} style={selectStyle}>
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select value={method} onChange={(e) => onMethodChange(e.target.value)} style={selectStyle}>
          <option value="All">All Methods</option>
          {INVOICE_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Calendar
            size={14}
            color="#6b7280"
            style={{ position: 'absolute', left: 11, pointerEvents: 'none' }}
          />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            style={{ ...selectStyle, paddingLeft: 32 }}
          >
            <option>Apr 1 – Apr 30</option>
            <option>Mar 1 – Mar 31</option>
            <option>Last 7 days</option>
            <option>Any date</option>
          </select>
        </div>
      </div>

      <div className="b-toolbar-actions">
        <button
          onClick={onGenerateInvoice}
          style={{
            ...buttonOutlineStyle,
            background: '#111827',
            border: '1px solid #111827',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          <FilePlus2 size={15} />
          Generate Invoice
        </button>
        <button onClick={onRecordPayment} style={buttonOutlineStyle}>
          <Receipt size={15} />
          Record Payment
        </button>
        <button onClick={onExport} style={buttonOutlineStyle}>
          <Download size={15} />
          Export Transactions
        </button>
        <button onClick={onFilter} style={buttonOutlineStyle}>
          <Filter size={15} />
          Filter Transactions
        </button>
      </div>
    </div>
  )
}
