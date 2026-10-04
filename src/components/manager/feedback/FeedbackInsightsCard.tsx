import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { FEEDBACK_CATEGORIES, TOTAL_REVIEWS } from './demoFeedback'

export default function FeedbackInsightsCard() {
  return (
    <div className="f-card">
      <div className="f-card-head">
        <div>
          <h3 className="f-card-title">Feedback Insights</h3>
          <p className="f-card-sub">Feedback categories</p>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={FEEDBACK_CATEGORIES}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={85}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {FEEDBACK_CATEGORIES.map((category) => (
                <Cell key={category.name} fill={category.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} reviews`, name]}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{TOTAL_REVIEWS}</span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Reviews</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        {FEEDBACK_CATEGORIES.map((category) => (
          <div key={category.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: category.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{category.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{category.percent}%</span>
            <span style={{ fontSize: 12, color: '#9ca3af', width: 36, textAlign: 'right' }}>{category.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
