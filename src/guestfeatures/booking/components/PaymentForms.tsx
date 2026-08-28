import { Loader2, CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'
import type { RazorpayPaymentResponse } from '../types'
import type { PaymentMethod } from '../types'

interface PaymentFormsProps {
  selectedPayment: PaymentMethod | null
  total: number
  currency: string
  hotelName: string
  refNumber: string
  guestName: string
  guestEmail: string
  guestPhone: string
  paymentLoading: boolean
  stripePaymentIntentId: string | null
  stripeIntentLoading: boolean
  stripeIntentError: string | null
  razorpayResponse: RazorpayPaymentResponse | null
  razorpayOrderLoading: boolean
  razorpayOrderError: string | null
  razorpayOrderId: string | null
  razorpayLoaded: boolean
  khaltiPaymentIntentId: string | null
  khaltiLoading: boolean
  khaltiError: string | null
  esewaPaymentIntentId: string | null
  esewaConfirmData: string | null
  esewaLoading: boolean
  esewaError: string | null
  onStripeRetry: () => void
  onSetKhaltiError: (error: string | null) => void
  onSetKhaltiLoading: (loading: boolean) => void
  onKhaltiRetry: () => void
  onEsewaRetry: () => void
  khaltiCompleted?: boolean
}

export function PaymentForms({
  selectedPayment,
  total,
  currency,
  hotelName,
  refNumber,
  guestName,
  guestEmail,
  guestPhone,
  paymentLoading,
  stripePaymentIntentId,
  stripeIntentLoading,
  stripeIntentError,
  razorpayResponse,
  razorpayOrderLoading,
  razorpayOrderError,
  razorpayOrderId,
  razorpayLoaded,
  khaltiPaymentIntentId,
  khaltiLoading,
  khaltiError,
  esewaPaymentIntentId,
  esewaConfirmData,
  esewaLoading,
  esewaError,
  onStripeRetry,
  onSetKhaltiError,
  onKhaltiRetry,
  onEsewaRetry,
  khaltiCompleted = false,
}: PaymentFormsProps) {
  if (selectedPayment === "stripe" && !stripePaymentIntentId) return null

  if (selectedPayment === "razorpay" && !razorpayResponse) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="space-y-4">
          {razorpayOrderLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 size={16} className="animate-spin text-[#1A3C5E]" />
              <span className="text-sm text-gray-500">Initializing Razorpay...</span>
            </div>
          )}
          {razorpayOrderError && (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 mb-2">{razorpayOrderError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-[#1A3C5E] font-semibold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
          {!razorpayOrderLoading && !razorpayOrderError && !razorpayOrderId && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 size={16} className="animate-spin text-[#1A3C5E]" />
              <span className="text-sm text-gray-500">Loading Razorpay...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (selectedPayment === "khalti" && !khaltiPaymentIntentId) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="space-y-3">
          {khaltiLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 size={16} className="animate-spin text-[#5C2D91]" />
              <span className="text-sm text-gray-500">Redirecting to Khalti...</span>
            </div>
          )}
          {khaltiError && (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 mb-2">{khaltiError}</p>
              <button
                onClick={onKhaltiRetry}
                className="text-sm text-[#1A3C5E] font-semibold hover:underline cursor-pointer"
              >
                Tap to retry
              </button>
            </div>
          )}
          {!khaltiLoading && !khaltiError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Payment not completed</p>
                <p className="text-xs text-gray-600">Click the button below to retry your payment.</p>
              </div>
            </div>
          )}
          <button
            disabled={khaltiLoading || paymentLoading}
            className="w-full py-3 rounded-xl bg-[#5C2D91] text-white font-semibold text-sm hover:bg-[#4a2375] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {khaltiLoading ? <><Loader2 size={14} className="animate-spin" /> Redirecting...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via Khalti</>}
          </button>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Secure Payment via Khalti</p>
              <p className="text-xs text-gray-600">You will be redirected to Khalti to complete payment.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedPayment === "khalti" && khaltiPaymentIntentId && khaltiCompleted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">Payment completed!</p>
            <p className="text-xs text-green-600 mt-1">Click "Complete booking" below to confirm your reservation.</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedPayment === "khalti" && khaltiPaymentIntentId) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-4">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">Khalti payment initiated</p>
            <p className="text-xs text-green-600 mt-1">Click "Pay" below to complete your payment via Khalti.</p>
          </div>
        </div>
        <button
          disabled={paymentLoading}
          className="w-full py-3 rounded-xl bg-[#5C2D91] text-white font-semibold text-sm hover:bg-[#4a2375] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {paymentLoading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via Khalti</>}
        </button>
      </div>
    )
  }

  if (selectedPayment === "esewa" && !esewaPaymentIntentId && !esewaConfirmData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="space-y-3">
          {esewaLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 size={16} className="animate-spin text-[#60BB46]" />
              <span className="text-sm text-gray-500">Redirecting to eSewa...</span>
            </div>
          )}
          {esewaError && (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 mb-2">{esewaError}</p>
              <button
                onClick={onEsewaRetry}
                className="text-sm text-[#1A3C5E] font-semibold hover:underline cursor-pointer"
              >
                Tap to retry
              </button>
            </div>
          )}
          {!esewaLoading && !esewaError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Payment not completed</p>
                <p className="text-xs text-gray-600">Click the button below to retry your payment.</p>
              </div>
            </div>
          )}
          <button
            disabled={esewaLoading || paymentLoading}
            className="w-full py-3 rounded-xl bg-[#60BB46] text-white font-semibold text-sm hover:bg-[#4fa83a] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {esewaLoading ? <><Loader2 size={14} className="animate-spin" /> Redirecting...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via eSewa</>}
          </button>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Secure Payment via eSewa</p>
              <p className="text-xs text-gray-600">You will be redirected to eSewa to complete payment.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedPayment === "esewa" && esewaConfirmData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">eSewa payment confirmed</p>
            <p className="text-xs text-green-600 mt-1">Click "Complete booking" below to confirm your reservation.</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedPayment === "arrival") {
    return null
  }

  if (razorpayResponse || stripePaymentIntentId || khaltiPaymentIntentId || esewaConfirmData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">Payment completed!</p>
            <p className="text-xs text-green-600 mt-1">Click "Complete booking" below to confirm your reservation.</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
