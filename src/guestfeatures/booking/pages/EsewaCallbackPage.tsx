import { useEffect } from "react"

export default function EsewaCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const returnTo = localStorage.getItem("esewa_return_to")
    localStorage.removeItem("esewa_return_to")
    localStorage.removeItem("esewa_payment_intent_id")

    let redirectUrl: string

    if (returnTo) {
      const url = new URL(returnTo, window.location.origin)
      params.forEach((value, key) => url.searchParams.set(key, value))
      redirectUrl = `${url.pathname}${url.search}`
    } else {
      redirectUrl = "/"
    }

    window.location.replace(redirectUrl)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-jakarta">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#60BB46] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-gray-500">Processing eSewa payment...</p>
      </div>
    </div>
  )
}
