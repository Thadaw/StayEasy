import { useNavigate } from 'react-router-dom'
import { CalendarPlus, UserPlus, BedDouble, Tag, FileText, LogOut } from 'lucide-react'

const actions = [
  { icon: CalendarPlus, label: 'New Booking', desc: 'Create new reservation', path: '/host/bookings/new', color: '#eff6ff', iconColor: '#2563eb' },
  { icon: UserPlus, label: 'Walk-in Guest', desc: 'Add walk-in guest', path: '/host/guests', color: '#f0fdf4', iconColor: '#16a34a' },
  { icon: BedDouble, label: 'Add Room', desc: 'Create new room', path: '/host/rooms', color: '#fef3c7', iconColor: '#d97706' },
  { icon: LogOut, label: 'Guest Checkout', desc: 'Process checkout', path: '/host/bookings', color: '#ede9fe', iconColor: '#7c3aed' },
  { icon: FileText, label: 'Generate Report', desc: 'Download report', path: '/host/reports', color: '#fce7f3', iconColor: '#db2777' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#111827' }}>Quick Actions</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {actions.map((a) => (
          <div
            key={a.label}
            onClick={() => navigate(a.path)}
            style={{
              flex: '1 1 180px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 16,
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, transform 0.15s',
              minWidth: 180,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: a.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <a.icon size={20} color={a.iconColor} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
