import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, CalendarDays, BedDouble, CreditCard, Clock } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { allBookings, statusColors, type Booking } from '../components/bookings/BookingTable'

const paymentColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef3c7', text: '#d97706' },
  Refunded: { bg: '#ede9fe', text: '#7c3aed' },
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(allBookings)

  const booking = bookings.find((b) => b.id === id)

  const updateStatus = (newStatus: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
  }

  if (!booking) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
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

  const sc = statusColors[booking.status] || { bg: '#f3f4f6', text: '#374151' }
  const pc = paymentColors[booking.paymentStatus] || { bg: '#f3f4f6', text: '#374151' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title={`Booking ${booking.id}`} subtitle="Booking details" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <button onClick={() => navigate('/host/bookings')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Bookings
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Guest Information</h3>
                  <span style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>{booking.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Guest Name</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.guest}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Email</div>
                    <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} color="var(--muted-foreground)" />{booking.email}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Reservation Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><BedDouble size={14} />Room Type</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.roomType}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Room {booking.roomNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><CalendarDays size={14} />Check-in</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.checkIn}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><CalendarDays size={14} />Check-out</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.checkOut}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} />Nights</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{booking.nights}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Payment Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Total Amount</span>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{booking.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Payment Status</span>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: pc.bg, color: pc.text }}>{booking.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {booking.status === 'Pending' && (
                    <button onClick={() => updateStatus('Confirmed')} style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Confirm Booking
                    </button>
                  )}
                  {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                    <button onClick={() => updateStatus('Checked-in')} style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Check In
                    </button>
                  )}
                  {booking.status === 'Checked-in' && (
                    <button onClick={() => updateStatus('Checked-out')} style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Check Out
                    </button>
                  )}
                  {booking.status !== 'Cancelled' && booking.status !== 'Checked-out' && (
                    <button onClick={() => updateStatus('Cancelled')} style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #dc2626', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'Checked-out' && (
                    <div style={{ padding: '12px', borderRadius: 8, background: 'var(--muted)', fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center' }}>
                      This booking has been completed.
                    </div>
                  )}
                  {booking.status === 'Cancelled' && (
                    <div style={{ padding: '12px', borderRadius: 8, background: '#fee2e2', fontSize: 13, color: '#dc2626', textAlign: 'center' }}>
                      This booking has been cancelled.
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
