import { useQuery } from "@tanstack/react-query"
import type { AuthRequestConfig } from "@/api/axiosInstance"
import { getBookingByRef } from "@/api/bookings/bookingApi"
import { getPropertyPublic, getAvailableRooms } from "@/api/properties/propertyApi"
import { getGuestProfile } from "@/api/users/userApi"
import { bookingKeys, propertyKeys, roomKeys } from "@/lib/queryKeys"

// -- Booking by refNumber --
export function useBookingQuery(refNumber: string | null | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(refNumber || ""),
    queryFn: ({ signal }) => getBookingByRef(refNumber || "", signal),
    enabled: !!refNumber,
    staleTime: 10_000,
  })
}

// -- Property public details --
export function usePropertyQuery(
  propertyId: string | null | undefined,
  requestConfig?: AuthRequestConfig,
) {
  return useQuery({
    queryKey: propertyKeys.detail(propertyId || ""),
    queryFn: ({ signal }) => getPropertyPublic(propertyId || "", requestConfig, signal),
    enabled: !!propertyId,
    staleTime: 5 * 60_000,
  })
}

// -- Available rooms --
export function useAvailableRoomsQuery(
  propertyId: string | null | undefined,
  checkinDate: string,
  checkoutDate: string,
  adults: number = 2,
  children: number = 0,
  rooms: number = 1,
  requestConfig?: AuthRequestConfig,
) {
  return useQuery({
    queryKey: roomKeys.available(propertyId || "", checkinDate, checkoutDate, adults, children, rooms),
    queryFn: ({ signal }) =>
      getAvailableRooms(propertyId || "", checkinDate, checkoutDate, adults, children, rooms, requestConfig, signal),
    enabled: !!propertyId && !!checkinDate && !!checkoutDate,
    staleTime: 30_000,
  })
}

// -- Guest profile from /auth/guests/me --
export function useGuestProfileQuery() {
  return useQuery({
    queryKey: ["guestProfile"] as const,
    queryFn: ({ signal }) => getGuestProfile(signal),
    staleTime: 5 * 60_000,
  })
}
