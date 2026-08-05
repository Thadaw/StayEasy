import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useRazorpay } from "../../../shared/hooks/useRazorpay"
import type { RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayPayOptions, RazorpayFailureResponse } from "../../../shared/types/razorpay"
import type { RoomType } from "../../../data/hotels"
import { useBookings } from "../../../context/BookingContext"
import { Navbar } from "../../../shared/components/Navbar"
import { Footer } from "../../../shared/components/Footer"
import { PageMessage } from "../../../shared/components/PageMessage"
import { ReserveLayout } from "../components/ReserveLayout"
import { ReserveStepper } from "../components/ReserveStepper"
import { PropertySummaryCard } from "../components/PropertySummaryCard"
import { PriceSummaryCard } from "../components/PriceSummaryCard"
import { PaymentMethodTabs } from "../components/PaymentMethodTabs"
import { PaymentForms } from "../components/PaymentForms"
import { ConfirmButton } from "../components/ConfirmButton"
import type { ApiProperty, ApiRoom } from "../../../shared/types/api"
import { mapPropertyToHotel } from "../../../shared/utils/propertyMapper"
import { allCountries } from "../../../data/countries"
import { parseJSON } from "../../../shared/utils/helpers"
import { calculateNights } from "../../../shared/utils/time"
import api from "../../../services/axios"
import type { PaymentMethod, ApiBooking } from "../types"

interface AppliedDiscount {
  type: 'percentage' | 'fixed'
  amount: number
  code: string
}

interface GuestProfile {
  name: string
  email: string
  phone: string
  nationality: string
}

const paymentOptions: { key: PaymentMethod; label: string; sub: string; logo: JSX.Element }[] = [
  {
    key: "stripe",
    label: "Stripe",
    sub: "Pay via Credit / Debit Card",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="#635bff" />
        <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">S</text>
      </svg>
    ),
  },
  {
    key: "razorpay",
    label: "Razorpay",
    sub: "Pay via UPI, Card, Net Banking & more",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="#3399ff" />
        <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">R</text>
      </svg>
    ),
  },
  {
    key: "khalti",
    label: "Khalti",
    sub: "Pay via eWallet, Cards, Net Banking",
    logo: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="#5C2D91" />
        <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">K</text>
      </svg>
    ),
  },
]

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
  const [property, setProperty] = useState<ApiProperty | null>(null)
  const [availableRooms, setAvailableRooms] = useState<ApiRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBookingData] = useState<ApiBooking | null>(null)

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
  const [stripeState, setStripeState] = useState({
    paymentIntentId: null as string | null,
    clientSecret: null as string | null,
    loading: false,
    error: null as string | null,
    transactionTime: null as number | null,
  })
  const [khaltiState, setKhaltiState] = useState({
    paymentIntentId: null as string | null,
    loading: false,
    error: null as string | null,
  })
