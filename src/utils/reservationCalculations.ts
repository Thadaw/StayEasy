import type { ApiBooking } from "@/types/guestBooking"
import type { ApiRoom } from "@/types/api"
import type { Hotel, RoomType } from "@/data/static/hotels"
import { calculateNights } from "@/utils/time"

export interface AppliedDiscount {
  type: "percentage" | "fixed"
  amount: number
  code: string
}

export interface RoomLine {
  room: RoomType
  qty: number
  gc: number
  ep: number
  lineTotal: number
  nights?: number
  maxAdults?: number
  maxChildren?: number
  cancellationTitle?: string
  cancellationPolicy?: string
}

export interface AdvanceBounds {
  minAdvancePct: number
  maxAdvancePct: number
  allowAdvance: boolean
}

export function selectRoomTypes(
  hotel: Hotel | null,
  booking: ApiBooking | null | undefined,
  selectedRooms: Record<string, number>,
): RoomType[] {
  if (!hotel) return []
  if (booking?.rooms?.length) {
    return hotel.roomTypes.filter(rt => booking.rooms.some(br => br.room_id === rt.id))
  }
  return hotel.roomTypes.filter(rt => selectedRooms[rt.id] && selectedRooms[rt.id] > 0)
}

export function computeNights(
  booking: ApiBooking | null | undefined,
  checkIn: string,
  checkOut: string,
): number {
  return booking?.nights || calculateNights(checkIn, checkOut)
}

export function buildRoomLines(
  booking: ApiBooking | null | undefined,
  hotel: Hotel | null,
  selectedRoomTypes: RoomType[],
  selectedRooms: Record<string, number>,
  guestAllocation: Record<string, number>,
  nights: number,
): RoomLine[] {
  if (booking?.rooms?.length) {
    return booking.rooms.map(br => {
      const rt = hotel?.roomTypes.find(r => r.id === br.room_id)
      return {
        room: rt || {
          id: br.room_id,
          name: br.room_name,
          price: br.base_rate,
          maxGuests: br.max_adults + br.max_children,
          maxAdults: br.max_adults,
          maxChildren: br.max_children,
          roomTypeName: br.room_type || "",
          bedType: br.bed_type || "",
          image: br.photo || br.photos?.cover || "",
          cancellationTitle: br.cancellation_title || "",
          cancellationDescription: br.cancellation_description || "",
        } as RoomType,
        qty: 1,
        gc: br.max_adults + br.max_children,
        ep: br.base_rate,
        lineTotal: br.subtotal || 1 * br.base_rate * nights,
        nights: br.nights,
        maxAdults: br.max_adults,
        maxChildren: br.max_children,
        cancellationTitle: rt?.cancellationTitle || br.cancellation_title || "",
        cancellationPolicy: rt?.cancellationPolicy || "",
      }
    })
  }
  return selectedRoomTypes.map(rt => {
    const qty = selectedRooms[rt.id] || 0
    const gc = guestAllocation[rt.id] || 1
    const ep = rt.price
    const lineTotal = qty * ep * nights
    return {
      room: rt,
      qty,
      gc,
      ep,
      lineTotal,
      maxAdults: rt.maxAdults || 0,
      maxChildren: rt.maxChildren || 0,
      cancellationTitle: rt.cancellationTitle || "",
      cancellationPolicy: rt.cancellationPolicy || "",
    }
  })
}

export function computeTotalGuests(
  booking: ApiBooking | null | undefined,
  guestAllocation: Record<string, number>,
  adultsParam: string | null,
  childrenParam: string | null,
): number {
  const guestCount = (booking?.number_of_adults || 0) + (booking?.number_of_children || 0)
  return (guestCount > 0 ? guestCount : null)
    || Object.values(guestAllocation).reduce((s, c) => s + c, 0)
    || (adultsParam ? Number(adultsParam) : 0) + (childrenParam ? Number(childrenParam) : 0)
    || booking?.rooms?.reduce((s, r) => s + r.max_adults + r.max_children, 0) || 0
}

export function computeCancellationInfo(
  booking: ApiBooking | null | undefined,
  availableRooms: ApiRoom[],
): { cancellationTitle: string; cancellationDescription: string } {
  return {
    cancellationTitle: booking?.rooms?.[0]?.cancellation_title || availableRooms[0]?.cancellation_title || "",
    cancellationDescription: booking?.rooms?.[0]?.cancellation_description || availableRooms[0]?.cancellation_description || "",
  }
}

export function computeSubtotal(
  booking: ApiBooking | null | undefined,
  roomLines: RoomLine[],
): number {
  return booking?.subtotal || roomLines.reduce((s, l) => s + l.lineTotal, 0)
}

export function computeDiscountAmount(
  appliedDiscount: AppliedDiscount | null,
  subtotal: number,
): number {
  if (!appliedDiscount) return 0
  return appliedDiscount.type === "percentage"
    ? Math.round(subtotal * appliedDiscount.amount / 100)
    : appliedDiscount.amount
}

export function computeAdvanceBounds(booking: ApiBooking | null | undefined): AdvanceBounds {
  const minAdvancePct = Math.max(30, Math.round(booking?.min_advance_percentage ?? 10))
  const maxAdvancePct = Math.min(100, Math.max(50, Math.round(booking?.max_advance_percentage ?? 100)))
  const allowAdvance =
    (booking?.min_advance_amount != null && booking.min_advance_amount > 0) ||
    (booking?.advance_payment_percentage != null && booking.advance_payment_percentage > 0)
  return { minAdvancePct, maxAdvancePct, allowAdvance }
}

// Default advance %: the server-stored advance expressed as a percentage,
// otherwise the preferred 30% — always clamped into the property's allowed
// [min, max] range (the API never sends advance_payment_percentage).
export function computeDefaultAdvancePct(
  booking: ApiBooking | null | undefined,
  total: number,
  minAdvancePct: number,
  maxAdvancePct: number,
): number {
  const preferred = booking?.advance_amount != null && booking.advance_amount > 0 && total > 0
    ? Math.round((booking.advance_amount / total) * 100)
    : (booking?.advance_payment_percentage ?? 30)
  return Math.min(maxAdvancePct, Math.max(minAdvancePct, preferred))
}

export function computeAdvanceAmount(params: {
  paymentPlan: "advance" | "full" | "arrival"
  total: number
  advancePercentage: number
  booking: ApiBooking | null | undefined
}): number {
  const { paymentPlan, total, advancePercentage, booking } = params
  if (paymentPlan !== "advance") return total
  if (total <= 0) return 0
  // total keeps cents and % is an integer, so the product is whole cents.
  let cents = Math.round(total * advancePercentage)
  // Stay inside the property's exact amount bounds — the backend validates
  // these and rejects the intent when the advance is out of range.
  if (booking?.min_advance_amount != null) cents = Math.max(cents, Math.ceil(booking.min_advance_amount * 100 - 1e-6))
  if (booking?.max_advance_amount != null) cents = Math.min(cents, Math.floor(booking.max_advance_amount * 100 + 1e-6))
  return cents / 100
}
