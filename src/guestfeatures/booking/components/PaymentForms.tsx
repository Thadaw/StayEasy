import { Loader2, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck } from 'lucide-react'
import StripeCardForm from '../../../shared/components/StripeCardForm'
import type { RazorpayPaymentResponse, RazorpayPayOptions } from '../types'
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
  stripeClientSecret: string | null
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
  esewaLoading: boolean
  esewaError: string | null
  paySubMethod: 'upi' | 'card' | 'netbanking' | null
  onSetPaySubMethod: (method: 'upi' | 'card' | 'netbanking' | null) => void
  onStripeSuccess: (id: string, secret: string, createdAt: number) => void
  onStripeRetry: () => void
  onRazorpayPay: (options: RazorpayPayOptions) => void
  onRazorpayRetry: () => void
  onSetKhaltiError: (error: string | null) => void
  onSetKhaltiLoading: (loading: boolean) => void
  onKhaltiRetry: () => void
  onEsewaRetry: () => void
}

export function PaymentForms({
  selectedPayment,
  total,
  currency,
  refNumber,
  guestName,
  guestEmail,
  guestPhone,
  paymentLoading,
  stripePaymentIntentId,
  stripeClientSecret,
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
  esewaLoading,
  esewaError,
  paySubMethod,
  onSetPaySubMethod,
  onStripeSuccess,
  onStripeRetry,
  onRazorpayPay,
  onRazorpayRetry,
  onSetKhaltiError,
  onKhaltiRetry,
  onEsewaRetry,
}: PaymentFormsProps) {
  if (selectedPayment === "stripe" && !stripePaymentIntentId) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <StripeCardForm
          refNumber={refNumber}
          amount={total}
          currency={currency}
          guestName={guestName}
          guestEmail={guestEmail}
          guestPhone={guestPhone}
          clientSecret={stripeClientSecret}
          intentLoading={stripeIntentLoading}
          intentError={stripeIntentError}
          onRetry={onStripeRetry}
          onSuccess={onStripeSuccess}
        />
      </div>
    )
  }

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
                onClick={onRazorpayRetry}
                className="text-sm text-[#1A3C5E] font-semibold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!razorpayOrderLoading && !razorpayOrderError && razorpayOrderId && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onSetPaySubMethod(paySubMethod === 'upi' ? null : 'upi')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paySubMethod === 'upi'
                    ? 'border-[#1A3C5E] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paySubMethod === 'upi' ? 'bg-[#1A3C5E] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Smartphone size={18} />
                </div>
                <span className="text-xs font-semibold text-gray-900">UPI</span>
                <span className="text-[10px] text-gray-500">GPay, PhonePe, etc.</span>
              </button>

              <button
                onClick={() => onSetPaySubMethod(paySubMethod === 'card' ? null : 'card')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paySubMethod === 'card'
                    ? 'border-[#1A3C5E] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paySubMethod === 'card' ? 'bg-[#1A3C5E] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <CreditCard size={18} />
                </div>
                <span className="text-xs font-semibold text-gray-900">Card</span>
                <span className="text-[10px] text-gray-500">Debit / Credit</span>
              </button>

              <button
                onClick={() => onSetPaySubMethod(paySubMethod === 'netbanking' ? null : 'netbanking')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paySubMethod === 'netbanking'
                    ? 'border-[#1A3C5E] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paySubMethod === 'netbanking' ? 'bg-[#1A3C5E] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Building2 size={18} />
                </div>
                <span className="text-xs font-semibold text-gray-900">Net Banking</span>
                <span className="text-[10px] text-gray-500">All major banks</span>
              </button>
            </div>
          )}

          {paySubMethod === 'upi' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">Select your UPI app</label>
              <p className="text-[11px] text-gray-400">
                You'll be redirected to your UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) to approve the payment.
              </p>
              <button
                disabled={paymentLoading || !razorpayOrderId}
                onClick={() => onRazorpayPay({ type: 'upi' })}
                className="w-full py-2.5 rounded-lg bg-[#1A3C5E] text-white text-sm font-semibold hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via UPI</>}
              </button>
            </div>
          )}

          {paySubMethod === 'card' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-600">You'll be redirected to Razorpay's secure card checkout.</p>
              <div className="flex items-center gap-2">
                {['Visa', 'Mastercard', 'RuPay', 'Amex'].map(b => (
                  <span key={b} className="text-[10px] font-medium bg-white border border-gray-200 rounded px-2 py-1 text-gray-600">{b}</span>
                ))}
              </div>
              <button
                disabled={paymentLoading || !razorpayOrderId}
                onClick={() => onRazorpayPay({ type: 'card' })}
                className="w-full py-2.5 rounded-lg bg-[#1A3C5E] text-white text-sm font-semibold hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via Card</>}
              </button>
            </div>
          )}

          {paySubMethod === 'netbanking' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">Select your bank in the secure checkout</label>
              <p className="text-[11px] text-gray-400">
                You'll be redirected to your bank's net banking page to complete the payment.
              </p>
              <button
                disabled={paymentLoading || !razorpayOrderId}
                onClick={() => onRazorpayPay({ type: 'netbanking' })}
                className="w-full py-2.5 rounded-lg bg-[#1A3C5E] text-white text-sm font-semibold hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Pay {currency}{Math.max(0, total).toFixed(2)} via Net Banking</>}
              </button>
            </div>
          )}

          {!paySubMethod && !razorpayResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Secure Payment via Razorpay</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Select a payment method above to proceed. All transactions are encrypted and PCI-compliant.
                </p>
              </div>
            </div>
          )}

          {!razorpayLoaded && (
            <p className="text-xs text-gray-400 text-center">Loading Razorpay...</p>
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
            <div className="flex items-center justify-center gap-2 py-4">
              <ShieldCheck size={16} className="text-[#5C2D91]" />
              <span className="text-sm text-gray-600">Tap the Khalti tab to pay</span>
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

  if (selectedPayment === "esewa" && !esewaPaymentIntentId) {
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
            <div className="flex items-center justify-center gap-2 py-4">
              <ShieldCheck size={16} className="text-[#60BB46]" />
              <span className="text-sm text-gray-600">Tap the eSewa tab to pay</span>
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

  if (selectedPayment === "esewa" && esewaPaymentIntentId) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-4">
          <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">eSewa payment initiated</p>
            <p className="text-xs text-green-600 mt-1">Click "Complete booking" below to confirm your reservation.</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedPayment === "arrival") {
    return null
  }

  if (razorpayResponse || stripePaymentIntentId || khaltiPaymentIntentId || esewaPaymentIntentId) {
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
