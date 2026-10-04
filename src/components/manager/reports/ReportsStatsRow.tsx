import { BarChart3, CalendarCheck, Star, TrendingUp } from 'lucide-react'
import { REPORT_KPIS } from './demoReports'

const ICONS = [
  { Icon: TrendingUp, bg: '#dbeafe', color: '#2563eb' },
  { Icon: BarChart3, bg: '#dcfce7', color: '#16a34a' },
  { Icon: CalendarCheck, bg: '#ffedd5', color: '#ea580c' },
  { Icon: Star, bg: '#fef3c7', color: '#d97706' },
]

export default function ReportsStatsRow() {
  return (
    <div className="r-stats">
      {REPORT_KPIS.map((kpi, i) => {
        const { Icon, bg, color } = ICONS[i]
        return (
          <div key={kpi.label} className="r-card" style={{ padding: 20 }}>
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
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                fontWeight: kpi.caption ? 400 : 600,
                color: kpi.caption ? '#9ca3af' : kpi.positive ? '#16a34a' : '#dc2626',
              }}
            >
              {kpi.delta}
            </div>
          </div>
        )
      })}
    </div>
  )
}
