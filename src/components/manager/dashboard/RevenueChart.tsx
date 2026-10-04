import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', revenue: 6800 },
  { day: 'Tue', revenue: 8200 },
  { day: 'Wed', revenue: 7500 },
  { day: 'Thu', revenue: 9100 },
  { day: 'Fri', revenue: 12400 },
  { day: 'Sat', revenue: 15800 },
  { day: 'Sun', revenue: 11500 },
]

export default function RevenueChart() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Revenue Analytics</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Daily Revenue (Last 7 Days)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>$61,300</div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: '2px 8px',
            borderRadius: 6,
            background: '#dcfce7',
            color: '#16a34a',
            fontWeight: 600,
            fontSize: 12,
          }}>
            ↑ +8%
          </span>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <div style={{ width: 10, height: 10, background: '#10b981', borderRadius: 2 }} />
          <span>Actual Revenue</span>
        </div>
      </div>
    </div>
  )
}
