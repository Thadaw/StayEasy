export interface StaffMember {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  contact: string
  joiningDate: string
  status: 'Active' | 'On Leave' | 'Inactive'
  monthlySalary?: number
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
