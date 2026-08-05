import { useNavigate } from 'react-router-dom'
import { CalendarPlus, UserPlus, BedDouble, Tag, FileText } from 'lucide-react'

const actions = [
  { icon: CalendarPlus, label: 'New Booking', desc: 'Create new reservation', path: '/host/bookings/new', color: 'var(--accent)' },
  { icon: UserPlus, label: 'Walk-in Guest', desc: 'Add walk-in guest', path: '/host/guests', color: '#ede9fe' },
  { icon: BedDouble, label: 'Add Room', desc: 'Create new room', path: '/host/rooms', color: '#dcfce7' },
  { icon: Tag, label: 'Create Discount', desc: 'Add new offer', path: '/host/pricing/new', color: '#fef3c7' },
  { icon: FileText, label: 'Generate Report', desc: 'Download report', path: '/host/reports', color: 'var(--accent)' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Quick Actions</h3>
      <div style={{ display: 'flex', gap: 12 }}>
        {actions.map((a) => (
          <div key={a.label} onClick={() => navigate(a.path)} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: 16,
            border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
            transition: 'box-shadow 0.15s',
          }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <a.icon size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
