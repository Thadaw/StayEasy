import { Search } from 'lucide-react'

interface ManagerBookingFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  dateRange: string
  onDateRangeChange: (d: string) => void
  status: string
  onStatusChange: (s: string) => void
  bookingSource: string
  onBookingSourceChange: (s: string) => void
  roomType: string
  onRoomTypeChange: (t: string) => void
  roomTypes: string[]
  onApply: () => void
}

const statusOptions = ['All Statuses', 'Confirmed', 'Pending', 'Checked-In', 'Checked-Out', 'Cancelled']
const sourceOptions = ['All Sources', 'Direct', 'OTA', 'Phone', 'Walk-in']

export default function ManagerBookingFilters({
  searchQuery, onSearchChange,
  dateRange, onDateRangeChange,
  status, onStatusChange,
  bookingSource, onBookingSourceChange,
  roomType, onRoomTypeChange,
  roomTypes,
  onApply,
}: ManagerBookingFiltersProps) {
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
    fontSize: 12,
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
      marginBottom: 16,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
        {/* Search */}
        <div>
          <label style={labelStyle}>Search</label>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Booking ID, guest name or room..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
        </div>

        {/* Stay Date - Single Range Field */}
        <div>
          <label style={labelStyle}>Stay Date</label>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            placeholder="Apr 28 – May 12, 2025"
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Booking Source */}
        <div>
          <label style={labelStyle}>Booking Source</label>
          <select
            value={bookingSource}
            onChange={(e) => onBookingSourceChange(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {sourceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label style={labelStyle}>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => onRoomTypeChange(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="All Rooms">All Rooms</option>
            {roomTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <div>
          <label style={{ ...labelStyle, visibility: 'hidden' }}>Apply</label>
          <button
            onClick={onApply}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
