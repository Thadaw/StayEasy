import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2, User, Lock, Eye, EyeOff, Check } from 'lucide-react'

export default function EsewaMockPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [esewaId, setEsewaId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [robotChecked, setRobotChecked] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const refNumber = searchParams.get('ref') || ''
  const amount = searchParams.get('amount') || '0'
  const currency = searchParams.get('currency') || 'NPR'
  const returnTo = localStorage.getItem('esewa_return_to') || `/reserve?ref=${refNumber}`

  const handlePay = () => {
    if (!esewaId || !password || !robotChecked) return
    setProcessing(true)
    const oid = `ESW${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const refId = `REF${Date.now()}`

    setTimeout(() => {
      setProcessing(false)
      setPaymentSuccess(true)

      setTimeout(() => {
        const url = new URL(returnTo, window.location.origin)
        url.searchParams.set('oid', oid)
        url.searchParams.set('refId', refId)
        url.searchParams.set('amt', amount)
        url.searchParams.set('status', 'Completed')
        localStorage.removeItem('esewa_return_to')
        localStorage.removeItem('esewa_payment_intent_id')
        window.location.replace(`${url.pathname}${url.search}`)
      }, 3000)
    }, 1500)
  }

  const handleCancel = () => {
    localStorage.removeItem('esewa_return_to')
    localStorage.removeItem('esewa_payment_intent_id')
    navigate(`/reserve?ref=${refNumber}`, { replace: true })
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-white font-jakarta flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/logos/Esewa_Green.png" alt="eSewa" className="h-10 object-contain mx-auto" />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-900 text-lg font-bold mb-6">Payment Success</p>

            <div className="w-20 h-20 rounded-full bg-[#a8d86e] mx-auto flex items-center justify-center mb-6">
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>

            <p className="text-gray-900 font-bold text-base mb-2">Payment Success !</p>
            <p className="text-gray-500 text-sm mb-6">Your payment process has been completed successfully.</p>

            <div className="bg-gray-100 rounded-xl py-4 px-6 mb-2">
              <p className="text-[#60BB46] text-xl font-bold">{currency}. {Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="h-1 bg-gray-200 rounded-full mx-8 mb-6 overflow-hidden">
              <div className="h-full bg-[#60BB46] rounded-full animate-[shrink_3s_linear]" style={{ width: '60%' }} />
            </div>
          </div>

          <p className="text-[#e6a817] text-sm text-center mt-6 leading-relaxed">
            Your payment success. Please wait while we redirect back to vendor.
          </p>

          <p className="text-gray-500 text-xs text-center mt-4">Thank you!!!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-jakarta">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logos/Esewa_Green.png" alt="eSewa" className="h-8 object-contain" />
            <span className="text-[#60BB46] font-bold text-lg">eSewa</span>
          </div>
          <span className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">English ▾</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Left: Merchant & Amount */}
            <div className="w-full md:w-[45%] p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logos/Esewa_Green.png" alt="eSewa" className="w-10 h-10 object-contain" />
                <span className="text-sm font-semibold text-gray-800">ServeIQ</span>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-[#60BB46]">{currency}. {Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm text-gray-700 py-2 border-b border-gray-100">
                  <span>Product Amount</span>
                  <span>{Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 py-2">
                  <span>Total Amount</span>
                  <span>{Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Right: Login form */}
            <div className="w-full md:w-[55%] p-8">
              <h2 className="text-sm font-semibold text-gray-800 mb-5">Sign in to your account</h2>

              {/* eSewa ID */}
              <div className="mb-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={esewaId}
                    onChange={(e) => setEsewaId(e.target.value)}
                    placeholder="eSewa ID"
                    className="w-full pl-10 pr-3 py-2.5 rounded border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#60BB46] focus:ring-1 focus:ring-[#60BB46] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password/MPIN"
                    className="w-full pl-10 pr-10 py-2.5 rounded border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#60BB46] focus:ring-1 focus:ring-[#60BB46] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="mb-5">
                <div className="flex items-center gap-3 border border-gray-300 rounded px-3 py-2.5 bg-gray-50">
                  <input
                    type="checkbox"
                    checked={robotChecked}
                    onChange={(e) => setRobotChecked(e.target.checked)}
                    className="w-5 h-5 accent-[#60BB46] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">I'm not a robot</span>
                  <div className="ml-auto flex flex-col items-center">
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8" />
                    <span className="text-[8px] text-gray-400">reCAPTCHA</span>
                    <span className="text-[7px] text-gray-400">Privacy - Terms</span>
                  </div>
                </div>
              </div>

              {/* Login button */}
              <button
                onClick={handlePay}
                disabled={processing || !esewaId || !password || !robotChecked}
                className="w-full py-3 rounded bg-[#60BB46] text-white font-bold text-sm tracking-wide hover:bg-[#4fa83a] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'LOGIN'
                )}
              </button>

              {/* Forgot password */}
              <div className="text-center mt-4">
                <span className="text-sm text-[#60BB46] cursor-pointer hover:underline">Forgot Password?</span>
              </div>

              {/* Register */}
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500">Don't have an account? </span>
                <span className="text-xs text-[#60BB46] font-semibold cursor-pointer hover:underline">Register</span>
              </div>
            </div>
          </div>

          {/* Cancel payment */}
          <div className="border-t border-gray-200 py-4 text-center">
            <button
              onClick={handleCancel}
              disabled={processing}
              className="text-sm text-gray-500 hover:text-gray-700 tracking-wide cursor-pointer disabled:opacity-50"
            >
              CANCEL PAYMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
