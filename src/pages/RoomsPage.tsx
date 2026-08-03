import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import RoomStats from '../components/rooms/RoomStats'
import RoomFilters from '../components/rooms/RoomFilters'
import RoomTable, { type Room } from '../components/rooms/RoomTable'
import { getAllProperties, getRooms, getRoomTypes, getBedTypes, deleteRoom } from '../services/pmsApi'
import { propertyKeys, roomKeys, roomTypeKeys, bedTypeKeys } from '../lib/queryKeys'
import type { RoomResponse, RoomTypeResponse, BedTypeResponse, GeneralInfoResponse } from '../types/pms'

const emptyForm = { number: '', type: 'Standard Room', bedInfo: '1 King Bed', floor: '1st Floor', status: 'Available', capacity: 2, price: '', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=140&fit=crop' }

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
    floor: apiRoom.floor_number ? `${apiRoom.floor_number}${apiRoom.floor_number === 1 ? 'st' : apiRoom.floor_number === 2 ? 'nd' : apiRoom.floor_number === 3 ? 'rd' : 'th'} Floor` : '1st Floor',
    status: statusMap[apiRoom.status || ''] || apiRoom.status || 'Available',
    capacity: (apiRoom.max_adults || 2) + (apiRoom.max_children || 0),
    price: `NPR ${(Number(apiRoom.base_rate) || 0).toLocaleString()}`,
    features: (apiRoom.system_amenity_ids || []).map(() => 'wifi').slice(0, 3),
    image: apiRoom.photos?.cover || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=140&fit=crop',
  }
}

export default function RoomsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('All Types')
  const [status, setStatus] = useState('All Status')
  const [floor, setFloor] = useState('All Floors')
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<Room | null>(null)

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const propertyId = property?.id

  const { data: roomTypes = [] } = useQuery<RoomTypeResponse[]>({
    queryKey: roomTypeKeys.byProperty(propertyId ?? ''),
    queryFn: () => getRoomTypes(propertyId!),
    enabled: !!propertyId,
  })

  const { data: bedTypes = [] } = useQuery<BedTypeResponse[]>({
    queryKey: bedTypeKeys.byProperty(propertyId ?? ''),
    queryFn: () => getBedTypes(propertyId!),
    enabled: !!propertyId,
  })

  const { data: apiRooms = [], isLoading: loading } = useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId ?? ''),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const rooms: Room[] = apiRooms.map(r => mapApiRoomToRoom(r, roomTypes, bedTypes))

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(propertyId!, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.byProperty(propertyId!) })
    },
  })

  const handleClear = () => {
    setSearchQuery('')
    setRoomType('All Types')
    setStatus('All Status')
    setFloor('All Floors')
  }

  const openAddModal = () => {
    setEditingRoom(null)
    setForm({ ...emptyForm, number: String(Math.floor(Math.random() * 900) + 100) })
    setShowModal(true)
  }

  const openEditModal = (room: Room) => {
    setEditingRoom(room)
    setForm({ ...room })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.number || !form.price) return
    setShowModal(false)
  }

  const handleDelete = (room: Room) => {
    setConfirmDelete(room)
  }

  const confirmDeleteRoom = () => {
    if (confirmDelete && property) {
      const apiRoom = apiRooms.find(r => r.room_name === confirmDelete.number)
      if (apiRoom) {
        deleteMutation.mutate(apiRoom.id)
      }
      setConfirmDelete(null)
    }
  }

  const handleChangeStatus = (room: Room, newStatus: string) => {
    setRooms(prev => prev.map(r => (r.number === room.number ? { ...r, status: newStatus } : r)))
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' }

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
            onClear={handleClear}
            onAddRoom={openAddModal}
          />
          <RoomTable
            searchQuery={searchQuery}
            roomType={roomType}
            status={status}
            floor={floor}
            rooms={rooms}
            onEditRoom={openEditModal}
            onDeleteRoom={handleDelete}
            onChangeStatus={handleChangeStatus}
          />
        </main>
      </div>

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Room Number *</label>
                  <input style={inputStyle} placeholder="e.g. 301" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Room Type</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {roomTypes.map(rt => <option key={rt.id} value={rt.room_type_name}>{rt.room_type_name}</option>)}
                    {roomTypes.length === 0 && <>
                      <option>Standard Room</option>
                      <option>Deluxe Room</option>
                      <option>Suite Room</option>
                    </>}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bed Info</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.bedInfo} onChange={(e) => setForm({ ...form, bedInfo: e.target.value })}>
                  {bedTypes.map(bt => <option key={bt.id} value={bt.bed_name}>{bt.bed_name}</option>)}
                  {bedTypes.length === 0 && <>
                    <option>1 King Bed</option>
                    <option>2 Single Beds</option>
                    <option>1 King + 1 Single Bed</option>
                  </>}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Floor</label>
                  <input style={inputStyle} type="number" min={1} value={form.floor.replace(/\D/g, '')} onChange={(e) => setForm({ ...form, floor: `${e.target.value || '1'}${Number(e.target.value) === 1 ? 'st' : Number(e.target.value) === 2 ? 'nd' : 'th'} Floor` })} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Cleaning</option>
                    <option>Maintenance</option>
                    <option>Out of Order</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Capacity</label>
                  <input style={inputStyle} type="number" min={1} max={10} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Price / Night *</label>
                  <input style={inputStyle} placeholder="e.g. NPR 8,000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editingRoom ? 'Save Changes' : 'Add Room'}</button>
            </div>
          </div>
        </div>
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
