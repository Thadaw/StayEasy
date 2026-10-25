import { create } from 'zustand'
import type { GuestInformationFormData } from '@/schemas/booking/bookingSchemas'

export const DEFAULT_GUEST: GuestInformationFormData = {
  name: '',
  email: '',
  phoneCode: '+977',
  phone: '',
  country: '',
}

interface GuestBookingState {
  guest: GuestInformationFormData
  specialRequest: string
  setGuest: (guest: GuestInformationFormData) => void
  updateGuest: (patch: Partial<GuestInformationFormData>) => void
  setSpecialRequest: (value: string) => void
  resetGuest: () => void
}

export const useGuestBookingStore = create<GuestBookingState>((set) => ({
  guest: DEFAULT_GUEST,
  specialRequest: '',
  setGuest: (guest) => set({ guest }),
  updateGuest: (patch) => set((s) => ({ guest: { ...s.guest, ...patch } })),
  setSpecialRequest: (specialRequest) => set({ specialRequest }),
  resetGuest: () => set({ guest: DEFAULT_GUEST, specialRequest: '' }),
}))
