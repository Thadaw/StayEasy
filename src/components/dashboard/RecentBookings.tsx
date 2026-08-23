import { useNavigate } from 'react-router-dom'
import type { PropertyBooking } from '../../types/pms'

const fallbackBookings = [
  { id: 'BK-250601', guest_name: 'John Smith', room_names: ['Deluxe Room'], checkin_date: '2026-06-01', checkout_date: '2026-06-04', status: 'CONFIRMED', total_amount: '18000' },
  { id: 'BK-250602', guest_name: 'Emily Johnson', room_names: ['Suite Room'], checkin_date: '2026-06-01', checkout_date: '2026-06-03', status: 'CONFIRMED', total_amount: '24000' },
  { id: 'BK-250603', guest_name: 'Michael Brown', room_names: ['Standard Room'], checkin_date: '2026-06-01', checkout_date: '2026-06-02', status: 'PENDING', total_amount: '9000' },
  { id: 'BK-250604', guest_name: 'Sarah Taylor', room_names: ['Deluxe Room'], checkin_date: '2026-06-02', checkout_date: '2026-06-05', status: 'CONFIRMED', total_amount: '21000' },
  { id: 'BK-250605', guest_name: 'David Wilson', room_names: ['Suite Room'], checkin_date: '2026-06-02', checkout_date: '2026-06-04', status: 'CONFIRMED', total_amount: '22500' },
]

const statusColors: Record<string, { bg: string; text: string }> = {
  CONFIRMED: { bg: '#dcfce7', text: '#16a34a' },
  PENDING: { bg: '#fef3c7', text: '#d97706' },
  CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
  CHECKED_IN: { bg: '#dbeafe', text: '#2563eb' },
  COMPLETED: { bg: '#dcfce7', text: '#16a34a' },
}

interface RecentBookingsProps {
  bookings?: PropertyBooking[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function RecentBookings({ bookings: propBookings }: RecentBookingsProps = {}) {
  const navigate = useNavigate()
  const displayBookings = (propBookings && propBookings.length > 0 ? propBookings : fallbackBookings) as any[]

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>Recent Bookings</h3>
        <button
          onClick={() => navigate('/host/bookings')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          View All
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            {['BOOKING ID', 'GUEST', 'ROOM', 'DATES', 'STATUS', 'AMOUNT'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 10px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayBookings.map((b: any) => {
            const status = (b.status || 'PENDING').toUpperCase()
            const label = status.replace('_', ' ')
            return (
              <tr
                key={b.id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/host/bookings/${b.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 10px', color: '#2563eb', fontWeight: 600 }}>{b.booking_number || b.id?.slice(0, 8)}</td>
                <td style={{ padding: '14px 10px', fontWeight: 600, color: '#111827' }}>{b.guest_name}</td>
                <td style={{ padding: '14px 10px', color: '#6b7280' }}>{Array.isArray(b.room_names) ? b.room_names[0] : b.room_names || '-'}</td>
                <td style={{ padding: '14px 10px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatDate(b.checkin_date)} – {formatDate(b.checkout_date)}
                </td>
                <td style={{ padding: '14px 10px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    background: statusColors[status]?.bg || '#f3f4f6',
                    color: statusColors[status]?.text || '#6b7280',
                  }}>
                    {label}
                  </span>
                </td>
                <td style={{ padding: '14px 10px', fontWeight: 600, color: '#111827' }}>NPR {Number(b.total_amount).toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
