import { useQuery } from '@tanstack/react-query'
import { getAmenities, getSystemRoomTypes, getSystemBedTypes } from '@/api/pms/pmsApi'
import type { AmenityOption, SystemBedTypeItem, SystemRoomTypeItem } from '@/types/pms'

export const portalKeys = {
  amenities: ['portal', 'amenities'] as const,
  systemRoomTypes: ['portal', 'systemRoomTypes'] as const,
  systemBedTypes: ['portal', 'systemBedTypes'] as const,
}

export function usePortalAmenitiesQuery(enabled = true) {
  return useQuery<AmenityOption[]>({
    queryKey: portalKeys.amenities,
    queryFn: getAmenities,
    enabled,
  })
}

export function usePortalSystemRoomTypesQuery(enabled = true) {
  return useQuery<SystemRoomTypeItem[]>({
    queryKey: portalKeys.systemRoomTypes,
    queryFn: getSystemRoomTypes,
    enabled,
  })
}

export function usePortalSystemBedTypesQuery(enabled = true) {
  return useQuery<SystemBedTypeItem[]>({
    queryKey: portalKeys.systemBedTypes,
    queryFn: getSystemBedTypes,
    enabled,
  })
}
