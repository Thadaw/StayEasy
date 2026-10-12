import { Award, TrendingUp, AlertTriangle } from 'lucide-react'
import { PERFORMANCE_HIGHLIGHTS } from './demoFeedback'

const TONES = {
  top: { Icon: Award, bg: '#fef3c7', color: '#d97706' },
  improved: { Icon: TrendingUp, bg: '#dcfce7', color: '#16a34a' },
  dissatisfied: { Icon: AlertTriangle, bg: '#fee2e2', color: '#dc2626' },
}

export default function PerformanceHighlights() {
  return (
    <div className="f-highlights">
      {PERFORMANCE_HIGHLIGHTS.map((item) => {
        const { Icon, bg, color } = TONES[item.tone]
        return (
          <div key={item.id} className="f-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: bg,
                  color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={15} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.label}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{item.category}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.score}</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>· {item.reviews}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
