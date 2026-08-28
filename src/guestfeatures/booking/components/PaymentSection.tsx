import { useMemo, type KeyboardEvent } from "react"
import {
  Banknote,
  CalendarClock,
  Check,
  CircleHelp,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Tag,
  WalletCards,
  X,
} from "lucide-react"
import type { PaymentMethod } from "../types"
import stripeLogo from "../../../assets/Stripe_Logo_2.webp"
import razorpayLogo from "../../../assets/Razorpay_logo.png"
import khaltiLogo from "../../../assets/Khalti_Official_idvPMBBXpx_0.jpeg"
import esewaLogo from "../../../assets/Esewa_Green.png"

export type PaymentPlan = "advance" | "full" | "arrival"

interface PaymentSectionProps {
  total: number
  currency: string
  advancePercentage: number
  advanceAmount?: number | null
  allowAdvance?: boolean
  selectedPayment: PaymentMethod | null
  onSelectPayment: (method: PaymentMethod) => void
  paymentPlan: PaymentPlan
  onSelectPlan: (plan: PaymentPlan) => void
  appliedDiscount?: {
    code: string
    type: 'percentage' | 'fixed'
    amount: number
  } | null
  promoInput: string
  promoError: string
  onPromoInputChange: (value: string) => void
  onApplyPromo: () => void
  onRemovePromo: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

interface PaymentOption {
  key: Exclude<PaymentMethod, "arrival">
  label: string
  description: string
  logo: string
  color: string
}

const paymentOptions: PaymentOption[] = [
  {
    key: "stripe",
    label: "Stripe",
    description: "Credit / Debit Card",
    logo: stripeLogo,
    color: "#635bff",
  },
  {
    key: "razorpay",
    label: "Razorpay",
    description: "UPI, Card, Net Banking",
    logo: razorpayLogo,
    color: "#0ea5e9",
  },
  {
    key: "khalti",
    label: "Khalti",
    description: "Wallet, Cards, Net Banking",
    logo: khaltiLogo,
    color: "#5b21b6",
  },
  {
    key: "esewa",
    label: "eSewa",
    description: "eSewa Wallet",
    logo: esewaLogo,
    color: "#16a34a",
  },
]

const paymentPlanLabels: Record<
  PaymentPlan,
  { title: string; description: string }
> = {
  advance: {
    title: "Pay advance",
    description: "Secure your room with a smaller payment today.",
  },
  full: {
    title: "Pay in full today",
    description: "Complete the entire booking payment now.",
  },
  arrival: {
    title: "Pay at arrival",
    description: "Pay the full amount when you check in.",
  },
}

function formatMoney(value: number, currency: string) {
  const amount = Math.max(0, Number(value) || 0)
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

function roundAmount(value: number) {
  return Math.round((Math.max(0, value) + Number.EPSILON) * 100) / 100
}

export default function PaymentSection({
  total,
  currency,
  advancePercentage,
  advanceAmount: backendAdvanceAmount,
  allowAdvance = true,
  selectedPayment,
  onSelectPayment,
  paymentPlan,
  onSelectPlan,
  appliedDiscount,
  promoInput,
  promoError,
  onPromoInputChange,
  onApplyPromo,
  onRemovePromo,
  onKeyDown,
}: PaymentSectionProps) {
  const safeTotal = Math.max(0, Number(total) || 0)
  const safeAdvancePercentage = Math.min(100, Math.max(1, Number(advancePercentage) || 30))

  const advanceAmount = useMemo(() => {
    if (backendAdvanceAmount != null && backendAdvanceAmount > 0) return roundAmount(backendAdvanceAmount)
    return roundAmount((safeTotal * safeAdvancePercentage) / 100)
  }, [backendAdvanceAmount, safeTotal, safeAdvancePercentage])

  const amountDueToday = useMemo(() => {
    if (paymentPlan === "full") return safeTotal
    if (paymentPlan === "advance") return advanceAmount
    return 0
  }, [paymentPlan, safeTotal, advanceAmount])

  const balanceDueAtArrival = useMemo(
    () => roundAmount(safeTotal - amountDueToday),
    [safeTotal, amountDueToday],
  )

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0
    if (appliedDiscount.type === "percentage") return roundAmount((safeTotal * appliedDiscount.amount) / 100)
    return roundAmount(appliedDiscount.amount)
  }, [appliedDiscount, safeTotal])

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    callback: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      callback()
    }
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 p-5 sm:p-[25px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Secure payment
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Choose how to pay
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Choose a payment plan, then select your preferred payment method.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-xl bg-white p-3 text-slate-400 shadow-sm sm:block">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div
          className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3"
          role="radiogroup"
          aria-label="Payment plan"
        >
          {(Object.keys(paymentPlanLabels) as PaymentPlan[]).filter(plan => allowAdvance || plan !== "advance").map((plan) => {
            const isSelected = paymentPlan === plan
            const planAmount = plan === "full"
              ? safeTotal
              : plan === "advance"
                ? advanceAmount
                : 0

            return (
              <button
                key={plan}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectPlan(plan)}
                onKeyDown={(event) =>
                  handleKeyDown(event, () => onSelectPlan(plan))
                }
                className={`relative rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-[0_0_0_2px_rgba(37,99,235,0.12)]"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {plan === "advance" && <WalletCards className="h-5 w-5" aria-hidden="true" />}
                    {plan === "full" && <CreditCard className="h-5 w-5" aria-hidden="true" />}
                    {plan === "arrival" && <CalendarClock className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                  </span>
                </div>
                <span className="mt-3 block text-sm font-bold text-slate-900">
                  {paymentPlanLabels[plan].title}
                </span>
                <span className="mt-1 block min-h-10 text-xs leading-5 text-slate-500">
                  {paymentPlanLabels[plan].description}
                </span>
                <span className="mt-2 block text-sm font-extrabold text-slate-900">
                  {formatMoney(planAmount, currency)} today
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-0 rounded-xl border border-blue-100 bg-white p-4 sm:grid-cols-3 sm:gap-0">
          <div className="sm:border-r sm:border-slate-100 sm:pr-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Booking total
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatMoney(safeTotal, currency)}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-3 sm:border-r sm:border-t-0 sm:px-4 sm:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
              Pay today
            </p>
            <p className="mt-1 text-base font-extrabold text-blue-700">
              {formatMoney(amountDueToday, currency)}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-3 sm:border-t-0 sm:pl-4 sm:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Due at check-in
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatMoney(balanceDueAtArrival, currency)}
            </p>
          </div>
        </div>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Tag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Have a discount code?
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Apply your promo code before completing payment.
              </p>
            </div>
          </div>

          {appliedDiscount ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-emerald-800">
                      {appliedDiscount.code}
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {appliedDiscount.type === "percentage"
                        ? `${appliedDiscount.amount}% discount applied`
                        : `${formatMoney(appliedDiscount.amount, currency)} discount applied`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRemovePromo}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Remove
                </button>
              </div>

              <div className="mt-4 border-t border-emerald-200 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700">Original total</span>
                  <span className="text-emerald-800 line-through">
                    {formatMoney(safeTotal, currency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm font-extrabold">
                  <span className="text-emerald-800">Discounted total</span>
                  <span className="text-emerald-900">
                    {formatMoney(safeTotal - discountAmount, currency)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>You save</span>
                  <span>{formatMoney(discountAmount, currency)}</span>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onApplyPromo()
              }}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="text"
                value={promoInput}
                onChange={(event) => onPromoInputChange(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Enter promo code"
                aria-label="Discount code"
                autoComplete="off"
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold uppercase tracking-wide text-slate-800 outline-none transition placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!promoInput.trim()}
                className="min-h-11 rounded-xl border border-blue-600 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply code
              </button>
            </form>
          )}

          {promoError && (
            <p className="mt-3 text-xs font-semibold text-red-600" role="alert">
              {promoError}
            </p>
          )}
        </section>

        {paymentPlan === "advance" && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p>
              Your room is secured after the advance payment. The remaining{" "}
              <strong>{formatMoney(balanceDueAtArrival, currency)}</strong> is payable
              directly at the property during check-in.
            </p>
          </div>
        )}
      </div>

      <div className="p-[21px_25px_25px]">
        {paymentPlan === "arrival" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Banknote className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  No payment is required today
                </h3>
                <p className="mt-1 text-xs leading-5 text-emerald-800">
                  Pay the full {formatMoney(safeTotal, currency)} at the property when
                  you check in. Your reservation will be confirmed without an online
                  charge.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select payment method
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {paymentPlan === "advance"
                    ? `Choose how to pay your ${safeAdvancePercentage}% advance.`
                    : "Choose how you would like to complete your payment."}
                </p>
              </div>
              <div className="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-400 sm:flex">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Encrypted checkout
              </div>
            </div>

        <div
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Payment method"
        >
              {paymentOptions.map((option) => {
                const isSelected = selectedPayment === option.key

                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectPayment(option.key)}
                    onKeyDown={(event) =>
                      handleKeyDown(event, () => onSelectPayment(option.key))
                    }
                    className={`flex min-h-20 items-center gap-3 rounded-xl border p-3.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <img
                      src={option.logo}
                      alt={option.label}
                      className="h-8 w-auto max-w-12 object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                        {option.description}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {paymentPlan === "arrival" && (
          <div className="mt-4 space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Pay at Arrival</p>
                <p className="text-xs text-green-600 leading-relaxed">
                  You will pay {formatMoney(safeTotal, currency)} when you check in at the property. No online payment required now.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0 mt-0.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">How it works</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Complete your booking now and pay the full amount ({formatMoney(safeTotal, currency)}) directly at the property during check-in.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
