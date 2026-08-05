import { useState, useEffect } from 'react'
import api from '../../../services/axios'
import type { ApiBooking } from '../types'

export type { ApiBooking, BookingRoom } from '../types'

interface UseBookingOptions {
  refNumber: string | null
}

export function useBooking({ refNumber }: UseBookingOptions) {
  const [booking, setBooking] = useState<ApiBooking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!refNumber) {
      setLoading(false)
      return
    }

    setLoading(true)

    api.get(`/bookings/${refNumber}`)
      .then(res => {
        setBooking(res.data?.data || res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [refNumber])

  return { booking, loading }
}
