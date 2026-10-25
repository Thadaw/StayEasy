import { useQuery } from "@tanstack/react-query"
import { getBookingByRef } from "@/api/bookings/bookingApi"
import { bookingKeys } from "@/lib/queryKeys"

// -- Booking by refNumber --
export function useBookingQuery(refNumber: string | null | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(refNumber || ""),
    queryFn: ({ signal }) => getBookingByRef(refNumber || "", signal),
    enabled: !!refNumber,
    staleTime: 10_000,
  })
}
