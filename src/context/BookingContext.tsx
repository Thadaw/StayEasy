import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Booking } from '../shared/types/booking'
import { parseBookingDate } from '../shared/utils/time'

interface BookingContextValue {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'> & { createdAt?: string }) => void
  cancelBooking: (id: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

function getStorageKey(userId?: number): string {
  return userId ? `bookings_${userId}` : 'bookings_guest'
}

function loadBookings(userId?: number): Booking[] {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveBookings(bookings: Booking[], userId?: number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(bookings))
}

// Automatically transition past bookings to "completed" status on load so the
// UI doesn't show stale "upcoming" badges for reservations whose check-out date
// has already passed.
function autoCompletePastBookings(bookings: Booking[]): Booking[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return bookings.map(b => {
    const checkOutDate = parseBookingDate(b.checkOut)
    checkOutDate.setHours(0, 0, 0, 0)
    if (b.status === 'upcoming' && checkOutDate < today) {
      return { ...b, status: 'completed' as const }
    }
    return b
  })
}

// Bookings are stored in localStorage per-user because the API doesn't persist
// draft/pending bookings, and this allows offline viewing of past reservations.
export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const loaded = loadBookings(user?.id)
    return autoCompletePastBookings(loaded)
  })

  useEffect(() => {
    const loaded = loadBookings(user?.id)
    setBookings(autoCompletePastBookings(loaded))
  }, [user?.id])

  useEffect(() => {
    saveBookings(bookings, user?.id)
  }, [bookings, user?.id])

  const addBooking = useCallback(
    (data: Omit<Booking, 'id' | 'status' | 'createdAt'> & { createdAt?: string }) => {
      const newBooking: Booking = {
        ...data,
        id: data.refNumber || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        status: 'upcoming',
        createdAt: data.createdAt || new Date().toISOString(),
      }
      setBookings(prev => {
        const updated = autoCompletePastBookings([newBooking, ...prev])
        return updated
      })
    },
    []
  )

  const cancelBooking = useCallback(
    (id: string) => {
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
      )
    },
    []
  )

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be inside BookingProvider')
  return ctx
}
