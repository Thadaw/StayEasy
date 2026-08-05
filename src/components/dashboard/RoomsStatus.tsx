import { useNavigate } from 'react-router-dom'
import { BedDouble, Bed, Wrench, XCircle, SprayCan } from 'lucide-react'
import type { RoomResponse } from '../../types/pms'

interface RoomsStatusProps {
  rooms: RoomResponse[]
  totalRooms: number
}

export default function RoomsStatus({ rooms, totalRooms }: RoomsStatusProps) {
  const navigate = useNavigate()

  const total = totalRooms || rooms.length || 0
  const occupied = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'BOOKED').length
  const available = rooms.filter(r => r.status === 'AVAILABLE').length
  const maintenance = rooms.filter(r => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE').length
  const outOfOrder = rooms.filter(r => r.status === 'OUT_OF_ORDER').length
  const cleaning = rooms.filter(r => r.status === 'CLEANING' || r.status === 'DIRTY').length

  const pct = (n: number) => total > 0 ? `${Math.round((n / total) * 100)}%` : '0%'

  const stats = [
    { label: 'Total Rooms', value: total, icon: BedDouble, iconBg: 'var(--accent)', color: 'var(--foreground)' },
    { label: 'Occupied', value: occupied, pct: pct(occupied), icon: Bed, iconBg: '#dcfce7', color: 'var(--status-success)' },
    { label: 'Available', value: available, pct: pct(available), icon: Bed, iconBg: 'var(--accent)', color: 'var(--primary)' },
    { label: 'Maintenance', value: maintenance, pct: pct(maintenance), icon: Wrench, iconBg: '#fef3c7', color: 'var(--status-warning)' },
    { label: 'Out of Order', value: outOfOrder, pct: pct(outOfOrder), icon: XCircle, iconBg: '#fee2e2', color: 'var(--destructive)' },
    { label: 'Cleaning', value: cleaning, pct: pct(cleaning), icon: SprayCan, iconBg: '#ede9fe', color: '#7c3aed' },
  ]

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Rooms Status</h3>
        <button onClick={() => navigate('/host/rooms')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View All</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            {s.pct && <div style={{ fontSize: 11, color: s.color }}>{s.pct}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
