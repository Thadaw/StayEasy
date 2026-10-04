import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerHousekeepingStats from '../../components/manager/housekeeping/ManagerHousekeepingStats'
import HousekeepingTabsBar from '../../components/manager/housekeeping/HousekeepingTabsBar'
import HousekeepingFilterBar, { type FilterOption } from '../../components/manager/housekeeping/HousekeepingFilterBar'
import RoomScheduleCard from '../../components/manager/housekeeping/RoomScheduleCard'
import CleaningProgressCard from '../../components/manager/housekeeping/CleaningProgressCard'
import StaffWorkloadCard from '../../components/manager/housekeeping/StaffWorkloadCard'
import RoomStatusDistributionCard from '../../components/manager/housekeeping/RoomStatusDistributionCard'
import {
  CLEANING_STATUSES,
  DEMO_DISTRIBUTION,
  DEMO_SCHEDULE_ROWS,
  DEMO_STATS,
  DEMO_STAFF_OPTIONS,
  DEMO_STAFF_WORK_SUMMARY,
  DEMO_TASKS,
  DEMO_TASK_TYPES,
  DEMO_WORKLOAD,
  PRIORITY_COLORS,
  CLEANING_STATUS_COLORS,
  buildDemoSchedule,
  buildStatCards,
  buildRoomOptions,
  ordinal,
  toHousekeepingRooms,
  type CleaningStatus,
  type HousekeepingStatValues,
  type SchedulePriority,
  type ScheduleRow,
} from '../../components/manager/housekeeping/demoHousekeeping'
import TaskFilters from '../../components/housekeeping/TaskFilters'
import TaskTable from '../../components/housekeeping/TaskTable'
import StaffAssignmentView from '../../components/housekeeping/StaffAssignmentView'
import BulkActionModal from '../../components/housekeeping/BulkActionModal'
import ReviewMaintenanceModal from '../../components/housekeeping/ReviewMaintenanceModal'
import AssignTaskModal, { type AssignTaskValues } from '../../components/manager/staff/AssignTaskModal'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import { getAllProperties, getHousekeepingRooms, getRoomStatusSummary, getTasks, getHousekeepingStaffOptions, getTaskRoomOptions, getStaffWorkSummary, getTaskTypes, getRoomTypes, bulkAssignTasks } from '../../services/pmsApi'
import { propertyKeys, housekeepingKeys, roomTypeKeys } from '../../lib/queryKeys'
import type {
  ApiRoomStatus,
  ApiRoomStatusSummary,
  ApiTaskListItem,
  ApiStaffOption,
  ApiRoomOption,
  ApiStaffWorkSummary,
  ApiTaskTypeOption,
  HousekeepingTask,
} from '../../types/housekeeping'
import type { RoomTypeResponse } from '../../types/pms'

const PAGE_SIZE = 8
const DEMO_UPDATED_AT = 'Apr 28, 2025 - 11:30 AM'

const apiStatusMap: Record<string, CleaningStatus> = {
  AVAILABLE: 'Clean',
  INSPECTED: 'Clean',
  OCCUPIED: 'Dirty',
  BOOKED: 'Dirty',
  DIRTY: 'Dirty',
  CLEANING: 'In Progress',
  IN_PROGRESS: 'In Progress',
  MAINTENANCE: 'Maintenance Required',
  OUT_OF_ORDER: 'Maintenance Required',
  OUT_OF_SERVICE: 'Maintenance Required',
  BLOCKED: 'Maintenance Required',
}

