import { useState, useEffect, useCallback, useRef } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"
import api from "../../services/axios"
import type { StripeCardFormProps } from "../types/stripe"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "")

// Stripe payment intents expire server-side after 24h. These timers let the UI
// warn the user at 22h and force a retry at 23h before the backend rejects it.
const INTENT_EXPIRY_MS = 23 * 60 * 60 * 1000
const INTENT_WARNING_MS = 22 * 60 * 60 * 1000

function StripeCardFormInner({ refNumber, amount, currency, guestName, guestEmail, guestPhone, clientSecret: externalSecret, intentLoading, intentError, onRetry, onSuccess }: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intentExpired, setIntentExpired] = useState(false)
  const [intentExpiringSoon, setIntentExpiringSoon] = useState(false)
  const intentCreatedAtRef = useRef<number>(Date.now())

  const CUR = currency || "USD"

  // Prevents state updates after unmount when async API calls or timers resolve late.
  const cancelledRef = useRef(false)

  useEffect(() => () => { cancelledRef.current = true }, [])

  const createIntent = useCallback(async () => {
    if (!refNumber) { setLoadingIntent(false); return }
    setLoadingIntent(true)
    setError(null)
    setClientSecret(null)
    setIntentExpired(false)
    setIntentExpiringSoon(false)
    intentCreatedAtRef.current = Date.now()
    try {
      const { data } = await api.post(`/bookings/${refNumber}/payment-intent`, { payment_gateway: "stripe" })
      if (cancelledRef.current) return
      const secret = data?.client_secret || data?.data?.client_secret
      if (!secret) {
        setError("Failed to initialize payment")
        return
      }
      setClientSecret(secret)
      intentCreatedAtRef.current = Date.now()
    } catch (err: unknown) {
      if (cancelledRef.current) return
      const msg = err instanceof Error ? err.message : "Failed to initialize payment"
      setError(msg)
    } finally {
      if (!cancelledRef.current) setLoadingIntent(false)
    }
  }, [refNumber])

  useEffect(() => {
    if (externalSecret !== undefined) return
    createIntent()
  }, [createIntent, externalSecret])

  useEffect(() => {
    if (!clientSecret) return
    const warningTimer = setTimeout(() => {
      if (!cancelledRef.current) setIntentExpiringSoon(true)
    }, INTENT_WARNING_MS)
    const expiryTimer = setTimeout(() => {
      if (!cancelledRef.current) {
        setIntentExpired(true)
        setClientSecret(null)
        toast.error("Payment session expired. Please retry.")
      }
    }, INTENT_EXPIRY_MS)
    return () => {
      clearTimeout(warningTimer)
      clearTimeout(expiryTimer)
    }
  }, [clientSecret])

  const handleConfirmPayment = async () => {
    if (!stripe || !elements || !resolvedSecret) return
    if (intentExpired) {
      toast.error("Payment session expired. Please retry.")
      return
    }
    setLoading(true)
    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(resolvedSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: guestName ?? "",
            email: guestEmail ?? "",
            phone: guestPhone ?? "",
          },
        },
      })
      if (stripeError) {
        toast.error(stripeError.message || "Payment failed")
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!")
        onSuccess(paymentIntent.id, resolvedSecret, paymentIntent.created)
      } else if (paymentIntent?.status === "requires_action") {
        toast("Additional authentication required", { icon: "ℹ️" })
      } else {
        toast.error("Payment was not completed")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // The component operates in two modes: it can either create its own payment
  // intent internally, or accept a client secret from the parent (externalSecret).
  // These resolved values abstract over both modes so the rest of the component
  // doesn't need to know which mode it's in.
  const resolvedLoading = externalSecret !== undefined ? (intentLoading ?? false) : loadingIntent
  const resolvedError = externalSecret !== undefined ? intentError : error
  const resolvedSecret = externalSecret !== undefined ? externalSecret : clientSecret

  if (resolvedLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6">
        <Loader2 size={16} className="animate-spin text-[#0071c2]" />
        <span className="text-sm text-gray-500">Initializing payment...</span>
      </div>
    )
  }

  if (intentExpired) {
    return (
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <p className="text-sm font-semibold text-amber-700">Payment session expired</p>
        </div>
        <p className="text-xs text-gray-500 mb-3">The payment session has timed out. Please retry to start a new session.</p>
        <button
          onClick={() => { if (externalSecret !== undefined) onRetry?.(); else createIntent() }}
          className="text-sm text-[#0071c2] font-semibold hover:underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  if (resolvedError) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-500 mb-2">{resolvedError}</p>
        <button
          onClick={() => { if (externalSecret !== undefined) onRetry?.(); else createIntent() }}
          className="text-sm text-[#0071c2] font-semibold hover:underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!resolvedSecret) return null

  return (
    <div className="space-y-3">
      {intentExpiringSoon && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">Payment session will expire soon. Please complete your payment.</p>
        </div>
      )}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#1a1a1a",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
          className="bg-white border border-gray-300 rounded-lg p-3"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {["Visa", "Mastercard", "Amex", "Discover"].map((b) => (
          <span key={b} className="text-[10px] font-medium bg-white border border-gray-200 rounded px-2 py-1 text-gray-600">{b}</span>
        ))}
      </div>
      <button
        disabled={loading || !stripe}
        onClick={handleConfirmPayment}
        className="w-full py-2.5 rounded-lg bg-[#0071c2] text-white text-sm font-semibold hover:bg-[#005fa3] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Processing...</>
        ) : (
          <>Pay {CUR}{Math.max(0, amount).toFixed(2)} via Card</>
        )}
      </button>
    </div>
  )
}

export default function StripeCardForm(props: StripeCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <div className="space-y-4">
        <StripeCardFormInner {...props} />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Secure Payment via Stripe</p>
            <p className="text-xs text-gray-600">Your card details are encrypted. We never store card details.</p>
          </div>
        </div>
      </div>
    </Elements>
  )
}
