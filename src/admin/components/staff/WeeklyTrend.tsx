import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const trendData = [
  { day: 'MON', attendance: 82 },
  { day: 'TUE', attendance: 85 },
  { day: 'WED', attendance: 78 },
  { day: 'THU', attendance: 88 },
  { day: 'FRI', attendance: 92 },
  { day: 'SAT', attendance: 75 },
  { day: 'SUN', attendance: 60 },
]

export default function WeeklyTrend() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
          Weekly Attendance Trend
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#6B7280',
            padding: '4px 10px',
            background: '#F3F4F6',
            borderRadius: 6,
          }}
        >
          Last 7 Days
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            formatter={(value) => [`${value}%`, 'Attendance']}
          />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#attendanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
