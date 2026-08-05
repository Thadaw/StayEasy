interface RoomLine {
  room: {
    id: string
    name: string
    price: number
  }
  qty: number
  gc: number
  ep: number
  lineTotal: number
}

interface PriceSummaryCardProps {
  roomLines: RoomLine[]
  nights: number
  currency: string
  subtotal: number
  discountAmount: number
  total: number
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

export function PriceSummaryCard({
  roomLines,
  nights,
  currency,
  subtotal,
  discountAmount,
  total,
  appliedDiscount,
  promoInput,
  promoError,
  onPromoInputChange,
  onApplyPromo,
  onRemovePromo,
  onKeyDown,
}: PriceSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Your price summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Original price</span>
          <span className="text-sm text-gray-900">{currency}{subtotal.toFixed(2)}</span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#d4111e] font-medium">Bonus savings</span>
            <span className="text-sm text-[#d4111e] font-medium">-{currency}{discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {appliedDiscount && (
        <p className="text-xs text-gray-500 italic mt-2">
          You're getting a reduced rate because this property is offering a discount.
        </p>
      )}

      <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
        {roomLines.map((l, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{l.room.name} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span className="text-gray-900">{currency}{(l.lineTotal * nights).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Discount code</p>
        {appliedDiscount ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-700">{appliedDiscount.code}</span>
              <span className="text-xs text-green-600">
                {appliedDiscount.type === 'percentage' ? `${appliedDiscount.amount}% off` : `${currency}${appliedDiscount.amount} off`}
              </span>
            </div>
            <button onClick={onRemovePromo} className="text-green-600 hover:text-green-800 cursor-pointer">
              ×
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={e => onPromoInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter code"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0071c2] transition-colors"
            />
            <button
              onClick={onApplyPromo}
              className="px-4 py-2 rounded-lg border-2 border-[#0071c2] text-[#0071c2] text-sm font-semibold hover:bg-[#0071c2] hover:text-white transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}
        {promoError && (
          <p className="text-xs text-red-500 mt-1">{promoError}</p>
        )}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        {appliedDiscount && (
          <p className="text-sm text-[#d4111e] line-through mb-1">{currency}{subtotal.toFixed(2)}</p>
        )}
        <p className="text-xl font-bold text-gray-900">Total {currency}{Math.max(0, total).toFixed(2)}</p>
        <p className="text-xs text-gray-500">Taxes & fees included</p>
      </div>
    </div>
  )
}
