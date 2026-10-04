import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { BOOKING_SOURCES, TOTAL_BOOKINGS } from './demoReports'

export default function BookingSourceCard() {
  return (
    <div className="r-card">
      <div className="r-card-head">
        <div>
          <h3 className="r-card-title">Booking Source</h3>
          <p className="r-card-sub">Distribution by reservation channel</p>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={BOOKING_SOURCES}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={85}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {BOOKING_SOURCES.map((source) => (
                <Cell key={source.name} fill={source.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} bookings`, name]}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{TOTAL_BOOKINGS}</span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Bookings</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        {BOOKING_SOURCES.map((source) => (
          <div key={source.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: source.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{source.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{source.percent}%</span>
            <span style={{ fontSize: 12, color: '#9ca3af', width: 36, textAlign: 'right' }}>{source.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
