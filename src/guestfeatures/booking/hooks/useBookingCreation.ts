import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../../services/axios"
import { bookingKeys } from "../../../lib/queryKeys"

interface CreateBookingPayload {
  property_id: string
  room_ids: string[]
  check_in: string
  check_out: string
  adults: number
  children: number
  guest_full_name?: string
  guest_email?: string
  guest_phone?: string
  guest_nationality?: string
}

interface UseBookingCreationReturn {
  createBooking: (payload: CreateBookingPayload) => Promise<string>
  isCreating: boolean
  error: string | null
}

export function useBookingCreation(): UseBookingCreationReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload: CreateBookingPayload): Promise<string> => {
      const idempotencyKey = crypto.randomUUID()
      const bookingPayload: Record<string, unknown> = {
        idempotency_key: idempotencyKey,
        property_id: payload.property_id,
        room_ids: payload.room_ids,
        check_in: payload.check_in,
        check_out: payload.check_out,
        adults: payload.adults,
        children: payload.children,
      }
      if (payload.guest_full_name) bookingPayload.guest_full_name = payload.guest_full_name
      if (payload.guest_email) bookingPayload.guest_email = payload.guest_email
      if (payload.guest_phone) bookingPayload.guest_phone = payload.guest_phone
      if (payload.guest_nationality) bookingPayload.guest_nationality = payload.guest_nationality
      const { data } = await api.post("/bookings/", bookingPayload)
      return data?.data?.ref_number || data?.ref_number || ""
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })

  return {
    createBooking: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message || null,
  }
}
