import { useState, useMemo } from 'react'
import { useUIStore } from '@/store/ui/uiStore'
import { usePropertyStore } from '@/store/properties/propertyStore'
import { useAdminBookingStore } from '@/store/admin/adminBookingStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import BookingStats from '@/components/admin/bookings/BookingStats'
import BookingFilters from '@/components/admin/bookings/BookingFilters'
import BookingTable, { type Booking } from '@/components/admin/bookings/BookingTable'
import BookingDetailModal from '@/components/admin/bookings/BookingDetailModal'
import NewBookingModal from '@/components/admin/bookings/NewBookingModal'
import { mapApiBookingToBooking } from '@/components/admin/bookings/bookingUtils'
import {
  useAdminPropertiesQuery,
  usePropertyBookingsQuery,
  useOverallPropertyBookingsQuery,
  useAdminRoomsQuery,
  useAdminRoomTypesQuery,
} from '@/services/queries/admin/adminBookingQueries'
import { useCreateAdminBooking } from '@/services/mutations/admin/adminBookingMutations'
import type { NewBookingFormData } from '@/schemas/admin/newBookingSchema'
import type { PropertyBooking } from '@/types/pms'

function extractBookingError(error: unknown): string {
  const err = error as {
    response?: { data?: { detail?: string; message?: string; error?: string } }
    message?: string
  }
  const data = err?.response?.data
  if (data) return data.detail || data.message || data.error || JSON.stringify(data)
  return err?.message || 'Failed to create booking.'
}

export default function BookingsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const {
    searchQuery,
    activeStatus,
    roomType,
    dateFilter,
    showNewBookingModal,
    viewingBookingId,
    setSearchQuery,
    setActiveStatus,
    setRoomType,
    setDateFilter,
    openNewBooking,
    closeNewBooking,
    setViewingBookingId,
  } = useAdminBookingStore()

  const [bookingError, setBookingError] = useState<string | null>(null)

  const { data: properties = [] } = useAdminPropertiesQuery()

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const overallMode = currentPropertyId === null
  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const propertyId = overallMode ? null : (currentPropertyId ?? property?.id)

  const activePropertyIds = useMemo(
    () => properties.filter((p) => p.is_active !== false).map((p) => p.id),
    [properties]
  )

  const overallBookingQueries = useOverallPropertyBookingsQuery(activePropertyIds, overallMode)

  const overallApiBookings: PropertyBooking[] = useMemo(
    () => overallBookingQueries.flatMap((q) => (q.data ? (q.data as PropertyBooking[]) : [])),
    [overallBookingQueries]
  )

  const overallLoading = overallBookingQueries.some((q) => q.isLoading)

  const { data: singlePropertyBookings = [], isLoading: singleLoading } = usePropertyBookingsQuery(
    overallMode ? null : propertyId
  )

  const apiBookings = overallMode ? overallApiBookings : singlePropertyBookings
  const loading = overallMode ? overallLoading : singleLoading

  const { data: rooms = [] } = useAdminRoomsQuery(propertyId, showNewBookingModal)
  const { data: roomTypes = [] } = useAdminRoomTypesQuery(propertyId, showNewBookingModal)

  const bookings: Booking[] = useMemo(
    () => apiBookings.map(mapApiBookingToBooking),
    [apiBookings],
  )

  const { createBooking, isCreating } = useCreateAdminBooking(propertyId)

  const viewingBooking = viewingBookingId
    ? apiBookings.find((b) => (b.booking_number || b.id) === viewingBookingId) ?? null
    : null

  const handleOpenNewBooking = () => {
    setBookingError(null)
    openNewBooking()
  }

  const handleCreateBooking = async (data: NewBookingFormData) => {
    if (!propertyId) return
    setBookingError(null)
    try {
      await createBooking({
        idempotency_key: crypto.randomUUID?.() ?? `bk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        property_id: propertyId,
        room_ids: data.roomIds,
        check_in: data.checkIn,
        check_out: data.checkOut,
        adults: data.adults,
        children: data.children,
      })
      closeNewBooking()
    } catch (error) {
      setBookingError(extractBookingError(error))
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Bookings"
          subtitle={overallMode ? 'All properties' : `Managing ${property?.name || 'property'}`}
          showOverallOption
          selectedLabel={overallMode ? 'Overall Bookings' : property?.name || 'Property'}
          onPropertyChange={() => {}}
        />
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
            onNewBooking={handleOpenNewBooking}
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
              onViewBooking={setViewingBookingId}
            />
          )}
        </main>
      </div>

      {showNewBookingModal && (
        <NewBookingModal
          propertyName={property?.name}
          rooms={rooms}
          roomTypes={roomTypes}
          isSubmitting={isCreating}
          error={bookingError}
          onClose={closeNewBooking}
          onSubmit={handleCreateBooking}
        />
      )}

      {viewingBookingId && (
        <BookingDetailModal
          booking={viewingBooking}
          onClose={() => setViewingBookingId(null)}
        />
      )}
    </div>
  )
}
