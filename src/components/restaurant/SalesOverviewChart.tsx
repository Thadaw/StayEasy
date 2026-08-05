import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { day: 'Mon', sales: 42000 },
  { day: 'Tue', sales: 58000 },
  { day: 'Wed', sales: 49000 },
  { day: 'Thu', sales: 63000 },
  { day: 'Fri', sales: 71000 },
  { day: 'Sat', sales: 89000 },
  { day: 'Sun', sales: 53000 },
]

export default function SalesOverviewChart() {
  const [period] = useState('This Week')

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Sales Overview</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--foreground)' }}>
          {period}
          <ChevronDown size={14} />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#999' }}
            tickFormatter={(v) => `${v / 1000}K`}
          />
          <Tooltip
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [`NPR ${Number(value ?? 0).toLocaleString()}`, 'Sales']}
            contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#7c3aed"
            strokeWidth={2.5}
            fill="url(#salesGradient)"
            dot={{ r: 4, fill: '#7c3aed', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#7c3aed', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Total Sales</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>NPR 425,200</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Total Orders</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>284</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Cancelled Orders</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--destructive)' }}>12</div>
        </div>
      </div>
    </div>
  )
}
