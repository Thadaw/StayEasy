import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBookingSpecialRequests } from "@/api/bookings/bookingApi"
import { bookingKeys } from "@/lib/queryKeys"

export interface UpdateSpecialRequestsPayload {
  refNumber: string
  specialRequests: string
}

interface UseBookingSpecialRequestsReturn {
  updateSpecialRequests: (payload: UpdateSpecialRequestsPayload) => Promise<void>
  isUpdating: boolean
  error: string | null
}

export function useBookingSpecialRequests(): UseBookingSpecialRequestsReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdateSpecialRequestsPayload) =>
      updateBookingSpecialRequests(payload.refNumber, payload.specialRequests),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.refNumber) })
    },
  })

  return {
    updateSpecialRequests: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error?.message || null,
  }
}
