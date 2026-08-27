import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const summaryData = [
  { name: 'Present', value: 982, color: '#10B981' },
  { name: 'Absent', value: 42, color: '#EF4444' },
  { name: 'Late', value: 18, color: '#F59E0B' },
  { name: 'On Leave', value: 20, color: '#3B82F6' },
]

const total = summaryData.reduce((sum, d) => sum + d.value, 0)

export default function TodaySummary() {
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
        Today's Summary
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={summaryData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {summaryData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{total.toLocaleString()}</span>
            <span style={{ fontSize: 9, color: '#9CA3AF' }}>Total</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {summaryData.map((d, i) => {
            const pct = ((d.value / total) * 100).toFixed(1)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.value}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
