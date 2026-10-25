import { useQuery } from "@tanstack/react-query"
import {
  getBookingStatuses,
  getPaymentStatuses,
  getPaymentGateways,
  getPaymentMethods,
  getBookingTypes,
  type EnumOption,
} from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

// Enums are static, so cache them for a while.
const ENUM_STALE_TIME = 5 * 60 * 1000

export function useBookingStatusesQuery() {
  return useQuery({
    queryKey: frontdeskKeys.enums.bookingStatuses,
    queryFn: getBookingStatuses,
    staleTime: ENUM_STALE_TIME,
  })
}

export function usePaymentStatusesQuery() {
  return useQuery({
    queryKey: frontdeskKeys.enums.paymentStatuses,
    queryFn: getPaymentStatuses,
    staleTime: ENUM_STALE_TIME,
  })
}

export function usePaymentGatewaysQuery() {
  return useQuery({
    queryKey: frontdeskKeys.enums.paymentGateways,
    queryFn: getPaymentGateways,
    staleTime: ENUM_STALE_TIME,
  })
}

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: frontdeskKeys.enums.paymentMethods,
    queryFn: getPaymentMethods,
    staleTime: ENUM_STALE_TIME,
  })
}

export function useBookingTypesQuery() {
  return useQuery({
    queryKey: frontdeskKeys.enums.bookingTypes,
    queryFn: getBookingTypes,
    staleTime: ENUM_STALE_TIME,
  })
}

export type { EnumOption }
