import { create } from 'zustand'
import { usePropertyStore } from '@/store/properties/propertyStore'

export interface Guest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  location: string
  lastStay: string
  roomType: string
  totalStays: number
  points: number
  pointsLabel: string
  status: 'active' | 'inactive'
  badge?: 'vip' | 'returning'
}

interface GuestState {
  searchTerm: string
  filterType: string
  filterNationality: string
  currentPage: number
  overallMode: boolean
  showModal: boolean
  editingGuest: Guest | null
  viewingGuest: Guest | null
  confirmDelete: Guest | null
  setSearchTerm: (value: string) => void
  setFilterType: (value: string) => void
  setFilterNationality: (value: string) => void
  setCurrentPage: (value: number | ((prev: number) => number)) => void
  setOverallMode: (value: boolean) => void
  setShowModal: (value: boolean) => void
  setEditingGuest: (value: Guest | null) => void
  setViewingGuest: (value: Guest | null) => void
  setConfirmDelete: (value: Guest | null) => void
  resetFilters: () => void
}

export const useGuestStore = create<GuestState>((set) => ({
  searchTerm: '',
  filterType: 'All',
  filterNationality: 'All',
  currentPage: 1,
  overallMode: usePropertyStore.getState().currentPropertyId === null,
  showModal: false,
  editingGuest: null,
  viewingGuest: null,
  confirmDelete: null,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFilterType: (filterType) => set({ filterType }),
  setFilterNationality: (filterNationality) => set({ filterNationality }),
  setCurrentPage: (value) => set((s) => ({ currentPage: typeof value === 'function' ? value(s.currentPage) : value })),
  setOverallMode: (overallMode) => set({ overallMode }),
  setShowModal: (showModal) => set({ showModal }),
  setEditingGuest: (editingGuest) => set({ editingGuest }),
  setViewingGuest: (viewingGuest) => set({ viewingGuest }),
  setConfirmDelete: (confirmDelete) => set({ confirmDelete }),
  resetFilters: () => set({
    searchTerm: '',
    filterType: 'All',
    filterNationality: 'All',
    currentPage: 1,
  }),
}))
