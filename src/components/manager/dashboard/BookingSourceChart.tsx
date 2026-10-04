import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Direct (Portal)', value: 92, color: '#3b82f6' },
  { name: 'Walk-in', value: 53, color: '#10b981' },
  { name: 'OTA', value: 68, color: '#f59e0b' },
  { name: 'Phone', value: 29, color: '#8b5cf6' },
]

const total = data.reduce((sum, item) => sum + item.value, 0)

const conversionRates = [
  { source: 'Direct (Portal)', rate: '78.6%' },
  { source: 'Walk-in', rate: '72.0%' },
  { source: 'OTA', rate: '51.4%' },
  { source: 'Phone', rate: '48.0%' },
]

export default function BookingSourceChart() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Booking Source Report</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Booking rate conversion performance by channel</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{total}</div>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>This Week</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 140, height: 140, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Conversion</div>
            {conversionRates.map((item) => (
              <div key={item.source} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.source}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{item.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
