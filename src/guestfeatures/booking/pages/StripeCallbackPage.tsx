import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function StripeCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent")
    const clientSecret = searchParams.get("payment_intent_client_secret")
    const refNumber = searchParams.get("ref") || localStorage.getItem("stripe_ref_number")
    const redirectStatus = searchParams.get("redirect_status")

    localStorage.removeItem("stripe_ref_number")

    if (paymentIntentId && refNumber) {
      const params = new URLSearchParams({
        payment_intent: paymentIntentId,
        ref: refNumber,
        redirect_status: redirectStatus || "succeeded",
      })
      if (clientSecret) params.set("payment_intent_client_secret", clientSecret)

      navigate(`/payment/success?${params.toString()}`, { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={32} className="animate-spin text-[#0071c2] mx-auto mb-3" />
        <p className="text-sm text-gray-500">Processing payment...</p>
      </div>
    </div>
  )
}
