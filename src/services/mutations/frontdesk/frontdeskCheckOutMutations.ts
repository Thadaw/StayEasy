import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { checkOutGuest } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

export interface CheckOutVars {
  refNumber: string
  paymentAmount: number
  paymentGateway: string
}

// Checks a guest out and, when a payment is collected, records the folio.
// Folio-creation failures are surfaced via `onFolioError` without failing the
// whole checkout. Cache invalidation is handled internally.
export function useCheckOutGuestMutation(
  propertyId: string | null | undefined,
  options?: { onFolioError?: (message: string) => void }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ refNumber, paymentAmount, paymentGateway }: CheckOutVars) => {
      await checkOutGuest(refNumber, paymentAmount, paymentGateway)

      if (propertyId && refNumber && paymentAmount > 0) {
        try {
          await api.post(`/staff/properties/${propertyId}/bookings/${refNumber}/folio`, {
            tax: "0.00",
            discount: "0.00",
          })
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } }
          options?.onFolioError?.(
            err.response?.data?.message || "Failed to create folio after checkout."
          )
        }
      }

      return { refNumber, paymentAmount, paymentGateway }
    },
    onSuccess: () => {
      // Prefix invalidation covers every checkout-booking detail for this property.
      queryClient.invalidateQueries({ queryKey: ["checkout-booking", propertyId || ""] })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.checkoutBookings(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.summary(propertyId || "") })
      // Prefix invalidation refreshes every cached folio detail (the folio id
      // isn't known here until the server responds).
      queryClient.invalidateQueries({ queryKey: ["folio-detail"] })
    },
  })
}
