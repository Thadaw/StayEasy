import { Search, Plus, ChevronDown } from 'lucide-react'

interface BookingFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  activeStatus: string
  onStatusChange: (s: string) => void
  roomType: string
  onRoomTypeChange: (t: string) => void
  dateFilter: string
  onDateFilterChange: (d: string) => void
  onNewBooking: () => void
}

const statuses = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Checked-in', 'Checked-out']
const roomTypes = ['All Rooms', 'Standard Room', 'Deluxe Room', 'Suite Room', 'Presidential Suite']

export default function BookingFilters({ searchQuery, onSearchChange, activeStatus, onStatusChange, roomType, onRoomTypeChange, dateFilter, onDateFilterChange, onNewBooking }: BookingFiltersProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={16} color="var(--muted-foreground)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by guest name or booking ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--muted)',
                fontSize: 13,
                color: 'var(--foreground)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={roomType}
              onChange={(e) => onRoomTypeChange(e.target.value)}
              style={{
                padding: '10px 32px 10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: '#fff',
                fontSize: 13,
                color: 'var(--foreground)',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
              }}
            >
              {roomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} color="var(--muted-foreground)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: '#fff',
                fontSize: 13,
                color: 'var(--foreground)',
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button onClick={onNewBooking} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 8, border: 'none',
          background: 'var(--primary)', color: '#fff',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: activeStatus === s ? 'var(--primary)' : 'var(--border)',
              background: activeStatus === s ? 'var(--accent)' : '#fff',
              color: activeStatus === s ? 'var(--primary)' : 'var(--foreground)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
