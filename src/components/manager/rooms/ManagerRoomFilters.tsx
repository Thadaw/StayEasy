import { Search, Plus } from 'lucide-react'

interface ManagerRoomFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  roomType: string
  onRoomTypeChange: (t: string) => void
  roomTypes: string[]
  status: string
  onStatusChange: (s: string) => void
  statusOptions: string[]
  floor: string
  onFloorChange: (f: string) => void
  floorOptions: string[]
  onAddRoom: () => void
}

export default function ManagerRoomFilters({
  searchQuery, onSearchChange,
  roomType, onRoomTypeChange, roomTypes,
  status, onStatusChange, statusOptions,
  floor, onFloorChange, floorOptions,
  onAddRoom,
}: ManagerRoomFiltersProps) {
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

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search room number or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>

        <select value={roomType} onChange={(e) => onRoomTypeChange(e.target.value)} style={{ ...inputStyle, flex: '1 1 130px', minWidth: 120, cursor: 'pointer' }}>
          {roomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={status} onChange={(e) => onStatusChange(e.target.value)} style={{ ...inputStyle, flex: '1 1 130px', minWidth: 120, cursor: 'pointer' }}>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={floor} onChange={(e) => onFloorChange(e.target.value)} style={{ ...inputStyle, flex: '1 1 130px', minWidth: 120, cursor: 'pointer' }}>
          {floorOptions.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <button
          onClick={onAddRoom}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: '#3b82f6', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
          <Plus size={15} /> Add Room
        </button>
      </div>
    </div>
  )
}
