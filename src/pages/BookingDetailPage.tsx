import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, CalendarDays, BedDouble, Clock, Receipt } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { statusColors } from '../components/bookings/BookingTable'
import { getBookingByRefNumber } from '../services/pmsApi'
import { bookingKeys } from '../lib/queryKeys'
import { normalizeStatus, derivePaymentStatus, formatDate, formatAmount } from '../components/bookings/bookingUtils'

const paymentColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Refunded: { bg: '#ede9fe', text: '#7c3aed' },
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: bookingKeys.detail(id ?? ''),
    queryFn: () => getBookingByRefNumber(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Booking Details" subtitle="" />
          <main style={{ padding: 24, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>Loading booking...</p>
          </main>
        </div>
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Booking Not Found" subtitle="" />
          <main style={{ padding: 24, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No booking found with ID "{id}".</p>
            <button onClick={() => navigate('/host/bookings')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Back to Bookings
            </button>
          </main>
        </div>
      </div>
    )
  }

  const status = normalizeStatus(booking.status)
  const sc = statusColors[status] || { bg: '#f3f4f6', text: '#374151' }
  const paymentStatus = derivePaymentStatus(status)
  const pc = paymentColors[paymentStatus] || { bg: '#f3f4f6', text: '#374151' }
  const nights = booking.checkin_date && booking.checkout_date
    ? Math.max(1, Math.ceil((new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / 86400000))
    : 1

  const subtotal = Number(booking.subtotal) || 0
  const offerDiscount = Number(booking.special_offer_discount) || 0
  const couponDiscount = Number(booking.coupon_discount) || 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title={`Booking ${booking.booking_number}`} subtitle="Booking details" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <button onClick={() => navigate('/host/bookings')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Bookings
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Guest Information</h3>
                  <span style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>{status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Guest Name</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.guest_name || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Email</div>
                    <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} color="var(--muted-foreground)" />{booking.guest_email || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Reservation Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><BedDouble size={14} />Rooms</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{(booking.room_names || []).join(', ') || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><CalendarDays size={14} />Check-in</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(booking.checkin_date)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><CalendarDays size={14} />Check-out</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(booking.checkout_date)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} />Nights</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{nights}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}><Receipt size={16} /> Payment Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{formatAmount(subtotal)}</span>
                  </div>
                  {offerDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Special Offer Discount</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>-{formatAmount(offerDiscount)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Coupon{booking.coupon_code ? ` (${booking.coupon_code})` : ''}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>-{formatAmount(couponDiscount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Total Amount</span>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{formatAmount(booking.total_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Payment Status</span>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: pc.bg, color: pc.text }}>{paymentStatus}</span>
                  </div>
                  {booking.payment_gateway && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Payment Gateway</span>
                      <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{booking.payment_gateway}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
