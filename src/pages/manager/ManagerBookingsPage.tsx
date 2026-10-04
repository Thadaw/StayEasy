import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import { useBookingStatusStore } from '../../stores/bookingStatusStore'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerBookingStats from '../../components/manager/bookings/ManagerBookingStats'
import ManagerBookingFilters from '../../components/manager/bookings/ManagerBookingFilters'
import ManagerBookingTable, { type BookingRow } from '../../components/manager/bookings/ManagerBookingTable'
import { DEMO_BOOKINGS } from '../../components/manager/bookings/demoBookings'
import { useBookingEditStore, applyBookingRowEdit } from '../../stores/bookingEditStore'
import { getAllProperties, getPropertyBookings, getRoomTypes } from '../../services/pmsApi'
import { propertyKeys, bookingKeys, roomTypeKeys } from '../../lib/queryKeys'
import type { PropertyBooking } from '../../types/pms'
import { normalizeStatus, formatDate } from '../../components/bookings/bookingUtils'

function mapApiBookingToRow(b: PropertyBooking): BookingRow {
  const status = normalizeStatus(b.status)
  let paymentStatus = 'Paid'
  if (status === 'Cancelled') paymentStatus = 'Refunded'
  else if (status === 'Pending') paymentStatus = 'Unpaid'

  const roomName = b.room_names?.[0] || '–'
  const guestCount = b.guest_nationality ? 1 : 2

  let source = 'Direct'
  if (b.payment_gateway?.toLowerCase().includes('ota')) source = 'OTA'
  else if (b.payment_gateway?.toLowerCase().includes('phone')) source = 'Phone'
  else if (b.payment_gateway?.toLowerCase().includes('walk')) source = 'Walk-in'

  return {
    id: b.booking_number || b.id,
    guest: b.guest_name || '–',
    room: roomName,
    roomType: roomName,
    checkIn: formatDate(b.checkin_date),
    checkOut: formatDate(b.checkout_date),
    guests: guestCount,
    source,
    paymentStatus,
    status,
  }
}

export default function ManagerBookingsPage() {
  const navigate = useNavigate()
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)
  const edits = useBookingEditStore((s) => s.edits)
  const statusOverrides = useBookingStatusStore((s) => s.overrides)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0] ?? null
  const effectivePropertyId = property?.id ?? ''

  const { data: apiBookings = [] } = useQuery({
    queryKey: bookingKeys.byProperty(effectivePropertyId),
    queryFn: () => getPropertyBookings(effectivePropertyId),
    enabled: !!effectivePropertyId,
    select: (data: unknown) => (Array.isArray(data) ? data : []) as PropertyBooking[],
  })

  const { data: roomTypes = [] } = useQuery({
    queryKey: roomTypeKeys.byProperty(effectivePropertyId),
    queryFn: () => getRoomTypes(effectivePropertyId),
    enabled: !!effectivePropertyId,
    select: (data: unknown) => {
      const arr = Array.isArray(data) ? data : []
      return arr
        .map((rt: { room_type_name?: string; name?: string }) => rt.room_type_name || rt.name || '')
        .filter(Boolean)
    },
  })

  const allBookings = useMemo(() => {
    const mapped = apiBookings.map(mapApiBookingToRow)
    const source = mapped.length > 0 ? mapped : DEMO_BOOKINGS
    return source.map((b) => {
      const edited = applyBookingRowEdit(b, edits[b.id])
      const override = statusOverrides[edited.id]
      return override ? { ...edited, status: override } : edited
    })
  }, [apiBookings, edits, statusOverrides])

  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [sourceFilter, setSourceFilter] = useState('All Sources')
  const [roomTypeFilter, setRoomTypeFilter] = useState('All Rooms')

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      const matchSearch = !searchQuery ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.room.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'All Statuses' || b.status === statusFilter
      const matchSource = sourceFilter === 'All Sources' || b.source === sourceFilter
      const matchRoomType = roomTypeFilter === 'All Rooms' || b.roomType === roomTypeFilter

      return matchSearch && matchStatus && matchSource && matchRoomType
    })
  }, [allBookings, searchQuery, statusFilter, sourceFilter, roomTypeFilter])

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return {
      total: allBookings.length,
      arrivals: allBookings.filter((b) => {
        const d = b.checkIn
        return d.includes(todayStr)
      }).length,
      departures: allBookings.filter((b) => {
        const d = b.checkOut
        return d.includes(todayStr)
      }).length,
      pending: allBookings.filter((b) => b.status === 'Pending').length,
    }
  }, [allBookings])

  return (
    <ManagerLayout
      title="All Bookings"
      subtitle="View, search and manage all hotel bookings from one place."
    >
      <ManagerBookingStats
        totalBookings={stats.total}
        todayArrivals={stats.arrivals}
        todayDepartures={stats.departures}
        pendingConfirmations={stats.pending}
      />

      <ManagerBookingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        bookingSource={sourceFilter}
        onBookingSourceChange={setSourceFilter}
        roomType={roomTypeFilter}
        onRoomTypeChange={setRoomTypeFilter}
        roomTypes={roomTypes}
        onApply={() => toast.success('Filters applied')}
      />

      <ManagerBookingTable
        bookings={filteredBookings}
        onNewBooking={() => navigate('/manager/bookings/new')}
      />
    </ManagerLayout>
  )
}
