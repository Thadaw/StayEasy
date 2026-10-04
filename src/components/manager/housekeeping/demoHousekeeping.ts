import type {
  HousekeepingTask,
  HousekeepingRoom,
  ApiStaffOption,
  ApiRoomOption,
  ApiTaskTypeOption,
  ApiStaffWorkSummary,
} from '../../../types/housekeeping'

export type CleaningStatus =
  | 'Clean'
  | 'Dirty'
  | 'In Progress'
  | 'Inspection Required'
  | 'Maintenance Required'
  | 'Ready for Check-in'

export type SchedulePriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface ScheduleRow {
  id: string
  room: string
  roomType: string
  floor: string
  status: CleaningStatus
  assignedTo: string | null
  lastCleaned: string
  priority: SchedulePriority
}

export const CLEANING_STATUS_COLORS: Record<CleaningStatus, { bg: string; text: string }> = {
  Clean: { bg: '#DCFCE7', text: '#166534' },
  Dirty: { bg: '#FEF3C7', text: '#92400E' },
  'In Progress': { bg: '#FFEDD5', text: '#C2410C' },
  'Inspection Required': { bg: '#DBEAFE', text: '#1E40AF' },
  'Maintenance Required': { bg: '#FEE2E2', text: '#B91C1C' },
  'Ready for Check-in': { bg: '#D1FAE5', text: '#065F46' },
}

export const PRIORITY_COLORS: Record<SchedulePriority, { bg: string; text: string }> = {
  Low: { bg: '#F3F4F6', text: '#6B7280' },
  Medium: { bg: '#FEF3C7', text: '#92400E' },
  High: { bg: '#FEE2E2', text: '#B91C1C' },
  Urgent: { bg: '#DC2626', text: '#FFFFFF' },
}

export const CLEANING_STATUSES: CleaningStatus[] = [
  'Clean',
  'Dirty',
  'In Progress',
  'Inspection Required',
  'Maintenance Required',
  'Ready for Check-in',
]

export interface HousekeepingStatValues {
  total: number
  clean: number
  dirty: number
  inProgress: number
  maintenance: number
  ready: number
}

export const DEMO_STATS: HousekeepingStatValues = {
  total: 128,
  clean: 74,
  dirty: 21,
  inProgress: 12,
  maintenance: 7,
  ready: 14,
}

export interface StatCardData {
  key: string
  label: string
  value: number
  caption: string
  filterValue: string
}

export function buildStatCards(stats: HousekeepingStatValues, floors: number): StatCardData[] {
  const pct = (n: number) => (stats.total > 0 ? Math.round((n / stats.total) * 100) : 0)
  return [
    { key: 'total', label: 'Total Rooms', value: stats.total, caption: `Across ${floors} hotel floors`, filterValue: '' },
    { key: 'clean', label: 'Clean Rooms', value: stats.clean, caption: `${pct(stats.clean)}% of total rooms`, filterValue: 'Clean' },
    { key: 'dirty', label: 'Dirty Rooms', value: stats.dirty, caption: `${pct(stats.dirty)}% need cleaning`, filterValue: 'Dirty' },
    { key: 'inProgress', label: 'In Progress', value: stats.inProgress, caption: `${pct(stats.inProgress)}% being cleaned`, filterValue: 'In Progress' },
    { key: 'maintenance', label: 'Maintenance', value: stats.maintenance, caption: `${pct(stats.maintenance)}% require attention`, filterValue: 'Maintenance Required' },
    { key: 'ready', label: 'Ready for Check-in', value: stats.ready, caption: 'Rooms verified & ready', filterValue: 'Ready for Check-in' },
  ]
}

export interface DistributionEntry {
  label: string
  count: number
  percent: number
  color: string
}

export const DEMO_DISTRIBUTION: DistributionEntry[] = [
  { label: 'Clean', count: 74, percent: 58, color: '#22C55E' },
  { label: 'Dirty', count: 21, percent: 16, color: '#EF4444' },
  { label: 'In Progress', count: 12, percent: 9, color: '#3B82F6' },
  { label: 'Inspection', count: 7, percent: 5, color: '#F59E0B' },
  { label: 'Maintenance', count: 7, percent: 5, color: '#374151' },
]

export interface WorkloadEntry {
  name: string
  tasks: number
}

