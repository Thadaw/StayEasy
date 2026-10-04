export interface EditFormState {
  guestName: string
  guestEmail: string
  guestPhone: string
  idPassport: string
  nationality: string
  guestType: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  bookingSource: string
  arrivalTime: string
  promoCode: string
  roomType: string
  room: string
  ratePlan: string
  specialRequests: string
  internalNote: string
}

export const ROOM_TYPES = ['Deluxe King', 'Deluxe Twin', 'Suite', 'Standard']

export const ROOM_OPTIONS: Record<string, string[]> = {
  'Deluxe King': ['501', '502', '506', '510'],
  'Deluxe Twin': ['503', '507', '511'],
  Suite: ['504', '508', '512'],
  Standard: ['505', '509'],
}

export const RATE_PLANS = [
  'Flexible · Breakfast Included',
  'Flexible · Room Only',
  'Non-Refundable · Breakfast Included',
  'Corporate Rate',
]

export const NATIONALITIES = ['Nepal', 'India', 'United States', 'United Kingdom', 'Australia', 'Other']

export const GUEST_TYPES = ['Regular Guest', 'VIP', 'Corporate', 'Walk-in', 'Travel Agent']

export const BOOKING_SOURCES = ['Direct (Website)', 'OTA', 'Phone', 'Walk-in']

export const ARRIVAL_TIMES = [
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
  '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
]

const pad = (n: number) => String(n).padStart(2, '0')

export function displayToISO(display: string): string {
  const date = new Date(display)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function isoToDisplay(iso: string): string {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function nightsBetween(isoFrom: string, isoTo: string): number {
  if (!isoFrom || !isoTo) return 0
  const start = new Date(`${isoFrom}T00:00:00`)
  const end = new Date(`${isoTo}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000))
}

export function roomOptionsFor(roomType: string, currentRoom: string): string[] {
  const options = ROOM_OPTIONS[roomType] ?? []
  return currentRoom && !options.includes(currentRoom) ? [...options, currentRoom] : options
}
