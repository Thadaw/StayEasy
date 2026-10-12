import { useNavigate } from 'react-router-dom'

const reservations = [
  {
    bookingId: 'BK-2024-001',
    guestName: 'Aarav Sharma',
    room: '501',
    checkIn: 'Apr 28, 2025',
    checkOut: 'Apr 30, 2025',
    status: 'Checked In',
    statusColor: '#8b5cf6',
    statusBg: '#ede9fe',
  },
  {
    bookingId: 'BK-2024-002',
    guestName: 'Emily Watson',
    room: '502',
    checkIn: 'Apr 28, 2025',
    checkOut: 'May 01, 2025',
    status: 'Checked In',
    statusColor: '#10b981',
    statusBg: '#dcfce7',
  },
  {
    bookingId: 'BK-2024-004',
    guestName: 'Sakura Tanaka',
    room: '504',
    checkIn: 'Apr 29, 2025',
    checkOut: 'May 02, 2025',
    status: 'Confirmed',
    statusColor: '#3b82f6',
    statusBg: '#dbeafe',
  },
  {
    bookingId: 'BK-2024-005',
    guestName: 'Priya Gurung',
    room: '505',
    checkIn: 'Apr 30, 2025',
    checkOut: 'May 01, 2025',
    status: 'Pending',
    statusColor: '#f59e0b',
    statusBg: '#fef3c7',
  },
]

export default function UpcomingReservations() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
      flex: 2,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Upcoming Reservations</h3>
        <button
          onClick={() => navigate('/manager/bookings')}
          style={{
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Booking ID</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Guest Name</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Room</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Check-in</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Check-out</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.bookingId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{reservation.bookingId}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#374151' }}>{reservation.guestName}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#374151' }}>{reservation.room}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#374151' }}>{reservation.checkIn}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#374151' }}>{reservation.checkOut}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    background: reservation.statusBg,
                    color: reservation.statusColor,
                  }}>
                    {reservation.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => navigate(`/manager/bookings/${reservation.bookingId}`)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
