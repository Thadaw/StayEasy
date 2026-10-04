import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ROOM_TYPE_BARS } from './demoReports'

export default function RevenueByRoomTypeCard() {
  return (
    <div className="r-card">
      <div className="r-card-head">
        <div>
          <h3 className="r-card-title">Revenue by Room Type</h3>
          <p className="r-card-sub">Weekly performance comparison</p>
        </div>
        <span className="r-pill">Weekly</span>
      </div>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ROOM_TYPE_BARS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="room" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}K`} />
            <Tooltip
              formatter={(value) => [`NPR ${value}K`, 'Revenue']}
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={38} isAnimationActive={false}>
              {ROOM_TYPE_BARS.map((row) => (
                <Cell key={row.room} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
