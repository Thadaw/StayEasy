import { create } from 'zustand'

interface ReportsState {
  dateRange: string
  roomType: string
  bookingChannel: string
  setDateRange: (dateRange: string) => void
  setRoomType: (roomType: string) => void
  setBookingChannel: (bookingChannel: string) => void
  resetFilters: () => void
}

const defaultFilters = {
  dateRange: '',
  roomType: 'All Room Types',
  bookingChannel: 'All Booking Channel',
}

export const useReportsStore = create<ReportsState>((set) => ({
  ...defaultFilters,
  setDateRange: (dateRange) => set({ dateRange }),
  setRoomType: (roomType) => set({ roomType }),
  setBookingChannel: (bookingChannel) => set({ bookingChannel }),
  resetFilters: () => set({ ...defaultFilters }),
}))
