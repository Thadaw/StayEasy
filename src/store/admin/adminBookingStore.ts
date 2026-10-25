import { create } from 'zustand'

interface AdminBookingState {
  searchQuery: string
  activeStatus: string
  roomType: string
  dateFilter: string
  showNewBookingModal: boolean
  viewingBookingId: string | null
  setSearchQuery: (value: string) => void
  setActiveStatus: (value: string) => void
  setRoomType: (value: string) => void
  setDateFilter: (value: string) => void
  openNewBooking: () => void
  closeNewBooking: () => void
  setViewingBookingId: (id: string | null) => void
}

export const useAdminBookingStore = create<AdminBookingState>((set) => ({
  searchQuery: '',
  activeStatus: 'All',
  roomType: 'All Rooms',
  dateFilter: '',
  showNewBookingModal: false,
  viewingBookingId: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveStatus: (activeStatus) => set({ activeStatus }),
  setRoomType: (roomType) => set({ roomType }),
  setDateFilter: (dateFilter) => set({ dateFilter }),
  openNewBooking: () => set({ showNewBookingModal: true }),
  closeNewBooking: () => set({ showNewBookingModal: false }),
  setViewingBookingId: (viewingBookingId) => set({ viewingBookingId }),
}))
