import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerRoomStats from '../../components/manager/rooms/ManagerRoomStats'
import ManagerRoomFilters from '../../components/manager/rooms/ManagerRoomFilters'
import ManagerRoomTable from '../../components/manager/rooms/ManagerRoomTable'
import RoomFormModal from '../../components/manager/rooms/RoomFormModal'
import DeleteRoomDialog from '../../components/manager/rooms/DeleteRoomDialog'
import { DEMO_ROOMS, ROOM_STATUSES, DEMO_FLOOR_OPTIONS, type RoomRow } from '../../components/manager/rooms/demoRooms'
import { useRoomStore, mergeRooms } from '../../stores/roomStore'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import { getAllProperties, getRooms, getRoomTypes } from '../../services/pmsApi'
import { propertyKeys, roomKeys, roomTypeKeys } from '../../lib/queryKeys'
import type { RoomResponse, RoomTypeResponse } from '../../types/pms'

const STATUS_OPTIONS = ['All Status', ...ROOM_STATUSES]

function mapApiRoom(r: RoomResponse, roomTypes: RoomTypeResponse[]): RoomRow {
  const roomType = roomTypes.find((rt) => rt.id === r.room_type_id)
  const statusMap: Record<string, string> = {
    AVAILABLE: 'Available', OCCUPIED: 'Occupied', BOOKED: 'Occupied', RESERVED: 'Reserved',
    CLEANING: 'Cleaning', DIRTY: 'Cleaning', MAINTENANCE: 'Maintenance',
    OUT_OF_ORDER: 'Out of Order', OUT_OF_SERVICE: 'Out of Order',
  }
  const floorNum = r.floor_number || 1
  return {
    id: r.id,
    number: r.room_name || '–',
    type: roomType?.room_type_name || 'Room',
    bedInfo: r.max_adults ? `${r.max_adults + (r.max_children || 0)} Guests Max` : '1 Bed',
    floor: `Floor ${floorNum}`,
    status: statusMap[r.status || ''] || r.status || 'Available',
    capacity: (r.max_adults || 2) + (r.max_children || 0),
    price: Number(r.base_rate) || 0,
    features: ['WiFi', 'AC', 'TV'],
    guestStay: '—',
    housekeeping: 'Clean',
  }
}

const STATUS_CYCLE: string[] = [...ROOM_STATUSES]

export default function ManagerRoomsPage() {
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)
  const { edits, added, deleted, save, add, remove } = useRoomStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [roomType, setRoomType] = useState('All Types')
  const [status, setStatus] = useState('All Status')
  const [floor, setFloor] = useState('All Floors')
  const [showForm, setShowForm] = useState<RoomRow | null | 'new'>(null)
  const [confirmDelete, setConfirmDelete] = useState<RoomRow | null>(null)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0] ?? null
  const effectivePropertyId = property?.id ?? ''

  const { data: apiRooms = [] } = useQuery({
    queryKey: roomKeys.byProperty(effectivePropertyId),
    queryFn: () => getRooms(effectivePropertyId),
    enabled: !!effectivePropertyId,
    select: (data: unknown) => (Array.isArray(data) ? data : []) as RoomResponse[],
  })

  const { data: apiRoomTypes = [] } = useQuery({
    queryKey: roomTypeKeys.byProperty(effectivePropertyId),
    queryFn: () => getRoomTypes(effectivePropertyId),
    enabled: !!effectivePropertyId,
    select: (data: unknown) => (Array.isArray(data) ? data : []) as RoomTypeResponse[],
  })

  const apiMapped = useMemo(
    () => apiRooms.map((r) => mapApiRoom(r, apiRoomTypes)),
    [apiRooms, apiRoomTypes],
  )
  const source = apiMapped.length > 0 ? apiMapped : DEMO_ROOMS

  const allRooms = useMemo(
    () => mergeRooms(source, edits, added, deleted),
    [source, edits, added, deleted],
  )

  const roomTypeOptions = useMemo(() => {
    const fromApi = apiRoomTypes.map((rt) => rt.room_type_name).filter(Boolean)
    const fromRows = allRooms.map((r) => r.type)
    const unique = [...new Set([...fromApi, ...fromRows])]
    return unique.length > 0 ? ['All Types', ...unique] : ['All Types']
  }, [apiRoomTypes, allRooms])

  const floorOptions = useMemo(() => {
    const unique = [...new Set(allRooms.map((r) => r.floor))].sort()
    return unique.length > 0 ? ['All Floors', ...unique] : DEMO_FLOOR_OPTIONS
  }, [allRooms])

  const filteredRooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allRooms.filter((r) => {
      const matchSearch = !q || r.number.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
      const matchType = roomType === 'All Types' || r.type === roomType
      const matchStatus = status === 'All Status' || r.status === status
      const matchFloor = floor === 'All Floors' || r.floor === floor
      return matchSearch && matchType && matchStatus && matchFloor
    })
  }, [allRooms, searchQuery, roomType, status, floor])

  const handleSaveRoom = (values: Omit<RoomRow, 'id'>, existingId: string | null) => {
    if (existingId) {
      save(existingId, values)
      toast.success(`Room #${values.number} updated.`)
    } else {
      add({ ...values, id: `RM-${values.number}-${Date.now()}` })
      toast.success(`Room #${values.number} added.`)
    }
    setShowForm(null)
  }

  const handleChangeStatus = (room: RoomRow) => {
    const idx = STATUS_CYCLE.indexOf(room.status)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    save(room.id, { status: next })
    toast.success(`Room #${room.number} is now ${next}.`)
  }

  const handleDeleteRoom = (room: RoomRow) => setConfirmDelete(room)

  const confirmDeleteRoom = () => {
    if (!confirmDelete) return
    remove(confirmDelete.id)
    toast.success(`Room #${confirmDelete.number} deleted.`)
    setConfirmDelete(null)
  }

  return (
    <ManagerLayout
      title="Rooms Management"
      subtitle="Schedule and manage all rooms from one place."
    >
      <ManagerRoomStats rooms={allRooms} />

      <ManagerRoomFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roomType={roomType}
        onRoomTypeChange={setRoomType}
        roomTypes={roomTypeOptions}
        status={status}
        onStatusChange={setStatus}
        statusOptions={STATUS_OPTIONS}
        floor={floor}
        onFloorChange={setFloor}
        floorOptions={floorOptions}
        onAddRoom={() => setShowForm('new')}
      />

      <ManagerRoomTable
        rooms={filteredRooms}
        onViewRoom={(room) => {
          setRoomType('All Types')
          setStatus('All Status')
          setFloor('All Floors')
          setSearchQuery(room.number)
          toast(`Room #${room.number} · ${room.type} · ${room.status}`)
        }}
        onEditRoom={(room) => setShowForm(room)}
        onChangeStatus={handleChangeStatus}
        onDeleteRoom={handleDeleteRoom}
      />

      {showForm && (
        <RoomFormModal
          room={showForm === 'new' ? null : showForm}
          roomTypes={roomTypeOptions}
          existingNumbers={allRooms.map((r) => r.number)}
          onClose={() => setShowForm(null)}
          onSave={handleSaveRoom}
        />
      )}

      {confirmDelete && (
        <DeleteRoomDialog
          room={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteRoom}
        />
      )}
    </ManagerLayout>
  )
}
