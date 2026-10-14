import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  applyDiscountCode,
  confirmBooking,
  createBooking,
  type CreateBookingPayload,
} from "@/api/bookings/bookingApi"
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

// -- Confirm booking mutation --
export function useConfirmBookingMutation(refNumber: string) {
  return useMutation({
    mutationFn: ({ payload, maxRetries = 3 }: { payload: Record<string, unknown>; maxRetries?: number }) =>
      confirmBooking(refNumber, payload, maxRetries),
  })
}

// -- Apply discount mutation --
export function useApplyDiscountMutation(refNumber: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => applyDiscountCode(refNumber, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(refNumber) })
    },
  })
}
