import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { useRazorpay } from "@/hooks/shared/useRazorpay"
import type { RazorpayPaymentResponse, RazorpayCheckoutOptions, RazorpayPayOptions, RazorpayFailureResponse } from "@/types/razorpay"
import type { PaymentMethod } from "@/types/guestBooking"
import type { PaymentPlan } from "@/components/bookings/PaymentSection"
import { env } from "@/config/env"
import { createPaymentIntent, type PaymentIntentResponse } from "@/api/payments/paymentApi"
import { extractGatewayErrorMessage, extractErrorMessage } from "@/utils/paymentErrors"

export interface RazorpayState {
  response: RazorpayPaymentResponse | null
  orderId: string | null
  amount: number | null
  currency: string | null
  loading: boolean
  error: string | null
}

export interface StripeState {
  paymentIntentId: string | null
  clientSecret: string | null
  loading: boolean
  error: string | null
  transactionTime: number | null
}

export interface KhaltiState {
  paymentIntentId: string | null
  loading: boolean
  error: string | null
}

export interface EsewaState {
  paymentIntentId: string | null
  loading: boolean
  error: string | null
}

interface UseReservationPaymentParams {
  refNumber: string
  propertyId: string
  id?: string
  selectedPayment: PaymentMethod | null
  setSelectedPayment: (method: PaymentMethod | null) => void
  paymentPlan: PaymentPlan
  advanceAmount: number
  expired: boolean
  hotelName: string
  guestName: string
  guestEmail: string
  guestPhone: string
  setPaymentLoading: (loading: boolean) => void
}

