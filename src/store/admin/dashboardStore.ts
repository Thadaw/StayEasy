import { create } from 'zustand'

interface DashboardState {
  activeFilter: string
  setActiveFilter: (value: string) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeFilter: 'all',
  setActiveFilter: (activeFilter) => set({ activeFilter }),
}))
