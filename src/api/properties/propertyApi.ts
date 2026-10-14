import api, { type AuthRequestConfig } from "@/api/axiosInstance"
import type { ApiProperty, ApiRoom } from "@/types/api"

export async function getPropertyPublic(
  propertyId: string,
  requestConfig?: AuthRequestConfig,
  signal?: AbortSignal,
): Promise<ApiProperty> {
  const { data } = await api.get(`/properties/${propertyId}/public`, {
    signal,
    ...requestConfig,
  } as AuthRequestConfig)
  return (data?.data || data) as ApiProperty
}

export async function getAvailableRooms(
  propertyId: string,
  checkinDate: string,
  checkoutDate: string,
  adults: number = 2,
  children: number = 0,
  rooms: number = 1,
  requestConfig?: AuthRequestConfig,
  signal?: AbortSignal,
): Promise<ApiRoom[]> {
  const { data } = await api.get(`/properties/${propertyId}/rooms/available-rooms`, {
    params: { checkin_date: checkinDate, checkout_date: checkoutDate, adults, children, rooms },
    signal,
    ...requestConfig,
  } as AuthRequestConfig)
  return (data?.data || []) as ApiRoom[]
}