const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [paySubMethod, setPaySubMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null)

  const refNumber = searchParams.get('ref') || ''
  const { isLoaded: razorpayLoaded } = useRazorpay()

  useEffect(() => {
    if (!refNumber) return
    const loadBookingDetails = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/bookings/${refNumber}`)
        const booking = response.data?.data || response.data
        setBookingData(booking)

        if (booking?.coupon_code && booking.coupon_discount > 0 && !appliedDiscount) {
          setAppliedDiscount({
            code: booking.coupon_code,
            type: 'fixed',
            amount: booking.coupon_discount,
          })
        }

        const propertyId = booking?.property?.id || id
        try {
          const propResponse = await api.get(`/properties/${propertyId}/public`)
          setProperty(propResponse.data?.data || null)
        } catch {
          setProperty(null)
        }
        try {
          const roomsResponse = await api.get(`/properties/${propertyId}/rooms/available-rooms`, {
            params: { checkin_date: booking?.check_in, checkout_date: booking?.check_out, adults: 2, children: 0, rooms: 1 },
          })
          setAvailableRooms(roomsResponse.data?.data || [])
        } catch {
          try {
            const allRoomsResponse = await api.get(`/properties/${propertyId}/rooms`)
            setAvailableRooms(allRoomsResponse.data?.data || [])
          } catch {
            setAvailableRooms([])
          }
        }
      } catch {
        setBookingData(null)
        if (id) {
          try {
            const propResponse = await api.get(`/properties/${id}/public`)
            setProperty(propResponse.data?.data || null)
            const roomsResponse = await api.get(`/properties/${id}/rooms/available-rooms`, {
              params: { checkin_date: searchParams.get('checkIn'), checkout_date: searchParams.get('checkOut'), adults: 2, children: 0, rooms: 1 },
            })
            setAvailableRooms(roomsResponse.data?.data || [])
          } catch {
            setProperty(null)
            setAvailableRooms([])
          }
        }
      } finally {
        setLoading(false)
      }
    }
    loadBookingDetails()
  }, [id, refNumber, appliedDiscount, searchParams])

  useEffect(() => {
    if (selectedPayment !== "razorpay" || !refNumber) return
    let cancelled = false
    const createOrder = async () => {
      setRazorpayState(prev => ({ ...prev, loading: true, error: null, orderId: null }))
      try {
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, { payment_gateway: "razorpay" })
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
  }, [selectedPayment, refNumber])

  useEffect(() => {
    if (selectedPayment !== "stripe" || !refNumber) return
    if (stripeState.paymentIntentId) return
    let cancelled = false
    const createStripeIntent = async () => {
      setStripeState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, { payment_gateway: "stripe" })
        if (cancelled) return
        const secret = response.data?.client_secret || response.data?.data?.client_secret
        if (!secret) {
          setStripeState(prev => ({ ...prev, error: "Failed to initialize payment" }))
          return
        }
        setStripeState(prev => ({ ...prev, clientSecret: secret }))
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : "Failed to initialize payment"
        setStripeState(prev => ({ ...prev, error: msg }))
      } finally {
        if (!cancelled) setStripeState(prev => ({ ...prev, loading: false }))
      }
    }
    createStripeIntent()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, stripeState.paymentIntentId])

  useEffect(() => {
    if (selectedPayment !== "khalti" || !refNumber) return
    if (khaltiState.paymentIntentId) return
    let cancelled = false
    const createKhaltiIntent = async () => {
      setKhaltiState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const response = await api.post(`/bookings/${refNumber}/payment-intent`, {
          payment_gateway: "khalti",
          return_url: `${window.location.origin}/reserve/${id}?ref=${refNumber}`,
        })
        if (cancelled) return
        const intentId = response.data?.payment_intent_id || response.data?.data?.payment_intent_id || response.data?.intent_id || response.data?.data?.intent_id
        const redirectUrl = response.data?.payment_url || response.data?.data?.payment_url || response.data?.redirect_url || response.data?.data?.redirect_url
        if (redirectUrl) {
          localStorage.setItem('khalti_payment_intent_id', intentId || '')
          localStorage.setItem('khalti_return_to', window.location.href)
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
  }, [selectedPayment, refNumber, id, khaltiState.paymentIntentId])

  useEffect(() => {
    const khaltiStatus = searchParams.get('khalti_status')
    if (khaltiStatus === 'Completed') {
      const storedIntentId = localStorage.getItem('khalti_payment_intent_id')
      const returnTo = localStorage.getItem('khalti_return_to')
      localStorage.removeItem('khalti_return_to')
      if (storedIntentId) {
        setKhaltiState(prev => ({ ...prev, paymentIntentId: storedIntentId }))
        toast.success("Payment successful!")
      }
      if (returnTo && returnTo !== window.location.href) {
        window.location.href = returnTo
      }
    }
  }, [searchParams])

  useEffect(() => {
    const storedIntentId = localStorage.getItem('khalti_payment_intent_id')
    if (storedIntentId && !searchParams.get('khalti_status')) {
      setKhaltiState(prev => ({ ...prev, paymentIntentId: storedIntentId }))
      setSelectedPayment("khalti")
    }
  }, [searchParams])

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
          type: discount.type || 'percentage',
          amount: discount.amount || discount.discount || 0,
        })
        setPromoError('')
        setPromoInput('')
      } else {
        setPromoError('Invalid promo code')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid promo code'
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

  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null)

  useEffect(() => {
    let cancelled = false
    api.get('/bookings/me').then((response) => {
      if (cancelled) return
      const items = response.data?.data?.items ?? response.data?.data ?? response.data?.items ?? []
      const match = Array.isArray(items) ? items.find((it: Record<string, unknown>) => {
        const ref = it.ref_number || it.id
        return ref === refNumber || ref === id
      }) : null
      if (match) {
        const g = match.guest || match.guest_details || {}
        setGuestProfile({
          name: match.full_name || match.guest_name || g.full_name || g.name || '',
          email: match.email || match.guest_email || g.email || '',
          phone: match.phone || match.guest_phone || g.phone || g.phone_number || '',
          nationality: match.nationality || g.nationality || '',
        })
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [refNumber, id])

  const checkIn = booking?.check_in || searchParams.get('checkIn') || ''
  const checkOut = booking?.check_out || searchParams.get('checkOut') || ''

  const guestName = searchParams.get('guestName') || guestProfile?.name || booking?.guest_name || ''
  const guestEmail = searchParams.get('guestEmail') || guestProfile?.email || booking?.guest_email || ''
  const guestPhone = searchParams.get('guestPhone') || guestProfile?.phone || booking?.guest_phone || ''
  const guestNationality = guestProfile?.nationality || (searchParams.get('guestCountry') ? allCountries.find(c => c.code === searchParams.get('guestCountry'))?.name || '' : '')

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

  const roomLines = useMemo(() => {
    if (booking?.rooms?.length) {
      return booking.rooms.map(br => {
        const rt = hotel?.roomTypes.find(r => r.id === br.room_id)
        return {
          room: rt || { id: br.room_id, name: br.room_name, price: br.base_rate, maxGuests: br.max_adults + br.max_children } as RoomType,
          qty: 1, gc: br.max_adults + br.max_children, ep: br.base_rate, lineTotal: br.subtotal,
          cancellationTitle: rt?.cancellationTitle || '',
          cancellationPolicy: rt?.cancellationPolicy || '',
        }
      })
    }
    return selectedRoomTypes.map(rt => {
      const qty = selectedRooms[rt.id] || 0;
      const gc = guestAllocation[rt.id] || 1;
      const ep = rt.price;
      const lineTotal = qty * ep;
      return { room: rt, qty, gc, ep, lineTotal, cancellationTitle: rt.cancellationTitle || '', cancellationPolicy: rt.cancellationPolicy || '' };
    })
  }, [booking, selectedRoomTypes, hotel, selectedRooms, guestAllocation])

  const cancellationTitle = booking?.rooms?.[0]?.cancellation_title || availableRooms[0]?.cancellation_title || ''
  const cancellationDescription = booking?.rooms?.[0]?.cancellation_description || availableRooms[0]?.cancellation_description || ''

  const guestCount = (booking?.number_of_adults || 0) + (booking?.number_of_children || 0)
  const totalGuests = (guestCount > 0 ? guestCount : null)
    || Object.values(guestAllocation).reduce((s, c) => s + c, 0)
    || (adultsParam ? Number(adultsParam) : 0) + (childrenParam ? Number(childrenParam) : 0)
    || booking?.rooms?.reduce((s, r) => s + r.max_adults + r.max_children, 0) || 0;

  const nights = booking?.nights || calculateNights(checkIn, checkOut)
  const subtotal = booking?.subtotal || roomLines.reduce((s, l) => s + l.lineTotal * nights, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = appliedDiscount.type === 'percentage'
      ? Math.round(subtotal * appliedDiscount.amount / 100)
      : appliedDiscount.amount;
  }

  const total = booking?.total_amount || (subtotal - discountAmount);

  const handleRazorpayPayment = async (options: RazorpayPayOptions) => {
    if (!razorpayState.orderId) { toast.error("Razorpay not ready"); return }
    setPaymentLoading(true)
    try {
      const razorpayOptions: RazorpayCheckoutOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.max(0, total) * 100,
        currency: "INR",
        order_id: razorpayState.orderId,
        name: "StayEasy",
        description: `Booking at ${hotelName}`,
        handler: (response: RazorpayPaymentResponse) => { setRazorpayState(prev => ({ ...prev, response })) },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
          vpa: options.upiId,
          bank: options.bank,
        },
        theme: { color: "#0071c2" },
      }

      if (options.type === 'upi') {
        razorpayOptions.config = {
          display: {
            blocks: {
              upib: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" }
                ]
              }
            },
            sequence: ["block.upib"],
            preferences: {
              show_default_blocks: false
            }
          }
        }
      } else if (options.type === 'netbanking') {
        razorpayOptions.config = {
          display: {
            blocks: {
              nbb: {
                name: "Pay via Net Banking",
                instruments: [
                  { method: "netbanking" }
                ]
              }
            },
            sequence: ["block.nbb"],
            preferences: {
              show_default_blocks: false
            }
          }
        }
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.on('payment.failed', (response: RazorpayFailureResponse) => { toast.error("Payment failed: " + response.error?.description || "Unknown error") })
      razorpay.open()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      if (msg !== "Payment cancelled") toast.error("Payment failed: " + msg)
    } finally { setPaymentLoading(false) }
  }

  const handleConfirmBooking = async () => {
    if (!selectedPayment) return

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

    setPaymentLoading(true)
    try {
      if (selectedPayment === "razorpay" && razorpayState.response && refNumber) {
        await confirmBookingWithRetry(refNumber, {
          idempotency_key: crypto.randomUUID(),
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
          payment_gateway: "stripe",
          gateway_payload: {
            payment_intent_id: stripeState.paymentIntentId,
            stripe_payment_intent_id: stripeState.paymentIntentId,
            client_secret: stripeState.clientSecret,
          },
        })
      }

      if (selectedPayment === "khalti" && khaltiState.paymentIntentId && refNumber) {
        await confirmBookingWithRetry(refNumber, {
          idempotency_key: crypto.randomUUID(),
          gateway_payload: {
            payment_intent_id: khaltiState.paymentIntentId,
          },
        })
      }

      const roomTypeName = roomLines.map(l => l.room.name).join(", ")
      const localBookingData = {
        hotelId: booking?.property?.id || hotel?.id || id,
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
      localStorage.removeItem('khalti_payment_intent_id')
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
        }
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      toast.error("Booking confirmation failed: " + msg)
    } finally {
      setPaymentLoading(false)
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
    hotelImage: hotel?.imageUrl || hotel?.images?.[0] || '',
    rating: hotel?.rating || 0,
    reviews: hotel?.reviews || 0,
    amenities: hotel?.amenities || [],
    checkIn,
    checkOut,
    totalGuests,
    nights,
    booking,
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
    appliedDiscount,
    promoInput,
    promoError,
    onPromoInputChange: (value: string) => { setPromoInput(value); setPromoError('') },
    onApplyPromo: handleApplyPromo,
    onRemovePromo: handleRemovePromo,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleApplyPromo() },
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-jakarta">
      <Navbar />

      <ReserveStepper currentStep={2} />

      <ReserveLayout
        leftColumn={
          <PropertySummaryCard
            {...propertySummaryProps}
          />
        }
        rightColumn={
          <>
            <PriceSummaryCard {...priceSummaryProps} />

            <PaymentMethodTabs
              paymentOptions={paymentOptions}
              selectedPayment={selectedPayment}
              onSelect={setSelectedPayment}
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
              stripeClientSecret={stripeState.clientSecret}
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
              paySubMethod={paySubMethod}
              upiId={upiId}
              selectedBank={selectedBank}
              onSetPaySubMethod={setPaySubMethod}
              onSetUpiId={setUpiId}
              onSetSelectedBank={setSelectedBank}
              onStripeSuccess={(id, secret, createdAt) => { setStripeState(prev => ({ ...prev, paymentIntentId: id, clientSecret: secret, transactionTime: createdAt })) }}
              onStripeRetry={() => { setStripeState(prev => ({ ...prev, clientSecret: null, paymentIntentId: null })) }}
              onRazorpayPay={handleRazorpayPayment}
              onSetKhaltiError={(error) => setKhaltiState(prev => ({ ...prev, error }))}
              onSetKhaltiLoading={(loading) => setKhaltiState(prev => ({ ...prev, loading }))}
            />

            <ConfirmButton
              selectedPayment={selectedPayment}
              paymentLoading={paymentLoading}
              marketingOptIn={marketingOptIn}
              razorpayResponse={razorpayState.response}
              stripePaymentIntentId={stripeState.paymentIntentId}
              khaltiPaymentIntentId={khaltiState.paymentIntentId}
              onSetMarketingOptIn={setMarketingOptIn}
              onConfirm={handleConfirmBooking}
            />
          </>
        }
      />

      <Footer />
    </div>
  )
}
