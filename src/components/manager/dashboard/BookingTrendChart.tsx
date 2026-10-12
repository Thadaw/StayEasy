import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', thisWeek: 18, lastWeek: 15 },
  { day: 'Tue', thisWeek: 22, lastWeek: 19 },
  { day: 'Wed', thisWeek: 19, lastWeek: 21 },
  { day: 'Thu', thisWeek: 25, lastWeek: 20 },
  { day: 'Fri', thisWeek: 30, lastWeek: 24 },
  { day: 'Sat', thisWeek: 35, lastWeek: 28 },
  { day: 'Sun', thisWeek: 28, lastWeek: 22 },
]

export default function BookingTrendChart() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Weekly Booking Trend</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>This Week vs Last Week</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>142</div>
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
            ↑ +18%
          </span>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="lastWeek"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLastWeek)"
              name="Last Week"
            />
            <Area
              type="monotone"
              dataKey="thisWeek"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorThisWeek)"
              name="This Week"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <div style={{ width: 10, height: 3, background: '#3b82f6', borderRadius: 2 }} />
          <span>This Week</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <div style={{ width: 10, height: 3, background: '#10b981', borderRadius: 2 }} />
          <span>Last Week</span>
        </div>
      </div>
    </div>
  )
}
