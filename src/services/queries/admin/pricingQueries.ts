import { useQuery } from '@tanstack/react-query'
import { getAllProperties, getDiscountCodes, getSpecialOffers } from '@/api/pms/pmsApi'
import { propertyKeys, discountCodeKeys, specialOfferKeys } from '@/lib/queryKeys'
import type { DiscountCodeResponse, GeneralInfoResponse, SpecialOfferResponse } from '@/types/pms'

export function usePricingPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}

export function useDiscountCodesQuery(propertyId: string | null | undefined) {
  return useQuery<DiscountCodeResponse[]>({
    queryKey: discountCodeKeys.byProperty(propertyId ?? ''),
    queryFn: () => getDiscountCodes(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useSpecialOffersQuery(propertyId: string | null | undefined) {
  return useQuery<SpecialOfferResponse[]>({
    queryKey: specialOfferKeys.byProperty(propertyId ?? ''),
    queryFn: () => getSpecialOffers(propertyId!),
    enabled: !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}
