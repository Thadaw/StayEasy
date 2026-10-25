import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { usePropertyStore } from '@/store/properties/propertyStore'
import { useHousekeepingStore } from '@/store/admin/housekeepingStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import HousekeepingHeader from '@/components/admin/housekeeping/HousekeepingHeader'
import HousekeepingStats from '@/components/admin/housekeeping/HousekeepingStats'
import HousekeepingFilters from '@/components/admin/housekeeping/HousekeepingFilters'
import HousekeepingTable from '@/components/admin/housekeeping/HousekeepingTable'
import HousekeepingTabs from '@/components/admin/housekeeping/HousekeepingTabs'
import HousekeepingPagination from '@/components/admin/housekeeping/HousekeepingPagination'
import TaskFilters from '@/components/admin/housekeeping/TaskFilters'
import TaskTable from '@/components/admin/housekeeping/TaskTable'
import StaffAssignmentView from '@/components/admin/housekeeping/StaffAssignmentView'
import ReviewMaintenanceModal from '@/components/admin/housekeeping/ReviewMaintenanceModal'
import BulkActionModal from '@/components/admin/housekeeping/BulkActionModal'
import CreateTaskModal from '@/components/admin/housekeeping/CreateTaskModal'
import AssignTaskModal from '@/components/admin/housekeeping/AssignTaskModal'
import TaskDetailModal from '@/components/admin/housekeeping/TaskDetailModal'
import RoomDetailModal from '@/components/admin/housekeeping/RoomDetailModal'
import {
  mapApiRoomToHousekeeping,
  mapApiTaskToFrontend,
  toFutureDueTime,
} from '@/components/admin/housekeeping/housekeepingUtils'
import {
  useHousekeepingPropertiesQuery,
  useHousekeepingRoomsQuery,
  useHousekeepingStaffOptionsQuery,
  useHousekeepingTasksQuery,
  useRoomStatusSummaryQuery,
  useStaffWorkSummaryQuery,
  useTaskRoomOptionsQuery,
  useTaskTypesQuery,
} from '@/services/queries/admin/housekeepingQueries'
import {
  useBulkAssignHousekeepingTasks,
  useCompleteHousekeepingTask,
  useCreateHousekeepingTask,
  useDeleteHousekeepingTask,
  useUpdateHousekeepingTask,
} from '@/services/mutations/admin/housekeepingMutations'
import type { AssignTaskFormData, CreateTaskFormData } from '@/schemas/admin/housekeepingSchema'
import type {
  ApiStaffOption,
  ApiTaskListItem,
  HousekeepingRoom,
  HousekeepingTask,
  RoomStats,
} from '@/types/housekeeping'

