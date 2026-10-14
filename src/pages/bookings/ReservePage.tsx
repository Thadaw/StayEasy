import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PageMessage } from "@/components/ui/PageMessage"
import { ReservePageSkeleton } from "@/components/bookings/ReservePageSkeleton"
import { ReserveLayout } from "@/components/bookings/ReserveLayout"
import { ReserveStepper } from "@/components/bookings/ReserveStepper"
import { PropertySummaryCard } from "@/components/bookings/PropertySummaryCard"
import { PriceSummaryCard } from "@/components/bookings/PriceSummaryCard"
import { PaymentForms } from "@/components/bookings/PaymentForms"
import { ConfirmButton } from "@/components/bookings/ConfirmButton"
import PaymentSection, { type PaymentPlan } from "@/components/bookings/PaymentSection"
import StripeCardForm from "@/components/payments/StripeCardForm"
import { HoldCountdownBanner } from "@/components/bookings/HoldCountdownBanner"
import { promoCodeSchema, type PromoCodeFormData } from "@/schemas/booking/bookingSchemas"
import type { PaymentMethod } from "@/types/guestBooking"
import { applyDiscountCode } from "@/api/bookings/bookingApi"
import { extractErrorMessage } from "@/utils/paymentErrors"
import type { AppliedDiscount } from "@/utils/reservationCalculations"
import { useBookingCreation } from "@/services/mutations/bookingMutations"
import { useSoftLockCountdown } from "@/hooks/bookings/useSoftLockCountdown"
import { useReservationData } from "@/hooks/bookings/useReservationData"
import { useReservationPricing } from "@/hooks/bookings/useReservationPricing"
import { useReservationPayment } from "@/hooks/bookings/useReservationPayment"
import { useBookingConfirmation } from "@/hooks/bookings/useBookingConfirmation"

