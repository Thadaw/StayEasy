import { useState, useMemo } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import HousekeepingStats from '../components/housekeeping/HousekeepingStats'
import HousekeepingFilters from '../components/housekeeping/HousekeepingFilters'
import HousekeepingTabs from '../components/housekeeping/HousekeepingTabs'
import HousekeepingTable from '../components/housekeeping/HousekeepingTable'
import HousekeepingPagination from '../components/housekeeping/HousekeepingPagination'
import type { HousekeepingRoom } from '../types/housekeeping'

const MOCK_ROOMS: HousekeepingRoom[] = [
  { id: 1, roomNumber: '101', roomType: 'Deluxe Room', bedDescription: '1 King Bed', floor: '1st Floor', status: 'Clean', assignedTo: 'Sunita Shrestha', lastCleaned: 'May 30, 2026\n10:30 AM', nextCleaning: 'Jun 1, 2026\n10:00 AM' },
  { id: 2, roomNumber: '102', roomType: 'Suite Room', bedDescription: '1 King Bed', floor: '1st Floor', status: 'Dirty', assignedTo: 'Kiran Gurung', lastCleaned: 'May 30, 2026\n09:15 AM', nextCleaning: null },
  { id: 3, roomNumber: '103', roomType: 'Standard Room', bedDescription: '2 Single Beds', floor: '1st Floor', status: 'In Progress', assignedTo: 'Anita Lama', lastCleaned: null, nextCleaning: 'May 31, 2026\n02:00 PM' },
  { id: 4, roomNumber: '104', roomType: 'Deluxe Room', bedDescription: '1 King Bed', floor: '1st Floor', status: 'Dirty', assignedTo: 'Bikash Magar', lastCleaned: 'May 29, 2026\n11:00 AM', nextCleaning: 'May 31, 2026\n10:00 AM' },
  { id: 5, roomNumber: '201', roomType: 'Suite Room', bedDescription: '1 King Bed', floor: '2nd Floor', status: 'Clean', assignedTo: 'Pooja Adhikari', lastCleaned: 'May 30, 2026\n12:10 PM', nextCleaning: 'Jun 1, 2026\n12:00 PM' },
  { id: 6, roomNumber: '202', roomType: 'Standard Room', bedDescription: '2 Single Beds', floor: '2nd Floor', status: 'Out of Service', assignedTo: null, lastCleaned: null, nextCleaning: null },
  { id: 7, roomNumber: '203', roomType: 'Family Room', bedDescription: '1 King + 1 Single Bed', floor: '2nd Floor', status: 'Clean', assignedTo: 'Sunita Shrestha', lastCleaned: 'May 30, 2026\n09:45 AM', nextCleaning: 'Jun 1, 2026\n09:00 AM' },
  { id: 8, roomNumber: '204', roomType: 'Deluxe Room', bedDescription: '1 King Bed', floor: '2nd Floor', status: 'In Progress', assignedTo: 'Kiran Gurung', lastCleaned: null, nextCleaning: 'May 31, 2026\n04:00 PM' },
]

export default function HousekeepingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [activeTab, setActiveTab] = useState('Room Status')
  const [activeFloor, setActiveFloor] = useState('All Floors')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter(room => {
      const matchesSearch =
        !search ||
        room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
        room.roomType.toLowerCase().includes(search.toLowerCase())
      const matchesFloor = !floorFilter || room.floor === floorFilter
      const matchesStatus = !statusFilter || room.status === statusFilter
      const matchesRoomType = !roomTypeFilter || room.roomType === roomTypeFilter
      const matchesFloorTab = activeFloor === 'All Floors' || room.floor === activeFloor
      return matchesSearch && matchesFloor && matchesStatus && matchesRoomType && matchesFloorTab
    })
  }, [search, floorFilter, statusFilter, roomTypeFilter, activeFloor])

  const stats = useMemo(() => {
    const total = MOCK_ROOMS.length
    const clean = MOCK_ROOMS.filter(r => r.status === 'Clean').length
    const dirty = MOCK_ROOMS.filter(r => r.status === 'Dirty').length
    const inProgress = MOCK_ROOMS.filter(r => r.status === 'In Progress').length
    const outOfService = MOCK_ROOMS.filter(r => r.status === 'Out of Service').length
    return { total, clean, dirty, inProgress, outOfService }
  }, [])

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage)
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Housekeeping" subtitle="Manage room cleaning status, tasks and housekeeping activities" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <HousekeepingStats stats={stats} />

          <HousekeepingFilters
            search={search}
            onSearchChange={setSearch}
            floor={floorFilter}
            onFloorChange={setFloorFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            roomType={roomTypeFilter}
            onRoomTypeChange={setRoomTypeFilter}
            date={dateFilter}
            onDateChange={setDateFilter}
            onAddTask={() => {}}
          />

          <HousekeepingTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeFloor={activeFloor}
            onFloorChange={setActiveFloor}
          />

          <HousekeepingTable rooms={paginatedRooms} />

          <HousekeepingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRooms.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(count) => {
              setItemsPerPage(count)
              setCurrentPage(1)
            }}
          />
        </main>
      </div>
    </div>
  )
}
