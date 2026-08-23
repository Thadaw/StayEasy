import { useState, useRef } from "react"
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
  const abortRef = useRef<AbortController | null>(null)

  const createBooking = async (payload: CreateBookingPayload): Promise<string> => {
    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsCreating(true)
    setError(null)

    try {
      const idempotencyKey = crypto.randomUUID()
      const { data } = await api.post("/bookings/", {
        idempotency_key: idempotencyKey,
        ...payload,
      }, { signal: controller.signal })
      return data?.data?.ref_number || data?.ref_number || ""
    } catch (err) {
      if (controller.signal.aborted) return ""
      const message = err instanceof Error ? err.message : "Failed to create booking"
      setError(message)
      throw err
    } finally {
      if (!controller.signal.aborted) setIsCreating(false)
    }
  }

  return {
    createBooking,
    isCreating,
    error,
  }
}
