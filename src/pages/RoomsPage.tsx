import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import RoomStats from '../components/rooms/RoomStats'
import RoomFilters from '../components/rooms/RoomFilters'
import RoomTable from '../components/rooms/RoomTable'
import { allRooms, type Room } from '../components/rooms/RoomTable'

const emptyForm = { number: '', type: 'Standard Room', bedInfo: '1 King Bed', floor: '1st Floor', status: 'Available', capacity: 2, price: '', features: ['wifi', 'tv', 'ac'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=140&fit=crop' }

export default function RoomsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('All Types')
  const [status, setStatus] = useState('All Status')
  const [floor, setFloor] = useState('All Floors')
  const [rooms, setRooms] = useState<Room[]>(allRooms)
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<Room | null>(null)

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
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.number === editingRoom.number ? { ...form } : r)))
    } else {
      setRooms((prev) => [{ ...form }, ...prev])
    }
    setShowModal(false)
  }

  const handleDelete = (room: Room) => {
    setConfirmDelete(room)
  }

  const confirmDeleteRoom = () => {
    if (confirmDelete) {
      setRooms((prev) => prev.filter((r) => r.number !== confirmDelete.number))
      setConfirmDelete(null)
    }
  }

  const handleChangeStatus = (room: Room, newStatus: string) => {
    setRooms((prev) => prev.map((r) => (r.number === room.number ? { ...r, status: newStatus } : r)))
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' }

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
            onAddRoom={openAddModal}
          />
          <RoomTable
            searchQuery={searchQuery}
            roomType={roomType}
            status={status}
            floor={floor}
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
                    <option>Standard Room</option>
                    <option>Deluxe Room</option>
                    <option>Suite Room</option>
                    <option>Family Room</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bed Info</label>
                <input style={inputStyle} placeholder="e.g. 1 King Bed" value={form.bedInfo} onChange={(e) => setForm({ ...form, bedInfo: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Floor</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })}>
                    <option>1st Floor</option>
                    <option>2nd Floor</option>
                    <option>3rd Floor</option>
                  </select>
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
              <div>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Features</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['wifi', 'tv', 'ac'].map((f) => (
                    <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.features.includes(f)}
                        onChange={(e) => {
                          if (e.target.checked) setForm({ ...form, features: [...form.features, f] })
                          else setForm({ ...form, features: form.features.filter((x) => x !== f) })
                        }}
                      />
                      {f.toUpperCase()}
                    </label>
                  ))}
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
