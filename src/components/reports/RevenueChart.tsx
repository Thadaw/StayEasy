import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RevenueDataPoint } from '../../types/reports'

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [period, setPeriod] = useState('Daily')

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: '20px',
        flex: '1 1 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Revenue Overview</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, borderRadius: 2, background: 'var(--primary)' }} />
            <span style={{ fontSize: 12, color: '#6B7280' }}>Total Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, borderRadius: 2, background: '#60A5FA', borderStyle: 'dashed' }} />
            <span style={{ fontSize: 12, color: '#6B7280' }}>Room Revenue</span>
          </div>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '4px 24px 4px 8px',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              color: '#374151',
              background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E") no-repeat right 6px center',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `NPR ${v / 1000}K`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontSize: 12,
            }}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [`NPR ${Number(value ?? 0).toLocaleString()}`, '']}
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            name="Total Revenue"
          />
          <Line
            type="monotone"
            dataKey="roomRevenue"
            stroke="#60A5FA"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Room Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
