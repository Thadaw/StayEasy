import { useQuery } from "@tanstack/react-query"
import { getAllProperties, getRooms, getRoomTypes, getBedTypes } from "@/api/pms/pmsApi"
import { propertyKeys, roomKeys, roomTypeKeys, bedTypeKeys } from "@/lib/queryKeys"
import type { GeneralInfoResponse, RoomResponse, RoomTypeResponse, BedTypeResponse } from "@/types/pms"

// -- Properties (portfolio) --
export function useAdminPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}

// -- Rooms for a single property --
export function useAdminRoomsQuery(propertyId: string | null | undefined) {
  return useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId || ""),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

// -- Room types for a single property --
export function useAdminRoomTypesQuery(propertyId: string | null | undefined) {
  return useQuery<RoomTypeResponse[]>({
    queryKey: roomTypeKeys.byProperty(propertyId || ""),
    queryFn: () => getRoomTypes(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

// -- Bed types for a single property --
export function useAdminBedTypesQuery(propertyId: string | null | undefined) {
  return useQuery<BedTypeResponse[]>({
    queryKey: bedTypeKeys.byProperty(propertyId || ""),
    queryFn: () => getBedTypes(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}
