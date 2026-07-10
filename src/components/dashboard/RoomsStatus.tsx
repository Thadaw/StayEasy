import { useNavigate } from 'react-router-dom'
import { BedDouble, Bed, Wrench, XCircle, SprayCan } from 'lucide-react'

const stats = [
  { label: 'Total Rooms', value: 86, icon: BedDouble, iconBg: 'var(--accent)', color: 'var(--foreground)' },
  { label: 'Occupied', value: 62, pct: '72.1%', icon: Bed, iconBg: '#dcfce7', color: 'var(--status-success)' },
  { label: 'Available', value: 20, pct: '23.3%', icon: Bed, iconBg: 'var(--accent)', color: 'var(--primary)' },
  { label: 'Maintenance', value: 3, pct: '3.5%', icon: Wrench, iconBg: '#fef3c7', color: 'var(--status-warning)' },
  { label: 'Out of Order', value: 1, pct: '1.1%', icon: XCircle, iconBg: '#fee2e2', color: 'var(--destructive)' },
  { label: 'Cleaning', value: 3, pct: '3.5%', icon: SprayCan, iconBg: '#ede9fe', color: '#7c3aed' },
]

export default function RoomsStatus() {
  const navigate = useNavigate()
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
