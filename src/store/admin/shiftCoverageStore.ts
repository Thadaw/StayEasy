import { create } from 'zustand'
import type { ShiftCoverageFilters, DayShiftGroup } from '@/types/shiftCoverage'

function applyFilters(data: DayShiftGroup[], filters: ShiftCoverageFilters): DayShiftGroup[] {
  return data.map((dayGroup) => ({
    ...dayGroup,
    shifts: dayGroup.shifts.filter((shift) => {
      if (filters.department !== 'All Departments' && shift.department !== filters.department) {
        return false
      }
      if (filters.shift !== 'All Shifts' && shift.shift !== filters.shift) {
        return false
      }
      return true
    }),
  }))
}

interface ShiftCoverageState {
  currentWeekStart: Date
  filters: ShiftCoverageFilters
  weekData: DayShiftGroup[]
  filteredData: DayShiftGroup[]
  showDepartmentDropdown: boolean
  showShiftDropdown: boolean
  setCurrentWeekStart: (date: Date) => void
  setFilters: (filters: Partial<ShiftCoverageFilters>) => void
  setWeekData: (data: DayShiftGroup[]) => void
  setShowDepartmentDropdown: (open: boolean) => void
  setShowShiftDropdown: (open: boolean) => void
}

export const useShiftCoverageStore = create<ShiftCoverageState>((set) => ({
  currentWeekStart: new Date(2026, 6, 14),
  filters: {
    department: 'All Departments',
    shift: 'All Shifts',
    weekStart: 'Jul 14',
    weekEnd: 'Jul 20, 2026',
  },
  weekData: [],
  filteredData: [],
  showDepartmentDropdown: false,
  showShiftDropdown: false,

  setCurrentWeekStart: (date) => set({ currentWeekStart: date }),
  setFilters: (patch) =>
    set((s) => {
      const filters = { ...s.filters, ...patch }
      return { filters, filteredData: applyFilters(s.weekData, filters) }
    }),
  setWeekData: (data) => set((s) => ({ weekData: data, filteredData: applyFilters(data, s.filters) })),
  setShowDepartmentDropdown: (showDepartmentDropdown) => set({ showDepartmentDropdown }),
  setShowShiftDropdown: (showShiftDropdown) => set({ showShiftDropdown }),
}))