// Owns every payment-gateway concern for the reserve page: intent creation for
// Razorpay/Stripe/Khalti/eSewa, the Razorpay checkout modal lifecycle, the
// gateway redirect callbacks, retry triggers, and the derived overlay state.
export function useReservationPayment({
  refNumber,
  propertyId,
  id,
  selectedPayment,
  setSelectedPayment,
  paymentPlan,
  advanceAmount,
  expired,
  hotelName,
  guestName,
  guestEmail,
  guestPhone,
  setPaymentLoading,
}: UseReservationPaymentParams) {
  const [searchParams] = useSearchParams()

  const [razorpayState, setRazorpayState] = useState<RazorpayState>({
    response: null,
    orderId: null,
    amount: null,
    currency: null,
    loading: false,
    error: null,
  })
  const [razorpayRetryCount] = useState(0)
  // Incremented on every Razorpay tab click so the checkout modal re-opens
  // even when the order was already created (e.g. after a dismissal).
  const [razorpayOpenRequests, setRazorpayOpenRequests] = useState(0)
  const razorpayModalOpenRef = useRef(false)
  // True from the moment the Razorpay tab is clicked until the checkout window
  // actually opens (or fails) — drives the checkout-style loading overlay.
  const [razorpayCheckoutOpening, setRazorpayCheckoutOpening] = useState(false)

  const [stripeState, setStripeState] = useState<StripeState>({
    paymentIntentId: null,
    clientSecret: null,
    loading: false,
    error: null,
    transactionTime: null,
  })
  const [stripeRetryCount, setStripeRetryCount] = useState(0)

  const [khaltiState, setKhaltiState] = useState<KhaltiState>({
    paymentIntentId: null,
    loading: false,
    error: null,
  })
  const [khaltiRetryCount, setKhaltiRetryCount] = useState(0)

  const [esewaState, setEsewaState] = useState<EsewaState>({
    paymentIntentId: null,
    loading: false,
    error: null,
  })
  const [esewaRetryCount, setEsewaRetryCount] = useState(0)
  const [esewaConfirmData, setEsewaConfirmData] = useState<string | null>(null)
  const [khaltiCompleted, setKhaltiCompleted] = useState(false)

  const { isLoaded: razorpayLoaded, error: razorpaySdkError } = useRazorpay(selectedPayment === "razorpay")

  // Surface checkout.js load failures (e.g. blocked by CSP/network) instead of
  // leaving an endless "Loading Razorpay..." spinner with no explanation.
  useEffect(() => {
    if (razorpaySdkError && selectedPayment === "razorpay") {
      setRazorpayCheckoutOpening(false)
      setRazorpayState(prev => ({ ...prev, loading: false, error: prev.error || razorpaySdkError }))
    }
  }, [razorpaySdkError, selectedPayment])

  useEffect(() => {
    if (expired || selectedPayment !== "razorpay") return
    if (!refNumber) {
      setRazorpayState(prev => ({ ...prev, loading: false, error: "Missing booking reference — unable to start Razorpay checkout. Please reload the page." }))
      return
    }
    let cancelled = false
    const createOrder = async () => {
      setRazorpayState(prev => ({ ...prev, loading: true, error: null, orderId: null }))
      try {
        const res = await createPaymentIntent({
          refNumber,
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "razorpay",
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        // Backend wraps the result as { success, data: { order_id, amount, currency, ... } }
        const payload: PaymentIntentResponse = res?.data ?? res ?? {}
        const orderId = payload.razorpay_order_id || payload.order_id
        if (!orderId) {
          setRazorpayState(prev => ({ ...prev, error: payload.message || "Failed to initialize Razorpay" }))
          return
        }
        setRazorpayState(prev => ({
          ...prev,
          orderId,
          amount: typeof payload.amount === "number" ? payload.amount : null,
          currency: typeof payload.currency === "string" ? payload.currency : null,
        }))
      } catch (err: unknown) {
        if (cancelled) return
        setRazorpayState(prev => ({ ...prev, error: extractGatewayErrorMessage(err, "Failed to initialize Razorpay") }))
      } finally {
        if (!cancelled) setRazorpayState(prev => ({ ...prev, loading: false }))
      }
    }
    createOrder()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment, refNumber, razorpayRetryCount, advanceAmount, expired])

  const handleRazorpayPaymentRef = useRef<(options?: RazorpayPayOptions) => void>(() => {})

  // Open the Razorpay checkout modal as soon as the tab is clicked and both
  // the order and the SDK are ready. Re-fires on every tab click (via
  // razorpayOpenRequests) so a dismissed modal can be reopened.
  useEffect(() => {
    if (selectedPayment !== "razorpay" || razorpayOpenRequests === 0) return
    if (!razorpayLoaded || !razorpayState.orderId || razorpayState.response || razorpayState.loading) return
    if (razorpayModalOpenRef.current) return
    handleRazorpayPaymentRef.current({ type: 'card' })
  }, [selectedPayment, razorpayOpenRequests, razorpayLoaded, razorpayState.orderId, razorpayState.response, razorpayState.loading])

  useEffect(() => {
    if (expired || selectedPayment !== "stripe" || !refNumber) return
    if (!env.stripePublishableKey) {
      setStripeState(prev => ({ ...prev, loading: false, error: "Stripe key missing: set VITE_STRIPE_PUBLISHABLE_KEY in my-react-app/.env and restart the dev server." }))
      return
    }
    let cancelled = false
    const createStripeIntent = async () => {
      setStripeState(prev => ({ ...prev, loading: true, error: null, clientSecret: null }))
      try {
        const res = await createPaymentIntent({
          refNumber,
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "stripe",
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        const secret = res?.client_secret || res?.data?.client_secret
        if (!secret) {
          setStripeState(prev => ({ ...prev, error: "Failed to initialize Stripe" }))
          return
        }
        setStripeState(prev => ({ ...prev, clientSecret: secret }))
      } catch (err: unknown) {
        if (cancelled) return
        setStripeState(prev => ({ ...prev, error: extractGatewayErrorMessage(err, "Failed to initialize Stripe") }))
      } finally {
        if (!cancelled) setStripeState(prev => ({ ...prev, loading: false }))
      }
    }
    createStripeIntent()
    return () => { cancelled = true }
  }, [selectedPayment, refNumber, stripeRetryCount, advanceAmount, paymentPlan, expired])

  useEffect(() => {
    if (expired || selectedPayment !== "khalti" || !refNumber) return
    if (khaltiState.paymentIntentId) return
    let cancelled = false
    const createKhaltiIntent = async () => {
      setKhaltiState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const returnToUrl = `${window.location.origin}/reserve/${id}?ref=${refNumber}`
        const res = await createPaymentIntent({
          refNumber,
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "khalti",
          return_url: returnToUrl,
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        const intentId = res?.payment_intent_id || res?.data?.payment_intent_id || res?.intent_id || res?.data?.intent_id || res?.pidx || res?.data?.pidx || res?.id || res?.data?.id
        const redirectUrl = res?.payment_url || res?.data?.payment_url || res?.redirect_url || res?.data?.redirect_url || res?.checkout_url || res?.data?.checkout_url || res?.payment_link || res?.data?.payment_link
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
        setKhaltiState(prev => ({ ...prev, error: extractErrorMessage(err, "Failed to initialize Khalti payment") }))
      } finally {
        if (!cancelled) setKhaltiState(prev => ({ ...prev, loading: false }))
      }
    }
    createKhaltiIntent()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment, refNumber, id, khaltiState.paymentIntentId, khaltiRetryCount, advanceAmount, expired])

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
  }, [searchParams, setSelectedPayment])

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
  }, [searchParams, setSelectedPayment])

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
  }, [searchParams, refNumber, setSelectedPayment])

  useEffect(() => {
    if (expired || selectedPayment !== "esewa" || !refNumber) return
    if (esewaState.paymentIntentId || esewaConfirmData) return
    if (searchParams.get('data') || searchParams.get('esewa_status')) return
    let cancelled = false
    const createEsewaIntent = async () => {
      setEsewaState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const returnToUrl = `${window.location.origin}/reserve/${id}`
        const res = await createPaymentIntent({
          refNumber,
          payment_method: paymentPlan === "advance" ? "ADVANCE" : "ONLINE",
          payment_gateway: "esewa",
          return_url: returnToUrl,
          advance_amount: advanceAmount,
        })
        if (cancelled) return
        const data: PaymentIntentResponse = res?.data || res
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
          setTimeout(() => { form.remove() }, 0)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment, refNumber, id, esewaState.paymentIntentId, esewaConfirmData, esewaRetryCount, advanceAmount, expired])

  const handleRazorpayPayment = async (options?: RazorpayPayOptions) => {
    if (expired) { setRazorpayCheckoutOpening(false); toast.error("Your reservation hold has expired. Please reserve again."); return }
    if (!razorpayState.orderId) { setRazorpayCheckoutOpening(false); toast.error("Razorpay not ready"); return }
    if (!window.Razorpay) { setRazorpayCheckoutOpening(false); toast.error("Razorpay is still loading. Please try again in a moment."); return }
    if (razorpayModalOpenRef.current) { setRazorpayCheckoutOpening(false); return }
    const razorpayKey = env.razorpayKeyId
    if (!razorpayKey) {
      setRazorpayCheckoutOpening(false)
      setRazorpayState(prev => ({ ...prev, error: "Razorpay key missing: set VITE_RAZORPAY_KEY_ID in my-react-app/.env and restart the dev server." }))
      return
    }
    setPaymentLoading(true)
    try {
      const razorpayOptions: RazorpayCheckoutOptions = {
        key: razorpayKey,
        // Must match the order the backend created (backend amount is in the
        // property's currency, not necessarily INR) — a mismatch makes the
        // checkout modal fail to open.
        amount: Math.round((razorpayState.amount ?? Math.max(0, advanceAmount)) * 100),
        currency: razorpayState.currency || "INR",
        order_id: razorpayState.orderId,
        name: "ServeIQ",
        description: `Booking at ${hotelName}`,
        handler: (response: RazorpayPaymentResponse) => {
          razorpayModalOpenRef.current = false
          setRazorpayCheckoutOpening(false)
          setRazorpayState(prev => ({ ...prev, response }))
        },
        modal: {
          ondismiss: () => {
            razorpayModalOpenRef.current = false
            setRazorpayCheckoutOpening(false)
          },
        },
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
      razorpayModalOpenRef.current = true
      setRazorpayCheckoutOpening(false)
    } catch (err: unknown) {
      setRazorpayCheckoutOpening(false)
      const msg = err instanceof Error ? err.message : "Unknown error"
      if (msg === "Payment cancelled") {
        toast("Payment cancelled. You can retry anytime.", { icon: "ℹ️" })
      } else {
        toast.error("Payment failed: " + msg)
      }
    } finally { setPaymentLoading(false) }
  }
  handleRazorpayPaymentRef.current = handleRazorpayPayment

  const handleSelectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method)
    if (method === "razorpay") {
      // Ask for the checkout modal to open — immediately if the order/SDK are
      // ready, otherwise as soon as they are.
      setRazorpayOpenRequests(count => count + 1)
      // Show the loading overlay until the checkout window appears.
      setRazorpayCheckoutOpening(true)
    }
    if (method === "stripe") {
      if (refNumber) localStorage.setItem("stripe_ref_number", refNumber)
      if (propertyId) localStorage.setItem("stripe_property_id", String(propertyId))
    }
  }

  const retryStripe = () => setStripeRetryCount(count => count + 1)
  const setKhaltiError = (error: string | null) => setKhaltiState(prev => ({ ...prev, error }))
  const setKhaltiLoading = (loading: boolean) => setKhaltiState(prev => ({ ...prev, loading }))
  const retryKhalti = () => {
    setKhaltiState({ paymentIntentId: null, loading: false, error: null })
    setKhaltiRetryCount(c => c + 1)
  }
  const retryEsewa = () => {
    setEsewaState({ paymentIntentId: null, loading: false, error: null })
    setEsewaConfirmData(null)
    localStorage.removeItem('esewa_confirm_data')
    localStorage.removeItem('esewa_status')
    localStorage.removeItem('esewa_ref_number')
    setEsewaRetryCount(c => c + 1)
  }
  const resetStripeState = () => setStripeState({
    paymentIntentId: null,
    clientSecret: null,
    loading: false,
    error: null,
    transactionTime: null,
  })
  const confirmStripeIntent = (paymentIntentId: string) => setStripeState(prev => ({
    ...prev,
    paymentIntentId,
    clientSecret: null,
    error: null,
    transactionTime: Math.floor(Date.now() / 1000),
  }))

  // Checkout-style loading overlay: visible from the moment the Razorpay tab
  // is clicked until Razorpay's own window opens, an error occurs, or the
  // payment completes.
  const razorpayOverlayVisible =
    razorpayCheckoutOpening &&
    selectedPayment === "razorpay" &&
    !razorpayState.response &&
    !razorpayState.error

  const razorpayLoadingMessage = !razorpayState.orderId
    ? "Preparing your payment order…"
    : !razorpayLoaded
      ? "Loading Razorpay checkout…"
      : "Opening secure checkout…"

  return {
    razorpayState,
    razorpayLoaded,
    stripeState,
    khaltiState,
    esewaState,
    esewaConfirmData,
    khaltiCompleted,
    razorpayOverlayVisible,
    razorpayLoadingMessage,
    handleSelectPayment,
    retryStripe,
    setKhaltiError,
    setKhaltiLoading,
    retryKhalti,
    retryEsewa,
    resetStripeState,
    confirmStripeIntent,
  }
}
