import type { PaymentMethod } from '../types'

interface PaymentOption {
  key: PaymentMethod
  label: string
  sub: string
  logo: JSX.Element
}

interface PaymentMethodTabsProps {
  paymentOptions: PaymentOption[]
  selectedPayment: PaymentMethod | null
  onSelect: (key: PaymentMethod) => void
}

export function PaymentMethodTabs({ paymentOptions, selectedPayment, onSelect }: PaymentMethodTabsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Payment Method</h3>
      <div className="flex border-b border-gray-200 mb-6">
        {paymentOptions.map(({ key, label, logo }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              selectedPayment === key
                ? "border-[#1A3C5E] text-[#1A3C5E]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">{logo} {label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
