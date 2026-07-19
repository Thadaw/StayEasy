import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import BookingStats from '../components/bookings/BookingStats'
import BookingFilters from '../components/bookings/BookingFilters'
import BookingTable from '../components/bookings/BookingTable'
import { allBookings, type Booking } from '../components/bookings/BookingTable'

export default function BookingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('All')
  const [roomType, setRoomType] = useState('All Rooms')
  const [dateFilter, setDateFilter] = useState('')
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [newBooking, setNewBooking] = useState({ guest: '', email: '', roomType: 'Standard Room', checkIn: '', checkOut: '', amount: '' })

  const handleCreateBooking = () => {
    if (!newBooking.guest || !newBooking.checkIn || !newBooking.checkOut) return
    const id = `BK-${String(Date.now()).slice(-6)}`
    const nights = Math.max(1, Math.ceil((new Date(newBooking.checkOut).getTime() - new Date(newBooking.checkIn).getTime()) / 86400000))
    const entry: Booking = {
      id,
      guest: newBooking.guest,
      email: newBooking.email || 'N/A',
      roomType: newBooking.roomType,
      roomNumber: String(Math.floor(Math.random() * 900) + 100),
      checkIn: new Date(newBooking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      checkOut: new Date(newBooking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nights,
      status: 'Pending',
      amount: newBooking.amount || `NPR ${(nights * 6000).toLocaleString()}`,
      paymentStatus: 'Pending',
    }
    allBookings.unshift(entry)
    setNewBooking({ guest: '', email: '', roomType: 'Standard Room', checkIn: '', checkOut: '', amount: '' })
    setShowNewBookingModal(false)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' as const }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Bookings" subtitle="Manage all reservations and bookings" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <BookingStats />
          <BookingFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            roomType={roomType}
            onRoomTypeChange={setRoomType}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onNewBooking={() => setShowNewBookingModal(true)}
          />
          <BookingTable
            searchQuery={searchQuery}
            activeStatus={activeStatus}
            roomType={roomType}
            dateFilter={dateFilter}
          />
        </main>
      </div>

      {showNewBookingModal && (
        <div onClick={() => setShowNewBookingModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 480, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>New Booking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Guest Name *</label>
                <input style={inputStyle} placeholder="Full name" value={newBooking.guest} onChange={(e) => setNewBooking({ ...newBooking, guest: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="guest@email.com" value={newBooking.email} onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Room Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={newBooking.roomType} onChange={(e) => setNewBooking({ ...newBooking, roomType: e.target.value })}>
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Suite Room</option>
                  <option>Presidential Suite</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Check-in *</label>
                  <input style={inputStyle} type="date" value={newBooking.checkIn} onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Check-out *</label>
                  <input style={inputStyle} type="date" value={newBooking.checkOut} onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Amount (optional)</label>
                <input style={inputStyle} placeholder="Auto-calculated if empty" value={newBooking.amount} onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowNewBookingModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleCreateBooking} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Create Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
