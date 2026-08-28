import { useState, useEffect, useRef } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, AlertTriangle, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { stripePromise } from "../../lib/stripe"
import type { StripeCardFormProps } from "../types/stripe"

const INTENT_EXPIRY_MS = 23 * 60 * 60 * 1000
const INTENT_WARNING_MS = 22 * 60 * 60 * 1000

function StripePaymentFormInner({
  refNumber,
  amount,
  currency,
  guestName,
  guestEmail,
  hotelName,
  clientSecret: externalSecret,
  intentError,
  onRetry,
}: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [intentExpired, setIntentExpired] = useState(false)
  const [intentExpiringSoon, setIntentExpiringSoon] = useState(false)
  const intentCreatedAtRef = useRef<number>(Date.now())

  const CUR = currency || "USD"
  const cancelledRef = useRef(false)

  useEffect(() => () => { cancelledRef.current = true }, [])

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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/stripe/callback?ref=${refNumber}`,
        },
      })
      if (error) {
        toast.error(error.message || "Payment failed. Please check your payment details and try again.")
      }
      // On success, Stripe redirects to return_url — no need to call onSuccess here.
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed"
      toast.error(msg)
    } finally {
      if (!cancelledRef.current) setLoading(false)
    }
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
        {/* Left Panel - Summary */}
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

        {/* Right Panel - Payment Element */}
        <div className="w-full md:w-[58%] bg-white p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment details</h3>
            <p className="text-xs text-gray-500">Complete your payment securely via Stripe.</p>
          </div>

          {/* Guest info */}
          {(guestName || guestEmail) && (
            <div className="mb-5 space-y-3">
              {guestName && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    readOnly
                    value={guestName}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              )}
              {guestEmail && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    readOnly
                    value={guestEmail}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Stripe PaymentElement — handles all payment methods automatically */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Payment method</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#0071c2] focus-within:ring-1 focus-within:ring-[#0071c2]">
              <PaymentElement
                options={{
                  layout: "tabs",
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            disabled={loading || !stripe || !elements}
            onClick={handleConfirmPayment}
            className="w-full py-3 rounded-lg bg-[#0a2540] text-white text-sm font-semibold hover:bg-[#1a3a5c] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Processing payment...</>
            ) : (
              <>
                <Lock size={13} />
                Pay {CUR} {Math.max(0, amount).toFixed(2)}
              </>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">Powered by Stripe</span>
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
  if (props.intentLoading || !props.clientSecret) {
    return (
      <div className="flex items-center justify-center gap-2 py-6">
        <Loader2 size={16} className="animate-spin text-[#0071c2]" />
        <span className="text-sm text-gray-500">Initializing payment...</span>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
      }}
    >
      <StripePaymentFormInner {...props} />
    </Elements>
  )
}
