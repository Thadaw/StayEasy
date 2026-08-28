import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Loader2, CreditCard } from "lucide-react"
import { useRazorpay } from "../../../shared/hooks/useRazorpay"
import type { RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayPayOptions, RazorpayFailureResponse } from "../../../shared/types/razorpay"
import type { RoomType } from "../../../data/hotels"
import { useBookings } from "../../../context/BookingContext"
import { useNotifications } from "../../../context/NotificationContext"
import { Navbar } from "../../../shared/components/Navbar"
import { Footer } from "../../../shared/components/Footer"
import { PageMessage } from "../../../shared/components/PageMessage"
import { ReserveLayout } from "../components/ReserveLayout"
import { ReserveStepper } from "../components/ReserveStepper"
import { PropertySummaryCard } from "../components/PropertySummaryCard"
import { PriceSummaryCard } from "../components/PriceSummaryCard"
import { PaymentForms } from "../components/PaymentForms"
import { ConfirmButton } from "../components/ConfirmButton"
import PaymentSection from "../components/PaymentSection"
import type { PaymentPlan } from "../components/PaymentSection"
import StripeCardForm from "../../../shared/components/StripeCardForm"
import { mapPropertyToHotel } from "../../../shared/utils/propertyMapper"
import { allCountries } from "../../../data/countries"
import { parseJSON } from "../../../shared/utils/helpers"
import { calculateNights } from "../../../shared/utils/time"
import api from "../../../services/axios"
import { useBookingQuery, usePropertyQuery, useAvailableRoomsQuery } from "../hooks/useBookingQueries"
import type { PaymentMethod } from "../types"

interface AppliedDiscount {
  type: 'percentage' | 'fixed'
  amount: number
  code: string
}