export default function HousekeepingPage() {
  const {
    topTab,
    setTopTab,
    roomSearch,
    setRoomSearch,
    floorFilter,
    setFloorFilter,
    statusFilter,
    setStatusFilter,
    roomTypeFilter,
    setRoomTypeFilter,
    dateFilter,
    setDateFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    taskSearch,
    setTaskSearch,
    taskStatusFilter,
    setTaskStatusFilter,
    priorityFilter,
    setPriorityFilter,
    roomFilter,
    setRoomFilter,
    showCreateTask,
    createPrefill,
    openCreateTask,
    closeCreateTask,
    viewingTask,
    setViewingTask,
    assigningTask,
    assigningMode,
    openAssignTask,
    closeAssignTask,
    viewingRoom,
    setViewingRoom,
    showReviewMaintenance,
    setShowReviewMaintenance,
    showBulkAction,
    setShowBulkAction,
  } = useHousekeepingStore()

  const { data: properties = [] } = useHousekeepingPropertiesQuery()

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const propertyId = properties.find((p) => p.id === currentPropertyId)?.id ?? properties[0]?.id

  // ─── API Queries ──────────────────────────────────────────

  const { data: apiRooms = [] } = useHousekeepingRoomsQuery(propertyId)
  const { data: roomSummary } = useRoomStatusSummaryQuery(propertyId)
  const { data: apiTasks = [] } = useHousekeepingTasksQuery(propertyId)
  const { data: staffOptions = [] } = useHousekeepingStaffOptionsQuery(propertyId)
  const { data: taskRoomOptions = [] } = useTaskRoomOptionsQuery(propertyId)
  const { data: staffWorkSummary = [] } = useStaffWorkSummaryQuery(propertyId)
  const { data: taskTypes = [] } = useTaskTypesQuery(propertyId)

  // ─── Mutations ────────────────────────────────────────────

  const createTaskMutation = useCreateHousekeepingTask(propertyId)
  const deleteTaskMutation = useDeleteHousekeepingTask(propertyId)
  const updateTaskMutation = useUpdateHousekeepingTask(propertyId)
  const completeTaskMutation = useCompleteHousekeepingTask(propertyId)
  const bulkAssignMutation = useBulkAssignHousekeepingTasks(propertyId)

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

  const handleCreateTask = (data: CreateTaskFormData) => {
    if (!propertyId) return
    const selectedRoom = taskRoomOptions.find(r => r.name === data.room)
    if (!selectedRoom) {
      toast.error('Please select a room')
      return
    }
    const selectedStaff = assignableStaff.find(s => s.name === data.assignedStaff)
    if (!selectedStaff) {
      toast.error('Please assign a staff member')
      return
    }

    const dueTimeISO = data.dueTime ? toFutureDueTime(data.dueTime) : new Date().toISOString()

    createTaskMutation.mutate({
      room_id: selectedRoom.id,
      task_type: data.taskType === 'Cleaning' ? 'ROOM_CLEANING' : data.taskType === 'Linen Change' ? 'LINEN_CHANGE' : data.taskType === 'Deep Cleaning' ? 'DEEP_CLEANING' : 'ROOM_CLEANING',
      assigned_staff_id: selectedStaff.id,
      due_time: dueTimeISO,
      priority: data.priority === 'High' ? 'HIGH' : data.priority === 'Low' ? 'LOW' : 'MEDIUM',
      notes: data.notes || null,
    })
    closeCreateTask()
  }

  const handleAssignTask = async (data: AssignTaskFormData) => {
    if (!assigningTask || !propertyId) return
    const selectedStaff = assignableStaff.find(s => s.name === data.staff)
    const originalTask = apiTasks.find(t => t.id.startsWith(assigningTask.id))
    if (!selectedStaff) {
      toast.error('Please assign a staff member')
      return
    }
    if (!originalTask) return

    if (assigningMode === 'reassign') {
      updateTaskMutation.mutate({
        taskId: originalTask.id,
        data: {
          assigned_staff_id: selectedStaff.id,
          ...(data.priority ? { priority: data.priority === 'High' ? 'HIGH' : data.priority === 'Low' ? 'LOW' : 'MEDIUM' } : {}),
          ...(data.dueTime ? { due_time: toFutureDueTime(data.dueTime) } : {}),
        },
      })
      closeAssignTask()
      return
    }

    const selectedRoom = taskRoomOptions.find(r => r.name === data.room)
    const dueTimeISO = data.dueTime ? toFutureDueTime(data.dueTime) : originalTask.due_time

    try {
      await createTaskMutation.mutateAsync({
        room_id: selectedRoom?.id ?? originalTask.room_id,
        task_type: originalTask.task_type,
        priority: data.priority === 'High' ? 'HIGH' : data.priority === 'Low' ? 'LOW' : 'MEDIUM',
        assigned_staff_id: selectedStaff.id,
        due_time: dueTimeISO ?? new Date().toISOString(),
        notes: data.notes || null,
      })
      deleteTaskMutation.mutate(originalTask.id)
      closeAssignTask()
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
            onAssignTask={() => openCreateTask()}
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
                onAssignTask={(task) => openAssignTask(task, 'assign')}
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

      {viewingTask && (
        <TaskDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onComplete={handleCompleteTask}
          onReassign={(task) => { setViewingTask(null); openAssignTask(task, 'reassign') }}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          roomOptions={roomOptionsList}
          staffOptions={assignableStaff}
          initialRoom={createPrefill?.room}
          initialStaff={createPrefill?.assignedStaff}
          isSubmitting={createTaskMutation.isPending}
          onClose={closeCreateTask}
          onSubmit={handleCreateTask}
        />
      )}

      {assigningTask && (
        <AssignTaskModal
          task={assigningTask}
          mode={assigningMode}
          roomOptions={roomOptionsList}
          staffOptions={assignableStaff}
          isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
          onClose={closeAssignTask}
          onSubmit={handleAssignTask}
        />
      )}

      {viewingRoom && (
        <RoomDetailModal
          room={viewingRoom}
          onClose={() => setViewingRoom(null)}
          onCreateTask={(room) => {
            setViewingRoom(null)
            openCreateTask({ room: `Room ${room.roomNumber}`, assignedStaff: room.assignedTo || '' })
          }}
        />
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
