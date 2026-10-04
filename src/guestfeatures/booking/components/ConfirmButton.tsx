import { Loader2 } from 'lucide-react'
import type { PaymentMethod } from '../types'
import type { RazorpayPaymentResponse } from '../types'

interface ConfirmButtonProps {
  selectedPayment: PaymentMethod | null
  paymentLoading: boolean
  marketingOptIn: boolean
  razorpayResponse: RazorpayPaymentResponse | null
  stripePaymentIntentId: string | null
  khaltiPaymentIntentId: string | null
  esewaPaymentIntentId: string | null
  esewaConfirmData: string | null
  onSetMarketingOptIn: (value: boolean) => void
  onConfirm: () => void
}

export function ConfirmButton({
  selectedPayment,
  paymentLoading,
  marketingOptIn,
  razorpayResponse,
  stripePaymentIntentId,
  khaltiPaymentIntentId,
  esewaPaymentIntentId,
  esewaConfirmData,
  onSetMarketingOptIn,
  onConfirm,
}: ConfirmButtonProps) {
  const isArrival = selectedPayment === "arrival"

  const isDisabled = !selectedPayment || paymentLoading ||
    (selectedPayment === "razorpay" && !razorpayResponse) ||
    (selectedPayment === "stripe" && !stripePaymentIntentId) ||
    (selectedPayment === "khalti" && !khaltiPaymentIntentId) ||
    (selectedPayment === "esewa" && !esewaConfirmData)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <button
        disabled={isDisabled}
        onClick={onConfirm}
        className="w-full py-3.5 rounded-xl bg-[#1A3C5E] text-white font-semibold text-sm hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {paymentLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isArrival ? "Confirming booking..." : "Processing payment..."}
          </>
        ) : (
          isArrival ? "Confirm booking" : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Complete booking
            </>
          )
        )}
      </button>
      {paymentLoading || isArrival ? (
        <p className="text-center text-xs text-gray-400 mt-3">
          {paymentLoading ? "Please do not close this page" : "No payment required now"}
        </p>
      ) : null}
    </div>
  )
}
