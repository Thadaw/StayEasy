import { normalizeBookingStatus } from "./format"
import { parseBookingDate } from "./time"

export function getStatusColor(status: string): string {
  switch (normalizeBookingStatus(status)) {
    case "upcoming":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    case "completed":
      return "bg-blue-50 text-blue-700 border border-blue-200"
    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200"
  }
}

// A stay counts as past once its check-out date (anchored at midnight UTC) is
// before today, so stale "upcoming" reservations roll over to "completed".
function hasCheckoutPassed(checkOut?: string | null): boolean {
  if (!checkOut) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkout = parseBookingDate(checkOut)
  checkout.setHours(0, 0, 0, 0)
  return checkout < today
}

// Combines the backend status mapping with a date check so a confirmed booking
// whose stay has already ended is shown as "completed" instead of "upcoming".
// Cancelled bookings are never reclassified.
export function resolveBookingStatus(status: string, checkOut?: string | null): 'upcoming' | 'completed' | 'cancelled' {
  const normalized = normalizeBookingStatus(status)
  if (normalized === 'cancelled') return 'cancelled'
  if (normalized === 'upcoming' && hasCheckoutPassed(checkOut)) return 'completed'
  return normalized === 'unknown' ? 'upcoming' : normalized
}

// Cancellation is allowed up to 24 hours before check-in at 14:00 (the property's
// standard check-in time). After that window, the reservation is locked.
export function canCancelBooking(status: string, checkIn: string): boolean {
  if (status !== "upcoming" && status !== "CONFIRMED") return false
  const checkInDate = new Date(checkIn)
  const cancelDeadline = new Date(checkInDate)
  cancelDeadline.setDate(cancelDeadline.getDate() - 1)
  cancelDeadline.setHours(14, 0, 0, 0)
  return new Date() < cancelDeadline
}

// The API returns `totalAmount` as a composite (base - discounts + tax + service fee).
// When a pre-discount base is available (`subtotal`, or the room subtotals as a
// fallback), the combined taxes & fees are what remains of the total after reversing
// the discounts, and the service fee is apportioned at 5/18 of that remainder (tax is
// the rest). Otherwise both are estimated from the total using the known 13% + 5% rates.
export function calculatePriceBreakdown(totalAmount: number, subtotal: number, specialOfferDiscount: number, couponDiscount: number, rooms: { subtotal?: number }[]) {
  const basePrice = subtotal > 0 ? subtotal : rooms.reduce((s, r) => s + (r.subtotal || 0), 0)

  if (basePrice > 0) {
    const taxesAndFees = Math.max(0, totalAmount - basePrice + specialOfferDiscount + couponDiscount)
    return {
      taxAmount: taxesAndFees,
      serviceFee: Math.round(taxesAndFees * (5 / 18)),
      basePrice,
    }
  }

  const estimatedBase = Math.max(0, Math.round((totalAmount + specialOfferDiscount + couponDiscount) / 1.18))
  const taxesAndFees = Math.max(0, Math.round(estimatedBase * 0.18))
  return {
    taxAmount: taxesAndFees,
    serviceFee: Math.round(taxesAndFees * (5 / 18)),
    basePrice: estimatedBase,
  }
}

// Deduplicates overlapping address parts — the API sometimes returns the city
// name inside the address field as well as in its own `city` field.
export function buildPropertyLocation(address: string, city: string, state: string, country: string): string {
  return [address, city, state, country]
    .filter(Boolean)
    .reduce<string[]>((parts, part) => {
      const prev = parts[parts.length - 1] || ""
      if (prev.toLowerCase().includes(part.toLowerCase())) return parts
      return [...parts, part]
    }, [])
    .join(", ")
}

export function buildShareText(propertyName: string, refNumber: string, checkIn: string, formatDateFull: (d: string) => string): string {
  if (!propertyName) return ""
  return `ServeIQ booking confirmed for ${propertyName}. Confirmation code: ${refNumber}. Check-in ${checkIn ? formatDateFull(checkIn) : ""}.`
}

export interface QrBookingData {
  confirmationCode: string
  propertyName: string
  propertyLocation: string
  propertyPhone?: string
  propertyEmail?: string
  checkIn: string
  checkOut: string
  nights: number
  totalGuests: number
  rooms: string
  roomTypes: string
  bedTypes: string
  guestName: string
  guestEmail?: string
  guestPhone?: string
  roomPrice: number
  taxes: number
  totalAmount: number
  currency: string
  paymentMethod: string
  cancellationPolicy: string
  bookedOn: string
}

export function buildQrData(params: QrBookingData): string {
  const lines = [
    'Booking Verification',
    '─────────────────────────',
    params.propertyName,
    params.propertyLocation,
    '',
    `Booking ID: ${params.confirmationCode}`,
    'Status: Paid',
    '',
    `Check-in: ${params.checkIn} (after 12:00)`,
    `Check-out: ${params.checkOut} (till 12:00)`,
    `Nights: ${params.nights}`,
    `Guests: ${params.totalGuests}`,
    `Room: ${params.rooms}`,
    `Room Type: ${params.roomTypes}`,
    '',
    `Guest: ${params.guestName}`,
    params.guestPhone ? `Phone: ${params.guestPhone}` : '',
    params.guestEmail ? `Email: ${params.guestEmail}` : '',
    '',
    `Total Cost: ${params.currency} ${params.totalAmount.toLocaleString()}`,
    `Payment: ${params.paymentMethod}`,
    '',
    params.propertyPhone ? `Property Phone: ${params.propertyPhone}` : '',
    params.propertyEmail ? `Property Email: ${params.propertyEmail}` : '',
    params.cancellationPolicy ? `Cancellation: ${params.cancellationPolicy}` : '',
  ].filter(Boolean)
  return lines.join('\n')
}
