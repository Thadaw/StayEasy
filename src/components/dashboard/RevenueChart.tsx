import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Jun 1', thisMonth: 45000, lastMonth: 38000 },
  { day: 'Jun 6', thisMonth: 82000, lastMonth: 71000 },
  { day: 'Jun 11', thisMonth: 125000, lastMonth: 95000 },
  { day: 'Jun 16', thisMonth: 98000, lastMonth: 110000 },
  { day: 'Jun 21', thisMonth: 155000, lastMonth: 120000 },
  { day: 'Jun 26', thisMonth: 110000, lastMonth: 90000 },
  { day: 'Jun 30', thisMonth: 180000, lastMonth: 140000 },
]

export default function RevenueChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Revenue Overview</h3>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted-foreground)' }}>
            <span style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--primary)', display: 'inline-block' }} /> This Month
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted-foreground)' }}>
            <span style={{ width: 10, height: 0, borderBottom: '2px dashed #ccc', display: 'inline-block' }} /> Last Month
          </span>
          <span style={{ padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>This Month ▾</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#ddd" />
          <YAxis tick={{ fontSize: 11 }} stroke="#ddd" tickFormatter={(v) => `${v/1000}K`} />
          <Tooltip formatter={(value: string | number | readonly (string | number)[] | undefined) => `NPR ${Number(value ?? 0).toLocaleString()}`} />
          <Line type="monotone" dataKey="thisMonth" stroke="var(--primary)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lastMonth" stroke="#ddd" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
