import type { PropertyBooking } from '@/types/pms'
import type { Booking } from '@/components/admin/bookings/BookingTable'
import { BOOKING_STATUS_LABELS } from '@/constants/bookingStatus'

export function normalizeStatus(raw: string): string {
  const up = (raw || '').toUpperCase()
  return BOOKING_STATUS_LABELS[up] ?? (raw || 'Unknown')
}

export function derivePaymentStatus(status: string, paymentStatus?: string): string {
  const apiStatus = (paymentStatus || '').toUpperCase()
  if (apiStatus) {
    if (apiStatus.includes('CANCELL') || apiStatus === 'REFUNDED') return 'Refunded'
    if (apiStatus === 'PAID') return 'Paid'
    if (apiStatus === 'PARTIAL' || apiStatus === 'PARTIALLY_PAID') return 'Partial'
    if (apiStatus === 'UNPAID' || apiStatus === 'PENDING') return 'Pending'
    return apiStatus.charAt(0) + apiStatus.slice(1).toLowerCase()
  }
  const up = (status || '').toUpperCase()
  if (up.includes('CANCELL')) return 'Refunded'
  if (up === 'PENDING') return 'Pending'
  return 'Paid'
}

export function formatDate(iso: string): string {
  if (!iso) return '–'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatAmount(value: string | number | null | undefined): string {
  const num = Number(value)
  if (value === null || value === undefined || isNaN(num)) return 'NPR 0'
  return `NPR ${num.toLocaleString()}`
}

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.ceil(diff / 86400000))
}

export function mapApiBookingToBooking(api: PropertyBooking): Booking {
  const status = normalizeStatus(api.status)
  return {
    id: api.booking_number || api.id,
    guest: api.guest_name || 'Unknown Guest',
    email: api.guest_email || 'N/A',
    roomType: (api.room_names || []).join(', ') || 'Room',
    roomNumber: api.room_names?.length ? String(api.room_names.length) : '1',
    checkIn: formatDate(api.checkin_date),
    checkOut: formatDate(api.checkout_date),
    nights: nightsBetween(api.checkin_date, api.checkout_date),
    status,
    amount: formatAmount(api.total_amount),
    paymentStatus: derivePaymentStatus(status, api.payment_status),
  }
}