import { useQuery } from "@tanstack/react-query"
import api, { type AuthRequestConfig } from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

// Shape returned by /staff/properties/:id/bookings/:id/guest-folio
export interface CheckoutBookingRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  base_rate: number
}

export interface CheckoutBookingFolio {
  folio_id: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  amount_paid: number
  remaining_balance: number
  charges_count: number
  settled_at: string | null
  charges?: Array<{
    charge_id: string
    description: string
    amount: number
    category?: string
    posted_by_name?: string
    created_at: string
  }>
}

export interface CheckoutBooking {
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  guest_nationality: string
  ref_number: string
  status: string
  checkin_date: string
  checkout_date: string
  total_amount: number
  amount_paid: number
  amount_due: number
  rooms: CheckoutBookingRoom[]
  folio: CheckoutBookingFolio | null
  payment_method?: string
}

// -- Booking with guest folio (checkout page) --
export function useCheckoutBookingQuery(propertyId: string | null | undefined, id?: string) {
  return useQuery({
    queryKey: frontdeskKeys.checkoutBooking(propertyId || "", id),
    queryFn: async (): Promise<CheckoutBooking | null> => {
      if (!propertyId || !id) return null
      const { data: result } = await api.get(
        `/staff/properties/${propertyId}/bookings/${id}/guest-folio`
      )
      const wrapped = result as { data?: CheckoutBooking }
      return (wrapped?.data ?? result) as CheckoutBooking
    },
    enabled: !!propertyId && !!id,
  })
}

// Shape returned by /staff/bookings/:ref_number (edit booking page)
export interface StaffBookingGuest {
  full_name: string
  email: string
  phone?: string | null
  nationality?: string | null
}

export interface BookingDetail {
  booking_id: string
  ref_number: string
  status: string
  booking_type: string
  payment_status: string
  payment_method: string
  amount_paid: number
  amount_due: number
  refund_due: number
  number_of_adults: number
  number_of_children: number
  checkin_date: string
  checkout_date: string
  checked_in_at?: string | null
  checked_out_at?: string | null
  special_requests?: string | null
  coupon_code?: string | null
  coupon_discount?: number
  property?: { property_id: string; name: string }
  rooms: { room_id: string; room_name: string; room_type: string; bed_type: string; base_rate: number }[]
  guest?: StaffBookingGuest | null
  booking_guest?: StaffBookingGuest | null
  total_amount: number
  subtotal: number
  created_at: string
}

// -- Booking detail (edit booking page) --
// Uses the staff-facing endpoint, which is keyed by the booking reference number.
export function useBookingDetailQuery(_propertyId: string | null | undefined, refNumber?: string) {
  return useQuery({
    queryKey: frontdeskKeys.bookingDetail(refNumber),
    queryFn: async (): Promise<BookingDetail | null> => {
      if (!refNumber) return null
      const { data: result } = await api.get(`/staff/bookings/${refNumber}`)
      const wrapped = result as { data?: BookingDetail }
      return (wrapped?.data ?? result) as BookingDetail
    },
    enabled: !!refNumber,
  })
}

// -- Booking receipt (guest-folio for the receipt/invoice view) --
export function useBookingReceiptQuery(propertyId: string | null | undefined, bookingId?: string) {
  return useQuery({
    queryKey: ["booking-receipt", propertyId || "", bookingId],
    queryFn: async (): Promise<CheckoutBooking | null> => {
      if (!propertyId || !bookingId) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${propertyId}/bookings/${bookingId}/guest-folio`,
          { skipAuthRedirect: true } as AuthRequestConfig
        )
        const wrapped = result as { data?: CheckoutBooking }
        return (wrapped?.data ?? result) as CheckoutBooking
      } catch {
        return null
      }
    },
    enabled: !!propertyId && !!bookingId,
  })
}
