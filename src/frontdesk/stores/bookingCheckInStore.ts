import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CheckInRecord {
  bookingId: string
  checkedInAt: string
}

interface BookingCheckInState {
  checkedInBookings: Record<string, CheckInRecord>
  checkIn: (bookingId: string) => void
  isCheckedIn: (bookingId: string) => boolean
}

export const useBookingCheckInStore = create<BookingCheckInState>()(
  persist(
    (set, get) => ({
      checkedInBookings: {},
      checkIn: (bookingId: string) => {
        set((state) => ({
          checkedInBookings: {
            ...state.checkedInBookings,
            [bookingId]: {
              bookingId,
              checkedInAt: new Date().toISOString(),
            },
          },
        }))
      },
      isCheckedIn: (bookingId: string) => {
        return !!get().checkedInBookings[bookingId]
      },
    }),
    {
      name: "booking-check-in-storage",
    }
  )
)
