import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Occupied Rooms', value: 62, color: 'var(--chart-1)' },
  { name: 'Available Rooms', value: 20, color: 'var(--status-success)' },
  { name: 'Maintenance', value: 3, color: 'var(--status-warning)' },
  { name: 'Out of Order', value: 1, color: 'var(--destructive)' },
]

export default function OccupancyChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Occupancy Overview</h3>
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', cursor: 'pointer' }}>Today ▾</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>72.4%</div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Occupied</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {data.map((d) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                {d.name}
              </span>
              <span style={{ fontWeight: 600 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
