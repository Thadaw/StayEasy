import { Search, Plus, X } from 'lucide-react'

interface RoomFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  roomType: string
  onRoomTypeChange: (t: string) => void
  status: string
  onStatusChange: (s: string) => void
  floor: string
  onFloorChange: (f: string) => void
  onClear: () => void
  onAddRoom: () => void
}

const roomTypes = ['All Types', 'Standard Room', 'Deluxe Room', 'Suite Room', 'Family Room', 'Presidential Suite']
const statuses = ['All Status', 'Available', 'Occupied', 'Cleaning', 'Maintenance', 'Out of Order']
const floors = ['All Floors', '1st Floor', '2nd Floor', '3rd Floor']

export default function RoomFilters({ searchQuery, onSearchChange, roomType, onRoomTypeChange, status, onStatusChange, floor, onFloorChange, onClear, onAddRoom }: RoomFiltersProps) {
  const hasFilters = searchQuery || roomType !== 'All Types' || status !== 'All Status' || floor !== 'All Floors'

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
          <Search size={16} color="var(--muted-foreground)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by room number or type..."
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

        {[
          { value: roomType, onChange: onRoomTypeChange, options: roomTypes, label: 'Room Type' },
          { value: status, onChange: onStatusChange, options: statuses, label: 'Status' },
          { value: floor, onChange: onFloorChange, options: floors, label: 'Floor' },
        ].map((f) => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{f.label}</span>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
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
                minWidth: 140,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}

        {hasFilters && (
          <button
            onClick={onClear}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)',
              background: '#fff', cursor: 'pointer', fontSize: 13, color: 'var(--muted-foreground)',
            }}
          >
            <X size={14} /> Clear Filters
          </button>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={onAddRoom} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 8, border: 'none',
          background: 'var(--primary)', color: '#fff',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={16} /> Add Room
        </button>
      </div>
    </div>
  )
}
