import { Bell, CalendarCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { NOTIFICATION_KPIS } from './demoNotifications'

const ICONS = [
  { Icon: Bell, bg: '#dbeafe', color: '#2563eb' },
  { Icon: CalendarCheck, bg: '#dcfce7', color: '#16a34a' },
  { Icon: AlertTriangle, bg: '#fee2e2', color: '#dc2626' },
  { Icon: CheckCircle2, bg: '#dcfce7', color: '#16a34a' },
]

export default function NotificationStatsRow() {
  return (
    <div className="n-stats">
      {NOTIFICATION_KPIS.map((kpi, i) => {
        const { Icon, bg, color } = ICONS[i]
        return (
          <div key={kpi.label} className="n-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#6b7280' }}>{kpi.label}</span>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: bg,
                  color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={17} />
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{kpi.value}</div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>{kpi.caption}</div>
          </div>
        )
      })}
    </div>
  )
}
