import api from "@/api/axiosInstance"
import type { ApiBooking } from "@/types/guestBooking"

export interface DiscountResult {
  type?: string
  amount?: number
  discount?: number
}

export interface CreateBookingPayload {
  property_id: string
  room_ids: string[]
  check_in: string
  check_out: string
  adults: number
  children: number
  guest_full_name?: string
  guest_email?: string
  guest_phone?: string
  guest_nationality?: string
}

export async function getBookingByRef(
  refNumber: string,
  signal?: AbortSignal,
): Promise<ApiBooking> {
  const { data } = await api.get(`/bookings/${refNumber}`, { signal })
  return (data?.data || data) as ApiBooking
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<string> {
  const idempotencyKey = crypto.randomUUID()
  const bookingPayload: Record<string, unknown> = {
    idempotency_key: idempotencyKey,
    property_id: payload.property_id,
    room_ids: payload.room_ids,
    check_in: payload.check_in,
    check_out: payload.check_out,
    adults: payload.adults,
    children: payload.children,
  }
  if (payload.guest_full_name) bookingPayload.guest_full_name = payload.guest_full_name
  if (payload.guest_email) bookingPayload.guest_email = payload.guest_email
  if (payload.guest_phone) bookingPayload.guest_phone = payload.guest_phone
  if (payload.guest_nationality) bookingPayload.guest_nationality = payload.guest_nationality
  const { data } = await api.post("/bookings/", bookingPayload)
  return data?.data?.ref_number || data?.ref_number || ""
}

export async function applyDiscountCode(
  refNumber: string,
  code: string,
): Promise<DiscountResult | null> {
  const { data } = await api.post(`/bookings/${refNumber}/apply-discount`, { code })
  return (data?.data || data || null) as DiscountResult | null
}

export async function confirmBooking(
  refNumber: string,
  payload: Record<string, unknown>,
  maxRetries = 3,
): Promise<void> {
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
}
