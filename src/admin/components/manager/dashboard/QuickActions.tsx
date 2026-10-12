import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Bed, CheckCircle, FileText, Users, Wrench } from 'lucide-react'

const actions = [
  { label: 'Add New Booking', icon: CalendarPlus, color: '#3b82f6', bg: '#dbeafe', path: '/manager/bookings' },
  { label: 'Assign Room', icon: Bed, color: '#10b981', bg: '#dcfce7', path: '/manager/rooms' },
  { label: 'Approve Check-in', icon: CheckCircle, color: '#8b5cf6', bg: '#ede9fe', path: '/manager/bookings' },
  { label: 'Generate Report', icon: FileText, color: '#f59e0b', bg: '#fef3c7', path: '/manager/reports' },
  { label: 'Staff Assignment', icon: Users, color: '#ec4899', bg: '#fce7f3', path: '/manager/staff' },
  { label: 'Schedule Maintenance', icon: Wrench, color: '#ef4444', bg: '#fee2e2', path: '/manager/housekeeping' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
      flex: 1,
    }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 16,
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = action.bg
                e.currentTarget.style.borderColor = action.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: action.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={20} color={action.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#374151', textAlign: 'center' }}>{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
