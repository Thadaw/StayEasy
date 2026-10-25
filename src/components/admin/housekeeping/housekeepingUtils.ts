import type { ApiRoomStatus, ApiTaskListItem, HousekeepingRoom, HousekeepingTask } from '@/types/housekeeping'

export const taskTypeMap: Record<string, HousekeepingTask['taskType']> = {
  ROOM_CLEANING: 'Cleaning',
  LINEN_CHANGE: 'Linen Change',
  DEEP_CLEANING: 'Deep Cleaning',
  MAINTENANCE_CHECK: 'Bathroom Cleaning',
  INSPECTION: 'Cleaning',
  RESTOCK_AMENITIES: 'Cleaning',
  OTHER: 'Cleaning',
}

export const priorityMap: Record<string, HousekeepingTask['priority']> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const statusMap: Record<string, HousekeepingTask['status']> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Completed',
  AWAITING_INSPECTION: 'In Progress',
}

export const roomStatusMap: Record<string, HousekeepingRoom['status']> = {
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

export function toFutureDueTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const due = new Date()
  due.setHours(h, m, 0, 0)
  if (due.getTime() <= Date.now()) due.setDate(due.getDate() + 1)
  return due.toISOString()
}

export function mapApiTaskToFrontend(apiTask: ApiTaskListItem): HousekeepingTask {
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

export function mapApiRoomToHousekeeping(
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
