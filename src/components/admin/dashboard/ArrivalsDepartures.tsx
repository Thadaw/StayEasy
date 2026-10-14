import { useNavigate } from 'react-router-dom'

const arrivals = [
  { time: '02:00 PM', name: 'John Smith', room: 'Deluxe Room' },
  { time: '03:30 PM', name: 'Emily Johnson', room: 'Suite Room' },
  { time: '04:00 PM', name: 'Michael Brown', room: 'Standard Room' },
]

const departures = [
  { time: '10:00 AM', name: 'David Wilson', room: 'Deluxe Room' },
  { time: '11:00 AM', name: 'Sarah Taylor', room: 'Standard Room' },
  { time: '12:00 PM', name: 'Daniel Lee', room: 'Suite Room' },
]

export default function ArrivalsDepartures() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>Arrivals & Departures</h3>
        <button
          onClick={() => navigate('/host/bookings')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          View All
        </button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#6b7280',
          marginBottom: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          ARRIVALS ({arrivals.length})
        </div>
        {arrivals.map((a, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              padding: '8px 0',
              borderBottom: i < arrivals.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
            }} />
            <span style={{ width: 72, color: '#9ca3af', flexShrink: 0, fontSize: 12 }}>{a.time}</span>
            <span style={{ flex: 1, fontWeight: 600, color: '#111827' }}>{a.name}</span>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{a.room}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#6b7280',
          marginBottom: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          DEPARTURES ({departures.length})
        </div>
        {departures.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              padding: '8px 0',
              borderBottom: i < departures.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#f59e0b',
              flexShrink: 0,
            }} />
            <span style={{ width: 72, color: '#9ca3af', flexShrink: 0, fontSize: 12 }}>{d.time}</span>
            <span style={{ flex: 1, fontWeight: 600, color: '#111827' }}>{d.name}</span>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{d.room}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
