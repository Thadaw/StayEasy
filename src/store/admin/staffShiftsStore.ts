import { create } from 'zustand'

export type AttendanceTab = 'daily' | 'requests'

interface StaffShiftsState {
  activeTab: AttendanceTab
  setActiveTab: (activeTab: AttendanceTab) => void
}

export const useStaffShiftsStore = create<StaffShiftsState>((set) => ({
  activeTab: 'daily',
  setActiveTab: (activeTab) => set({ activeTab }),
}))
