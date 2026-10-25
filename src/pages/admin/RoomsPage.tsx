import { useMemo } from 'react'
import { useUIStore } from '@/store/ui/uiStore'
import { usePropertyStore } from '@/store/properties/propertyStore'
import { useAdminRoomStore } from '@/store/admin/roomStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import RoomStats from '@/components/admin/rooms/RoomStats'
import RoomFilters from '@/components/admin/rooms/RoomFilters'
import RoomTable, { type Room } from '@/components/admin/rooms/RoomTable'
import RoomFormModal from '@/components/admin/rooms/RoomFormModal'
import {
  useAdminPropertiesQuery,
  useAdminRoomsQuery,
  useAdminRoomTypesQuery,
  useAdminBedTypesQuery,
} from '@/services/queries/admin/roomQueries'
import { useDeleteAdminRoom, useCreateAdminRoom, useUpdateAdminRoom } from '@/services/mutations/admin/roomMutations'
import type { RoomFormData } from '@/schemas/admin/roomSchema'
import type { RoomBase, RoomResponse, RoomTypeResponse, BedTypeResponse } from '@/types/pms'

function mapApiRoomToRoom(apiRoom: RoomResponse, roomTypes: RoomTypeResponse[], bedTypes: BedTypeResponse[]): Room {
  const roomType = roomTypes.find(rt => rt.id === apiRoom.room_type_id)
  const bedType = bedTypes.find(bt => bt.id === apiRoom.bed_type_id)
  const statusMap: Record<string, string> = {
    AVAILABLE: 'Available', OCCUPIED: 'Occupied', BOOKED: 'Occupied',
    CLEANING: 'Cleaning', DIRTY: 'Cleaning', MAINTENANCE: 'Maintenance',
    OUT_OF_ORDER: 'Out of Order', OUT_OF_SERVICE: 'Out of Order',
  }
  return {
    number: apiRoom.room_name || '–',
    type: roomType?.room_type_name || 'Room',
    bedInfo: bedType?.bed_name || '1 Bed',
    floor: apiRoom.floor_number ? `${apiRoom.floor_number}${(() => { const n = apiRoom.floor_number, m = n % 100; return m >= 11 && m <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th' })()} Floor` : '1st Floor',
    status: statusMap[apiRoom.status || ''] || apiRoom.status || 'Available',
    capacity: (apiRoom.max_adults || 2) + (apiRoom.max_children || 0),
    price: `NPR ${(Number(apiRoom.base_rate) || 0).toLocaleString()}`,
    features: (apiRoom.system_amenity_ids || []).map(() => 'wifi').slice(0, 3),
    image: apiRoom.photos?.cover || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=140&fit=crop',
  }
}

function mapFormToRoomBase(data: RoomFormData, roomTypes: RoomTypeResponse[], bedTypes: BedTypeResponse[]): RoomBase {
  const statusMap: Record<string, string> = {
    'Available': 'AVAILABLE',
    'Occupied': 'OCCUPIED',
    'Cleaning': 'CLEANING',
    'Maintenance': 'MAINTENANCE',
    'Out of Order': 'OUT_OF_ORDER',
  }
  const roomTypeId = roomTypes.find(rt => rt.room_type_name === data.type)?.id ?? roomTypes[0]?.id ?? ''
  const bedTypeId = bedTypes.find(bt => bt.bed_name === data.bedInfo)?.id ?? bedTypes[0]?.id ?? ''
  return {
    room_name: data.number,
    room_type_id: roomTypeId,
    bed_type_id: bedTypeId,
    floor_number: Number(data.floor.replace(/\D/g, '')) || 1,
    max_adults: data.capacity,
    max_children: 0,
    base_rate: Number(data.price.replace(/[^0-9.]/g, '')) || 0,
    status: statusMap[data.status] ?? data.status,
  }
}

export default function RoomsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const {
    searchQuery,
    roomType,
    status,
    floor,
    showModal,
    editingRoom,
    confirmDelete,
    statusOverrides,
    setSearchQuery,
    setRoomType,
    setStatus,
    setFloor,
    openAddRoom,
    openEditRoom,
    closeModal,
    setConfirmDelete,
    setRoomStatus,
    clearFilters,
  } = useAdminRoomStore()

  const { data: properties = [] } = useAdminPropertiesQuery()

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const propertyId = property?.id

  const { data: roomTypes = [] } = useAdminRoomTypesQuery(propertyId)
  const { data: bedTypes = [] } = useAdminBedTypesQuery(propertyId)

  const { data: apiRooms = [], isLoading: loading } = useAdminRoomsQuery(propertyId)

  const rooms: Room[] = useMemo(
    () => apiRooms.map(r => {
      const mapped = mapApiRoomToRoom(r, roomTypes, bedTypes)
      return statusOverrides[mapped.number] ? { ...mapped, status: statusOverrides[mapped.number] } : mapped
    }),
    [apiRooms, roomTypes, bedTypes, statusOverrides],
  )

  const { deleteRoom } = useDeleteAdminRoom(propertyId)
  const { createRoom, isCreating } = useCreateAdminRoom(propertyId)
  const { updateRoom, isUpdating } = useUpdateAdminRoom(propertyId)

  const handleSave = async (data: RoomFormData) => {
    try {
      const base = mapFormToRoomBase(data, roomTypes, bedTypes)
      if (editingRoom) {
        const apiRoom = apiRooms.find(r => r.room_name === editingRoom.number)
        if (!apiRoom) {
          alert('Could not find the room to update.')
          return
        }
        await updateRoom(apiRoom.id, base)
      } else {
        await createRoom(base)
      }
      closeModal()
    } catch (error) {
      alert(`Failed to save room: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDelete = (room: Room) => {
    setConfirmDelete(room)
  }

  const confirmDeleteRoom = () => {
    if (confirmDelete && property) {
      const apiRoom = apiRooms.find(r => r.room_name === confirmDelete.number)
      if (apiRoom) {
        deleteRoom(apiRoom.id)
      }
      setConfirmDelete(null)
    }
  }

  const handleChangeStatus = (room: Room, newStatus: string) => {
    setRoomStatus(room.number, newStatus)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, color: '#6B7280' }}>Loading rooms...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Rooms" subtitle={property ? `${property.name} — ${rooms.length} rooms` : 'Manage all rooms and their status.'} />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <RoomStats rooms={apiRooms} totalRooms={property?.total_rooms || 0} />
          <RoomFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roomType={roomType}
            onRoomTypeChange={setRoomType}
            status={status}
            onStatusChange={setStatus}
            floor={floor}
            onFloorChange={setFloor}
            onClear={clearFilters}
            onAddRoom={openAddRoom}
          />
          <RoomTable
            searchQuery={searchQuery}
            roomType={roomType}
            status={status}
            floor={floor}
            rooms={rooms}
            onEditRoom={openEditRoom}
            onDeleteRoom={handleDelete}
            onChangeStatus={handleChangeStatus}
          />
        </main>
      </div>

      {showModal && (
        <RoomFormModal
          editingRoom={editingRoom}
          roomTypes={roomTypes}
          bedTypes={bedTypes}
          submitting={isCreating || isUpdating}
          onClose={closeModal}
          onSubmit={handleSave}
        />
      )}

      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Delete Room</h3>
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.5 }}>Are you sure you want to delete room <strong>{confirmDelete.number}</strong> ({confirmDelete.type})? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={confirmDeleteRoom} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
