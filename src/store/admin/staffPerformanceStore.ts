import { create } from 'zustand'

interface StaffPerformanceState {
  search: string
  deptFilter: string
  shiftFilter: string
  statusFilter: string
  setSearch: (search: string) => void
  setDeptFilter: (deptFilter: string) => void
  setShiftFilter: (shiftFilter: string) => void
  setStatusFilter: (statusFilter: string) => void
}

export const useStaffPerformanceStore = create<StaffPerformanceState>((set) => ({
  search: '',
  deptFilter: '',
  shiftFilter: '',
  statusFilter: '',
  setSearch: (search) => set({ search }),
  setDeptFilter: (deptFilter) => set({ deptFilter }),
  setShiftFilter: (shiftFilter) => set({ shiftFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}))