function formatStamp(iso: string | null | undefined): string {
  if (!iso) return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  if (day === startOfToday) return time
  if (day === startOfToday - 86400000) return `Yesterday ${time}`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function mapPriority(task: ApiTaskListItem | undefined): SchedulePriority {
  if (!task) return 'Low'
  if (task.priority === 'HIGH') {
    const overdue = task.due_time ? new Date(task.due_time).getTime() < Date.now() : false
    return overdue ? 'Urgent' : 'High'
  }
  return task.priority === 'LOW' ? 'Low' : 'Medium'
}

export default function ManagerHousekeepingPage() {
  const queryClient = useQueryClient()
  const assignedPropertyId = useManagerPropertyStore(s => s.assignedPropertyId)

  const [topTab, setTopTab] = useState('Room Status')
  const [search, setSearch] = useState('')
  const [floor, setFloor] = useState('')
  const [status, setStatus] = useState('')
  const [staff, setStaff] = useState('')
  const [date, setDate] = useState('2025-04-28')
  const [currentPage, setCurrentPage] = useState(1)

  const [taskSearch, setTaskSearch] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskRoom, setTaskRoom] = useState('')
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])

  const [showBulkAction, setShowBulkAction] = useState(false)
  const [showReviewMaintenance, setShowReviewMaintenance] = useState(false)
  const [showAssignTask, setShowAssignTask] = useState(false)
  const [viewingRow, setViewingRow] = useState<ScheduleRow | null>(null)
  const [viewingTask, setViewingTask] = useState<HousekeepingTask | null>(null)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
  const property = properties.find(p => p.id === assignedPropertyId) ?? properties[0] ?? null
  const propertyId = property?.id ?? ''

  const { data: apiRooms = [] } = useQuery<ApiRoomStatus[]>({
    queryKey: housekeepingKeys.rooms(propertyId),
    queryFn: () => getHousekeepingRooms(propertyId),
    enabled: !!propertyId,
  })
  const { data: roomSummary } = useQuery<ApiRoomStatusSummary>({
    queryKey: housekeepingKeys.roomSummary(propertyId),
    queryFn: () => getRoomStatusSummary(propertyId),
    enabled: !!propertyId,
  })
  const { data: apiTasks = [] } = useQuery<ApiTaskListItem[]>({
    queryKey: housekeepingKeys.tasks(propertyId),
    queryFn: () => getTasks(propertyId, { limit: 100 }),
    enabled: !!propertyId,
  })
  const { data: apiStaffOptions = [] } = useQuery<ApiStaffOption[]>({
    queryKey: housekeepingKeys.staffOptions(propertyId),
    queryFn: () => getHousekeepingStaffOptions(propertyId),
    enabled: !!propertyId,
  })
  const { data: apiRoomOptions = [] } = useQuery<ApiRoomOption[]>({
    queryKey: housekeepingKeys.roomOptions(propertyId),
    queryFn: () => getTaskRoomOptions(propertyId),
    enabled: !!propertyId,
  })
  const { data: apiStaffWork = [] } = useQuery<ApiStaffWorkSummary[]>({
    queryKey: housekeepingKeys.staffWorkSummary(propertyId),
    queryFn: () => getStaffWorkSummary(propertyId),
    enabled: !!propertyId,
  })
  const { data: apiTaskTypes = [] } = useQuery<ApiTaskTypeOption[]>({
    queryKey: housekeepingKeys.taskTypes(propertyId),
    queryFn: () => getTaskTypes(propertyId),
    enabled: !!propertyId,
  })
  const { data: roomTypes = [] } = useQuery<RoomTypeResponse[]>({
    queryKey: roomTypeKeys.byProperty(propertyId),
    queryFn: () => getRoomTypes(propertyId),
    enabled: !!propertyId,
  })

  const bulkAssignMutation = useMutation({
    mutationFn: (tasks: import('../../types/housekeeping').BulkAssignTaskItem[]) => bulkAssignTasks(propertyId, tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId) })
      toast.success('Bulk assignments applied')
    },
    onError: () => toast.error('Failed to apply bulk assignments'),
  })

  const demoRows = useMemo(() => buildDemoSchedule(), [])

  const rows: ScheduleRow[] = useMemo(() => {
    if (apiRooms.length === 0) return demoRows
    return apiRooms.map((room, index) => {
      const roomTasks = apiTasks.filter(t => t.room_id === room.id || t.room_name === room.room_name)
      const active =
        roomTasks.find(t => t.status === 'IN_PROGRESS') ??
        roomTasks.find(t => t.status === 'PENDING')
      const awaitingInspection = roomTasks.find(t => t.status === 'AWAITING_INSPECTION')
      const completed = roomTasks
        .filter(t => t.status === 'COMPLETED' && t.completed_at)
        .sort((a, b) => new Date(b.completed_at as string).getTime() - new Date(a.completed_at as string).getTime())[0]

      let roomStatus: CleaningStatus = apiStatusMap[room.status || ''] ?? 'Clean'
      if (awaitingInspection) roomStatus = 'Inspection Required'

      const roomType = roomTypes.find(rt => rt.id === room.room_type_id)?.room_type_name
      const floorNumber = room.floor_number || 1

      return {
        id: room.id,
        room: room.room_name || String(101 + index),
        roomType: roomType || room.room_type_id || 'Room',
        floor: ordinal(floorNumber),
        status: roomStatus,
        assignedTo: active?.assigned_staff_name || null,
        lastCleaned: formatStamp(completed?.completed_at),
        priority: mapPriority(active),
      }
    })
  }, [apiRooms, apiTasks, roomTypes, demoRows])

  const stats: HousekeepingStatValues = useMemo(() => {
    if (roomSummary) {
      const clean = roomSummary.available_rooms + roomSummary.inspected_rooms
      const readyCount = rows.filter(r => r.status === 'Ready for Check-in').length
      return {
        total: roomSummary.total_rooms,
        clean,
        dirty: roomSummary.dirty_rooms,
        inProgress: roomSummary.in_progress_rooms + roomSummary.cleaning_rooms,
        maintenance: roomSummary.out_of_service_rooms + roomSummary.maintenance_rooms,
        ready: readyCount > 0 ? readyCount : Math.round(clean * 0.19),
      }
    }
    if (apiRooms.length > 0) {
      const count = (s: CleaningStatus) => rows.filter(r => r.status === s).length
      const clean = count('Clean') + count('Ready for Check-in')
      return {
        total: rows.length,
        clean,
        dirty: count('Dirty'),
        inProgress: count('In Progress'),
        maintenance: count('Maintenance Required'),
        ready: count('Ready for Check-in') > 0 ? count('Ready for Check-in') : Math.round(clean * 0.19),
      }
    }
    return DEMO_STATS
  }, [roomSummary, apiRooms, rows])

  const floorCount = useMemo(() => new Set(rows.map(r => r.floor)).size || 6, [rows])
  const statCards = useMemo(() => buildStatCards(stats, floorCount), [stats, floorCount])

  const distribution = useMemo(() => {
    if (apiRooms.length === 0) return DEMO_DISTRIBUTION
    const total = stats.total || 1
    const inspection = rows.filter(r => r.status === 'Inspection Required').length
    return [
      { label: 'Clean', count: stats.clean, color: '#22C55E' },
      { label: 'Dirty', count: stats.dirty, color: '#EF4444' },
      { label: 'In Progress', count: stats.inProgress, color: '#3B82F6' },
      { label: 'Inspection', count: inspection, color: '#F59E0B' },
      { label: 'Maintenance', count: stats.maintenance, color: '#374151' },
    ].map(entry => ({ ...entry, percent: Math.round((entry.count / total) * 100) }))
  }, [apiRooms, rows, stats])

  const workload = useMemo(() => {
    if (apiStaffWork.length > 0) {
      return apiStaffWork
        .filter(s => s.staff_name)
        .slice(0, 5)
        .map(s => ({ name: s.staff_name.split(' ')[0], tasks: s.pending + s.in_progress }))
    }
    return DEMO_WORKLOAD
  }, [apiStaffWork])

  const floorOptions = useMemo<FilterOption[]>(
    () => [
      { value: '', label: 'All Floors' },
      ...[...new Set(rows.map(r => r.floor))].map(f => ({ value: f, label: `${f} Floor` })),
    ],
    [rows],
  )
  const statusOptions = useMemo<FilterOption[]>(
    () => [
      { value: '', label: 'All Status' },
      ...CLEANING_STATUSES.filter(s => rows.some(r => r.status === s)).map(s => ({ value: s, label: s })),
    ],
    [rows],
  )
  const staffOptions = useMemo<FilterOption[]>(
    () => [
      { value: '', label: 'All Housekeeping Staff' },
      ...[...new Set(rows.map(r => r.assignedTo).filter((name): name is string => !!name))].map(name => ({
        value: name,
        label: name,
      })),
    ],
    [rows],
  )

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter(row => {
      const matchSearch = !query || row.room.toLowerCase().includes(query) || row.roomType.toLowerCase().includes(query)
      const matchFloor = !floor || row.floor === floor
      const matchStatus = !status || row.status === status
      const matchStaff = !staff || row.assignedTo === staff
      return matchSearch && matchFloor && matchStatus && matchStaff
    })
  }, [rows, search, floor, status, staff])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const demoTasks = useMemo(() => DEMO_TASKS.filter(t => !completedTaskIds.includes(t.id)), [completedTaskIds])
  const tasks = apiTasks.length > 0
    ? apiTasks.map<HousekeepingTask>(t => ({
        id: t.id.slice(0, 8),
        room: t.room_name,
        taskType: 'Cleaning',
        priority: t.priority === 'HIGH' ? 'High' : t.priority === 'LOW' ? 'Low' : 'Medium',
        assignedTo: t.assigned_staff_name || null,
        dueTime: formatStamp(t.due_time),
        status: t.status === 'COMPLETED' ? 'Completed' : t.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending',
        notes: t.notes || undefined,
      }))
    : demoTasks

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase()
    return tasks.filter(task => {
      const matchSearch = !query || task.id.toLowerCase().includes(query) || task.room.toLowerCase().includes(query)
      const matchStatus = !taskStatus || task.status === taskStatus
      const matchPriority = !taskPriority || task.priority === taskPriority
      const matchRoom = !taskRoom || task.room === taskRoom
      return matchSearch && matchStatus && matchPriority && matchRoom
    })
  }, [tasks, taskSearch, taskStatus, taskPriority, taskRoom])

  const bulkRooms = useMemo(() => toHousekeepingRooms(rows.slice(0, 40)), [rows])
  const bulkStaffOptions = apiStaffOptions.length > 0 ? apiStaffOptions : DEMO_STAFF_OPTIONS
  const bulkRoomOptions = apiRoomOptions.length > 0 ? apiRoomOptions : buildRoomOptions(DEMO_SCHEDULE_ROWS)
  const bulkTaskTypes = apiTaskTypes.length > 0 ? apiTaskTypes : DEMO_TASK_TYPES
  const staffForAssign = apiStaffWork.length > 0 ? apiStaffWork : DEMO_STAFF_WORK_SUMMARY
  const staffOptionsForAssign = apiStaffOptions.length > 0 ? apiStaffOptions : DEMO_STAFF_OPTIONS

  const applyFilter = (value: string) => {
    setStatus(value)
    setCurrentPage(1)
  }

  const handleBulkAssign = (tasksToAssign: import('../../types/housekeeping').BulkAssignTaskItem[]) => {
    setShowBulkAction(false)
    if (propertyId && apiRooms.length > 0) {
      bulkAssignMutation.mutate(tasksToAssign)
      return
    }
    toast.success('Bulk assignments applied')
  }

  const handleAssignTask = (values: AssignTaskValues) => {
    setShowAssignTask(false)
    toast.success(`Task assigned to ${values.employee.split(' – ')[0]}`)
  }

  const handleCompleteTask = (taskId: string) => {
    setCompletedTaskIds(prev => [...prev, taskId])
    setViewingTask(null)
    toast.success('Task marked complete')
  }

  const progressPercent = stats.total > 0 ? Math.round((stats.clean / stats.total) * 100) : 0
  const progressInProgress = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0

  return (
    <ManagerLayout
      title="Housekeeping"
      subtitle="Manage room cleaning & housekeeping operations."
      searchPlaceholder="Search rooms, staff, tasks..."
      breadcrumb={
        <span>
          <Link to="/manager/dashboard" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: '#374151', fontWeight: 600 }}>Housekeeping</span>
        </span>
      }
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <ManagerHousekeepingStats cards={statCards} activeFilter={status} onFilterChange={applyFilter} />

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <HousekeepingTabsBar
            activeTab={topTab}
            onTabChange={setTopTab}
            onBulkAction={() => setShowBulkAction(true)}
            onReviewMaintenance={() => setShowReviewMaintenance(true)}
            onAssignTask={() => setShowAssignTask(true)}
          />
          {topTab === 'Room Status' && (
            <div className="mt-4">
              <HousekeepingFilterBar
                search={search}
                onSearchChange={value => {
                  setSearch(value)
                  setCurrentPage(1)
                }}
                floor={floor}
                onFloorChange={value => {
                  setFloor(value)
                  setCurrentPage(1)
                }}
                floorOptions={floorOptions}
                status={status}
                onStatusChange={applyFilter}
                statusOptions={statusOptions}
                staff={staff}
                onStaffChange={value => {
                  setStaff(value)
                  setCurrentPage(1)
                }}
                staffOptions={staffOptions}
                date={date}
                onDateChange={setDate}
              />
            </div>
          )}
        </div>

        {topTab === 'Room Status' && (
          <div className="grid grid-cols-1 items-start gap-4 min-[1440px]:grid-cols-[minmax(0,1fr)_310px] min-[1600px]:grid-cols-[minmax(0,1fr)_340px]">
            <RoomScheduleCard
              rows={pageRows}
              totalRows={filteredRows.length}
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onRowActions={setViewingRow}
            />
            <div className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2 min-[1440px]:grid-cols-1">
              <CleaningProgressCard
                updatedAt={apiRooms.length > 0 ? formatStamp(new Date().toISOString()) : DEMO_UPDATED_AT}
                percent={progressPercent}
                cleanCount={stats.clean}
                inProgressCount={stats.inProgress}
                totalCount={stats.total}
                inProgressPercent={progressInProgress}
              />
              <StaffWorkloadCard workload={workload} />
              <RoomStatusDistributionCard entries={distribution} totalRooms={stats.total} />
            </div>
          </div>
        )}

        {topTab === 'Housekeeping Tasks' && (
          <>
            <TaskFilters
              search={taskSearch}
              onSearchChange={setTaskSearch}
              status={taskStatus}
              onStatusChange={setTaskStatus}
              priority={taskPriority}
              onPriorityChange={setTaskPriority}
              room={taskRoom}
              onRoomChange={setTaskRoom}
            />
            <TaskTable
              tasks={filteredTasks}
              onViewTask={setViewingTask}
              onAssignTask={() => setShowAssignTask(true)}
              onCompleteTask={handleCompleteTask}
            />
          </>
        )}

        {topTab === 'Staff Assignments' && (
          <StaffAssignmentView staffWorkSummary={staffForAssign} staffOptions={staffOptionsForAssign} />
        )}
      </div>

      {viewingRow && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewingRow(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="m-0 text-[18px] font-bold text-[#111827]">Room Details</h3>
              <button
                type="button"
                onClick={() => setViewingRow(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#6B7280]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 flex items-start justify-between gap-3 rounded-[10px] bg-[#F9FAFB] p-4">
              <div>
                <div className="text-[20px] font-bold text-[#111827]">Room {viewingRow.room}</div>
                <div className="mt-1 text-[13px] text-[#6B7280]">{viewingRow.roomType}</div>
              </div>
              <span
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold"
                style={{
                  background: CLEANING_STATUS_COLORS[viewingRow.status].bg,
                  color: CLEANING_STATUS_COLORS[viewingRow.status].text,
                }}
              >
                {viewingRow.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Floor</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingRow.floor}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Assigned Staff</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingRow.assignedTo ?? 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Last Cleaned</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingRow.lastCleaned}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Priority</div>
                <span
                  className="mt-0.5 inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold"
                  style={{
                    background: PRIORITY_COLORS[viewingRow.priority].bg,
                    color: PRIORITY_COLORS[viewingRow.priority].text,
                  }}
                >
                  {viewingRow.priority}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingRow(null)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewingRow(null)
                  setShowAssignTask(true)
                }}
                className="rounded-lg bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E293B]"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingTask && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewingTask(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="m-0 text-[18px] font-bold text-[#111827]">Task Details</h3>
              <button
                type="button"
                onClick={() => setViewingTask(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#6B7280]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 rounded-[10px] bg-[#F9FAFB] p-4">
              <div className="text-[15px] font-bold text-[#111827]">{viewingTask.id}</div>
              <div className="mt-1 text-[13px] text-[#6B7280]">
                Room {viewingTask.room} · {viewingTask.taskType}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Priority</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingTask.priority}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Assigned To</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingTask.assignedTo ?? 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Due Time</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingTask.dueTime}</div>
              </div>
              <div>
                <div className="text-[12px] text-[#9CA3AF]">Status</div>
                <div className="text-[14px] font-medium text-[#374151]">{viewingTask.status}</div>
              </div>
            </div>

            {viewingTask.notes && (
              <div className="mt-4">
                <div className="text-[12px] text-[#9CA3AF]">Notes</div>
                <div className="mt-1 text-[14px] text-[#374151]">{viewingTask.notes}</div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2.5">
              {viewingTask.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleCompleteTask(viewingTask.id)}
                  className="rounded-lg bg-[#059669] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#047857]"
                >
                  Mark Complete
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingTask(null)}
                className="rounded-lg bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1E293B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BulkActionModal
        isOpen={showBulkAction}
        onClose={() => setShowBulkAction(false)}
        rooms={bulkRooms}
        staffOptions={bulkStaffOptions}
        roomOptions={bulkRoomOptions}
        taskTypes={bulkTaskTypes}
        onBulkAssign={handleBulkAssign}
      />

      <ReviewMaintenanceModal isOpen={showReviewMaintenance} onClose={() => setShowReviewMaintenance(false)} />

      {showAssignTask && <AssignTaskModal onClose={() => setShowAssignTask(false)} onAssign={handleAssignTask} />}
    </ManagerLayout>
  )
}
