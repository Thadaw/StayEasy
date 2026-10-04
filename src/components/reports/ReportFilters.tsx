import { Calendar, Download } from 'lucide-react'

interface ReportFiltersProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  roomType: string
  onRoomTypeChange: (value: string) => void
  bookingChannel: string
  onBookingChannelChange: (value: string) => void
  onApply: () => void
  onReset: () => void
  onExport: () => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  padding: '10px 36px 10px 12px',
  fontSize: 13,
  color: '#334155',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '14px',
  backgroundAttachment: 'local',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#64748B',
  marginBottom: 6,
  display: 'block',
}

export default function ReportFilters({
  dateRange,
  onDateRangeChange,
  roomType,
  onRoomTypeChange,
  bookingChannel,
  onBookingChannelChange,
  onApply,
  onReset,
  onExport,
}: ReportFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <label style={labelStyle}>Date Range</label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Calendar size={15} style={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#94A3B8' }} />
          <input
            type="text"
            value={dateRange}
            onChange={e => onDateRangeChange(e.target.value)}
            style={{
              padding: '10px 12px 10px 36px',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: 13,
              color: '#334155',
              outline: 'none',
              background: '#fff',
              width: 220,
              fontWeight: 500,
            }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Room Type</label>
        <div style={{ position: 'relative' }}>
          <select
            value={roomType}
            onChange={e => onRoomTypeChange(e.target.value)}
            style={selectStyle}
          >
            <option>All Room Types</option>
            <option>Standard</option>
            <option>Deluxe</option>
            <option>Suite</option>
            <option>Premium</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Booking Channel</label>
        <div style={{ position: 'relative' }}>
          <select
            value={bookingChannel}
            onChange={e => onBookingChannelChange(e.target.value)}
            style={selectStyle}
          >
            <option>All Booking Channel</option>
            <option>Direct</option>
            <option>OTA</option>
            <option>Walk-in</option>
            <option>Phone</option>
          </select>
        </div>
      </div>

      <button
        onClick={onApply}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          background: '#2E86AB',
          fontSize: 13,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Apply Filters
      </button>

      <button
        onClick={onReset}
        style={{
          padding: '10px 16px',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          background: '#fff',
          fontSize: 13,
          fontWeight: 500,
          color: '#64748B',
          cursor: 'pointer',
        }}
      >
        Reset
      </button>

      <button
        onClick={onExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          background: '#fff',
          fontSize: 13,
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        <Download size={15} />
        Export
      </button>
    </div>
  )
}
