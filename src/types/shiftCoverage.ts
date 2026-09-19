export interface ShiftCoverageStats {
  totalStaff: number
  scheduledToday: number
  understaffedShifts: number
  employeesOnLeave: number
  avgCoverage: number
  coverageChange: number
}

export type ShiftStatus = 'Fully Staffed' | 'Slightly Low' | 'Critically Low' | 'Overstaffed'

export interface ShiftDetail {
  id: string
  department: string
  shift: string
  time: string
  required: number
  assigned: number
  coverage: number
  status: ShiftStatus
  missing: number | null
}

export interface DayShiftGroup {
  day: string
  date: string
  shifts: ShiftDetail[]
}

export interface ShiftCoverageFilters {
  department: string
  shift: string
  weekStart: string
  weekEnd: string
}

export function calculateStats(data: DayShiftGroup[]): ShiftCoverageStats {
  let totalRequired = 0
  let totalAssigned = 0
  let understaffedShifts = 0

  data.forEach((day) => {
    day.shifts.forEach((shift) => {
      totalRequired += shift.required
      totalAssigned += shift.assigned
      if (shift.status === 'Critically Low' || shift.status === 'Slightly Low') {
        understaffedShifts++
      }
    })
  })

  const avgCoverage = totalRequired > 0 ? Math.round((totalAssigned / totalRequired) * 100) : 0

  return {
    totalStaff: totalAssigned,
    scheduledToday: totalAssigned,
    understaffedShifts,
    employeesOnLeave: Math.max(0, totalRequired - totalAssigned - 4),
    avgCoverage,
    coverageChange: 5,
  }
}

export const getStatusColor = (status: ShiftStatus): string => {
  switch (status) {
    case 'Fully Staffed':
      return '#16A34A'
    case 'Slightly Low':
      return '#F59E0B'
    case 'Critically Low':
      return '#DC2626'
    case 'Overstaffed':
      return '#2563EB'
  }
}

export const getStatusBgColor = (status: ShiftStatus): string => {
  switch (status) {
    case 'Fully Staffed':
      return '#DCFCE7'
    case 'Slightly Low':
      return '#FEF3C7'
    case 'Critically Low':
      return '#FEE2E2'
    case 'Overstaffed':
      return '#DBEAFE'
  }
}
