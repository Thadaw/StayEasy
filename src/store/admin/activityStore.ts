import { create } from 'zustand'
import type { ActivityLog } from '@/types/activity'

interface ActivityState {
  search: string
  userFilter: string
  moduleFilter: string
  actionFilter: string
  statusFilter: string
  selectedActivity: ActivityLog | null
  currentPage: number
  perPage: number
  setSearch: (search: string) => void
  setUserFilter: (userFilter: string) => void
  setModuleFilter: (moduleFilter: string) => void
  setActionFilter: (actionFilter: string) => void
  setStatusFilter: (statusFilter: string) => void
  setSelectedActivity: (selectedActivity: ActivityLog | null) => void
  setCurrentPage: (value: number | ((prev: number) => number)) => void
  setPerPage: (perPage: number) => void
}

export const useActivityStore = create<ActivityState>((set) => ({
  search: '',
  userFilter: '',
  moduleFilter: '',
  actionFilter: '',
  statusFilter: '',
  selectedActivity: null,
  currentPage: 1,
  perPage: 10,
  setSearch: (search) => set({ search }),
  setUserFilter: (userFilter) => set({ userFilter }),
  setModuleFilter: (moduleFilter) => set({ moduleFilter }),
  setActionFilter: (actionFilter) => set({ actionFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedActivity: (selectedActivity) => set({ selectedActivity }),
  setCurrentPage: (value) => set((s) => ({ currentPage: typeof value === 'function' ? value(s.currentPage) : value })),
  setPerPage: (perPage) => set({ perPage }),
}))
