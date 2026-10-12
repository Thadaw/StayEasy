export interface StaffRow {
  id: string
  staffId: string
  name: string
  avatarColor: string
  department: string
  position: string
  shift: 'Morning' | 'Evening' | 'Night'
  attendance: 'Present' | 'Late' | 'Absent' | 'On Leave'
  phone: string
  performance: number
}

export interface StaffStat {
  label: string
  value: string
  sub: string
  icon: 'users' | 'userCheck' | 'clock' | 'calendar' | 'check' | 'alert'
  accent: string
}

const IMAGE_ROWS: StaffRow[] = [
  {
    id: 's1',
    staffId: 'ST-001',
    name: 'Anaya Sharma',
    avatarColor: '#2563eb',
    department: 'Front Desk',
    position: 'Front Office Supervisor',
    shift: 'Morning',
    attendance: 'Present',
    phone: '+977 9812345601',
    performance: 92,
  },
  {
    id: 's2',
    staffId: 'ST-014',
    name: 'Maria Santos',
    avatarColor: '#16a34a',
    department: 'Housekeeping',
    position: 'Supervisor',
    shift: 'Morning',
    attendance: 'Present',
    phone: '+977 9812345654',
    performance: 96,
  },
  {
    id: 's3',
    staffId: 'ST-022',
    name: 'Anja Gurung',
    avatarColor: '#f59e0b',
    department: 'Housekeeping',
    position: 'Room Attendant',
    shift: 'Evening',
    attendance: 'Late',
    phone: '+977 9812345611',
    performance: 88,
  },
  {
    id: 's4',
    staffId: 'ST-003',
    name: 'Rajan KC',
    avatarColor: '#8b5cf6',
    department: 'Maintenance',
    position: 'Technician',
    shift: 'Morning',
    attendance: 'Present',
    phone: '+977 9812345663',
    performance: 91,
  },
  {
    id: 's5',
    staffId: 'ST-047',
    name: 'Suman Thapa',
    avatarColor: '#ec4899',
    department: 'Restaurant',
    position: 'F&B Captain',
    shift: 'Evening',
    attendance: 'On Leave',
    phone: '+977 9812345667',
    performance: 94,
  },
  {
    id: 's6',
    staffId: 'ST-056',
    name: 'Kiran Rai',
    avatarColor: '#0ea5e9',
    department: 'Security',
    position: 'Security Officer',
    shift: 'Night',
    attendance: 'Present',
    phone: '+977 9812345658',
    performance: 89,
  },
  {
    id: 's7',
    staffId: 'ST-071',
    name: 'Neha Shrestha',
    avatarColor: '#ef4444',
    department: 'Management',
    position: 'Duty Manager',
    shift: 'Night',
    attendance: 'Absent',
    phone: '+977 9812345690',
    performance: 93,
  },
]

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Bikash', 'Sita', 'Ramesh', 'Anita', 'Dipak', 'Kabita', 'Suresh', 'Mina',
  'Rajesh', 'Gita', 'Manoj', 'Sunita', 'Prakash', 'Rekha', 'Sanjay', 'Laxmi', 'Amit', 'Nirmala',
]

const LAST_NAMES = [
  'Poudel', 'Karki', 'Magar', 'Tamang', 'Chaudhary', 'Basnet', 'Dhungana', 'Adhikari', 'Neupane', 'Cyaral',
  'Maharjan', 'Silpakar',
]

const POSITIONS: Record<string, string[]> = {
  'Front Desk': ['Front Office Supervisor', 'Receptionist', 'Front Desk Agent'],
  Housekeeping: ['Supervisor', 'Room Attendant', 'Housekeeper'],
  Maintenance: ['Technician', 'Electrician', 'Plumber'],
  Restaurant: ['F&B Captain', 'Waiter', 'Bartender'],
  Security: ['Security Officer', 'Security Guard'],
  Management: ['Duty Manager', 'Operations Manager'],
  Kitchen: ['Chef', 'Assistant Chef', 'Kitchen Staff'],
}

const DEPARTMENT_POOL = Object.keys(POSITIONS)
const SHIFTS: StaffRow['shift'][] = ['Morning', 'Evening', 'Night']
const ATTENDANCE_CYCLE: StaffRow['attendance'][] = [
  'Present', 'Present', 'Present', 'Late', 'Present', 'On Leave', 'Present', 'Present', 'Absent', 'Present',
]
const AVATAR_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9', '#ef4444', '#14b8a6']

