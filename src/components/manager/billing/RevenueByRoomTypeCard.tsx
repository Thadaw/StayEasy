import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { ROOM_TYPE_REVENUE } from './demoBilling'

export default function RevenueByRoomTypeCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
        Revenue by Room Type
      </h3>

      <div style={{ height: 170 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ROOM_TYPE_REVENUE} margin={{ top: 18, right: 4, left: 4, bottom: 0 }} barCategoryGap="32%">
            <XAxis
              dataKey="room"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 200]} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              formatter={(value) => [`NPR ${value}K`, 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false}>
              {ROOM_TYPE_REVENUE.map((entry) => (
                <Cell key={entry.room} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="revenue"
                position="top"
                fill="#6b7280"
                fontSize={10}
                fontWeight={600}
                formatter={(value) => `NPR\u00A0${value}K`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
