import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const ratingData = [
  { name: 'Positive', value: 88, color: '#10b981' },
  { name: 'Neutral', value: 6, color: '#f59e0b' },
  { name: 'Negative', value: 6, color: '#ef4444' },
]

export default function GuestFeedback() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Guest Feedback Insights</h3>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>This Month</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#111827' }}>4.7</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} style={{ color: star <= 4 ? '#f59e0b' : '#f59e0b', fontSize: 14 }}>★</span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Based on 320 reviews</div>
        </div>
        <div style={{ width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={3}
                dataKey="value"
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ratingData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>{item.name} Reviews</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
