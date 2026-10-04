import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CheckOutRecord {
  bookingId: string
  checkedOutAt: string
}

interface BookingCheckOutState {
  checkedOutBookings: Record<string, CheckOutRecord>
  checkOut: (bookingId: string) => void
  isCheckedOut: (bookingId: string) => boolean
}

export const useBookingCheckOutStore = create<BookingCheckOutState>()(
  persist(
    (set, get) => ({
      checkedOutBookings: {},
      checkOut: (bookingId: string) => {
        set((state) => ({
          checkedOutBookings: {
            ...state.checkedOutBookings,
            [bookingId]: {
              bookingId,
              checkedOutAt: new Date().toISOString(),
            },
          },
        }))
      },
      isCheckedOut: (bookingId: string) => {
        return !!get().checkedOutBookings[bookingId]
      },
    }),
    {
      name: "booking-check-out-storage",
    }
  )
)
