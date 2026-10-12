import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface OccupancyChartProps {
  occupied?: number
  available?: number
  maintenance?: number
  outOfOrder?: number
}

export default function OccupancyChart({
  occupied = 62,
  available = 20,
  maintenance = 3,
  outOfOrder = 1,
}: OccupancyChartProps) {
  const data = [
    { name: 'Occupied Rooms', value: occupied, color: '#2563eb' },
    { name: 'Available Rooms', value: available, color: '#22c55e' },
    { name: 'Maintenance', value: maintenance, color: '#f59e0b' },
    { name: 'Out of Order', value: outOfOrder, color: '#ef4444' },
  ]

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const occupiedPct = total > 0 ? Math.round((occupied / total) * 100) : 0

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>Occupancy</h3>
        <span style={{ fontSize: 12, color: '#6b7280', cursor: 'pointer' }}>Today ▾</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{occupiedPct}%</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Occupied</div>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          {data.map((d) => (
            <div key={d.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: d.name !== data[data.length - 1].name ? '1px solid #f3f4f6' : 'none',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: d.color,
                  display: 'inline-block',
                }} />
                {d.name}
              </span>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
