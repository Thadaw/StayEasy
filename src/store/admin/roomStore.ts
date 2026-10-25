import { create } from 'zustand'
import type { Room } from '@/components/admin/rooms/RoomTable'

interface AdminRoomState {
  searchQuery: string
  roomType: string
  status: string
  floor: string
  showModal: boolean
  editingRoom: Room | null
  confirmDelete: Room | null
  statusOverrides: Record<string, string>
  setSearchQuery: (value: string) => void
  setRoomType: (value: string) => void
  setStatus: (value: string) => void
  setFloor: (value: string) => void
  openAddRoom: () => void
  openEditRoom: (room: Room) => void
  closeModal: () => void
  setConfirmDelete: (room: Room | null) => void
  setRoomStatus: (roomNumber: string, status: string) => void
  clearFilters: () => void
}

export const useAdminRoomStore = create<AdminRoomState>((set) => ({
  searchQuery: '',
  roomType: 'All Types',
  status: 'All Status',
  floor: 'All Floors',
  showModal: false,
  editingRoom: null,
  confirmDelete: null,
  statusOverrides: {},
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setRoomType: (roomType) => set({ roomType }),
  setStatus: (status) => set({ status }),
  setFloor: (floor) => set({ floor }),
  openAddRoom: () => set({ editingRoom: null, showModal: true }),
  openEditRoom: (editingRoom) => set({ editingRoom, showModal: true }),
  closeModal: () => set({ showModal: false }),
  setConfirmDelete: (confirmDelete) => set({ confirmDelete }),
  setRoomStatus: (roomNumber, status) => set((s) => ({ statusOverrides: { ...s.statusOverrides, [roomNumber]: status } })),
  clearFilters: () => set({ searchQuery: '', roomType: 'All Types', status: 'All Status', floor: 'All Floors' }),
}))
