export interface HousekeepingRoom {
  id: number
  roomNumber: string
  roomType: string
  bedDescription: string
  floor: string
  status: 'Clean' | 'Dirty' | 'In Progress' | 'Out of Service'
  assignedTo: string | null
  assignedAvatar?: string
  lastCleaned: string | null
  nextCleaning: string | null
  image?: string
}

export interface RoomStats {
  total: number
  clean: number
  dirty: number
  inProgress: number
  outOfService: number
}

export type TaskType = 'Cleaning' | 'Linen Change' | 'Deep Cleaning' | 'Bathroom Cleaning'
export type Priority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type StaffAvailability = 'Available' | 'Busy'

export interface HousekeepingTask {
  id: string
  room: string
  taskType: TaskType
  priority: Priority
  assignedTo: string | null
  dueTime: string
  status: TaskStatus
  notes?: string
}

export interface TaskStats {
  pending: number
  inProgress: number
  completedToday: number
  urgent: number
}

export interface StaffWorkload {
  id: number
  name: string
  shift: string
  todayTasks: number
  completed: number
  remaining: number
  availability: StaffAvailability
  tasks: StaffTask[]
}

export interface StaffTask {
  room: string
  status: 'Completed' | 'In Progress' | 'Pending'
}

// ─── API Response Types ────────────────────────────────────

export interface ApiTaskListItem {
  id: string
  property_id: string
  room_id: string
  room_name: string
  room_status: string
  task_type: string
  priority: string
  status: string
  assigned_staff_id: string
  assigned_staff_name: string
  due_time: string
  notes: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  assigned_by_id?: string | null
  assigned_by_name?: string | null
}

export interface ApiRoomStatus {
  id: string
  property_id: string
  room_name: string
  room_type_id: string
  bed_type_id: string
  floor_number: number
  status: string
  max_adults: number
  max_children: number
  base_rate: string
  photos?: { cover: string | null; gallery: string[] }
}

export interface ApiRoomStatusSummary {
  total_rooms: number
  available_rooms: number
  occupied_rooms: number
  dirty_rooms: number
  in_progress_rooms: number
  cleaning_rooms: number
  inspected_rooms: number
  blocked_rooms: number
  booked_rooms: number
  out_of_service_rooms: number
  maintenance_rooms: number
}

export interface ApiStaffOption {
  id: string
  name: string
  cover_photo?: string | null
}

export interface ApiRoomOption {
  id: string
  name: string
  status: string
}

export interface ApiStaffWorkSummary {
  staff_id: string
  staff_name: string
  total_assigned: number
  completed: number
  pending: number
  in_progress: number
  cancelled: number
}

export interface CreateTaskRequest {
  room_id: string
  task_type: string
  assigned_staff_id: string
  due_time: string
  priority?: string
  notes?: string | null
}

export interface UpdateTaskRequest {
  assigned_staff_id?: string | null
  due_time?: string | null
  notes?: string | null
  priority?: string | null
  status?: string | null
  task_type?: string | null
}

export interface BulkAssignTaskItem {
  task_type: string
  room_id: string
  staff_id: string
  due_time: string
  priority?: string
  notes?: string | null
}

export interface ApiTaskTypeOption {
  value: string
  label: string
}
