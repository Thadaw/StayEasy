import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import BookingStats from '../components/bookings/BookingStats'
import BookingFilters from '../components/bookings/BookingFilters'
import BookingTable from '../components/bookings/BookingTable'

export default function BookingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('All')
  const [roomType, setRoomType] = useState('All Rooms')

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
          />
          <BookingTable
            searchQuery={searchQuery}
            activeStatus={activeStatus}
            roomType={roomType}
          />
        </main>
      </div>
    </div>
  )
}
