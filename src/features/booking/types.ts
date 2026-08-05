import type { RazorpayOrderResponse, RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayPayOptions, RazorpayFailureResponse, HostBankDetails } from '../../shared/types/razorpay'

export type PaymentMethod = "stripe" | "razorpay" | "khalti"

export interface BookingRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  max_adults: number
  max_children: number
  base_rate: number
  nights: number
  subtotal: number
  photo?: string
  photos?: { cover?: string }
  cancellation_title?: string
  cancellation_description?: string
}

export interface ApiBooking {
  booking_id: string
  ref_number: string
  status: string
  check_in: string
  check_out: string
  nights: number
  adults: number
  children: number
  total_guests: number
  payment_gateway: string | null
  payment_status: string | null
  property: {
    id: string
    name: string
    type: string
    city: string
    country: string
    currency: string
  }
  rooms: BookingRoom[]
  total_amount: number
  subtotal: number
  special_offer_discount: number
  special_offer_applied?: unknown[]
  coupon_code: string | null
  coupon_discount: number
  soft_lock_expires_at?: string
  created_at?: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  number_of_adults?: number
  number_of_children?: number
  photos?: { cover: string; gallery: string[] }
}

export interface LocalBooking {
  id: string
  refNumber?: string
  hotelId: number
  hotelName: string
  hotelCity: string
  hotelCountry: string
  hotelImage: string
  checkIn: string
  checkOut: string
  roomTypeName: string
  guests: number
  totalPrice: number
  discountApplied?: {
    code: string
    type: 'percentage' | 'fixed'
    amount: number
  }
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
}

export type { RazorpayOrderResponse, RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayPayOptions, RazorpayFailureResponse, HostBankDetails }