export default function ReservePage() {
  const navigate = useNavigate()
  const data = useReservationData()
  const {
    id,
    searchParams,
    refNumber,
    propertyId,
    booking,
    property,
    availableRooms,
    loading,
    hotel,
    currency,
    bookingAdults,
    bookingChildren,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    hotelName,
    hotelCity,
    hotelCountry,
  } = data

  const countdown = useSoftLockCountdown({
    expiresAt: booking?.soft_lock_expires_at,
    createdAt: booking?.created_at,
    status: booking?.status,
  })
  const expired = countdown.expired

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("full")
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [promoError, setPromoError] = useState("")
  const promoForm = useForm<PromoCodeFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: { code: "" },
  })
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(() => {
    const dc = searchParams.get('discountCode')
    const dt = searchParams.get('discountType') as 'percentage' | 'fixed' | null
    const da = searchParams.get('discountAmount')
    if (dc && dt && da) return { code: dc, type: dt, amount: Number(da) }
    return null
  })

  // Apply coupon from booking response if present (only once)
  const couponAppliedRef = useRef(false)
  useEffect(() => {
    if (booking?.coupon_code && booking.coupon_discount > 0 && !couponAppliedRef.current) {
      couponAppliedRef.current = true
      setAppliedDiscount({
        code: booking.coupon_code,
        type: 'fixed',
        amount: booking.coupon_discount,
      })
    }
  }, [booking])

  const pricing = useReservationPricing({
    booking,
    hotel,
    availableRooms,
    checkIn,
    checkOut,
    paymentPlan,
    appliedDiscount,
  })

  useEffect(() => {
    if (!pricing.allowAdvance && paymentPlan === "advance") {
      setPaymentPlan("full")
      setSelectedPayment(null)
    }
  }, [pricing.allowAdvance, paymentPlan])

  const payment = useReservationPayment({
    refNumber,
    propertyId,
    id,
    selectedPayment,
    setSelectedPayment,
    paymentPlan,
    advanceAmount: pricing.advanceAmount,
    expired,
    hotelName,
    guestName,
    guestEmail,
    guestPhone,
    setPaymentLoading,
  })

  const confirmation = useBookingConfirmation({
    refNumber,
    id,
    booking,
    hotel,
    total: pricing.total,
    advanceAmount: pricing.advanceAmount,
    selectedPayment,
    appliedDiscount,
    roomLines: pricing.roomLines,
    totalGuests: pricing.totalGuests,
    checkIn,
    checkOut,
    guestName,
    guestEmail,
    guestPhone,
    hotelName,
    hotelCity,
    hotelCountry,
    razorpayState: payment.razorpayState,
    stripeState: payment.stripeState,
    khaltiState: payment.khaltiState,
    esewaConfirmData: payment.esewaConfirmData,
    expired,
    setPaymentLoading,
  })

  const { createBooking, isCreating } = useBookingCreation()

  // Re-creates the reservation (fresh 10-min hold) and lands back on the same
  // payment page so the guest only re-confirms payment — without re-entering
  // any guest details (Plan A).
  const handleReserveAgain = async () => {
    if (!booking || !booking.property?.id || !booking.rooms?.length) return
    try {
      const guestNameParam = searchParams.get('guestName')
      const guestEmailParam = searchParams.get('guestEmail')
      const guestPhoneParam = searchParams.get('guestPhone')
      const newRef = await createBooking({
        property_id: booking.property.id,
        room_ids: booking.rooms.map(r => r.room_id),
        check_in: booking.check_in,
        check_out: booking.check_out,
        adults: bookingAdults,
        children: bookingChildren,
        ...(guestNameParam ? { guest_full_name: guestNameParam } : {}),
        ...(guestEmailParam ? { guest_email: guestEmailParam } : {}),
        ...(guestPhoneParam ? { guest_phone: guestPhoneParam } : {}),
      })
      if (!newRef) {
        toast.error('Could not start a new reservation. Please try again.')
        return
      }
      const params = new URLSearchParams(searchParams.toString())
      params.set('ref', newRef)
      navigate(`/reserve/${booking.property.id}?${params.toString()}`)
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, 'Could not start a new reservation.')
      if (/no rooms|unavailable|allocation/i.test(msg)) {
        toast.error('Rooms are no longer available. Please search again.')
      } else {
        toast.error(msg)
      }
    }
  }

  const handleApplyPromo = async () => {
    const code = promoForm.getValues('code').trim().toUpperCase()
    if (!code) return
    if (!refNumber) {
      setPromoError('No booking reference found')
      return
    }
    try {
      const discount = await applyDiscountCode(refNumber, code)
      if (discount) {
        setAppliedDiscount({
          code,
          type: String(discount.type || 'percentage').toLowerCase() === 'percentage' ? 'percentage' : 'fixed',
          amount: discount.amount || discount.discount || 0,
        })
        setPromoError('')
        promoForm.reset({ code: '' })
      } else {
        setPromoError('Invalid or expired discount code')
      }
    } catch (err: unknown) {
      setPromoError(extractErrorMessage(err, 'Invalid or expired discount code'))
    }
  }

  const handleRemovePromo = () => {
    setAppliedDiscount(null)
  }

  if (loading) {
    return <ReservePageSkeleton />
  }

  if (!hotel && !booking) {
    return (
      <PageMessage
        icon="🏨"
        title="Property not found"
        action={
          <Link to="/" className="px-5 py-2.5 bg-[#1A3C5E] text-white rounded-full text-sm font-medium hover:opacity-90">
            Back to home
          </Link>
        }
      />
    )
  }

  const propertySummaryProps = {
    hotelName,
    hotelCity,
    hotelCountry,
    hotelPhone: property?.phone_number || '',
    hotelEmail: property?.email || '',
    hotelImage: hotel?.imageUrl || hotel?.images?.[0] || '',
    rating: hotel?.rating || 0,
    reviews: hotel?.reviews || 0,
    amenities: hotel?.amenities || [],
    checkIn,
    checkOut,
    totalGuests: pricing.totalGuests,
    nights: pricing.nights,
    bookingData: booking,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    roomLines: pricing.roomLines,
    availableRooms,
    cancellationTitle: pricing.cancellationTitle,
    cancellationDescription: pricing.cancellationDescription,
    currency,
  }

  const priceSummaryProps = {
    roomLines: pricing.roomLines,
    nights: pricing.nights,
    currency,
    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    total: pricing.total,
    specialOfferDiscount: booking?.special_offer_discount || 0,
    couponDiscount: booking?.coupon_discount || 0,
    couponCode: booking?.coupon_code || null,
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      <ReserveStepper currentStep={2} />

      <ReserveLayout
        leftColumn={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <PropertySummaryCard {...propertySummaryProps} />
            {booking?.special_requests && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Special Requests</h3>
                <p className="text-sm text-gray-600">{booking.special_requests}</p>
              </div>
            )}
            <PriceSummaryCard {...priceSummaryProps} />
          </div>
        }
        rightColumn={
          <>
            <HoldCountdownBanner
              expiresAt={booking?.soft_lock_expires_at}
              createdAt={booking?.created_at}
              status={booking?.status}
              canReserveAgain={!!(booking?.rooms?.length && booking?.property?.id)}
              reserving={isCreating}
              onReserveAgain={handleReserveAgain}
            />
            {expired ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <p className="text-sm font-medium text-gray-600">
                  Payment is unavailable while the hold is expired. Use "Reserve again" above to start a fresh reservation.
                </p>
              </div>
            ) : (
              <>
              <PaymentSection
                total={pricing.total}
                currency={currency}
                advancePercentage={pricing.advancePercentage}
                minAdvancePercentage={pricing.minAdvancePct}
                maxAdvancePercentage={pricing.maxAdvancePct}
                onAdvancePercentageChange={pricing.setChosenAdvancePct}
                allowAdvance={pricing.allowAdvance}
                selectedPayment={selectedPayment}
                onSelectPayment={payment.handleSelectPayment}
                paymentPlan={paymentPlan}
                onSelectPlan={(plan) => {
                  setPaymentPlan(plan)
                  if (plan === "arrival") {
                    setSelectedPayment("arrival")
                  } else {
                    setSelectedPayment(null)
                  }
                }}
                appliedDiscount={appliedDiscount}
                promoInput={promoForm.watch('code')}
                promoError={promoError}
                onPromoInputChange={(value) => promoForm.setValue('code', value)}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
              />

              <PaymentForms
                selectedPayment={selectedPayment}
                total={pricing.total}
                currency={currency}
                hotelName={hotelName}
                refNumber={refNumber}
                guestName={guestName}
                guestEmail={guestEmail}
                guestPhone={guestPhone}
                paymentLoading={paymentLoading}
                stripePaymentIntentId={payment.stripeState.paymentIntentId}
                stripeIntentLoading={payment.stripeState.loading}
                stripeIntentError={payment.stripeState.error}
                razorpayResponse={payment.razorpayState.response}
                razorpayOrderLoading={payment.razorpayState.loading}
                razorpayOrderError={payment.razorpayState.error}
                razorpayOrderId={payment.razorpayState.orderId}
                razorpayLoaded={payment.razorpayLoaded}
                khaltiPaymentIntentId={payment.khaltiState.paymentIntentId}
                khaltiLoading={payment.khaltiState.loading}
                khaltiError={payment.khaltiState.error}
                khaltiCompleted={payment.khaltiCompleted}
                esewaPaymentIntentId={payment.esewaState.paymentIntentId}
                esewaConfirmData={payment.esewaConfirmData}
                esewaLoading={payment.esewaState.loading}
                esewaError={payment.esewaState.error}
                onStripeRetry={payment.retryStripe}
                onSetKhaltiError={payment.setKhaltiError}
                onSetKhaltiLoading={payment.setKhaltiLoading}
                onKhaltiRetry={payment.retryKhalti}
                onEsewaRetry={payment.retryEsewa}
              />

              <ConfirmButton
                selectedPayment={selectedPayment}
                paymentLoading={paymentLoading || confirmation.confirmingBooking}
                marketingOptIn={marketingOptIn}
                razorpayResponse={payment.razorpayState.response}
                stripePaymentIntentId={payment.stripeState.paymentIntentId}
                khaltiPaymentIntentId={payment.khaltiState.paymentIntentId}
                esewaPaymentIntentId={payment.esewaState.paymentIntentId}
                esewaConfirmData={payment.esewaConfirmData}
                onSetMarketingOptIn={setMarketingOptIn}
                onConfirm={confirmation.handleConfirmBooking}
              />
              </>
            )}
          </>
        }
      />

      <Footer />

      {payment.razorpayOverlayVisible && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Loading Razorpay checkout"
        >
          <div className="w-[min(92vw,440px)] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#0ea5e9]" aria-hidden="true" />
              <p className="mt-4 text-sm font-bold text-slate-900">{payment.razorpayLoadingMessage}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                The secure Razorpay payment window is about to open — please don't close this page.
              </p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#0ea5e9]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPayment === "stripe" && !payment.stripeState.paymentIntentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 sm:px-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedPayment(null); payment.resetStripeState() }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1100px] min-h-[50vh] sm:min-h-[70vh] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <button
              onClick={() => { setSelectedPayment(null); payment.resetStripeState() }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <StripeCardForm
              refNumber={refNumber}
              amount={pricing.advanceAmount}
              currency={currency}
              guestName={guestName}
              guestEmail={guestEmail}
              hotelName={hotelName}
              clientSecret={payment.stripeState.clientSecret}
              intentLoading={payment.stripeState.loading}
              intentError={payment.stripeState.error}
              paymentPlan={paymentPlan}
              onRetry={payment.retryStripe}
              onPaymentIntentConfirmed={payment.confirmStripeIntent}
            />
          </div>
        </div>
      )}
    </div>
  )
}
