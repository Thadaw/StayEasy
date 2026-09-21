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

    const controller = new AbortController()
    setLoading(true)

    api.get(`/bookings/${refNumber}`, { signal: controller.signal })
      .then(res => {
        setBooking(res.data?.data || res.data)
      })
      .catch(err => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Failed to fetch booking:", err)
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [refNumber])

  return { booking, loading }
}
