import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

// Shape returned by /staff/properties/:id/booking-guests
export interface InHouseGuest {
  guest_id: string | null
  booking_guest_id: string | null
  full_name: string
  email: string
  phone: string
  nationality: string
  ref_number: string
  checkin_date: string
  checkout_date: string
}

// Shape of a booking used to derive the guest CRM directory
export interface GuestBooking {
  id: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  booking_number: string
  room_names: string[]
  checkin_date: string
  checkout_date: string
  status: string
  payment_status?: string
  total_amount: string
  created_at: string
}

// -- Currently in-house guests --
export function useInHouseGuestsQuery(
  propertyId: string | null | undefined,
  options?: { refetchOnMount?: boolean }
) {
  return useQuery({
    queryKey: frontdeskKeys.inHouse(propertyId || ""),
    queryFn: async (): Promise<InHouseGuest[]> => {
      if (!propertyId) return []
      try {
        const { data: result } = await api.get(`/staff/properties/${propertyId}/booking-guests`, {
          params: { skip: 0, limit: 100 },
        })
        const wrapped = result as { data?: InHouseGuest[] }
        return wrapped?.data || []
      } catch {
        return []
      }
    },
    enabled: !!propertyId,
    refetchOnMount: options?.refetchOnMount,
  })
}

// -- All bookings for a property (guest CRM), paginated client-side loop --
export function useGuestBookingsQuery(propertyId: string | null | undefined, searchQuery = "") {
  return useQuery({
    queryKey: [...frontdeskKeys.guests(propertyId || ""), searchQuery],
    queryFn: async (): Promise<GuestBooking[]> => {
      if (!propertyId) return []
      let allBookings: GuestBooking[] = []
      let skip = 0
      let hasMore = true
      let iterations = 0
      const MAX_ITERATIONS = 100

      while (hasMore && iterations < MAX_ITERATIONS) {
        iterations++
        const params: Record<string, string> = { limit: "50", skip: String(skip) }
        if (searchQuery.trim()) params.search = searchQuery.trim()

        const { data: result } = await api.get(`/properties/${propertyId}/bookings`, { params })
        const wrapped = result as {
          data?: GuestBooking[]
          meta?: { has_more?: boolean }
          has_more?: boolean
        }
        const apiData = (wrapped?.data ?? result) as GuestBooking[]
        allBookings = [...allBookings, ...apiData]
        hasMore = wrapped?.meta?.has_more ?? wrapped?.has_more ?? false
        skip += 50
      }

      return allBookings
    },
    enabled: !!propertyId,
  })
}
