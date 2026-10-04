import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import HousekeepingHeader from '../components/housekeeping/HousekeepingHeader'
import HousekeepingStats from '../components/housekeeping/HousekeepingStats'
import HousekeepingFilters from '../components/housekeeping/HousekeepingFilters'
import HousekeepingTable from '../components/housekeeping/HousekeepingTable'
import HousekeepingTabs from '../components/housekeeping/HousekeepingTabs'
import HousekeepingPagination from '../components/housekeeping/HousekeepingPagination'
import TaskFilters from '../components/housekeeping/TaskFilters'
import TaskTable from '../components/housekeeping/TaskTable'
import StaffAssignmentView from '../components/housekeeping/StaffAssignmentView'
import ReviewMaintenanceModal from '../components/housekeeping/ReviewMaintenanceModal'
import BulkActionModal from '../components/housekeeping/BulkActionModal'
import {
  getAllProperties,
  getHousekeepingRooms,
  getRoomStatusSummary,
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  bulkAssignTasks,
  getHousekeepingStaffOptions,
  getTaskRoomOptions,
  getStaffWorkSummary,
  getTaskTypes,
} from '../services/pmsApi'
import { propertyKeys, housekeepingKeys } from '../lib/queryKeys'
import type {
  HousekeepingRoom,
  RoomStats,
  HousekeepingTask,
  ApiRoomStatus,
  ApiTaskListItem,
  ApiStaffOption,
  ApiRoomOption,
  ApiStaffWorkSummary,
  ApiTaskTypeOption,
} from '../types/housekeeping'
import type { GeneralInfoResponse } from '../types/pms'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4, display: 'block' }

const taskTypeMap: Record<string, HousekeepingTask['taskType']> = {
  ROOM_CLEANING: 'Cleaning',
  LINEN_CHANGE: 'Linen Change',
  DEEP_CLEANING: 'Deep Cleaning',
  MAINTENANCE_CHECK: 'Bathroom Cleaning',
  INSPECTION: 'Cleaning',
  RESTOCK_AMENITIES: 'Cleaning',
  OTHER: 'Cleaning',
}

const priorityMap: Record<string, HousekeepingTask['priority']> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

const statusMap: Record<string, HousekeepingTask['status']> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Completed',
  AWAITING_INSPECTION: 'In Progress',
}

const roomStatusMap: Record<string, HousekeepingRoom['status']> = {
  AVAILABLE: 'Clean',
  OCCUPIED: 'Dirty',
  BOOKED: 'Dirty',
  CLEANING: 'In Progress',
  DIRTY: 'Dirty',
  MAINTENANCE: 'Out of Service',
  OUT_OF_ORDER: 'Out of Service',
  OUT_OF_SERVICE: 'Out of Service',
  INSPECTED: 'Clean',
  BLOCKED: 'Out of Service',
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2']
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

function toFutureDueTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const due = new Date()
  due.setHours(h, m, 0, 0)
  if (due.getTime() <= Date.now()) due.setDate(due.getDate() + 1)
  return due.toISOString()
}

