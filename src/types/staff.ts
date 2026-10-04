export interface StaffMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  contact: string
  joiningDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
  monthlySalary?: number
  shift?: string
  photo?: string
  citizenshipFront?: string
  citizenshipBack?: string
}

export interface StaffStats {
  total: number
  active: number
  onLeave: number
  inactive: number
  departments: number
}

// ─── API Types ─────────────────────────────────────────────

export interface ApiStaff {
  id: string
  tenant_id: string
  full_name: string
  email: string
  phone_number: string
  job_role: string
  monthly_salary: number
  joining_date: string
  status: 'ACTIVE' | 'ON LEAVE' | 'INACTIVE'
  shift: string
  photos: {
    profile: string
    citizenship_front: string
    citizenship_back: string
  }
}

export interface CreateStaffPayload {
  full_name: string
  email: string
  phone_number: string
  job_role: string
  monthly_salary: number
  joining_date: string
  status: 'ACTIVE' | 'ON LEAVE' | 'INACTIVE'
  shift: string
  photos?: {
    profile: string | null
    citizenship_front: string | null
    citizenship_back: string | null
  } | null
}

export type UpdateStaffPayload = Partial<Omit<CreateStaffPayload, 'email'>>

// ─── Mappers ───────────────────────────────────────────────

const JOB_ROLE_TO_DEPARTMENT: Record<string, string> = {
  MANAGER: 'Management',
  FRONT_DESK: 'Front Office',
  HOUSEKEEPING: 'Housekeeping',
  WAITER: 'Restaurant',
  KITCHEN: 'Kitchen',
  MAINTENANCE: 'Maintenance',
}

function deriveDepartment(jobRole: string): string {
  return JOB_ROLE_TO_DEPARTMENT[jobRole.toUpperCase()] || 'General'
}

function formatJobRole(apiRole: string): string {
  return apiRole
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

function formatStatus(apiStatus: string): StaffMember['status'] {
  switch (apiStatus) {
    case 'ACTIVE': return 'Active'
    case 'ON LEAVE': return 'On Leave'
    case 'INACTIVE': return 'Inactive'
    default: return 'Active'
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function mapApiStaffToStaffMember(api: ApiStaff): StaffMember {
  const role = formatJobRole(api.job_role)
  return {
    id: api.id,
    name: api.full_name,
    email: api.email,
    contact: api.phone_number,
    role,
    department: deriveDepartment(api.job_role),
    joiningDate: formatDate(api.joining_date),
    status: formatStatus(api.status),
    monthlySalary: api.monthly_salary,
    shift: api.shift,
    photo: api.photos?.profile || undefined,
    citizenshipFront: api.photos?.citizenship_front || undefined,
    citizenshipBack: api.photos?.citizenship_back || undefined,
  }
}

export function toApiJobRole(role: string): string {
  return role.toUpperCase().replace(/ /g, '_')
}

export function toApiStatus(status: StaffMember['status']): CreateStaffPayload['status'] {
  switch (status) {
    case 'Active': return 'ACTIVE'
    case 'On Leave': return 'ON LEAVE'
    case 'Inactive': return 'INACTIVE'
  }
}

export function mapStaffMemberToCreatePayload(
  m: Pick<StaffMember, 'name' | 'email' | 'contact' | 'role' | 'monthlySalary' | 'joiningDate' | 'status' | 'shift' | 'photo' | 'citizenshipFront' | 'citizenshipBack'>
): CreateStaffPayload {
  const hasAnyPhoto = m.photo || m.citizenshipFront || m.citizenshipBack
  return {
    full_name: m.name,
    email: m.email,
    phone_number: m.contact,
    job_role: toApiJobRole(m.role),
    monthly_salary: m.monthlySalary ?? 0,
    joining_date: m.joiningDate,
    status: toApiStatus(m.status),
    shift: m.shift ?? 'MORNING',
    photos: hasAnyPhoto ? {
      profile: m.photo || null,
      citizenship_front: m.citizenshipFront || null,
      citizenship_back: m.citizenshipBack || null,
    } : null,
  }
}