function generateRows(count: number): StaffRow[] {
  const rows: StaffRow[] = []
  for (let i = 0; i < count; i++) {
    const department = DEPARTMENT_POOL[i % DEPARTMENT_POOL.length]
    const positions = POSITIONS[department]
    rows.push({
      id: `s-gen-${i}`,
      staffId: `ST-${String(101 + i).padStart(3, '0')}`,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]}`,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      department,
      position: positions[i % positions.length],
      shift: SHIFTS[i % SHIFTS.length],
      attendance: ATTENDANCE_CYCLE[i % ATTENDANCE_CYCLE.length],
      phone: `+977 ${9812345601 + i * 37}`,
      performance: 80 + ((i * 7) % 18),
    })
  }
  return rows
}

export const DEMO_STAFF: StaffRow[] = [...IMAGE_ROWS, ...generateRows(79)]

export const STAFF_STATS: StaffStat[] = [
  { label: 'Total Staff', value: '86', sub: 'Across 7 departments', icon: 'users', accent: '#3b82f6' },
  { label: 'Active Staff', value: '79', sub: '89% active workforce', icon: 'userCheck', accent: '#16a34a' },
  { label: 'On Duty Today', value: '54', sub: 'Across 8 shifts', icon: 'clock', accent: '#3b82f6' },
  { label: 'On Leave', value: '7', sub: 'Approved today', icon: 'calendar', accent: '#f59e0b' },
  { label: 'Attendance Rate', value: '94.2%', sub: '+2.3% vs last month', icon: 'check', accent: '#16a34a' },
  { label: 'Pending Approvals', value: '7', sub: '3 today • 4 others', icon: 'alert', accent: '#ef4444' },
]

export const DEPARTMENT_OPTIONS = [
  'All Departments',
  ...DEPARTMENT_POOL,
]

export const ATTENDANCE_OPTIONS = ['All Status', 'Present', 'Late', 'Absent', 'On Leave']

export const ATTENDANCE_PILL: Record<StaffRow['attendance'], { background: string; color: string }> = {
  Present: { background: '#dcfce7', color: '#16a34a' },
  Late: { background: '#fef3c7', color: '#d97706' },
  Absent: { background: '#fee2e2', color: '#dc2626' },
  'On Leave': { background: '#f3f4f6', color: '#6b7280' },
}

export const SHIFT_TILES = [
  { name: 'Morning', time: '06:00–14:00', staff: 28, background: '#eff6ff', color: '#2563eb' },
  { name: 'Evening', time: '14:00–22:00', staff: 19, background: '#fff7ed', color: '#ea580c' },
  { name: 'Night', time: '22:00–06:00', staff: 10, background: '#f9fafb', color: '#4b5563' },
]

export const WEEKLY_DUTY = [
  { day: 'Mon', date: '28', duty: 41 },
  { day: 'Tue', date: '29', duty: 44 },
  { day: 'Wed', date: '30', duty: 46 },
  { day: 'Thu', date: '01', duty: 45 },
  { day: 'Fri', date: '02', duty: 43 },
  { day: 'Sat', date: '03', duty: 38 },
  { day: 'Sun', date: '04', duty: 36 },
]

export const SHIFT_COVERAGE = [
  { label: 'Housekeeping: Morning', status: 'Critical' as const },
  { label: 'Restaurant: Evening', status: 'Low' as const },
  { label: 'Front Desk: Morning', status: 'Covered' as const },
  { label: 'Front Desk: Night', status: 'Covered' as const },
]

export const COVERAGE_PILL: Record<string, { background: string; color: string }> = {
  Critical: { background: '#fee2e2', color: '#dc2626' },
  Low: { background: '#fef3c7', color: '#d97706' },
  Covered: { background: '#dcfce7', color: '#16a34a' },
}

export const ATTENDANCE_OVERVIEW = {
  scope: 'Today · 86 total staff',
  rate: '94.2%',
  change: '+2.3% vs last month',
  segments: [
    { label: 'Present', value: 81, color: '#16a34a' },
    { label: 'Late', value: 3, color: '#f59e0b' },
    { label: 'Absent', value: 2, color: '#ef4444' },
    { label: 'On Leave', value: 7, color: '#9ca3af' },
  ],
}

export const DEPARTMENT_HEADCOUNT = [
  { label: 'Housekeeping', value: 22 },
  { label: 'Restaurant', value: 18 },
  { label: 'Front Desk', value: 14 },
  { label: 'Security', value: 10 },
  { label: 'Maintenance', value: 6 },
]

export const PERFORMANCE_TREND = [
  { month: 'Nov', value: 86 },
  { month: 'Dec', value: 83 },
  { month: 'Jan', value: 87 },
  { month: 'Feb', value: 89 },
  { month: 'Mar', value: 91 },
  { month: 'Apr', value: 92 },
]

export const LEAVE_STATS = [
  { label: 'Approved', value: 18, color: '#16a34a' },
  { label: 'Pending', value: 5, color: '#f59e0b' },
  { label: 'Rejected', value: 2, color: '#ef4444' },
  { label: 'Sick Leave', value: 6, color: '#3b82f6' },
  { label: 'Annual Leave', value: 9, color: '#8b5cf6' },
]

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
