import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { CheckCircle2, ArrowRight } from "lucide-react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "")

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

  const refNumber = searchParams.get("ref")
  const paymentIntentId = searchParams.get("payment_intent")
  const clientSecret = searchParams.get("payment_intent_client_secret")
  const redirectStatus = searchParams.get("redirect_status")
  const propertyId = localStorage.getItem("stripe_property_id")
  const stripeAmount = localStorage.getItem("stripe_amount")

  // Razorpay params
  const razorpayOrderId = searchParams.get("razorpay_order_id")
  const razorpayPaymentId = searchParams.get("razorpay_payment_id")
  const razorpaySignature = searchParams.get("razorpay_signature")
  const razorpayPropertyId = searchParams.get("propertyId") || localStorage.getItem("razorpay_property_id")
  const razorpayAmount = localStorage.getItem("razorpay_amount")

  const isRazorpay = !!(razorpayOrderId && razorpayPaymentId && razorpaySignature)
  const isStripe = !!(paymentIntentId && clientSecret)

  useEffect(() => {
    if (isRazorpay) {
      // Razorpay payment is always successful when we have all three params
      setStatus("success")
      return
    }

    if (!paymentIntentId || !clientSecret) {
      setStatus("failed")
      return
    }

    const verifyPayment = async () => {
      try {
        const stripe = await stripePromise
        if (!stripe) {
          setStatus("failed")
          return
        }

        const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret)

        if (error || !paymentIntent) {
          setStatus("failed")
          return
        }

        if (paymentIntent.status === "succeeded" || redirectStatus === "succeeded") {
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch {
        setStatus("failed")
      }
    }

    verifyPayment()
  }, [paymentIntentId, clientSecret, redirectStatus, isRazorpay, razorpayOrderId, razorpayPaymentId, razorpaySignature])

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        handleContinue()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleContinue = () => {
    if (isRazorpay) {
      localStorage.removeItem("razorpay_property_id")
      localStorage.removeItem("razorpay_amount")
      localStorage.removeItem("razorpay_ref_number")
      const params = new URLSearchParams({
        razorpay_order_id: razorpayOrderId!,
        razorpay_payment_id: razorpayPaymentId!,
        razorpay_signature: razorpaySignature!,
      })
      if (refNumber) params.set("ref", refNumber)
      if (razorpayPropertyId) params.set("propertyId", razorpayPropertyId)
      if (propertyId) {
        navigate(`/reserve/${propertyId}?${params.toString()}`, { replace: true })
      } else if (razorpayPropertyId && refNumber) {
        navigate(`/reserve/${razorpayPropertyId}?${params.toString()}`, { replace: true })
      } else if (refNumber) {
        navigate(`/booking-confirmation/${refNumber}`, { replace: true })
      } else {
        navigate("/", { replace: true })
      }
      return
    }

    localStorage.removeItem("stripe_property_id")
    localStorage.removeItem("stripe_amount")
    const params = new URLSearchParams()
    if (refNumber) params.set("ref", refNumber)
    if (paymentIntentId) params.set("payment_intent", paymentIntentId)
    if (redirectStatus) params.set("redirect_status", redirectStatus)

    if (propertyId) {
      navigate(`/reserve/${propertyId}?${params.toString()}`, { replace: true })
    } else if (refNumber) {
      navigate(`/booking-confirmation/${refNumber}`, { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }

  const displayAmount = isRazorpay ? razorpayAmount : stripeAmount
  const displayTransactionId = isRazorpay ? razorpayPaymentId : paymentIntentId

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 font-jakarta">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {status === "loading" && (
          <div className="py-4">
            <div className="relative mb-6 mx-auto w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-[#635bff] border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Verifying your payment</h1>
            <p className="text-sm text-gray-500">Please wait while we confirm your transaction...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-2">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={44} className="text-green-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h1>
            <p className="text-sm text-gray-500 mb-1">Your payment has been confirmed</p>
            {refNumber && (
              <p className="text-xs text-gray-400 mb-6">Booking #{refNumber}</p>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Amount paid</span>
                <span className="font-semibold text-gray-900">NPR {displayAmount || "—"}</span>
              </div>
              {displayTransactionId && (
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono text-gray-500">{displayTransactionId.slice(0, 20)}...</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2">Redirecting to booking page...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="py-4">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-sm text-gray-500 mb-6">Something went wrong. No charges were made.</p>
            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-xl bg-[#1A3C5E] text-white text-sm font-semibold hover:bg-[#163552] transition-all flex items-center justify-center gap-2"
            >
              Go Back
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-6 text-center">
          Powered by {isRazorpay ? "Razorpay" : "Stripe"}
        </p>
      </div>
    </div>
  )
}
