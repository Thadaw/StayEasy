import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "")

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent")
    const clientSecret = searchParams.get("payment_intent_client_secret")
    const redirectStatus = searchParams.get("redirect_status")
    const refNumber = searchParams.get("ref")

    if (!paymentIntentId || !clientSecret) {
      setStatus("failed")
      return
    }

    const verifyAndRedirect = async () => {
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

    verifyAndRedirect()
  }, [searchParams])

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        const paymentIntentId = searchParams.get("payment_intent")
        const refNumber = searchParams.get("ref")
        const redirectStatus = searchParams.get("redirect_status")
        const propertyId = localStorage.getItem("stripe_property_id")

        localStorage.removeItem("stripe_property_id")

        const params = new URLSearchParams()
        if (refNumber) params.set("ref", refNumber)
        if (paymentIntentId) params.set("payment_intent", paymentIntentId)
        if (redirectStatus) params.set("redirect_status", redirectStatus)

        if (propertyId) {
          navigate(`/reserve/${propertyId}?${params.toString()}`, { replace: true })
        } else {
          navigate("/", { replace: true })
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, navigate, searchParams])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 size={48} className="animate-spin text-[#0071c2] mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-sm text-gray-500">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-sm text-gray-500 mb-6">Something went wrong. Please try again.</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-[#1A3C5E] text-white text-sm font-semibold rounded-lg hover:bg-[#163552] transition-colors"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}
