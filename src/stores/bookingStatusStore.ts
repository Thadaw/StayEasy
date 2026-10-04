import { create } from 'zustand'

interface BookingStatusState {
  overrides: Record<string, string>
  setStatus: (id: string, status: string) => void
}

export const useBookingStatusStore = create<BookingStatusState>((set) => ({
  overrides: {},
  setStatus: (id, status) => set((s) => ({ overrides: { ...s.overrides, [id]: status } })),
}))

export function getBookingStatus(id: string, fallback: string): string {
  return useBookingStatusStore.getState().overrides[id] ?? fallback
}
