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
