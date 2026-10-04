import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RevenueTrendData } from '../../types/reports'

interface RevenueChartProps {
  data: RevenueTrendData[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [period, setPeriod] = useState('Last 7 Days')

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E2E8F0',
        padding: '20px 20px 12px',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Revenue Trend</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E86AB' }} />
            <span style={{ fontSize: 11, color: '#64748B' }}>Revenue (USD)</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '6px 28px 6px 10px',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              color: '#334155',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '10px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
            }}
          >
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E86AB" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2E86AB" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontSize: 12,
              color: '#334155',
            }}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [`$${Number(value ?? 0).toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2E86AB"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={{ r: 3, fill: '#2E86AB', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#2E86AB', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
