import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const data = [
  { day: 'Mon', occupancy: 65 },
  { day: 'Tue', occupancy: 70 },
  { day: 'Wed', occupancy: 72 },
  { day: 'Thu', occupancy: 68 },
  { day: 'Fri', occupancy: 78 },
  { day: 'Sat', occupancy: 82 },
  { day: 'Sun', occupancy: 75 },
]

export default function OccupancyChart() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Room Occupancy Rate</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Occupancy % • Last 7 Days</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>75%</div>
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
            ↑ +2%
          </span>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target 80%', position: 'right', fontSize: 11, fill: '#ef4444' }} />
            <Line
              type="monotone"
              dataKey="occupancy"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Occupancy Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <div style={{ width: 10, height: 3, background: '#3b82f6', borderRadius: 2 }} />
          <span>Occupancy Rate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <div style={{ width: 10, height: 3, background: '#ef4444', borderRadius: 2, borderStyle: 'dashed' }} />
          <span>Target 80%</span>
        </div>
      </div>
    </div>
  )
}