function mapApiTaskToFrontend(apiTask: ApiTaskListItem): HousekeepingTask {
  return {
    id: apiTask.id.slice(0, 8),
    room: apiTask.room_name,
    taskType: taskTypeMap[apiTask.task_type] || 'Cleaning',
    priority: priorityMap[apiTask.priority] || 'Medium',
    assignedTo: apiTask.assigned_staff_name || null,
    dueTime: apiTask.due_time
      ? new Date(apiTask.due_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : 'Today',
    status: statusMap[apiTask.status] || 'Pending',
    notes: apiTask.notes || undefined,
  }
}

function mapApiRoomToHousekeeping(
  apiRoom: ApiRoomStatus,
  index: number,
  details: { assignedTo: string | null; lastCleaned: string | null; nextCleaning: string | null }
): HousekeepingRoom {
  const floor = apiRoom.floor_number
    ? `${apiRoom.floor_number}${apiRoom.floor_number === 1 ? 'st' : apiRoom.floor_number === 2 ? 'nd' : apiRoom.floor_number === 3 ? 'rd' : 'th'} Floor`
    : '1st Floor'
  return {
    id: index + 1,
    roomNumber: apiRoom.room_name || String(index + 101),
    roomType: apiRoom.room_type_id || 'Room',
    bedDescription: apiRoom.bed_type_id || '1 Bed',
    floor,
    status: roomStatusMap[apiRoom.status || ''] || 'Clean',
    assignedTo: details.assignedTo,
    lastCleaned: details.lastCleaned,
    nextCleaning: details.nextCleaning,
  }
}

export default function HousekeepingPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const queryClient = useQueryClient()
  const [topTab, setTopTab] = useState('Room Status')

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const propertyId = properties.find((p) => p.id === currentPropertyId)?.id ?? properties[0]?.id

  // ─── API Queries ──────────────────────────────────────────

  const { data: apiRooms = [] } = useQuery<ApiRoomStatus[]>({
    queryKey: housekeepingKeys.rooms(propertyId ?? ''),
    queryFn: () => getHousekeepingRooms(propertyId!),
    enabled: !!propertyId,
  })

  const { data: roomSummary } = useQuery({
    queryKey: housekeepingKeys.roomSummary(propertyId ?? ''),
    queryFn: () => getRoomStatusSummary(propertyId!),
    enabled: !!propertyId,
  })

  const { data: apiTasks = [] } = useQuery<ApiTaskListItem[]>({
    queryKey: housekeepingKeys.tasks(propertyId ?? ''),
    queryFn: () => getTasks(propertyId!, { limit: 50 }),
    enabled: !!propertyId,
  })

  const { data: staffOptions = [] } = useQuery<ApiStaffOption[]>({
    queryKey: housekeepingKeys.staffOptions(propertyId ?? ''),
    queryFn: () => getHousekeepingStaffOptions(propertyId!),
    enabled: !!propertyId,
  })

  const { data: taskRoomOptions = [] } = useQuery<ApiRoomOption[]>({
    queryKey: housekeepingKeys.roomOptions(propertyId ?? ''),
    queryFn: () => getTaskRoomOptions(propertyId!),
    enabled: !!propertyId,
  })

  const { data: staffWorkSummary = [] } = useQuery<ApiStaffWorkSummary[]>({
    queryKey: housekeepingKeys.staffWorkSummary(propertyId ?? ''),
    queryFn: () => getStaffWorkSummary(propertyId!),
    enabled: !!propertyId,
  })

  const { data: taskTypes = [] } = useQuery<ApiTaskTypeOption[]>({
    queryKey: housekeepingKeys.taskTypes(propertyId ?? ''),
    queryFn: () => getTaskTypes(propertyId!),
    enabled: !!propertyId,
  })

  // ─── Mutations ────────────────────────────────────────────

  const createTaskMutation = useMutation({
    mutationFn: (data: import('../types/housekeeping').CreateTaskRequest) => createTask(propertyId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
      toast.success('Task created successfully')
    },
    onError: () => toast.error('Failed to create task'),
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(propertyId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
    },
    onError: () => toast.error('Failed to remove the original unassigned task'),
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: import('../types/housekeeping').UpdateTaskRequest }) =>
      updateTask(propertyId!, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
      toast.success('Task updated successfully')
    },
    onError: () => toast.error('Failed to update task'),
  })

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(propertyId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      toast.success('Task completed')
    },
    onError: () => toast.error('Failed to complete task'),
  })

  const bulkAssignMutation = useMutation({
    mutationFn: (tasks: import('../types/housekeeping').BulkAssignTaskItem[]) => bulkAssignTasks(propertyId!, tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      toast.success('Bulk assignments applied')
    },
    onError: () => toast.error('Failed to apply bulk assignments'),
  })

  // ─── Mapped Data ──────────────────────────────────────────

  const rooms: HousekeepingRoom[] = useMemo(() => {
    if (apiRooms.length === 0) return []

    const taskByRoom = new Map<string, ApiTaskListItem[]>()
    const addTask = (key: string, task: ApiTaskListItem) => {
      if (!key) return
      const list = taskByRoom.get(key) ?? []
      list.push(task)
      taskByRoom.set(key, list)
    }
    for (const task of apiTasks) {
      addTask(task.room_id, task)
      addTask(task.room_name, task)
    }

    const sortByDue = (a: ApiTaskListItem, b: ApiTaskListItem) =>
      new Date(a.due_time).getTime() - new Date(b.due_time).getTime()

    const dateOnly = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dateTime = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })

    return apiRooms.map((room, i) => {
      const tasks = taskByRoom.get(room.id) ?? taskByRoom.get(room.room_name) ?? []
      const pending = tasks.filter(t => t.status === 'PENDING').sort(sortByDue)
      const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').sort(sortByDue)
      const active = inProgress.length > 0 ? inProgress : pending

      const completed = tasks
        .filter(t => t.status === 'COMPLETED' && t.completed_at)
        .sort((a, b) => new Date(b.completed_at as string).getTime() - new Date(a.completed_at as string).getTime())

      return mapApiRoomToHousekeeping(room, i, {
        assignedTo: active[0]?.assigned_staff_name || null,
        lastCleaned: completed[0]?.completed_at ? dateOnly(completed[0].completed_at) : null,
        nextCleaning: active[0]?.due_time ? dateTime(active[0].due_time) : null,
      })
    })
  }, [apiRooms, apiTasks])

  const tasks: HousekeepingTask[] = useMemo(() => {
    return apiTasks.map(t => mapApiTaskToFrontend(t))
  }, [apiTasks])

  const roomOptionsList = useMemo(() => taskRoomOptions.map(r => r.name), [taskRoomOptions])

  const assignableStaff = useMemo<ApiStaffOption[]>(() => {
    if (staffOptions.length > 0) return staffOptions
    return staffWorkSummary.map(s => ({ id: s.staff_id, name: s.staff_name, cover_photo: null }))
  }, [staffOptions, staffWorkSummary])

  // ─── Local UI State ──────────────────────────────────────

  const [roomSearch, setRoomSearch] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [taskSearch, setTaskSearch] = useState('')
  const [taskStatusFilter, setTaskStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')

  const [showCreateTask, setShowCreateTask] = useState(false)
  const [viewingTask, setViewingTask] = useState<HousekeepingTask | null>(null)
  const [assigningTask, setAssigningTask] = useState<HousekeepingTask | null>(null)
  const [assigningMode, setAssigningMode] = useState<'assign' | 'reassign'>('assign')
  const [viewingRoom, setViewingRoom] = useState<HousekeepingRoom | null>(null)
  const [createForm, setCreateForm] = useState({ room: '', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' })
  const [assignForm, setAssignForm] = useState({ staff: '', room: '', priority: 'High', dueTime: '', notes: '' })
  const [showReviewMaintenance, setShowReviewMaintenance] = useState(false)
  const [showBulkAction, setShowBulkAction] = useState(false)

  // ─── Filtering ────────────────────────────────────────────

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = !roomSearch || room.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) || room.roomType.toLowerCase().includes(roomSearch.toLowerCase())
      const matchesFloor = !floorFilter || room.floor === floorFilter
      const matchesStatus = !statusFilter || room.status === statusFilter
      const matchesRoomType = !roomTypeFilter || room.roomType === roomTypeFilter
      return matchesSearch && matchesFloor && matchesStatus && matchesRoomType
    })
  }, [rooms, roomSearch, floorFilter, statusFilter, roomTypeFilter])

  const roomStats: RoomStats = useMemo(() => {
    if (roomSummary) {
      return {
        total: roomSummary.total_rooms,
        clean: roomSummary.available_rooms + roomSummary.inspected_rooms,
        dirty: roomSummary.dirty_rooms,
        inProgress: roomSummary.in_progress_rooms + roomSummary.cleaning_rooms,
        outOfService: roomSummary.out_of_service_rooms + roomSummary.maintenance_rooms,
      }
    }
    return {
      total: rooms.length,
      clean: rooms.filter(r => r.status === 'Clean').length,
      dirty: rooms.filter(r => r.status === 'Dirty').length,
      inProgress: rooms.filter(r => r.status === 'In Progress').length,
      outOfService: rooms.filter(r => r.status === 'Out of Service').length,
    }
  }, [rooms, roomSummary])

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage)
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = !taskSearch || task.id.toLowerCase().includes(taskSearch.toLowerCase()) || task.room.toLowerCase().includes(taskSearch.toLowerCase())
      const matchStatus = !taskStatusFilter || task.status === taskStatusFilter
      const matchPriority = !priorityFilter || task.priority === priorityFilter
      const matchRoom = !roomFilter || task.room === roomFilter
      return matchSearch && matchStatus && matchPriority && matchRoom
    })
  }, [tasks, taskSearch, taskStatusFilter, priorityFilter, roomFilter])

  // ─── Handlers ─────────────────────────────────────────────

  const renderStaffField = (selected: string, onChange: (name: string) => void, includeUnassigned = false) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxHeight: 220, overflow: 'auto' }}>
      {includeUnassigned && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
            border: selected === '' ? '1.5px solid var(--primary)' : '1px solid #E5E7EB',
            background: selected === '' ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>?</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Unassigned</span>
        </button>
      )}
      {assignableStaff.map(s => {
        const name = s.name || ''
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
              border: selected === name ? '1.5px solid var(--primary)' : '1px solid #E5E7EB',
              background: selected === name ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'left',
            }}
          >
            {s.cover_photo ? (
              <img src={s.cover_photo} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColors[(name.length || 0) % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{getInitials(name)}</div>
            )}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{name}</span>
          </button>
        )
      })}
    </div>
  )

  const handleCreateTask = () => {
    if (!createForm.room || !propertyId) {
      toast.error('Please select a room')
      return
    }
    const selectedRoom = taskRoomOptions.find(r => r.name === createForm.room)
    if (!selectedRoom) {
      toast.error('Please select a room')
      return
    }
    const selectedStaff = assignableStaff.find(s => s.name === createForm.assignedStaff)
    if (!selectedStaff) {
      toast.error('Please assign a staff member')
      return
    }

    const dueTimeISO = createForm.dueTime ? toFutureDueTime(createForm.dueTime) : new Date().toISOString()

    createTaskMutation.mutate({
      room_id: selectedRoom.id,
      task_type: createForm.taskType === 'Cleaning' ? 'ROOM_CLEANING' : createForm.taskType === 'Linen Change' ? 'LINEN_CHANGE' : createForm.taskType === 'Deep Cleaning' ? 'DEEP_CLEANING' : 'ROOM_CLEANING',
      assigned_staff_id: selectedStaff.id,
      due_time: dueTimeISO,
      priority: createForm.priority === 'High' ? 'HIGH' : createForm.priority === 'Low' ? 'LOW' : 'MEDIUM',
      notes: createForm.notes || null,
    })
    setShowCreateTask(false)
    setCreateForm({ room: '', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' })
  }

  const handleAssignTask = async () => {
    if (!assigningTask || !propertyId) return
    const selectedStaff = assignableStaff.find(s => s.name === assignForm.staff)
    const originalTask = apiTasks.find(t => t.id.startsWith(assigningTask.id))
    if (!assignForm.staff || !selectedStaff) {
      toast.error('Please assign a staff member')
      return
    }
    if (!originalTask) return

    if (assigningMode === 'reassign') {
      const selectedRoom = taskRoomOptions.find(r => r.name === assignForm.room)
      updateTaskMutation.mutate({
        taskId: originalTask.id,
        data: {
          assigned_staff_id: selectedStaff.id,
          ...(selectedRoom ? { room_id: selectedRoom.id } : {}),
          ...(assignForm.priority ? { priority: assignForm.priority === 'High' ? 'HIGH' : assignForm.priority === 'Low' ? 'LOW' : 'MEDIUM' } : {}),
          ...(assignForm.dueTime ? { due_time: toFutureDueTime(assignForm.dueTime) } : {}),
        },
      })
      setAssigningTask(null)
      setAssignForm({ staff: '', room: '', priority: 'High', dueTime: '', notes: '' })
      return
    }

    const selectedRoom = taskRoomOptions.find(r => r.name === assignForm.room)
    const dueTimeISO = assignForm.dueTime ? toFutureDueTime(assignForm.dueTime) : originalTask.due_time

    try {
      await createTaskMutation.mutateAsync({
        room_id: selectedRoom?.id ?? originalTask.room_id,
        task_type: originalTask.task_type,
        priority: assignForm.priority === 'High' ? 'HIGH' : assignForm.priority === 'Low' ? 'LOW' : 'MEDIUM',
        assigned_staff_id: selectedStaff.id,
        due_time: dueTimeISO ?? new Date().toISOString(),
        notes: assignForm.notes || null,
      })
      deleteTaskMutation.mutate(originalTask.id)
      setAssigningTask(null)
      setAssignForm({ staff: '', room: '', priority: 'High', dueTime: '', notes: '' })
    } catch {
      return
    }
  }

  const handleCompleteTask = (taskId: string) => {
    if (!propertyId) return
    const originalTask = apiTasks.find(t => t.id.startsWith(taskId))
    if (!originalTask) return
    completeTaskMutation.mutate(originalTask.id)
    setViewingTask(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <HousekeepingHeader />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <HousekeepingStats stats={roomStats} activeFilter={statusFilter} onFilterChange={(s) => { setStatusFilter(s); setCurrentPage(1) }} />

          <HousekeepingTabs
            activeTab={topTab}
            onTabChange={setTopTab}
            onBulkAction={() => setShowBulkAction(true)}
            onReviewMaintenance={() => setShowReviewMaintenance(true)}
            onAssignTask={() => {
              setCreateForm({ room: '', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' })
              setShowCreateTask(true)
            }}
          />

          {/* ============ ROOM STATUS TAB ============ */}
          {topTab === 'Room Status' && (
            <>
              <HousekeepingFilters
                search={roomSearch}
                onSearchChange={setRoomSearch}
                floor={floorFilter}
                onFloorChange={setFloorFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                roomType={roomTypeFilter}
                onRoomTypeChange={setRoomTypeFilter}
                date={dateFilter}
                onDateChange={setDateFilter}
              />

              <HousekeepingTable
                rooms={paginatedRooms}
                onViewRoom={setViewingRoom}
                onMoreActions={(room, action) => {
                  if (action === 'menu') {
                    setViewingRoom(room)
                  }
                }}
              />

              <HousekeepingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredRooms.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* ============ HOUSEKEEPING TASKS TAB ============ */}
          {topTab === 'Housekeeping Tasks' && (
            <>
              <TaskFilters
                search={taskSearch}
                onSearchChange={setTaskSearch}
                status={taskStatusFilter}
                onStatusChange={setTaskStatusFilter}
                priority={priorityFilter}
                onPriorityChange={setPriorityFilter}
                room={roomFilter}
                onRoomChange={setRoomFilter}
              />

              <TaskTable
                tasks={filteredTasks}
                onViewTask={setViewingTask}
                onAssignTask={(task) => {
                  setAssigningMode('assign')
                  setAssigningTask(task)
                }}
                onCompleteTask={handleCompleteTask}
              />
            </>
          )}

          {/* ============ STAFF ASSIGNMENT TAB ============ */}
          {topTab === 'Staff Assignments' && (
            <StaffAssignmentView
              staffWorkSummary={staffWorkSummary}
              staffOptions={staffOptions}
            />
          )}
        </main>
      </div>

      {/* ============ TASK MODALS ============ */}

      {/* View Task Modal */}
      {viewingTask && (
        <div onClick={() => setViewingTask(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Task Details</h3>
              <button onClick={() => setViewingTask(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>x</button>
            </div>
            <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{viewingTask.id}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{viewingTask.room} - {viewingTask.taskType}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: viewingTask.status === 'Completed' ? '#D1FAE5' : viewingTask.status === 'In Progress' ? '#EDE9FE' : '#FEF3C7', color: viewingTask.status === 'Completed' ? '#065F46' : viewingTask.status === 'In Progress' ? '#5B21B6' : '#92400E' }}>
                  {viewingTask.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Priority</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingTask.priority}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Assigned To</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingTask.assignedTo || 'Unassigned'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Due Time</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingTask.dueTime}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Task Type</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingTask.taskType}</div>
              </div>
            </div>
            {viewingTask.notes && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{viewingTask.notes}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {viewingTask.status !== 'Completed' && (
                <button onClick={() => handleCompleteTask(viewingTask.id)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Mark Complete</button>
              )}
              <button onClick={() => { setViewingTask(null); setAssigningMode('reassign'); setAssigningTask(viewingTask); setAssignForm({ staff: viewingTask.assignedTo || '', room: viewingTask.room, priority: viewingTask.priority, dueTime: '', notes: '' }) }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Reassign</button>
              <button onClick={() => setViewingTask(null)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <div onClick={() => setShowCreateTask(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>Create Housekeeping Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Room *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.room} onChange={e => setCreateForm({ ...createForm, room: e.target.value })}>
                  <option value="">Select room</option>
                  {roomOptionsList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Task Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.taskType} onChange={e => setCreateForm({ ...createForm, taskType: e.target.value })}>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Linen Change">Linen Change</option>
                  <option value="Deep Cleaning">Deep Cleaning</option>
                  <option value="Bathroom Cleaning">Bathroom Cleaning</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.priority} onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Assign Staff *</label>
                {renderStaffField(createForm.assignedStaff, (name) => setCreateForm({ ...createForm, assignedStaff: name }), true)}
              </div>
              <div>
                <label style={labelStyle}>Due Time</label>
                <input type="time" style={inputStyle} value={createForm.dueTime} onChange={e => setCreateForm({ ...createForm, dueTime: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Any additional notes..." value={createForm.notes} onChange={e => setCreateForm({ ...createForm, notes: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowCreateTask(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={handleCreateTask} disabled={createTaskMutation.isPending} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: createTaskMutation.isPending ? 0.6 : 1 }}>
                {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assigningTask && (
        <div onClick={() => setAssigningTask(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Assign Task</h3>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 16px' }}>{assigningTask.id} - {assigningTask.room} - {assigningTask.taskType}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Staff *</label>
                {renderStaffField(assignForm.staff, (name) => setAssignForm({ ...assignForm, staff: name }))}
              </div>
              <div>
                <label style={labelStyle}>Room *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.room} onChange={e => setAssignForm({ ...assignForm, room: e.target.value })}>
                  <option value="">Select room</option>
                  {roomOptionsList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.priority} onChange={e => setAssignForm({ ...assignForm, priority: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Due Time</label>
                <input type="time" style={inputStyle} value={assignForm.dueTime} onChange={e => setAssignForm({ ...assignForm, dueTime: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Any additional notes..." value={assignForm.notes} onChange={e => setAssignForm({ ...assignForm, notes: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setAssigningTask(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={handleAssignTask} disabled={createTaskMutation.isPending || updateTaskMutation.isPending} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: (createTaskMutation.isPending || updateTaskMutation.isPending) ? 0.6 : 1 }}>
                {createTaskMutation.isPending ? 'Creating...' : updateTaskMutation.isPending ? 'Assigning...' : assigningMode === 'reassign' ? 'Reassign' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {viewingRoom && (
        <div onClick={() => setViewingRoom(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Room Details</h3>
              <button onClick={() => setViewingRoom(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>x</button>
            </div>
            <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Room {viewingRoom.roomNumber}</div>
                  <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{viewingRoom.roomType} - {viewingRoom.bedDescription}</div>
                </div>
                <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: viewingRoom.status === 'Clean' ? '#D1FAE5' : viewingRoom.status === 'Dirty' ? '#FEE2E2' : viewingRoom.status === 'In Progress' ? '#EDE9FE' : '#FEE2E2', color: viewingRoom.status === 'Clean' ? '#065F46' : viewingRoom.status === 'Dirty' ? '#991B1B' : viewingRoom.status === 'In Progress' ? '#5B21B6' : '#991B1B' }}>
                  {viewingRoom.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Floor</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingRoom.floor}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Assigned To</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingRoom.assignedTo || 'Unassigned'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Last Cleaned</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingRoom.lastCleaned || 'Never'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Next Cleaning</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{viewingRoom.nextCleaning || 'Not scheduled'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => {
                setViewingRoom(null)
                setCreateForm({ room: `Room ${viewingRoom.roomNumber}`, taskType: 'Cleaning', priority: 'High', assignedStaff: viewingRoom.assignedTo || '', dueTime: '11:00', notes: '' })
                setShowCreateTask(true)
              }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--primary)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Create Task</button>
              <button onClick={() => setViewingRoom(null)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Maintenance Modal */}
      <ReviewMaintenanceModal
        isOpen={showReviewMaintenance}
        onClose={() => setShowReviewMaintenance(false)}
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={showBulkAction}
        onClose={() => setShowBulkAction(false)}
        rooms={rooms}
        staffOptions={assignableStaff}
        roomOptions={taskRoomOptions}
        taskTypes={taskTypes}
        onBulkAssign={(tasks) => bulkAssignMutation.mutate(tasks)}
      />
    </div>
  )
}
