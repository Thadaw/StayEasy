import { BedDouble, CheckCircle, Bed, SprayCan } from 'lucide-react'

const stats = [
  { icon: BedDouble, label: 'Total Rooms', value: '86', color: 'var(--foreground)', iconBg: 'var(--accent)', change: '', positive: true },
  { icon: CheckCircle, label: 'Available', value: '20', color: 'var(--status-success)', iconBg: '#dcfce7', change: '23.3%', positive: true },
  { icon: Bed, label: 'Occupied', value: '62', color: 'var(--primary)', iconBg: 'var(--accent)', change: '72.1%', positive: true },
  { icon: SprayCan, label: 'Cleaning', value: '3', color: '#ea580c', iconBg: '#fff7ed', change: '3.5%', positive: false },
]

export default function RoomStats() {
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
