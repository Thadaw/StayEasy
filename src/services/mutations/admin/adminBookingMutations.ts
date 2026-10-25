import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking } from "@/api/pms/pmsApi"
import { bookingKeys } from "@/lib/queryKeys"
import type { BookingCreatePayload, PropertyBooking } from "@/types/pms"

interface UseCreateAdminBookingReturn {
  createBooking: (payload: BookingCreatePayload) => Promise<PropertyBooking>
  isCreating: boolean
  error: unknown
}

export function useCreateAdminBooking(propertyId: string | null | undefined): UseCreateAdminBookingReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: BookingCreatePayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byProperty(propertyId || "") })
    },
  })

  return {
    createBooking: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}