export const DEMO_WORKLOAD: WorkloadEntry[] = [
  { name: 'Maria', tasks: 12 },
  { name: 'Anita', tasks: 9 },
  { name: 'Roshan', tasks: 8 },
  { name: 'Priya', tasks: 6 },
  { name: 'Sunita', tasks: 7 },
]

export const DEMO_SCHEDULE_ROWS: ScheduleRow[] = [
  { id: 'HK-101', room: '101', roomType: 'Standard Room', floor: '1st', status: 'Clean', assignedTo: 'Maria Santos', lastCleaned: '09:10 AM', priority: 'Low' },
  { id: 'HK-102', room: '102', roomType: 'Deluxe Room', floor: '1st', status: 'Dirty', assignedTo: null, lastCleaned: 'Yesterday 6:20 PM', priority: 'High' },
  { id: 'HK-201', room: '201', roomType: 'Family Room', floor: '2nd', status: 'In Progress', assignedTo: 'Anita Gurung', lastCleaned: '10:35 AM', priority: 'Medium' },
  { id: 'HK-202', room: '202', roomType: 'Deluxe Room', floor: '2nd', status: 'Inspection Required', assignedTo: 'Roshan Thapa', lastCleaned: '08:50 AM', priority: 'Medium' },
  { id: 'HK-301', room: '301', roomType: 'Suite Room', floor: '3rd', status: 'Maintenance Required', assignedTo: 'Maintenance Team', lastCleaned: 'Apr 27', priority: 'Urgent' },
  { id: 'HK-302', room: '302', roomType: 'Deluxe Room', floor: '3rd', status: 'Clean', assignedTo: 'Priya Sharma', lastCleaned: '08:45 AM', priority: 'Low' },
  { id: 'HK-401', room: '401', roomType: 'Standard Room', floor: '4th', status: 'Dirty', assignedTo: 'Kiran Rai', lastCleaned: 'Apr 27', priority: 'High' },
  { id: 'HK-402', room: '402', roomType: 'Executive Suite', floor: '4th', status: 'In Progress', assignedTo: 'Sunita KC', lastCleaned: '10:12 AM', priority: 'Urgent' },
]

const ROOM_TYPE_CYCLE = ['Standard Room', 'Deluxe Room', 'Family Room', 'Suite Room', 'Standard Room', 'Executive Suite']
const STAFF_CYCLE = ['Maria Santos', 'Anita Gurung', 'Roshan Thapa', 'Priya Sharma', 'Sunita KC', 'Kiran Rai', 'Unassigned', 'Deepak Gurung', 'Sita Magar']
const LAST_CLEANED_CYCLE = ['09:10 AM', '08:45 AM', 'Yesterday 6:20 PM', 'Apr 27', '10:35 AM', '07:55 AM', 'Apr 26', '11:05 AM']
const PRIORITY_CYCLE: SchedulePriority[] = ['Low', 'Medium', 'High', 'Urgent']

export function ordinal(n: number): string {
  const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'
  return `${n}${suffix}`
}

export function buildDemoSchedule(): ScheduleRow[] {
  const pool: { status: CleaningStatus; count: number }[] = [
    { status: 'Clean', count: 72 },
    { status: 'Dirty', count: 19 },
    { status: 'In Progress', count: 10 },
    { status: 'Inspection Required', count: 6 },
    { status: 'Maintenance Required', count: 6 },
    { status: 'Ready for Check-in', count: 7 },
  ]
  const statuses: CleaningStatus[] = pool.flatMap(p => Array.from({ length: p.count }, () => p.status))

  let seed = 42
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = statuses[i]
    statuses[i] = statuses[j]
    statuses[j] = tmp
  }

  const rows: ScheduleRow[] = [...DEMO_SCHEDULE_ROWS]
  let idx = 0
  for (let floor = 1; floor <= 6 && idx < statuses.length; floor++) {
    const start = floor <= 4 ? floor * 100 + 3 : floor * 100 + 1
    for (let k = 0; k < 20 && idx < statuses.length; k++, idx++) {
      const number = String(start + k)
      const status = statuses[idx]
      const staff = STAFF_CYCLE[idx % STAFF_CYCLE.length]
      rows.push({
        id: `HK-${number}`,
        room: number,
        roomType: ROOM_TYPE_CYCLE[idx % ROOM_TYPE_CYCLE.length],
        floor: ordinal(floor),
        status,
        assignedTo: status === 'Maintenance Required' ? 'Maintenance Team' : staff === 'Unassigned' ? null : staff,
        lastCleaned: LAST_CLEANED_CYCLE[(idx + 2) % LAST_CLEANED_CYCLE.length],
        priority: status === 'Maintenance Required' ? 'Urgent' : PRIORITY_CYCLE[idx % PRIORITY_CYCLE.length],
      })
    }
  }
  return rows
}

