import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { parseJSON } from "@/utils/helpers"
import type { ApiBooking } from "@/types/guestBooking"
import type { ApiRoom } from "@/types/api"
import type { Hotel } from "@/data/static/hotels"
import type { PaymentPlan } from "@/components/bookings/PaymentSection"
import {
  buildRoomLines,
  computeAdvanceAmount,
  computeAdvanceBounds,
  computeCancellationInfo,
  computeDefaultAdvancePct,
  computeDiscountAmount,
  computeNights,
  computeSubtotal,
  computeTotalGuests,
  selectRoomTypes,
  type AppliedDiscount,
} from "@/utils/reservationCalculations"

interface UseReservationPricingParams {
  booking: ApiBooking | null | undefined
  hotel: Hotel | null
  availableRooms: ApiRoom[]
  checkIn: string
  checkOut: string
  paymentPlan: PaymentPlan
  appliedDiscount: AppliedDiscount | null
}

// Derives every price/room figure shown on the reserve page from the booking
// and the room selection, and owns the guest-chosen advance percentage.
export function useReservationPricing({
  booking,
  hotel,
  availableRooms,
  checkIn,
  checkOut,
  paymentPlan,
  appliedDiscount,
}: UseReservationPricingParams) {
  const [searchParams] = useSearchParams()

  const selectedRooms: Record<string, number> = useMemo(
    () => parseJSON(searchParams.get('rooms') || '', {}),
    [searchParams],
  )
  const guestAllocation: Record<string, number> = useMemo(
    () => parseJSON(searchParams.get('guestCounts') || '', {}),
    [searchParams],
  )
  const adultsParam = searchParams.get('adults')
  const childrenParam = searchParams.get('children')

  const total = booking?.total_amount ?? 0
  const { minAdvancePct, maxAdvancePct, allowAdvance } = computeAdvanceBounds(booking)
  const defaultAdvancePct = useMemo(
    () => computeDefaultAdvancePct(booking, total, minAdvancePct, maxAdvancePct),
    [booking, total, minAdvancePct, maxAdvancePct],
  )

  // Guest-selected advance % from the picker (null → default).
  const [chosenAdvancePct, setChosenAdvancePct] = useState<number | null>(null)
  const advancePercentage = chosenAdvancePct ?? defaultAdvancePct
  const advanceAmount = useMemo(
    () => computeAdvanceAmount({ paymentPlan, total, advancePercentage, booking }),
    [paymentPlan, total, advancePercentage, booking],
  )

  const selectedRoomTypes = useMemo(
    () => selectRoomTypes(hotel, booking, selectedRooms),
    [hotel, booking, selectedRooms],
  )

  const nights = computeNights(booking, checkIn, checkOut)

  const roomLines = useMemo(
    () => buildRoomLines(booking, hotel, selectedRoomTypes, selectedRooms, guestAllocation, nights),
    [booking, selectedRoomTypes, hotel, selectedRooms, guestAllocation, nights],
  )

  const { cancellationTitle, cancellationDescription } = computeCancellationInfo(booking, availableRooms)
  const totalGuests = computeTotalGuests(booking, guestAllocation, adultsParam, childrenParam)
  const subtotal = computeSubtotal(booking, roomLines)
  const discountAmount = computeDiscountAmount(appliedDiscount, subtotal)

  return {
    total,
    minAdvancePct,
    maxAdvancePct,
    allowAdvance,
    defaultAdvancePct,
    chosenAdvancePct,
    setChosenAdvancePct,
    advancePercentage,
    advanceAmount,
    selectedRoomTypes,
    nights,
    roomLines,
    cancellationTitle,
    cancellationDescription,
    totalGuests,
    subtotal,
    discountAmount,
  }
}
