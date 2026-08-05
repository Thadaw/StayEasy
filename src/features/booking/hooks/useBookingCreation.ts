import { useState } from "react"
import api from "../../../services/axios"

interface CreateBookingPayload {
  property_id: string
  room_ids: string[]
  check_in: string
  check_out: string
  adults: number
  children: number
}

interface UseBookingCreationReturn {
  createBooking: (payload: CreateBookingPayload) => Promise<string>
  isCreating: boolean
  error: string | null
}

export function useBookingCreation(): UseBookingCreationReturn {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (payload: CreateBookingPayload): Promise<string> => {
    setIsCreating(true)
    setError(null)

    try {
      const idempotencyKey = crypto.randomUUID()
      const { data } = await api.post("/bookings/", {
        idempotency_key: idempotencyKey,
        ...payload,
      })
      return data?.data?.ref_number || data?.ref_number || ""
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create booking"
      setError(message)
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createBooking,
    isCreating,
    error,
  }
}
