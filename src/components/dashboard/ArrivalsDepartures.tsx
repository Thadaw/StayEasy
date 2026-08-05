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
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Today's Arrivals & Departures</h3>
        <button onClick={() => navigate('/host/bookings')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View All</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 8 }}>ARRIVALS ({arrivals.length})</div>
        {arrivals.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-success)', flexShrink: 0 }} />
            <span style={{ width: 72, color: 'var(--muted-foreground)', flexShrink: 0 }}>{a.time}</span>
            <span style={{ flex: 1, fontWeight: 500 }}>{a.name}</span>
            <span style={{ color: 'var(--muted-foreground)' }}>{a.room}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 8 }}>DEPARTURES ({departures.length})</div>
        {departures.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-warning)', flexShrink: 0 }} />
            <span style={{ width: 72, color: 'var(--muted-foreground)', flexShrink: 0 }}>{d.time}</span>
            <span style={{ flex: 1, fontWeight: 500 }}>{d.name}</span>
            <span style={{ color: 'var(--muted-foreground)' }}>{d.room}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