async function confirmBookingWithRetry(refNumber: string, payload: Record<string, unknown>, maxRetries = 3): Promise<void> {
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

export default function ReservePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const refNumber = searchParams.get('ref') || localStorage.getItem('esewa_ref_number') || ''

  const { addNotification } = useNotifications()

  // React Query hooks — automatically cached, deduplicated, and abortable
  const { data: booking, isLoading: bookingLoading } = useBookingQuery(refNumber)
  const propertyId = booking?.property?.id || id || ''
  const { data: property, isLoading: propertyLoading } = usePropertyQuery(propertyId)

  const bookingAdults = booking?.number_of_adults || 2
  const bookingChildren = booking?.number_of_children || 0
  const { data: availableRooms = [], isLoading: roomsLoading } = useAvailableRoomsQuery(
    propertyId,
    booking?.check_in || searchParams.get('checkIn') || '',
    booking?.check_out || searchParams.get('checkOut') || '',
    bookingAdults,
    bookingChildren,
    1,
  )

  const loading = bookingLoading || (refNumber ? false : propertyLoading)

  const hotel = useMemo(() => {
    if (!property) return null
    return mapPropertyToHotel(property, availableRooms)
  }, [property, availableRooms])

  const currency = property?.currency || booking?.property?.currency || 'USD'
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(() => {
    const dc = searchParams.get('discountCode')
    const dt = searchParams.get('discountType') as 'percentage' | 'fixed' | null
    const da = searchParams.get('discountAmount')
    if (dc && dt && da) return { code: dc, type: dt, amount: Number(da) }
    return null
  })
  const [promoError, setPromoError] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [razorpayState, setRazorpayState] = useState({
    response: null as RazorpayPaymentResponse | null,
    orderId: null as string | null,
    loading: false,
    error: null as string | null,
  })
  const [razorpayRetryCount, setRazorpayRetryCount] = useState(0)
  const [stripeState, setStripeState] = useState({
    paymentIntentId: null as string | null,
    clientSecret: null as string | null,
    loading: false,
    error: null as string | null,
    transactionTime: null as number | null,
  })
  const [stripeRetryCount, setStripeRetryCount] = useState(0)
  const [khaltiState, setKhaltiState] = useState({
    paymentIntentId: null as string | null,
    loading: false,
    error: null as string | null,
  })
  const [khaltiRetryCount, setKhaltiRetryCount] = useState(0)
  const [esewaState, setEsewaState] = useState({
    paymentIntentId: null as string | null,
    loading: false,
    error: null as string | null,
  })
  const [esewaRetryCount, setEsewaRetryCount] = useState(0)
  const [esewaConfirmData, setEsewaConfirmData] = useState<string | null>(null)
  const [confirmingBooking, setConfirmingBooking] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("full")
  const [khaltiCompleted, setKhaltiCompleted] = useState(false)

  const { isLoaded: razorpayLoaded } = useRazorpay(selectedPayment === "razorpay")

  // Apply coupon from booking response if present
  useEffect(() => {
    if (booking?.coupon_code && booking.coupon_discount > 0 && !appliedDiscount) {
      setAppliedDiscount({
        code: booking.coupon_code,
        type: 'fixed',
        amount: booking.coupon_discount,
      })
    }
  }, [booking])

  const advancePercentage = booking?.advance_payment_percentage ?? 30
  const total = booking?.total_amount ?? 0
  const allowAdvance = (booking?.min_advance_amount != null && booking.min_advance_amount > 0) || (booking?.advance_payment_percentage != null && booking.advance_payment_percentage > 0)
  const advanceAmount = useMemo(() => {
    if (paymentPlan === "advance") {
      if (booking?.advance_amount != null && booking.advance_amount > 0) return booking.advance_amount
      return Math.round((total * advancePercentage) / 100)
    }
    return total
  }, [paymentPlan, total, advancePercentage, booking?.advance_amount])

  useEffect(() => {
    if (!allowAdvance && paymentPlan === "advance") {
      setPaymentPlan("full")
      setSelectedPayment(null)
    }
  }, [allowAdvance, paymentPlan])

  useEffect(() => {
    if (selectedPayment !== "razorpay" || !refNumber) return
    let cancelled = false
    const createOrder = async () => {
      setRazorpayState(prev => ({ ...prev, loading: true, error: null, orderId: null }))
      try {
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, { payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE", payment_gateway: "razorpay", advance_amount: advanceAmount })
        if (cancelled) return
        const orderId = response.data?.razorpay_order_id || response.data?.data?.razorpay_order_id || response.data?.order_id || response.data?.data?.order_id
        if (!orderId) {
          setRazorpayState(prev => ({ ...prev, error: "Failed to initialize Razorpay" }))
          return
        }
        setRazorpayState(prev => ({ ...prev, orderId }))
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : "Failed to initialize Razorpay"
        setRazorpayState(prev => ({ ...prev, error: msg }))
      } finally {
        if (!cancelled) setRazorpayState(prev => ({ ...prev, loading: false }))
      }
    }
    createOrder()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, razorpayRetryCount, advanceAmount])

  // Auto-open official Razorpay checkout once order is created and SDK is loaded
  useEffect(() => {
    if (selectedPayment !== "razorpay" || !razorpayLoaded || !razorpayState.orderId || razorpayState.response || razorpayState.loading) return
    handleRazorpayPayment({ type: 'card' })
  }, [selectedPayment, razorpayLoaded, razorpayState.orderId, razorpayState.response, razorpayState.loading])

  useEffect(() => {
    if (selectedPayment !== "stripe" || !refNumber) return
    let cancelled = false
    const createStripeIntent = async () => {
      setStripeState(prev => ({ ...prev, loading: true, error: null, clientSecret: null }))
      try {
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, { payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE", payment_gateway: "stripe", advance_amount: advanceAmount })
        if (cancelled) return
        const secret = response.data?.client_secret || response.data?.data?.client_secret
        if (!secret) {
          setStripeState(prev => ({ ...prev, error: "Failed to initialize Stripe" }))
          return
        }
        setStripeState(prev => ({ ...prev, clientSecret: secret }))
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : "Failed to initialize Stripe"
        setStripeState(prev => ({ ...prev, error: msg }))
      } finally {
        if (!cancelled) setStripeState(prev => ({ ...prev, loading: false }))
      }
    }
    createStripeIntent()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, stripeRetryCount, advanceAmount])

  useEffect(() => {
    if (selectedPayment !== "khalti" || !refNumber) return
    if (khaltiState.paymentIntentId) return
    let cancelled = false
    const createKhaltiIntent = async () => {
      setKhaltiState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const returnToUrl = `${window.location.origin}/reserve/${id}?ref=${refNumber}`
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, {
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "khalti",
          return_url: returnToUrl,
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        const intentId = response.data?.payment_intent_id || response.data?.data?.payment_intent_id || response.data?.intent_id || response.data?.data?.intent_id || response.data?.pidx || response.data?.data?.pidx || response.data?.id || response.data?.data?.id
        const redirectUrl = response.data?.payment_url || response.data?.data?.payment_url || response.data?.redirect_url || response.data?.data?.redirect_url || response.data?.checkout_url || response.data?.data?.checkout_url || response.data?.payment_link || response.data?.data?.payment_link
        if (redirectUrl) {
          if (intentId) localStorage.setItem('khalti_payment_intent_id', intentId)
          localStorage.setItem('khalti_return_to', returnToUrl)
          window.location.href = redirectUrl
          return
        }
        if (!intentId) {
          setKhaltiState(prev => ({ ...prev, error: "Failed to initialize Khalti payment" }))
          return
        }
        setKhaltiState(prev => ({ ...prev, paymentIntentId: intentId }))
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : "Failed to initialize Khalti payment"
        setKhaltiState(prev => ({ ...prev, error: msg }))
      } finally {
        if (!cancelled) setKhaltiState(prev => ({ ...prev, loading: false }))
      }
    }
    createKhaltiIntent()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, id, khaltiState.paymentIntentId, khaltiRetryCount, advanceAmount])

  useEffect(() => {
    const rawQuery = window.location.search
    const statusMatch = rawQuery.match(/[?&](?:status|khalti_status)=([^&]+)/i)
    const pidxMatch = rawQuery.match(/[?&]pidx=([^&]+)/i)
    if (!statusMatch && !pidxMatch) return
    const khaltiStatus = (statusMatch?.[1] || searchParams.get('status') || searchParams.get('khalti_status') || '').toLowerCase()
    const pidx = pidxMatch?.[1] || searchParams.get('pidx') || ''

    if (khaltiStatus === 'user canceled' || khaltiStatus === 'pending') {
      toast("Payment cancelled. You can retry anytime.", { icon: "ℹ️" })
      setKhaltiState({ paymentIntentId: null, loading: false, error: null })
      setSelectedPayment("khalti")
      localStorage.removeItem('khalti_payment_intent_id')
      return
    }

    const storedIntentId = localStorage.getItem('khalti_payment_intent_id') || pidx
    if (storedIntentId) {
      setKhaltiState(prev => ({ ...prev, paymentIntentId: storedIntentId }))
      setSelectedPayment("khalti")
      setKhaltiCompleted(true)
    }
  }, [searchParams])

  useEffect(() => {
    const rawQuery = window.location.search
    if (/[?&](?:status|khalti_status|pidx)=/i.test(rawQuery)) return
    localStorage.removeItem('khalti_payment_intent_id')
  }, [searchParams])

  // Detect Stripe callback redirect — Stripe redirects to /payment/stripe/callback,
  // which then redirects to /payment/success, which then redirects here with payment_intent in URL params.
  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')
    if (!paymentIntentId) return

    setSelectedPayment('stripe')
    setStripeState(prev => ({
      ...prev,
      paymentIntentId,
      clientSecret: null,
      transactionTime: Math.floor(Date.now() / 1000),
    }))

    localStorage.removeItem('stripe_property_id')

    // Clean URL params
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('payment_intent')
    newUrl.searchParams.delete('redirect_status')
    window.history.replaceState({}, '', newUrl.toString())

    if (redirectStatus === 'succeeded') {
      toast.success('Payment successful!')
    } else {
      toast('Payment processing. Please wait.', { icon: 'ℹ️' })
    }
  }, [searchParams])

  useEffect(() => {
    const esewaData = searchParams.get('data') || localStorage.getItem('esewa_confirm_data')
    const statusParam = searchParams.get('status') || searchParams.get('esewa_status') || localStorage.getItem('esewa_status')
    const hasEsewaParams = esewaData || statusParam || /[?&](?:data|esewa_status)=/i.test(window.location.search)
    if (!hasEsewaParams) return

    localStorage.removeItem('esewa_confirm_data')
    localStorage.removeItem('esewa_status')

    if (statusParam && ['user canceled', 'pending', 'failed'].includes(statusParam.toLowerCase())) {
      toast("Payment cancelled. You can retry anytime.", { icon: "ℹ️" })
      setEsewaState({ paymentIntentId: null, loading: false, error: null })
      setSelectedPayment("esewa")
      return
    }

    if (esewaData) {
      setSelectedPayment("esewa")
      setEsewaConfirmData(esewaData)
      toast.success("eSewa payment verified successfully")
    }
  }, [searchParams, refNumber])

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (!refNumber) {
      setPromoError('No booking reference found')
      return
    }
    try {
      const response = await api.post(`/bookings/${refNumber}/apply-discount`, { code })
      const discount = response.data?.data || response.data
      if (discount) {
        setAppliedDiscount({
          code,
          type: String(discount.type || 'percentage').toLowerCase() === 'percentage' ? 'percentage' : 'fixed',
          amount: discount.amount || discount.discount || 0,
        })
        setPromoError('')
        setPromoInput('')
      } else {
        setPromoError('Invalid or expired discount code')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired discount code'
      setPromoError(msg)
    }
  }

  const handleRemovePromo = () => {
    setAppliedDiscount(null)
  }

  const roomsParam = searchParams.get('rooms');
  const guestCountsParam = searchParams.get('guestCounts');
  const adultsParam = searchParams.get('adults');
  const childrenParam = searchParams.get('children');
  const selectedRooms: Record<string, number> = parseJSON(roomsParam || '', {});
  const guestAllocation: Record<string, number> = parseJSON(guestCountsParam || '', {});

  const { addBooking } = useBookings()

  const checkIn = booking?.check_in || searchParams.get('checkIn') || ''
  const checkOut = booking?.check_out || searchParams.get('checkOut') || ''

  const guestName = searchParams.get('guestName') || booking?.guest_name || ''
  const guestEmail = searchParams.get('guestEmail') || booking?.guest_email || ''
  const guestPhone = searchParams.get('guestPhone') || booking?.guest_phone || ''
  const guestNationality = searchParams.get('guestCountry') ? allCountries.find(c => c.code === searchParams.get('guestCountry'))?.name || '' : ''

  const hotelName = booking?.property?.name || hotel?.name || ''
  const hotelCity = booking?.property?.city || hotel?.city || ''
  const hotelCountry = booking?.property?.country || hotel?.country || ''

  const selectedRoomTypes = useMemo(() => {
    if (!hotel) return []
    if (booking?.rooms?.length) {
      return hotel.roomTypes.filter(rt => booking.rooms.some(br => br.room_id === rt.id))
    }
    return hotel.roomTypes.filter(rt => selectedRooms[rt.id] && selectedRooms[rt.id] > 0)
  }, [hotel, booking, selectedRooms])

  const nights = booking?.nights || calculateNights(checkIn, checkOut)

  const roomLines = useMemo(() => {
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
            roomTypeName: br.room_type || '',
            bedType: br.bed_type || '',
            image: br.photo || br.photos?.cover || '',
            cancellationTitle: br.cancellation_title || '',
            cancellationDescription: br.cancellation_description || '',
          } as RoomType,
          qty: 1, gc: br.max_adults + br.max_children, ep: br.base_rate, lineTotal: br.subtotal || 1 * br.base_rate * nights,
          nights: br.nights,
          maxAdults: br.max_adults,
          maxChildren: br.max_children,
          cancellationTitle: rt?.cancellationTitle || br.cancellation_title || '',
          cancellationPolicy: rt?.cancellationPolicy || '',
        }
      })
    }
    return selectedRoomTypes.map(rt => {
      const qty = selectedRooms[rt.id] || 0;
      const gc = guestAllocation[rt.id] || 1;
      const ep = rt.price;
      const lineTotal = qty * ep * nights;
      return { room: rt, qty, gc, ep, lineTotal, maxAdults: rt.maxAdults || 0, maxChildren: rt.maxChildren || 0, cancellationTitle: rt.cancellationTitle || '', cancellationPolicy: rt.cancellationPolicy || '' };
    })
  }, [booking, selectedRoomTypes, hotel, selectedRooms, guestAllocation, nights])

  const cancellationTitle = booking?.rooms?.[0]?.cancellation_title || availableRooms[0]?.cancellation_title || ''
  const cancellationDescription = booking?.rooms?.[0]?.cancellation_description || availableRooms[0]?.cancellation_description || ''

  const guestCount = (booking?.number_of_adults || 0) + (booking?.number_of_children || 0)
  const totalGuests = (guestCount > 0 ? guestCount : null)
    || Object.values(guestAllocation).reduce((s, c) => s + c, 0)
    || (adultsParam ? Number(adultsParam) : 0) + (childrenParam ? Number(childrenParam) : 0)
    || booking?.rooms?.reduce((s, r) => s + r.max_adults + r.max_children, 0) || 0;

  const subtotal = booking?.subtotal || roomLines.reduce((s, l) => s + l.lineTotal, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = appliedDiscount.type === 'percentage'
      ? Math.round(subtotal * appliedDiscount.amount / 100)
      : appliedDiscount.amount;
  }

  useEffect(() => {
    if (selectedPayment !== "esewa" || !refNumber) return
    if (esewaState.paymentIntentId || esewaConfirmData) return
    if (searchParams.get('data') || searchParams.get('esewa_status')) return
    let cancelled = false
    const createEsewaIntent = async () => {
      setEsewaState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const returnToUrl = `${window.location.origin}/reserve/${id}`
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, {
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "esewa",
          return_url: returnToUrl,
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        const data = response.data?.data || response.data
        const intentId = data?.payment_intent_id || data?.id
        const formUrl = data?.form_url
        const formFields = data?.form_fields

        if (intentId) {
          setEsewaState(prev => ({ ...prev, paymentIntentId: intentId }))
        }

        if (formUrl && formFields) {
          localStorage.setItem('esewa_return_to', returnToUrl)
          localStorage.setItem('esewa_ref_number', refNumber)
          const form = document.createElement('form')
          form.method = 'POST'
          form.action = formUrl
          form.style.display = 'none'
          for (const [key, value] of Object.entries(formFields)) {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = String(value)
            form.appendChild(input)
          }
          document.body.appendChild(form)
          form.submit()
          return
        }

        setEsewaState(prev => ({ ...prev, error: "Invalid response from payment gateway" }))
      } catch {
        if (cancelled) return
        setEsewaState(prev => ({ ...prev, error: "Failed to initialize eSewa payment. Please retry." }))
      } finally {
        if (!cancelled) setEsewaState(prev => ({ ...prev, loading: false }))
      }
    }
    createEsewaIntent()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, id, esewaState.paymentIntentId, esewaConfirmData, esewaRetryCount, advanceAmount])

  const handleRazorpayPayment = async (options?: RazorpayPayOptions) => {
    if (!razorpayState.orderId) { toast.error("Razorpay not ready"); return }
    setPaymentLoading(true)
    try {
      const razorpayOptions: RazorpayCheckoutOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.max(0, advanceAmount) * 100,
        currency: "INR",
        order_id: razorpayState.orderId,
        name: "ServeIQ",
        description: `Booking at ${hotelName}`,
        handler: (response: RazorpayPaymentResponse) => { setRazorpayState(prev => ({ ...prev, response })) },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
          method: options?.type,
        },
        theme: { color: "#1A3C5E" },
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.on('payment.failed', (response: RazorpayFailureResponse) => { toast.error("Payment failed: " + (response.error?.description || "Unknown error")) })
      razorpay.open()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      if (msg === "Payment cancelled") {
        toast("Payment cancelled. You can retry anytime.", { icon: "ℹ️" })
      } else {
        toast.error("Payment failed: " + msg)
      }
    } finally { setPaymentLoading(false) }
  }

  const handleConfirmBooking = async () => {
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
        await confirmBookingWithRetry(refNumber, {
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
        await confirmBookingWithRetry(refNumber, {
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
        await confirmBookingWithRetry(refNumber, {
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
        await confirmBookingWithRetry(refNumber, {
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
        await api.post(`/bookings/${refNumber}/payment-intent`, {
          payment_method: "PAY_ON_ARRIVAL",
        })
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
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error("Booking confirmation failed: " + msg)
    } finally {
      setPaymentLoading(false)
      setConfirmingBooking(false)
    }
  }

  if (loading) {
    return <PageMessage loading title="Loading reservation..." />
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
    totalGuests,
    nights,
    bookingData: booking,
    guestName,
    guestEmail,
    guestPhone,
    guestNationality,
    roomLines,
    availableRooms,
    cancellationTitle,
    cancellationDescription,
    currency: currency,
  }

  const priceSummaryProps = {
    roomLines,
    nights,
    currency: currency,
    subtotal,
    discountAmount,
    total,
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
            <PriceSummaryCard {...priceSummaryProps} />
          </div>
        }
        rightColumn={
          <>
            <PaymentSection
              total={total}
              currency={currency}
              advancePercentage={booking?.advance_payment_percentage ?? 30}
              advanceAmount={booking?.advance_amount}
              allowAdvance={allowAdvance}
              selectedPayment={selectedPayment}
              onSelectPayment={(method) => {
                setSelectedPayment(method)
                if (method === "stripe") {
                  if (refNumber) localStorage.setItem("stripe_ref_number", refNumber)
                  if (propertyId) localStorage.setItem("stripe_property_id", String(propertyId))
                }
              }}
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
              promoInput={promoInput}
              promoError={promoError}
              onPromoInputChange={setPromoInput}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            />

            <PaymentForms
              selectedPayment={selectedPayment}
              total={total}
              currency={currency}
              hotelName={hotelName}
              refNumber={refNumber}
              guestName={guestName}
              guestEmail={guestEmail}
              guestPhone={guestPhone}
              paymentLoading={paymentLoading}
              stripePaymentIntentId={stripeState.paymentIntentId}
              stripeIntentLoading={stripeState.loading}
              stripeIntentError={stripeState.error}
              razorpayResponse={razorpayState.response}
              razorpayOrderLoading={razorpayState.loading}
              razorpayOrderError={razorpayState.error}
              razorpayOrderId={razorpayState.orderId}
              razorpayLoaded={razorpayLoaded}
              khaltiPaymentIntentId={khaltiState.paymentIntentId}
              khaltiLoading={khaltiState.loading}
              khaltiError={khaltiState.error}
              khaltiCompleted={khaltiCompleted}
              esewaPaymentIntentId={esewaState.paymentIntentId}
              esewaConfirmData={esewaConfirmData}
              esewaLoading={esewaState.loading}
              esewaError={esewaState.error}
              onStripeRetry={() => setStripeRetryCount(count => count + 1)}
              onSetKhaltiError={(error) => setKhaltiState(prev => ({ ...prev, error }))}
              onSetKhaltiLoading={(loading) => setKhaltiState(prev => ({ ...prev, loading }))}
              onKhaltiRetry={() => {
                setKhaltiState({ paymentIntentId: null, loading: false, error: null })
                setKhaltiRetryCount(c => c + 1)
              }}
              onEsewaRetry={() => {
                setEsewaState({ paymentIntentId: null, loading: false, error: null })
                setEsewaConfirmData(null)
                localStorage.removeItem('esewa_confirm_data')
                localStorage.removeItem('esewa_status')
                localStorage.removeItem('esewa_ref_number')
                setEsewaRetryCount(c => c + 1)
              }}
            />

            <ConfirmButton
              selectedPayment={selectedPayment}
              paymentLoading={paymentLoading || confirmingBooking}
              marketingOptIn={marketingOptIn}
              razorpayResponse={razorpayState.response}
              stripePaymentIntentId={stripeState.paymentIntentId}
              khaltiPaymentIntentId={khaltiState.paymentIntentId}
              esewaPaymentIntentId={esewaState.paymentIntentId}
              esewaConfirmData={esewaConfirmData}
              onSetMarketingOptIn={setMarketingOptIn}
              onConfirm={handleConfirmBooking}
            />
          </>
        }
      />

      <Footer />

      {selectedPayment === "stripe" && !stripeState.paymentIntentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setSelectedPayment(null); setStripeState({ paymentIntentId: null, clientSecret: null, loading: false, error: null, transactionTime: null }) }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1100px] min-h-[70vh] max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => { setSelectedPayment(null); setStripeState({ paymentIntentId: null, clientSecret: null, loading: false, error: null, transactionTime: null }) }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <StripeCardForm
              refNumber={refNumber}
              amount={advanceAmount}
              currency={currency}
              guestName={guestName}
              guestEmail={guestEmail}
              hotelName={hotelName}
              clientSecret={stripeState.clientSecret}
              intentLoading={stripeState.loading}
              intentError={stripeState.error}
              onRetry={() => setStripeRetryCount(c => c + 1)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
