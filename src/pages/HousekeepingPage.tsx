import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import HousekeepingStats from '../components/housekeeping/HousekeepingStats'
import HousekeepingFilters from '../components/housekeeping/HousekeepingFilters'
import HousekeepingTable from '../components/housekeeping/HousekeepingTable'
import HousekeepingTabs from '../components/housekeeping/HousekeepingTabs'
import HousekeepingPagination from '../components/housekeeping/HousekeepingPagination'
import TaskFilters from '../components/housekeeping/TaskFilters'
import TaskTable, { allTasks } from '../components/housekeeping/TaskTable'
import StaffAssignmentView from '../components/housekeeping/StaffAssignmentView'
import { getAllProperties, getRooms } from '../services/pmsApi'
import { propertyKeys, roomKeys } from '../lib/queryKeys'
import type { HousekeepingRoom, RoomStats, HousekeepingTask } from '../types/housekeeping'
import type { GeneralInfoResponse, RoomResponse } from '../types/pms'

const staffList = ['Sita Sharma', 'Ram Gurung', 'Maya Rai', 'Anita Lama', 'Bikash Magar', 'Pooja Adhikari']
const roomOptions = ['Room 101', 'Room 102', 'Room 201', 'Room 205', 'Room 305', 'Room 108', 'Room 402', 'Room 401']
const taskTypeOptions = ['Cleaning', 'Linen Change', 'Deep Cleaning', 'Bathroom Cleaning']
const priorityOptions = ['High', 'Medium', 'Low']

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4, display: 'block' }

function mapApiRoomToHousekeeping(apiRoom: RoomResponse, index: number): HousekeepingRoom {
  const statusMap: Record<string, HousekeepingRoom['status']> = {
    AVAILABLE: 'Clean', OCCUPIED: 'Dirty', BOOKED: 'Dirty',
    CLEANING: 'In Progress', DIRTY: 'Dirty', MAINTENANCE: 'Out of Service',
    OUT_OF_ORDER: 'Out of Service', OUT_OF_SERVICE: 'Out of Service',
  }
  const floor = apiRoom.floor_number ? `${apiRoom.floor_number}${apiRoom.floor_number === 1 ? 'st' : apiRoom.floor_number === 2 ? 'nd' : apiRoom.floor_number === 3 ? 'rd' : 'th'} Floor` : '1st Floor'
  return {
    id: index + 1,
    roomNumber: apiRoom.room_name || String(index + 101),
    roomType: apiRoom.room_type_id || 'Room',
    bedDescription: apiRoom.bed_type_id || '1 Bed',
    floor,
    status: statusMap[apiRoom.status || ''] || 'Clean',
    assignedTo: null,
    lastCleaned: null,
    nextCleaning: null,
  }
}

