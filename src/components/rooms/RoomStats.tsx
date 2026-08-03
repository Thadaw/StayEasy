import { BedDouble, CheckCircle, Bed, SprayCan } from 'lucide-react'
import type { RoomResponse } from '../../types/pms'

interface RoomStatsProps {
  rooms: RoomResponse[]
  totalRooms: number
}

export default function RoomStats({ rooms, totalRooms }: RoomStatsProps) {
  const available = rooms.filter(r => r.status === 'AVAILABLE').length
  const occupied = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'BOOKED').length
  const cleaning = rooms.filter(r => r.status === 'CLEANING' || r.status === 'DIRTY').length
  const maintenance = rooms.filter(r => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE').length

  const displayTotal = totalRooms || rooms.length || 0
  const availPct = displayTotal > 0 ? Math.round((available / displayTotal) * 100) : 0
  const occPct = displayTotal > 0 ? Math.round((occupied / displayTotal) * 100) : 0
  const cleanPct = displayTotal > 0 ? Math.round((cleaning / displayTotal) * 100) : 0

  const stats = [
    { icon: BedDouble, label: 'Total Rooms', value: String(displayTotal), color: 'var(--foreground)', iconBg: 'var(--accent)', change: '', positive: true },
    { icon: CheckCircle, label: 'Available', value: String(available), color: 'var(--status-success)', iconBg: '#dcfce7', change: `${availPct}%`, positive: true },
    { icon: Bed, label: 'Occupied', value: String(occupied), color: 'var(--primary)', iconBg: 'var(--accent)', change: `${occPct}%`, positive: true },
    { icon: SprayCan, label: 'Cleaning', value: String(cleaning + maintenance), color: '#ea580c', iconBg: '#fff7ed', change: `${cleanPct}%`, positive: false },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{s.label}</div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={20} color={s.color} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          {s.change && <div style={{ fontSize: 12, color: s.positive ? 'var(--status-success)' : '#ea580c', marginTop: 2 }}>{s.change}</div>}
        </div>
      ))}
    </div>
  )
}
