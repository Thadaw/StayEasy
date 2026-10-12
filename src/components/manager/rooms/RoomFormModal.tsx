import { useEffect, useState } from 'react'
import { ROOM_STATUSES, HOUSEKEEPING_STATUSES, type RoomRow } from './demoRooms'

interface RoomFormModalProps {
  room: RoomRow | null
  roomTypes: string[]
  existingNumbers: string[]
  onClose: () => void
  onSave: (values: Omit<RoomRow, 'id'>, existingId: string | null) => void
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
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
  display: 'block',
}

const bedOptions = ['1 Queen Bed', '1 King Bed', '2 Single Beds', '1 King + 1 Single', '2 Queen Beds']
const floorOptions = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4']

export default function RoomFormModal({ room, roomTypes, existingNumbers, onClose, onSave }: RoomFormModalProps) {
  const [number, setNumber] = useState(room?.number ?? '')
  const [type, setType] = useState(room?.type ?? roomTypes[0] ?? 'Standard Room')
  const [bedInfo, setBedInfo] = useState(room?.bedInfo ?? bedOptions[0])
  const [floor, setFloor] = useState(room?.floor ?? floorOptions[0])
  const [status, setStatus] = useState(room?.status ?? 'Available')
  const [housekeeping, setHousekeeping] = useState(room?.housekeeping ?? 'Clean')
  const [capacity, setCapacity] = useState(room?.capacity ?? 2)
  const [price, setPrice] = useState(room ? String(room.price) : '')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    const trimmed = number.trim()
    if (!trimmed) return setError('Room number is required.')
    const priceNum = Number(price)
    if (!price.trim() || Number.isNaN(priceNum) || priceNum <= 0) return setError('Price per night must be a positive number.')
    const duplicate = existingNumbers.some((n) => n === trimmed && n !== room?.number)
    if (duplicate) return setError(`Room ${trimmed} already exists.`)

    onSave({
      number: trimmed,
      type,
      bedInfo,
      floor,
      status,
      capacity,
      price: priceNum,
      features: room?.features ?? ['WiFi', 'AC', 'TV'],
      guestStay: room?.guestStay ?? '—',
      housekeeping,
    }, room?.id ?? null)
  }

  const types = roomTypes.length > 0 ? roomTypes.filter((t) => t !== 'All Types') : ['Standard Room', 'Deluxe Room', 'Family Room', 'Suite Room']

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, padding: 28, width: 560,
          maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          {room ? 'Edit Room' : 'Add Room'}
        </h3>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
          {room ? `Update details for room #${room.number}.` : 'Create a new room for this property.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Room Number *</label>
              <input style={inputStyle} placeholder="e.g. 301" value={number} onChange={(e) => { setNumber(e.target.value); setError('') }} />
            </div>
            <div>
              <label style={labelStyle}>Room Type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Bed Info</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={bedInfo} onChange={(e) => setBedInfo(e.target.value)}>
                {bedOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Floor</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={floor} onChange={(e) => setFloor(e.target.value)}>
                {floorOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                {ROOM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Housekeeping</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={housekeeping} onChange={(e) => setHousekeeping(e.target.value)}>
                {HOUSEKEEPING_STATUSES.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input
                style={inputStyle} type="number" min={1} max={10} value={capacity}
                onChange={(e) => setCapacity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
              />
            </div>
            <div>
              <label style={labelStyle}>Price / Night (NPR) *</label>
              <input
                style={inputStyle} type="number" min={0} placeholder="e.g. 12000" value={price}
                onChange={(e) => { setPrice(e.target.value); setError('') }}
              />
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', padding: '10px 12px', borderRadius: 8 }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            {room ? 'Save Changes' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  )
}
