import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../services/axios'
import { bookingKeys, propertyKeys, roomKeys } from '../../../lib/queryKeys'
import type { ApiBooking, ApiProperty, ApiRoom } from '../types'

// -- Booking by refNumber --
export function useBookingQuery(refNumber: string | null | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(refNumber || ''),
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/bookings/${refNumber}`, { signal })
      return (data?.data || data) as ApiBooking
    },
    enabled: !!refNumber,
    staleTime: 10_000,
  })
}

// -- Property public details --
export function usePropertyQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: propertyKeys.detail(propertyId || ''),
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/properties/${propertyId}/public`, { signal })
      return (data?.data || data) as ApiProperty
    },
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
) {
  return useQuery({
    queryKey: roomKeys.available(propertyId || '', checkinDate, checkoutDate, adults, children, rooms),
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/properties/${propertyId}/rooms/available-rooms`, {
        params: { checkin_date: checkinDate, checkout_date: checkoutDate, adults, children, rooms },
        signal,
      })
      return (data?.data || []) as ApiRoom[]
    },
    enabled: !!propertyId && !!checkinDate && !!checkoutDate,
    staleTime: 30_000,
  })
}

// -- Guest profile from /auth/guests/me --
export function useGuestProfileQuery() {
  return useQuery({
    queryKey: ['guestProfile'] as const,
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/auth/guests/me', { signal })
      return data as { full_name?: string; email?: string; phone?: string; nationality?: string }
    },
    staleTime: 5 * 60_000,
  })
}

// -- Apply discount mutation --
export function useApplyDiscountMutation(refNumber: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post(`/bookings/${refNumber}/apply-discount`, { code })
      return data?.data || data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(refNumber) })
    },
  })
}

// -- Confirm booking mutation --
export function useConfirmBookingMutation(refNumber: string) {
  return useMutation({
    mutationFn: async ({ payload, maxRetries = 3 }: { payload: Record<string, unknown>; maxRetries?: number }) => {
      let lastError: unknown
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          await api.post(`/bookings/${refNumber}/confirm`, payload)
          return
        } catch (err) {
          lastError = err
          if (attempt < maxRetries - 1) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
          }
        }
      }
      throw lastError
    },
  })
}
