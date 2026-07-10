import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import RoomStats from '../components/rooms/RoomStats'
import RoomFilters from '../components/rooms/RoomFilters'
import RoomTable from '../components/rooms/RoomTable'

export default function RoomsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('All Types')
  const [status, setStatus] = useState('All Status')
  const [floor, setFloor] = useState('All Floors')

  const handleClear = () => {
    setSearchQuery('')
    setRoomType('All Types')
    setStatus('All Status')
    setFloor('All Floors')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Rooms" subtitle="Manage all rooms and their status." />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <RoomStats />
          <RoomFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roomType={roomType}
            onRoomTypeChange={setRoomType}
            status={status}
            onStatusChange={setStatus}
            floor={floor}
            onFloorChange={setFloor}
            onClear={handleClear}
          />
          <RoomTable
            searchQuery={searchQuery}
            roomType={roomType}
            status={status}
            floor={floor}
          />
        </main>
      </div>
    </div>
  )
}
