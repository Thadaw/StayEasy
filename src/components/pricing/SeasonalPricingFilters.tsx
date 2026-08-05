import { Search, ChevronDown, Calendar, Download } from 'lucide-react'

interface SeasonalPricingFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  roomType: string
  onRoomTypeChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  dateRange: string
  onDateRangeChange: (value: string) => void
  onExport: () => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '10px 36px 10px 14px',
  fontSize: 14,
  color: '#374151',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
  backgroundImage: 'none',
  minWidth: 140,
}

const dropdownWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
}

const dropdownIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: 12,
  pointerEvents: 'none',
  color: '#9CA3AF',
}

export default function SeasonalPricingFilters({
  search,
  onSearchChange,
  roomType,
  onRoomTypeChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onExport,
}: SeasonalPricingFiltersProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 320 }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search season..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 42px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
          }}
        />
      </div>

      {/* Room Type */}
      <div style={dropdownWrapperStyle}>
        <select
          value={roomType}
          onChange={e => onRoomTypeChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Room Type</option>
          <option value="All">All</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
          <option value="Standard">Standard</option>
          <option value="Family">Family</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      {/* Status */}
      <div style={dropdownWrapperStyle}>
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Status</option>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Expired">Expired</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      {/* Date Range */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <input
          type="text"
          value={dateRange}
          onChange={e => onDateRangeChange(e.target.value)}
          placeholder="Select date range"
          style={{
            padding: '10px 14px 10px 36px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
            minWidth: 180,
          }}
        />
        <Calendar
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            pointerEvents: 'none',
            color: '#9CA3AF',
          }}
        />
      </div>

      {/* Export */}
      <button
        onClick={onExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
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
        Export
      </button>
    </div>
  )
}
