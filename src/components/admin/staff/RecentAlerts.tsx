import { Clock, AlertTriangle, Timer } from 'lucide-react'

interface Alert {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  time: string
  description: string
}

const alerts: Alert[] = [
  {
    icon: <Clock size={16} />,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    title: 'Late Check In',
    time: '09:15 AM',
    description: 'Liam Smith checked in late',
  },
  {
    icon: <AlertTriangle size={16} />,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    title: 'Missed Punch',
    time: '06:00 PM',
    description: 'Olivia Brown missed check-out',
  },
  {
    icon: <Timer size={16} />,
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    title: 'Overtime Request',
    time: 'Yesterday',
    description: 'Noah Williams requested overtime',
  },
]

export default function RecentAlerts() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
        Recent Attendance Alerts
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {alerts.map((alert, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px',
              background: '#F9FAFB',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: alert.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: alert.iconColor,
                flexShrink: 0,
              }}
            >
              {alert.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{alert.title}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{alert.time}</span>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{alert.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 13,
            color: '#2563EB',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          View all alerts →
        </span>
      </div>
    </div>
  )
}
