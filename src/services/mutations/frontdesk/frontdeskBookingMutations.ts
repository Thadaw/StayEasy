import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"
import type { EditBookingFormData } from "@/schemas/frontdesk/bookingSchema"

// -- Update an existing booking (edit booking page) --
// The backend only supports modifying stay details via the staff modify
// endpoint (keyed by reference number); guest contact changes are not part
// of that contract, so they are not submitted here.
export function useUpdateBookingMutation(_propertyId: string | null | undefined, refNumber?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditBookingFormData) => {
      if (!refNumber) throw new Error("Missing params")
      const payload = {
        checkin_date: data.checkinDate,
        checkout_date: data.checkoutDate,
        number_of_adults: data.adults,
        number_of_children: data.children,
        special_requests: data.specialRequests || undefined,
        reason: data.reason,
      }
      const { data: result } = await api.patch(`/staff/${refNumber}/booking-modify`, payload)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.bookingDetail(refNumber) })
      queryClient.invalidateQueries({ queryKey: frontdeskKeys.bookings(_propertyId || "") })
    },
  })
}
