import { Calendar, ChevronDown, Filter, Download } from 'lucide-react'

interface ReportFiltersProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  property: string
  onPropertyChange: (value: string) => void
  department: string
  onDepartmentChange: (value: string) => void
  onExport: () => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '9px 32px 9px 12px',
  fontSize: 14,
  color: '#374151',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
}

export default function ReportFilters({
  dateRange,
  onDateRangeChange,
  property,
  onPropertyChange,
  department,
  onDepartmentChange,
  onExport,
}: ReportFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <Calendar
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            pointerEvents: 'none',
            color: '#9CA3AF',
          }}
        />
        <input
          type="text"
          value={dateRange}
          onChange={e => onDateRangeChange(e.target.value)}
          style={{
            padding: '9px 12px 9px 36px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
            width: 240,
          }}
        />
      </div>

      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
          value={property}
          onChange={e => onPropertyChange(e.target.value)}
          style={selectStyle}
        >
          <option>All Properties</option>
          <option>Main Hotel</option>
          <option>Resort</option>
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
          value={department}
          onChange={e => onDepartmentChange(e.target.value)}
          style={selectStyle}
        >
          <option>All Departments</option>
          <option>Rooms</option>
          <option>Restaurant</option>
          <option>Housekeeping</option>
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
      </div>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 14px',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          background: '#fff',
          fontSize: 14,
          fontWeight: 500,
          color: '#374151',
          cursor: 'pointer',
        }}
      >
        <Filter size={16} />
        More Filters
      </button>

      <button
        onClick={onExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '9px 18px',
          border: '1px solid var(--primary)',
          borderRadius: 8,
          background: '#fff',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--primary)',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        <Download size={16} />
        Export Report
      </button>
    </div>
  )
}
