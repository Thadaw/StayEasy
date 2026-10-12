import { Loader2 } from 'lucide-react'
import { normalizeStatus, derivePaymentStatus, formatDate, formatAmount } from './bookingUtils'
import { statusColors } from './BookingTable'
import type { PropertyBooking } from '@/types/pms'

const paymentColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Refunded: { bg: '#ede9fe', text: '#7c3aed' },
}

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.ceil(diff / 86400000))
}

const labelStyle = { fontSize: 11, fontWeight: 600 as const, color: 'var(--muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 }
const valueStyle = { fontSize: 14, fontWeight: 500 as const, color: 'var(--foreground)' }
const sectionStyle = { background: 'var(--muted)', borderRadius: 10, padding: 16 }

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span style={labelStyle}>{label}</span>
      <span style={{ ...valueStyle, wordBreak: 'break-word' }}>{value || '–'}</span>
    </div>
  )
}

interface BookingDetailModalProps {
  booking: PropertyBooking | null
  loading?: boolean
  onClose: () => void
}

export default function BookingDetailModal({ booking, loading = false, onClose }: BookingDetailModalProps) {
  const status = booking ? normalizeStatus(booking.status) : ''
  const paymentStatus = booking ? derivePaymentStatus(booking.status, booking.payment_status) : ''

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, width: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Booking details</h3>
          <button onClick={onClose} aria-label="Close" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--muted-foreground)' }}>
            ✕
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading || !booking ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px 0' }}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Loading booking...</span>
                </>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Booking not found.</span>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', margin: 0 }}>{booking.booking_number || booking.id}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: statusColors[status]?.bg, color: statusColors[status]?.text }}>
                    {status}
                  </span>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: paymentColors[paymentStatus]?.bg, color: paymentColors[paymentStatus]?.text }}>
                    {paymentStatus}
                  </span>
                </div>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>Guest</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InfoRow label="Name" value={booking.guest_name} />
                  <InfoRow label="Email" value={booking.guest_email} />
                  <InfoRow label="Phone" value={booking.guest_phone} />
                  <InfoRow label="Nationality" value={booking.guest_nationality} />
                </div>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>Stay</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InfoRow label="Check-in" value={formatDate(booking.checkin_date)} />
                  <InfoRow label="Check-out" value={formatDate(booking.checkout_date)} />
                  <InfoRow label="Nights" value={nightsBetween(booking.checkin_date, booking.checkout_date)} />
                  <InfoRow label="Rooms" value={(booking.room_names || []).join(', ')} />
                </div>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px' }}>Payment</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InfoRow label="Total" value={<strong>{formatAmount(booking.total_amount)}</strong>} />
                  <InfoRow label="Subtotal" value={formatAmount(booking.subtotal)} />
                  <InfoRow label="Gateway" value={(booking.payment_gateway || '').toUpperCase()} />
                  <InfoRow label="Booked on" value={formatDate(booking.created_at)} />
                </div>
                {booking.coupon_code && (
                  <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: 8, background: '#fff', fontSize: 12, border: '1px solid var(--border)' }}>
                    Coupon <strong>{booking.coupon_code}</strong> — discount {formatAmount(booking.coupon_discount)}
                  </div>
                )}
                {booking.special_offer_discount && (
                  <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: '#fff', fontSize: 12, border: '1px solid var(--border)' }}>
                    Special offer discount: {formatAmount(booking.special_offer_discount)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
