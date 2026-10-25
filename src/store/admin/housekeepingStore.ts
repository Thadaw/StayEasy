import { create } from 'zustand'
import type { HousekeepingRoom, HousekeepingTask } from '@/types/housekeeping'

export interface CreateTaskPrefill {
  room: string
  assignedStaff: string
}

interface HousekeepingState {
  topTab: string
  roomSearch: string
  floorFilter: string
  statusFilter: string
  roomTypeFilter: string
  dateFilter: string
  currentPage: number
  itemsPerPage: number
  taskSearch: string
  taskStatusFilter: string
  priorityFilter: string
  roomFilter: string
  showCreateTask: boolean
  createPrefill: CreateTaskPrefill | null
  viewingTask: HousekeepingTask | null
  assigningTask: HousekeepingTask | null
  assigningMode: 'assign' | 'reassign'
  viewingRoom: HousekeepingRoom | null
  showReviewMaintenance: boolean
  showBulkAction: boolean
  setTopTab: (value: string) => void
  setRoomSearch: (value: string) => void
  setFloorFilter: (value: string) => void
  setStatusFilter: (value: string) => void
  setRoomTypeFilter: (value: string) => void
  setDateFilter: (value: string) => void
  setCurrentPage: (value: number) => void
  setTaskSearch: (value: string) => void
  setTaskStatusFilter: (value: string) => void
  setPriorityFilter: (value: string) => void
  setRoomFilter: (value: string) => void
  openCreateTask: (prefill?: CreateTaskPrefill) => void
  closeCreateTask: () => void
  setViewingTask: (task: HousekeepingTask | null) => void
  openAssignTask: (task: HousekeepingTask, mode: 'assign' | 'reassign') => void
  closeAssignTask: () => void
  setViewingRoom: (room: HousekeepingRoom | null) => void
  setShowReviewMaintenance: (value: boolean) => void
  setShowBulkAction: (value: boolean) => void
}

export const useHousekeepingStore = create<HousekeepingState>((set) => ({
  topTab: 'Room Status',
  roomSearch: '',
  floorFilter: '',
  statusFilter: '',
  roomTypeFilter: '',
  dateFilter: '',
  currentPage: 1,
  itemsPerPage: 10,
  taskSearch: '',
  taskStatusFilter: '',
  priorityFilter: '',
  roomFilter: '',
  showCreateTask: false,
  createPrefill: null,
  viewingTask: null,
  assigningTask: null,
  assigningMode: 'assign',
  viewingRoom: null,
  showReviewMaintenance: false,
  showBulkAction: false,
  setTopTab: (topTab) => set({ topTab }),
  setRoomSearch: (roomSearch) => set({ roomSearch }),
  setFloorFilter: (floorFilter) => set({ floorFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setRoomTypeFilter: (roomTypeFilter) => set({ roomTypeFilter }),
  setDateFilter: (dateFilter) => set({ dateFilter }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTaskSearch: (taskSearch) => set({ taskSearch }),
  setTaskStatusFilter: (taskStatusFilter) => set({ taskStatusFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  setRoomFilter: (roomFilter) => set({ roomFilter }),
  openCreateTask: (prefill) => set({ showCreateTask: true, createPrefill: prefill ?? null }),
  closeCreateTask: () => set({ showCreateTask: false, createPrefill: null }),
  setViewingTask: (viewingTask) => set({ viewingTask }),
  openAssignTask: (assigningTask, assigningMode) => set({ assigningTask, assigningMode }),
  closeAssignTask: () => set({ assigningTask: null }),
  setViewingRoom: (viewingRoom) => set({ viewingRoom }),
  setShowReviewMaintenance: (showReviewMaintenance) => set({ showReviewMaintenance }),
  setShowBulkAction: (showBulkAction) => set({ showBulkAction }),
}))
