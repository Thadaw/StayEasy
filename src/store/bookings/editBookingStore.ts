import { create } from 'zustand'

interface EditBookingState {
  editingId: string | null
  open: (id: string) => void
  close: () => void
}

export const useEditBookingStore = create<EditBookingState>((set) => ({
  editingId: null,
  open: (id) => set({ editingId: id }),
  close: () => set({ editingId: null }),
}))
