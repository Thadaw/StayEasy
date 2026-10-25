import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking, type CreateBookingPayload } from "@/api/bookings/bookingApi"
import { bookingKeys } from "@/lib/queryKeys"

interface UseBookingCreationReturn {
  createBooking: (payload: CreateBookingPayload) => Promise<string>
  isCreating: boolean
  error: string | null
}

export function useBookingCreation(): UseBookingCreationReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
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
