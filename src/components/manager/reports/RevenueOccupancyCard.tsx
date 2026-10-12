import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { REVENUE_OCCUPANCY } from './demoReports'

export default function RevenueOccupancyCard() {
  return (
    <div className="r-card">
      <div className="r-card-head">
        <div>
          <h3 className="r-card-title">Revenue &amp; Occupancy Trend</h3>
          <p className="r-card-sub">Daily revenue (NPR) vs occupancy rate (%)</p>
        </div>
        <span className="r-pill">Last 7 Days</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#1f2937' }} />
          Revenue (NPR)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
          Occupancy Rate (%)
        </span>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={REVENUE_OCCUPANCY} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}K`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue' ? [`NPR ${value}K`, 'Revenue'] : [`${value}%`, 'Occupancy']
              }
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={26} isAnimationActive={false} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="occupancy"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2563eb' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