export const DEMO_TASKS: HousekeepingTask[] = [
  { id: 'HK-T-01', room: '102', taskType: 'Cleaning', priority: 'High', assignedTo: null, dueTime: '2:00 PM', status: 'Pending', notes: 'Check-out cleaning, guest departs at noon.' },
  { id: 'HK-T-02', room: '201', taskType: 'Cleaning', priority: 'Medium', assignedTo: 'Anita Gurung', dueTime: '11:30 AM', status: 'In Progress' },
  { id: 'HK-T-03', room: '301', taskType: 'Deep Cleaning', priority: 'High', assignedTo: 'Maintenance Team', dueTime: '4:00 PM', status: 'Pending', notes: 'AC unit servicing before next arrival.' },
  { id: 'HK-T-04', room: '402', taskType: 'Cleaning', priority: 'Medium', assignedTo: 'Sunita KC', dueTime: '10:45 AM', status: 'In Progress' },
  { id: 'HK-T-05', room: '302', taskType: 'Linen Change', priority: 'Low', assignedTo: 'Priya Sharma', dueTime: '9:30 AM', status: 'Completed' },
  { id: 'HK-T-06', room: '401', taskType: 'Bathroom Cleaning', priority: 'High', assignedTo: 'Kiran Rai', dueTime: '1:00 PM', status: 'Pending' },
]

export const DEMO_STAFF_WORK_SUMMARY: ApiStaffWorkSummary[] = [
  { staff_id: 'ST-01', staff_name: 'Maria Santos', total_assigned: 14, completed: 8, pending: 4, in_progress: 2, cancelled: 0 },
  { staff_id: 'ST-02', staff_name: 'Anita Gurung', total_assigned: 12, completed: 7, pending: 3, in_progress: 2, cancelled: 0 },
  { staff_id: 'ST-03', staff_name: 'Roshan Thapa', total_assigned: 11, completed: 6, pending: 4, in_progress: 1, cancelled: 0 },
  { staff_id: 'ST-04', staff_name: 'Priya Sharma', total_assigned: 9, completed: 6, pending: 3, in_progress: 0, cancelled: 0 },
  { staff_id: 'ST-05', staff_name: 'Sunita KC', total_assigned: 10, completed: 6, pending: 3, in_progress: 1, cancelled: 0 },
]

export const DEMO_STAFF_OPTIONS: ApiStaffOption[] = DEMO_STAFF_WORK_SUMMARY.map(s => ({
  id: s.staff_id,
  name: s.staff_name,
  cover_photo: null,
}))

export function buildRoomOptions(rows: ScheduleRow[]): ApiRoomOption[] {
  return rows.slice(0, 24).map(r => ({
    id: r.id.replace('HK-', 'RM-'),
    name: r.room,
    status: r.status,
  }))
}

export const DEMO_TASK_TYPES: ApiTaskTypeOption[] = [
  { value: 'ROOM_CLEANING', label: 'Room Cleaning' },
  { value: 'LINEN_CHANGE', label: 'Linen Change' },
  { value: 'DEEP_CLEANING', label: 'Deep Cleaning' },
  { value: 'MAINTENANCE_CHECK', label: 'Maintenance Check' },
]

export function toHousekeepingRooms(rows: ScheduleRow[]): HousekeepingRoom[] {
  const statusMap: Record<CleaningStatus, HousekeepingRoom['status']> = {
    Clean: 'Clean',
    Dirty: 'Dirty',
    'In Progress': 'In Progress',
    'Inspection Required': 'In Progress',
    'Maintenance Required': 'Out of Service',
    'Ready for Check-in': 'Clean',
  }
  return rows.map((row, i) => ({
    id: i + 1,
    roomNumber: row.room,
    roomType: row.roomType,
    bedDescription: '1 Bed',
    floor: `${row.floor} Floor`,
    status: statusMap[row.status],
    assignedTo: row.assignedTo,
    lastCleaned: row.lastCleaned,
    nextCleaning: null,
  }))
}
