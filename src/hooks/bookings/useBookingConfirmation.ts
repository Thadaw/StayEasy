import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useBookings } from "@/context/BookingContext"
import { useNotifications } from "@/context/NotificationContext"
import { confirmBooking } from "@/api/bookings/bookingApi"
import { markPayOnArrival } from "@/api/payments/paymentApi"
import { extractErrorMessage } from "@/utils/paymentErrors"
import type { ApiBooking, PaymentMethod } from "@/types/guestBooking"
import type { Hotel } from "@/data/static/hotels"
import type { RazorpayState, StripeState, KhaltiState } from "@/hooks/bookings/useReservationPayment"
import type { AppliedDiscount, RoomLine } from "@/utils/reservationCalculations"

interface UseBookingConfirmationParams {
  refNumber: string
  id?: string
  booking: ApiBooking | null | undefined
  hotel: Hotel | null
  total: number
  advanceAmount: number
  selectedPayment: PaymentMethod | null
  appliedDiscount: AppliedDiscount | null
  roomLines: RoomLine[]
  totalGuests: number
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
  guestPhone: string
  hotelName: string
  hotelCity: string
  hotelCountry: string
  razorpayState: RazorpayState
  stripeState: StripeState
  khaltiState: KhaltiState
  esewaConfirmData: string | null
  expired: boolean
  setPaymentLoading: (loading: boolean) => void
}

// Orchestrates the final "complete booking" step: verifies per-gateway state,
// submits the confirmation (with retry), records the booking locally, fires a
// notification, clears gateway storage keys, and navigates to the confirmation.
export function useBookingConfirmation(params: UseBookingConfirmationParams) {
  const {
    refNumber,
    id,
    booking,
    hotel,
    total,
    advanceAmount,
    selectedPayment,
    appliedDiscount,
    roomLines,
    totalGuests,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestPhone,
    hotelName,
    hotelCity,
    hotelCountry,
    razorpayState,
    stripeState,
    khaltiState,
    esewaConfirmData,
    expired,
    setPaymentLoading,
  } = params

  const navigate = useNavigate()
  const { addBooking } = useBookings()
  const { addNotification } = useNotifications()
  const [confirmingBooking, setConfirmingBooking] = useState(false)

  const handleConfirmBooking = async () => {
    if (expired) {
      toast.error("Your reservation hold has expired. Please reserve again.")
      return
    }
    if (!selectedPayment || confirmingBooking) return

    if (selectedPayment === "stripe" && !stripeState.paymentIntentId) {
      toast.error("Please complete payment first")
      return
    }

    if (selectedPayment === "razorpay" && !razorpayState.response) {
      toast.error("Please complete payment first by clicking the Razorpay tab")
      return
    }

    if (selectedPayment === "khalti" && !khaltiState.paymentIntentId) {
      toast.error("Please complete Khalti payment first")
      return
    }

    if (selectedPayment === "esewa" && !esewaConfirmData) {
      toast.error("Please complete eSewa payment first")
      return
    }

    setConfirmingBooking(true)
    setPaymentLoading(true)
    try {
      if (selectedPayment === "razorpay" && razorpayState.response && refNumber) {
        await confirmBooking(refNumber, {
          idempotency_key: crypto.randomUUID(),
          payment_method: "ONLINE",
          payment_gateway: "razorpay",
          advance_amount: advanceAmount,
          gateway_payload: {
            razorpay_order_id: razorpayState.response.razorpay_order_id,
            razorpay_payment_id: razorpayState.response.razorpay_payment_id,
            razorpay_signature: razorpayState.response.razorpay_signature,
          },
        })
      }

      if (selectedPayment === "stripe" && stripeState.paymentIntentId && refNumber) {
        await confirmBooking(refNumber, {
          idempotency_key: crypto.randomUUID(),
          payment_method: "ONLINE",
          payment_gateway: "stripe",
          advance_amount: advanceAmount,
          gateway_payload: {
            payment_intent_id: stripeState.paymentIntentId,
            stripe_payment_intent_id: stripeState.paymentIntentId,
          },
        })
      }

      if (selectedPayment === "khalti" && khaltiState.paymentIntentId && refNumber) {
        await confirmBooking(refNumber, {
          idempotency_key: crypto.randomUUID(),
          payment_method: "ONLINE",
          payment_gateway: "khalti",
          advance_amount: advanceAmount,
          gateway_payload: {
            payment_intent_id: khaltiState.paymentIntentId,
          },
        })
      }

      if (selectedPayment === "esewa" && esewaConfirmData && refNumber) {
        await confirmBooking(refNumber, {
          idempotency_key: crypto.randomUUID(),
          payment_method: "ONLINE",
          payment_gateway: "esewa",
          advance_amount: advanceAmount,
          gateway_payload: {
            data: esewaConfirmData,
          },
        })
      }

      if (selectedPayment === "arrival" && refNumber) {
        await markPayOnArrival(refNumber)
      }

      const roomTypeName = roomLines.map(l => l.room.name).join(", ")
      const localBookingData = {
        hotelId: Number(booking?.property?.id || hotel?.id || id),
        hotelName: hotelName,
        hotelCity: hotelCity,
        hotelCountry: hotelCountry,
        hotelImage: hotel?.imageUrl || hotel?.images?.[0] || '',
        checkIn,
        checkOut,
        roomTypeName,
        guests: totalGuests,
        totalPrice: Math.max(0, total),
        refNumber: refNumber || undefined,
        paymentGateway: selectedPayment === "arrival" ? "arrival" : selectedPayment || undefined,
        discountApplied: appliedDiscount ? {
          code: appliedDiscount.code,
          type: appliedDiscount.type,
          amount: appliedDiscount.amount,
        } : undefined,
      }

      const bookingTimestamp = selectedPayment === "stripe" && stripeState.transactionTime
        ? new Date(stripeState.transactionTime * 1000).toISOString()
        : new Date().toISOString()

      try {
        addBooking({ ...localBookingData, createdAt: bookingTimestamp })
      } catch {
        // localStorage write failure is non-critical — the booking is already confirmed server-side.
      }

      const newBooking = {
        id: refNumber || `${Date.now().toString(36)}`,
        ...localBookingData,
        status: "upcoming" as const,
        createdAt: bookingTimestamp,
      }
      toast.success("Booking confirmed!")
      addNotification({
        icon: 'CalendarDays',
        color: 'var(--brand-accent)',
        bgColor: 'var(--brand-accent-light)',
        title: 'Booking Confirmed',
        message: `Your booking at ${hotel?.name ?? 'the property'} has been confirmed. Check-in is on ${checkIn}.`,
      })
      localStorage.removeItem('khalti_payment_intent_id')
      localStorage.removeItem('esewa_confirm_data')
      localStorage.removeItem('esewa_status')
      localStorage.removeItem('esewa_return_to')
      localStorage.removeItem('esewa_ref_number')
      navigate(`/booking-confirmation/${refNumber || newBooking.id}`, {
        state: {
          propertyImages: hotel?.images || [],
          amenities: hotel?.amenities || [],
          guestName,
          guestEmail,
          guestPhone,
          totalGuests,
          rating: hotel?.rating,
          reviews: hotel?.reviews,
          paymentGateway: selectedPayment,
        }
      })
    } catch (err: unknown) {
      toast.error("Booking confirmation failed: " + extractErrorMessage(err, "Unknown error"))
    } finally {
      setPaymentLoading(false)
      setConfirmingBooking(false)
    }
  }

  return { handleConfirmBooking, confirmingBooking }
}
