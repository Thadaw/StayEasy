import { useState, useEffect, useRef } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, AlertTriangle, Lock, CreditCard } from "lucide-react"
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
  paymentPlan,
  onPaymentIntentConfirmed,
}: StripeCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [intentExpired, setIntentExpired] = useState(false)
  const [intentExpiringSoon, setIntentExpiringSoon] = useState(false)

  const CUR = currency || "USD"
  const cancelledRef = useRef(false)

  useEffect(() => () => { cancelledRef.current = true }, [])

  const resolvedError = intentError
  const resolvedSecret = externalSecret

  useEffect(() => {
    if (!resolvedSecret) return
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
    if (!stripe || !elements || !resolvedSecret) {
      toast.error("Payment is still loading. Please wait a moment and try again.")
      return
    }
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
      } else {
        // No error means the payment completed in place (no 3D Secure / bank
        // redirect). Retrieve the intent to learn its id and status — without
        // this ReservePage would never get the payment_intent id and the
        // booking would be unconfirmable.
        const retrieved = await stripe.retrievePaymentIntent(resolvedSecret)
        const intent = retrieved.paymentIntent
        if (retrieved.error) {
          toast.error(retrieved.error.message || "Could not verify payment. Please try again.")
        } else if (intent?.status === "succeeded" && intent.id) {
          onPaymentIntentConfirmed?.(intent.id)
          toast.success("Payment successful! Click \"Complete booking\" below to finish.")
        } else if (intent?.status) {
          toast(`Payment status: ${intent.status}. Please wait a moment, then try confirming.`, { icon: "ℹ️" })
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed"
      toast.error(msg)
    } finally {
      if (!cancelledRef.current) setLoading(false)
    }
  }

  if (intentExpired) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <p className="text-sm font-semibold text-amber-700">Payment session expired</p>
        </div>
        <p className="text-xs text-gray-500 mb-4">The payment session has timed out. Please retry.</p>
        <button
          onClick={() => onRetry?.()}
          className="px-5 py-2.5 bg-[#635bff] text-white text-sm font-semibold rounded-lg hover:bg-[#5046e4] transition-colors cursor-pointer"
        >
          Retry Payment
        </button>
      </div>
    )
  }

  if (resolvedError) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-500 mb-3">{resolvedError}</p>
        <button
          onClick={() => onRetry?.()}
          className="px-5 py-2.5 bg-[#635bff] text-white text-sm font-semibold rounded-lg hover:bg-[#5046e4] transition-colors cursor-pointer"
        >
          Retry Payment
        </button>
      </div>
    )
  }

  if (!resolvedSecret) return null

  return (
    <div className="flex flex-col md:flex-row min-h-[500px]">
      {/* Left Panel - Summary */}
      <div className="w-full md:w-[40%] bg-[#0a2540] text-white p-6 md:p-8 flex flex-col">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0a2540] font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-sm">ServeIQ</span>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-1">Pay {hotelName || "ServeIQ"}</p>
          <p className="text-3xl font-bold">{CUR} {Math.max(0, amount).toFixed(2)}</p>
        </div>

        <div className="border-t border-gray-600 pt-4 mt-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Subtotal</span>
            <span>{CUR} {Math.max(0, amount).toFixed(2)}</span>
          </div>
          {paymentPlan !== "full" && (
            <div className="flex justify-between text-sm font-semibold pt-3 border-t border-gray-600">
              <span>Total due</span>
              <span>{CUR} {Math.max(0, amount).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
          <Lock size={12} />
          <span>Secured by Stripe</span>
        </div>
      </div>

      {/* Right Panel - Payment Element */}
      <div className="w-full md:w-[60%] bg-white p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={18} className="text-[#635bff]" />
            <h3 className="text-base font-semibold text-gray-900">Payment details</h3>
          </div>
          <p className="text-xs text-gray-500">Complete your payment securely via Stripe.</p>
        </div>

        {/* Guest info */}
        {(guestName || guestEmail) && (
          <div className="mb-5 p-3 bg-gray-50 rounded-lg space-y-2">
            {guestName && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{guestName}</span>
              </div>
            )}
            {guestEmail && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{guestEmail}</span>
              </div>
            )}
          </div>
        )}

        {/* Stripe PaymentElement */}
        <div className="mb-5">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>

        {/* Pay Button */}
        <button
          disabled={loading}
          onClick={handleConfirmPayment}
          className="w-full py-3.5 rounded-lg bg-[#635bff] text-white text-sm font-semibold hover:bg-[#5046e4] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Processing payment...</>
          ) : (
            <>
              <Lock size={14} />
              Pay {CUR} {Math.max(0, amount).toFixed(2)}
            </>
          )}
        </button>

        {/* Footer */}
        <div className="flex items-center justify-center mt-5 pt-4 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">Powered by <span className="font-semibold text-gray-500">Stripe</span></span>
        </div>
      </div>
    </div>
  )
}

export default function StripeCardForm(props: StripeCardFormProps) {
  if (props.intentLoading || !props.clientSecret) {
    return (
      <div className="flex flex-col md:flex-row min-h-[500px]">
        <div className="w-full md:w-[40%] bg-[#0a2540] text-white p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#0a2540] font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-sm">ServeIQ</span>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-300 mb-1">Pay {props.hotelName || "ServeIQ"}</p>
            <p className="text-3xl font-bold">{props.currency || "USD"} {Math.max(0, props.amount).toFixed(2)}</p>
          </div>
          <div className="border-t border-gray-600 pt-4 mt-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Subtotal</span>
              <span>{props.currency || "USD"} {Math.max(0, props.amount).toFixed(2)}</span>
            </div>
            {props.paymentPlan !== "full" && (
              <div className="flex justify-between text-sm font-semibold pt-3 border-t border-gray-600">
                <span>Total due</span>
                <span>{props.currency || "USD"} {Math.max(0, props.amount).toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <Lock size={12} />
            <span>Secured by Stripe</span>
          </div>
        </div>
        <div className="w-full md:w-[60%] bg-white p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-gray-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#635bff] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-700">Initializing secure payment...</p>
          <p className="mt-1 text-xs text-gray-400">Connecting to Stripe</p>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: props.clientSecret }}
      key={props.clientSecret}
    >
      <StripePaymentFormInner {...props} />
    </Elements>
  )
}
