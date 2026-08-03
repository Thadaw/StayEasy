import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { RecentBooking } from '../../types/reports'

interface RecentBookingsProps {
  bookings: RecentBooking[]
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#D1FAE5', text: '#065F46' },
  'Checked In': { bg: '#DBEAFE', text: '#1E40AF' },
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  'Checked Out': { bg: '#F3F4F6', text: '#6B7280' },
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        flex: '1 1 0',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Bookings</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['BOOKING ID', 'GUEST', 'CHECK-IN', 'AMOUNT', 'STATUS'].map(col => (
              <th
                key={col}
                style={{
                  padding: '12px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => {
            const sc = statusColors[booking.status] || { bg: '#F3F4F6', text: '#374151' }
            return (
              <tr key={booking.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                  {booking.bookingId}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#111827' }}>
                  {booking.guest}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>
                  {booking.checkIn}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  NPR {booking.amount.toLocaleString()}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: sc.bg,
                      color: sc.text,
                    }}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
        <button
          onClick={() => navigate('/host/bookings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View all bookings
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
