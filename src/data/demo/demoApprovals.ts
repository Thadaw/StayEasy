export type ApprovalKind = 'leave' | 'swap'

export interface LeaveRequest {
  kind: 'leave'
  id: string
  name: string
  department: string
  position: string
  date: string
  category: string
  banner?: string
  body: string
  reason: string
  notes: string
  coverage: string
}

export interface SwapPerson {
  name: string
  department: string
  position: string
  shift: string
}

export interface SwapRequest {
  kind: 'swap'
  id: string
  personA: SwapPerson
  personB: SwapPerson
  reason: string
  coverage: string
}

export type ApprovalRequest = LeaveRequest | SwapRequest

export function swapDepartmentMatch(request: SwapRequest, department: string) {
  return request.personA.department === department || request.personB.department === department
}

export function matchesDepartment(request: ApprovalRequest, department: string) {
  if (department === 'All Departments') return true
  if (request.kind === 'leave') return request.department === department
  return swapDepartmentMatch(request, department)
}

export const CATEGORY_COLORS: Record<string, { background: string; color: string }> = {
  MEDICAL: { background: '#fff7ed', color: '#ea580c' },
  FAMILY: { background: '#eff6ff', color: '#2563eb' },
  PERSONAL: { background: '#f3f4f6', color: '#6b7280' },
  TRAVEL: { background: '#ecfdf5', color: '#0f766e' },
}

export const APPROVAL_TYPE_OPTIONS = ['All Types', 'Leave', 'Shift Swap']

export const APPROVAL_DEPARTMENT_OPTIONS = [
  'All Departments',
  'Housekeeping',
  'Front Office',
  'Kitchen',
  'Security',
]

export const SEED_APPROVALS: ApprovalRequest[] = [
  {
    kind: 'leave',
    id: 'a1',
    name: 'Maya Gurung',
    department: 'Housekeeping',
    position: 'Room Attendant',
    date: 'Aug 17',
    category: 'MEDICAL',
    banner: 'Urgent medical appointment requires coverage plan',
    body: 'Requesting 1 day of sick leave for family emergency. Household tasks are complete.',
    reason: 'Medical',
    notes: '1 day',
    coverage: 'Coverage OK',
  },
  {
    kind: 'leave',
    id: 'a2',
    name: 'James Choi',
    department: 'Front Office',
    position: 'Guest Services Assistant',
    date: 'Aug 17',
    category: 'FAMILY',
    body: "Need to attend my daughter's school event on Friday. Morning shift handover planned.",
    reason: 'Family',
    notes: 'Handover planned',
    coverage: 'Coverage OK',
  },
  {
    kind: 'leave',
    id: 'a3',
    name: 'Ram Thapa',
    department: 'Housekeeping',
    position: 'Room Attendant',
    date: 'Aug 18',
    category: 'FAMILY',
    body: 'Requesting 2 days leave for a family obligation. I can complete priority rooms before departure.',
    reason: 'Family',
    notes: '2 days',
    coverage: 'Coverage OK',
  },
  {
    kind: 'leave',
    id: 'a4',
    name: 'Sita Rai',
    department: 'Kitchen',
    position: 'Line Cook',
    date: 'Aug 20',
    category: 'TRAVEL',
    body: "Travelling out of town for a relative's wedding. Kitchen prep is covered for both shifts.",
    reason: 'Travel',
    notes: '2 days',
    coverage: 'Coverage tight',
  },
  {
    kind: 'leave',
    id: 'a5',
    name: 'Bikash Magar',
    department: 'Security',
    position: 'Security Guard',
    date: 'Aug 22',
    category: 'PERSONAL',
    body: 'Need a day off for personal errands and a bank appointment during morning hours.',
    reason: 'Personal',
    notes: '1 day',
    coverage: 'Coverage OK',
  },
  {
    kind: 'swap',
    id: 'a6',
    personA: {
      name: 'Elena V.',
      department: 'Housekeeping',
      position: 'Room Attendant',
      shift: 'Fri Aug 9 · Evening',
    },
    personB: {
      name: 'Mark O.',
      department: 'Housekeeping',
      position: 'Room Attendant',
      shift: 'Sat Aug 10 · Morning',
    },
    reason: 'Family event on Friday evening',
    coverage: 'Coverage OK',
  },
  {
    kind: 'swap',
    id: 'a7',
    personA: {
      name: 'Anja Gurung',
      department: 'Kitchen',
      position: 'Line Cook',
      shift: 'Thu Aug 14 · Night',
    },
    personB: {
      name: 'Kiran Rai',
      department: 'Security',
      position: 'Security Officer',
      shift: 'Fri Aug 15 · Evening',
    },
    reason: 'Personal appointment in the evening',
    coverage: 'Coverage tight',
  },
]
