import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import BookingStats from '../components/bookings/BookingStats'
import BookingFilters from '../components/bookings/BookingFilters'
import BookingTable, { type Booking } from '../components/bookings/BookingTable'
import { getAllProperties, getPropertyBookings, getRooms, getRoomTypes, createBooking } from '../services/pmsApi'
import { propertyKeys, roomKeys, roomTypeKeys, bookingKeys } from '../lib/queryKeys'
import { mapApiBookingToBooking } from '../components/bookings/bookingUtils'
import type { GeneralInfoResponse, PropertyBooking, RoomResponse, RoomTypeResponse } from '../types/pms'

const initialForm = { roomIds: [] as string[], checkIn: '', checkOut: '', adults: 2, children: 0 }

export default function BookingsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('All')
  const [roomType, setRoomType] = useState('All Rooms')
  const [dateFilter, setDateFilter] = useState('')
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [newBooking, setNewBooking] = useState(initialForm)

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const propertyId = property?.id

  const { data: apiBookings = [], isLoading: loading } = useQuery<PropertyBooking[]>({
    queryKey: bookingKeys.byProperty(propertyId ?? ''),
    queryFn: () => getPropertyBookings(propertyId!),
    enabled: !!propertyId,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const { data: rooms = [] } = useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId ?? ''),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId && showNewBookingModal,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const { data: roomTypes = [] } = useQuery<RoomTypeResponse[]>({
    queryKey: roomTypeKeys.byProperty(propertyId ?? ''),
    queryFn: () => getRoomTypes(propertyId!),
    enabled: !!propertyId && showNewBookingModal,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const roomTypeMap = new Map(roomTypes.map(rt => [rt.id, rt.room_type_name]))

  const bookings: Booking[] = apiBookings.map(mapApiBookingToBooking)

  const [bookingError, setBookingError] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: () => createBooking({
      idempotency_key: crypto.randomUUID?.() ?? `bk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      property_id: propertyId!,
      room_ids: newBooking.roomIds,
      check_in: newBooking.checkIn,
      check_out: newBooking.checkOut,
      adults: newBooking.adults,
      children: newBooking.children,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byProperty(propertyId!) })
      setNewBooking(initialForm)
      setShowNewBookingModal(false)
      setBookingError(null)
    },
    onError: (error: any) => {
      console.error('Booking creation error:', error)
      const data = error?.response?.data
      let msg = 'Failed to create booking.'
      if (data) {
        msg = data.detail || data.message || data.error || JSON.stringify(data)
      } else {
        msg = error?.message || 'Failed to create booking.'
      }
      setBookingError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    },
  })

  const handleCreateBooking = () => {
    if (!propertyId || !newBooking.roomIds.length || !newBooking.checkIn || !newBooking.checkOut) return
    createMutation.mutate()
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' as const }

  const canSubmit = !!propertyId && newBooking.roomIds.length > 0 && !!newBooking.checkIn && !!newBooking.checkOut && newBooking.checkOut > newBooking.checkIn

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Bookings" subtitle="Manage all reservations and bookings" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <BookingStats bookings={bookings} />
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
          {loading ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '60px 20px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>
              Loading bookings...
            </div>
          ) : (
            <BookingTable
              bookings={bookings}
              searchQuery={searchQuery}
              activeStatus={activeStatus}
              roomType={roomType}
              dateFilter={dateFilter}
            />
          )}
        </main>
      </div>

      {showNewBookingModal && (
        <div onClick={() => { if (!createMutation.isPending) setShowNewBookingModal(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>New Booking</h3>
            <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
              {property ? `Creating a booking for ${property.name}` : 'Select a property first'} — the booking is created as <b>Pending</b> and payment is completed by the guest later.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Rooms *</label>
                {rooms.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--muted-foreground)', padding: '8px 0' }}>No rooms available for this property.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflow: 'auto' }}>
                    {rooms.map((r) => {
                      const isSelected = newBooking.roomIds.includes(r.id)
                      const hasCover = r.photos?.cover
                      const roomType = roomTypeMap.get(r.room_type_id) || 'Room'
                      return (
                        <label
                          key={r.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px',
                            borderRadius: 8, cursor: 'pointer', fontSize: 13,
                            border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--accent)' : '#fff',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const roomIds = e.target.checked
                                ? [...newBooking.roomIds, r.id]
                                : newBooking.roomIds.filter((id) => id !== r.id)
                              setNewBooking({ ...newBooking, roomIds })
                            }}
                            style={{ width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }}
                          />
                          <div style={{
                            width: 36, height: 36, borderRadius: 6, overflow: 'hidden',
                            background: '#f3f4f6', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {hasCover ? (
                              <img
                                src={r.photos.cover!}
                                alt={r.room_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: 16 }}>🛏️</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <span style={{ fontWeight: 600, color: 'var(--foreground)', lineHeight: '1.2' }}>
                              {r.room_name || 'Room'}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                              {roomType}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Check-in *</label>
                  <input style={inputStyle} type="date" value={newBooking.checkIn} onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Check-out *</label>
                  <input style={inputStyle} type="date" min={newBooking.checkIn || undefined} value={newBooking.checkOut} onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Adults</label>
                  <input style={inputStyle} type="number" min={1} max={30} value={newBooking.adults} onChange={(e) => setNewBooking({ ...newBooking, adults: Math.max(1, parseInt(e.target.value, 10) || 1) })} />
                </div>
                <div>
                  <label style={labelStyle}>Children</label>
                  <input style={inputStyle} type="number" min={0} max={15} value={newBooking.children} onChange={(e) => setNewBooking({ ...newBooking, children: Math.max(0, parseInt(e.target.value, 10) || 0) })} />
                </div>
              </div>
              {bookingError && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fee2e2', fontSize: 13, color: '#dc2626' }}>
                  {bookingError}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowNewBookingModal(false)} disabled={createMutation.isPending} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleCreateBooking} disabled={!canSubmit || createMutation.isPending} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: canSubmit ? 1 : 0.5 }}>
                {createMutation.isPending ? 'Creating...' : 'Create Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
