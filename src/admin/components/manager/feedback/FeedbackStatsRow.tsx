import { MessageSquare, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import { FEEDBACK_KPIS } from './demoFeedback'

const ICONS = [
  { Icon: Star, bg: '#fef3c7', color: '#d97706' },
  { Icon: MessageSquare, bg: '#dbeafe', color: '#2563eb' },
  { Icon: ThumbsUp, bg: '#dcfce7', color: '#16a34a' },
  { Icon: ThumbsDown, bg: '#fee2e2', color: '#dc2626' },
]

export default function FeedbackStatsRow() {
  return (
    <div className="f-stats">
      {FEEDBACK_KPIS.map((kpi, i) => {
        const { Icon, bg, color } = ICONS[i]
        return (
          <div key={kpi.label} className="f-card" style={{ padding: 20 }}>
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
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: kpi.positive ? '#16a34a' : '#dc2626' }}>
              {kpi.delta}
            </div>
          </div>
        )
      })}
    </div>
  )
}