export default function HousekeepingPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [topTab, setTopTab] = useState('Room Status')

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const propertyId = properties.find((p) => p.id === currentPropertyId)?.id ?? properties[0]?.id

  const { data: apiRooms = [] } = useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId ?? ''),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId,
  })

  const rooms: HousekeepingRoom[] = useMemo(
    () => apiRooms.map((r, i) => mapApiRoomToHousekeeping(r, i)),
    [apiRooms]
  )
  const [roomSearch, setRoomSearch] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roomTypeFilter, setRoomTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [activeFloor, setActiveFloor] = useState('All Floors')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [assignedStaffFilter, setAssignedStaffFilter] = useState('')
  const [cleaningStatusFilter, setCleaningStatusFilter] = useState('')

  const [tasks, setTasks] = useState<HousekeepingTask[]>(allTasks)
  const [taskSearch, setTaskSearch] = useState('')
  const [taskStatusFilter, setTaskStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')

  const [showCreateTask, setShowCreateTask] = useState(false)
  const [viewingTask, setViewingTask] = useState<HousekeepingTask | null>(null)
  const [assigningTask, setAssigningTask] = useState<HousekeepingTask | null>(null)
  const [viewingRoom, setViewingRoom] = useState<HousekeepingRoom | null>(null)
  const [createForm, setCreateForm] = useState({ room: 'Room 205', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' })
  const [assignForm, setAssignForm] = useState({ staff: '', priority: 'High', dueTime: '', notes: '' })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const parseDateStr = (dateStr: string | null): string | null => {
    if (!dateStr) return null
    const monthMap: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    }
    const parts = dateStr.split('\n')[0].split(' ')
    if (parts.length >= 3) {
      const month = monthMap[parts[0]]
      const day = parts[1].replace(',', '').padStart(2, '0')
      const year = parts[2]
      if (month) return `${year}-${month}-${day}`
    }
    return null
  }

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = !roomSearch || room.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) || room.roomType.toLowerCase().includes(roomSearch.toLowerCase())
      const matchesFloor = !floorFilter || room.floor === floorFilter
      const matchesStatus = !statusFilter || room.status === statusFilter
      const matchesRoomType = !roomTypeFilter || room.roomType === roomTypeFilter
      const matchesFloorTab = activeFloor === 'All Floors' || room.floor === activeFloor
      const matchesAssignedStaff = !assignedStaffFilter || room.assignedTo === assignedStaffFilter
      const matchesDate = !dateFilter || parseDateStr(room.nextCleaning) === dateFilter || parseDateStr(room.lastCleaned) === dateFilter
      return matchesSearch && matchesFloor && matchesStatus && matchesRoomType && matchesFloorTab && matchesAssignedStaff && matchesDate
    })
  }, [rooms, roomSearch, floorFilter, statusFilter, roomTypeFilter, activeFloor, assignedStaffFilter, dateFilter])

  const roomStats: RoomStats = useMemo(() => ({
    total: rooms.length,
    clean: rooms.filter(r => r.status === 'Clean').length,
    dirty: rooms.filter(r => r.status === 'Dirty').length,
    inProgress: rooms.filter(r => r.status === 'In Progress').length,
    outOfService: rooms.filter(r => r.status === 'Out of Service').length,
  }), [rooms])

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

  const handleCreateTask = () => {
    if (!createForm.room) return
    const newId = `HK-${String(tasks.length + 1).padStart(3, '0')}`
    const dueTimeFormatted = createForm.dueTime ? new Date(`2026-01-01T${createForm.dueTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'Today'
    const newTask: HousekeepingTask = {
      id: newId,
      room: createForm.room,
      taskType: createForm.taskType as HousekeepingTask['taskType'],
      priority: createForm.priority as HousekeepingTask['priority'],
      assignedTo: createForm.assignedStaff || null,
      dueTime: dueTimeFormatted,
      status: 'Pending',
      notes: createForm.notes || undefined,
    }
    setTasks(prev => [newTask, ...prev])
    setShowCreateTask(false)
    setCreateForm({ room: 'Room 205', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' })
    setToast({ message: `Task ${newId} created successfully`, type: 'success' })
  }

  const handleAssignTask = () => {
    if (!assigningTask || !assignForm.staff) return
    setTasks(prev => prev.map(t => t.id === assigningTask.id ? { ...t, assignedTo: assignForm.staff } : t))
    setAssigningTask(null)
    setAssignForm({ staff: '', priority: 'High', dueTime: '', notes: '' })
    setToast({ message: `Task assigned to ${assignForm.staff}`, type: 'success' })
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t))
    setViewingTask(null)
    setToast({ message: `Task ${taskId} marked as completed`, type: 'success' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Housekeeping" subtitle="Manage room cleaning status, tasks and housekeeping activities" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <HousekeepingStats stats={roomStats} activeFilter={statusFilter} onFilterChange={(s) => { setStatusFilter(s); setCurrentPage(1) }} />

          <HousekeepingTabs
            activeTab={topTab}
            onTabChange={setTopTab}
            activeFloor={activeFloor}
            onFloorChange={setActiveFloor}
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
                onAddTask={() => { setCreateForm({ room: 'Room 205', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' }); setShowCreateTask(true) }}
                assignedStaff={assignedStaffFilter}
                onAssignedStaffChange={setAssignedStaffFilter}
                cleaningStatus={cleaningStatusFilter}
                onCleaningStatusChange={setCleaningStatusFilter}
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
                onItemsPerPageChange={(count) => { setItemsPerPage(count); setCurrentPage(1) }}
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
                onCreateTask={() => { setCreateForm({ room: 'Room 205', taskType: 'Cleaning', priority: 'High', assignedStaff: '', dueTime: '11:00', notes: '' }); setShowCreateTask(true) }}
              />

              <TaskTable
                tasks={filteredTasks}
                onViewTask={setViewingTask}
                onAssignTask={setAssigningTask}
                onCompleteTask={handleCompleteTask}
              />
            </>
          )}

          {/* ============ STAFF ASSIGNMENT TAB ============ */}
          {topTab === 'Staff Assignments' && (
            <StaffAssignmentView />
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
              <button onClick={() => { setViewingTask(null); setAssigningTask(viewingTask); setAssignForm({ staff: viewingTask.assignedTo || '', priority: viewingTask.priority, dueTime: '', notes: '' }) }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Reassign</button>
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
                  {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Task Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.taskType} onChange={e => setCreateForm({ ...createForm, taskType: e.target.value })}>
                  {taskTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.priority} onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}>
                  {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Assigned Staff</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={createForm.assignedStaff} onChange={e => setCreateForm({ ...createForm, assignedStaff: e.target.value })}>
                  <option value="">Unassigned</option>
                  {staffList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
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
              <button onClick={handleCreateTask} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Create Task</button>
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
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.staff} onChange={e => setAssignForm({ ...assignForm, staff: e.target.value })}>
                  <option value="">Select staff member</option>
                  {staffList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.priority} onChange={e => setAssignForm({ ...assignForm, priority: e.target.value })}>
                  {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
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
              <button onClick={handleAssignTask} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Assign</button>
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

      {/* Toast Notification */}
      {toast && (
        <div style={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          padding: '14px 20px', 
          borderRadius: 10, 
          background: toast.type === 'success' ? '#059669' : '#DC2626', 
          color: '#fff', 
          fontSize: 14, 
          fontWeight: 500,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}
    </div>
  )
}
