import { useQueries, useQuery } from "@tanstack/react-query"
import { getAllProperties, getPropertyBookings, getRooms, getRoomTypes } from "@/api/pms/pmsApi"
import { bookingKeys, propertyKeys, roomKeys, roomTypeKeys } from "@/lib/queryKeys"
import type { GeneralInfoResponse, PropertyBooking, RoomResponse, RoomTypeResponse } from "@/types/pms"

// -- Properties (portfolio) --
export function useAdminPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}

// -- Bookings for a single property --
export function usePropertyBookingsQuery(propertyId: string | null | undefined) {
  return useQuery<PropertyBooking[]>({
    queryKey: bookingKeys.byProperty(propertyId || ""),
    queryFn: () => getPropertyBookings(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

// -- Bookings across every active property (overall mode) --
export function useOverallPropertyBookingsQuery(propertyIds: string[], enabled = true) {
  return useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: bookingKeys.byProperty(id),
      queryFn: () => getPropertyBookings(id),
      select: (data: unknown) => (Array.isArray(data) ? data : []),
      enabled: enabled && propertyIds.length > 0,
    })),
  })
}

// -- Rooms / room types for the new-booking form --
export function useAdminRoomsQuery(propertyId: string | null | undefined, enabled = false) {
  return useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId || ""),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId && enabled,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useAdminRoomTypesQuery(propertyId: string | null | undefined, enabled = false) {
  return useQuery<RoomTypeResponse[]>({
    queryKey: roomTypeKeys.byProperty(propertyId || ""),
    queryFn: () => getRoomTypes(propertyId!),
    enabled: !!propertyId && enabled,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}
