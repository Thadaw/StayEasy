import { useNavigate } from 'react-router-dom'

const bookings = [
  { id: 'BK-250601', guest: 'John Smith', room: 'Deluxe Room', dates: 'Jun 1 – Jun 4, 2026', status: 'Confirmed', amount: 'NPR 18,000' },
  { id: 'BK-250602', guest: 'Emily Johnson', room: 'Suite Room', dates: 'Jun 1 – Jun 3, 2026', status: 'Confirmed', amount: 'NPR 24,000' },
  { id: 'BK-250603', guest: 'Michael Brown', room: 'Standard Room', dates: 'Jun 1 – Jun 2, 2026', status: 'Pending', amount: 'NPR 9,000' },
  { id: 'BK-250604', guest: 'Sarah Taylor', room: 'Deluxe Room', dates: 'Jun 2 – Jun 5, 2026', status: 'Confirmed', amount: 'NPR 21,000' },
  { id: 'BK-250605', guest: 'David Wilson', room: 'Suite Room', dates: 'Jun 2 – Jun 4, 2026', status: 'Confirmed', amount: 'NPR 22,500' },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Cancelled: { bg: '#fee2e2', text: '#dc2626' },
}

export default function RecentBookings() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Recent Bookings</h3>
        <button onClick={() => navigate('/host/bookings')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View All</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['BOOKING ID', 'GUEST', 'ROOM', 'DATES', 'STATUS', 'AMOUNT'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--muted-foreground)', fontWeight: 600, fontSize: 11 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate(`/host/bookings/${b.id}`)}>
              <td style={{ padding: '10px 6px', color: 'var(--primary)', fontWeight: 500 }}>{b.id}</td>
              <td style={{ padding: '10px 6px', fontWeight: 500 }}>{b.guest}</td>
              <td style={{ padding: '10px 6px' }}>{b.room}</td>
              <td style={{ padding: '10px 6px', whiteSpace: 'nowrap' }}>{b.dates}</td>
              <td style={{ padding: '10px 6px' }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: statusColors[b.status]?.bg, color: statusColors[b.status]?.text }}>
                  {b.status}
                </span>
              </td>
              <td style={{ padding: '10px 6px' }}>{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
