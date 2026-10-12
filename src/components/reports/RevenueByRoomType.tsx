import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { RoomTypeRevenue } from '../../types/reports'

interface RevenueByRoomTypeProps {
  data: RoomTypeRevenue[]
}

const BAR_COLORS = ['#1A3C5E', '#2E86AB', '#3BA0CA', '#6BC0D8', '#A8D8EA']

export default function RevenueByRoomType({ data }: RevenueByRoomTypeProps) {
  const [period, setPeriod] = useState('This Month')

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
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Revenue by Room Type</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A3C5E' }} />
            <span style={{ fontSize: 11, color: '#64748B' }}>Revenue (USD)</span>
          </div>
        </div>
        <div>
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
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="roomType"
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
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
          />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
