import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const orderTypes = [
  { name: 'Dine In', value: 128, pct: 45, color: '#7c3aed' },
  { name: 'Takeaway', value: 76, pct: 27, color: '#22c55e' },
  { name: 'Delivery', value: 54, pct: 19, color: '#f59e0b' },
  { name: 'Walk-in', value: 26, pct: 9, color: '#3b82f6' },
]

export default function OrdersByTypeChart() {
  const [period] = useState('This Week')

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Orders by Type</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--foreground)' }}>
          {period}
          <ChevronDown size={14} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderTypes}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {orderTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>284</div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Total Orders</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orderTypes.map((t) => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{t.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t.value}</span>
                <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>({t.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
