import { useState, useEffect, useRef } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, ShieldCheck, AlertTriangle, Lock } from "lucide-react"
import toast from "react-hot-toast"
import type { StripeCardFormProps } from "../types/stripe"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "")

const INTENT_EXPIRY_MS = 23 * 60 * 60 * 1000
const INTENT_WARNING_MS = 22 * 60 * 60 * 1000

function StripeCardFormInner({ refNumber, amount, currency, guestName, guestEmail, guestPhone, hotelName, clientSecret: externalSecret, intentLoading, intentError, onRetry, onSuccess }: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [intentExpired, setIntentExpired] = useState(false)
  const [intentExpiringSoon, setIntentExpiringSoon] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const intentCreatedAtRef = useRef<number>(Date.now())

  const CUR = currency || "USD"
  const cancelledRef = useRef(false)

  useEffect(() => () => { cancelledRef.current = true }, [])

  const resolvedLoading = intentLoading ?? false
  const resolvedError = intentError
  const resolvedSecret = externalSecret

  useEffect(() => {
    if (!resolvedSecret) return
    intentCreatedAtRef.current = Date.now()
    setIntentExpired(false)
    setIntentExpiringSoon(false)
    const warningTimer = setTimeout(() => {
      if (!cancelledRef.current) setIntentExpiringSoon(true)
    }, INTENT_WARNING_MS)
    const expiryTimer = setTimeout(() => {
      if (!cancelledRef.current) {
        setIntentExpired(true)
        toast.error("Payment session expired. Please retry.")
      }
    }, INTENT_EXPIRY_MS)
    return () => {
      clearTimeout(warningTimer)
      clearTimeout(expiryTimer)
    }
  }, [resolvedSecret])

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
      if (!cancelledRef.current) setLoading(false)
    }
  }

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
          onClick={() => onRetry?.()}
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
          onClick={() => onRetry?.()}
          className="text-sm text-[#0071c2] font-semibold hover:underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!resolvedSecret) return null

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {intentExpiringSoon && (
        <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">Payment session will expire soon. Please complete your payment.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Left Panel - Summary (dark navy) */}
        <div className="w-full md:w-[42%] bg-[#0a2540] text-white p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <span className="text-[#0a2540] font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-sm">ServeIQ</span>
          </div>

          <p className="text-sm text-gray-300 mb-1">Pay {hotelName || "ServeIQ"}</p>
          <p className="text-3xl font-bold mb-6">{CUR} {Math.max(0, amount).toFixed(2)}</p>

          <div className="border-t border-gray-600 pt-4 mt-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Subtotal</span>
              <span>{CUR} {Math.max(0, amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-600">
              <span>Total due</span>
              <span>{CUR} {Math.max(0, amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Payment Form (white) */}
        <div className="w-full md:w-[58%] bg-white p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment details</h3>
            <p className="text-xs text-gray-500">Complete your payment securely via Stripe.</p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              readOnly
              value={guestEmail || ""}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
          </div>

          {/* Card Info */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Card information</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#0071c2] focus-within:ring-1 focus-within:ring-[#0071c2]">
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
                className="p-3"
              />
            </div>
          </div>

          {/* Billing checkbox */}
          <label className="flex items-center gap-2 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="w-4 h-4 accent-[#0071c2] rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700">Billing address same as shipping</span>
          </label>

          {/* Pay Button */}
          <button
            disabled={loading || !stripe}
            onClick={handleConfirmPayment}
            className="w-full py-3 rounded-lg bg-[#0a2540] text-white text-sm font-semibold hover:bg-[#1a3a5c] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Processing...</>
            ) : (
              <>
                <Lock size={13} />
                Pay {CUR} {Math.max(0, amount).toFixed(2)}
              </>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">Powered by stripe</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">Terms</span>
              <span className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StripeCardForm(props: StripeCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripeCardFormInner {...props} />
    </Elements>
  )
}
