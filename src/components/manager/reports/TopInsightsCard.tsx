import { Award, CalendarDays, Crown, Smile } from 'lucide-react'
import { TOP_INSIGHTS } from './demoReports'

const ICONS = [
  { Icon: CalendarDays, bg: '#dbeafe', color: '#2563eb' },
  { Icon: Crown, bg: '#ffedd5', color: '#ea580c' },
  { Icon: Award, bg: '#fef3c7', color: '#d97706' },
  { Icon: Smile, bg: '#dcfce7', color: '#16a34a' },
]

export default function TopInsightsCard() {
  return (
    <div className="r-card">
      <div className="r-card-head">
        <div>
          <h3 className="r-card-title">Top Insights</h3>
          <p className="r-card-sub">Key highlights this period</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TOP_INSIGHTS.map((insight, i) => {
          const { Icon, bg, color } = ICONS[i]
          return (
            <div
              key={insight.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #f3f4f6',
                borderRadius: 10,
                background: '#f9fafb',
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: bg,
                  color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={17} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{insight.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 2 }}>
                  {insight.value}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af', marginLeft: 8 }}>
                    {insight.caption}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
