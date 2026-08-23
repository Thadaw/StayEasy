import { FileText, Banknote } from "lucide-react"
import { DetailField } from "../../../shared/components/DetailField"
import { Card, SectionHeader } from "../../../shared/ui"

interface BookingPaymentSummaryProps {
  currency: string
  basePrice: number
  taxAmount: number
  specialOfferDiscount: number
  couponDiscount: number
  couponCode?: string | null
  totalAmount: number
  paymentGateway?: string
  refNumber: string
}

export function BookingPaymentSummary({
  currency,
  basePrice,
  taxAmount,
  specialOfferDiscount,
  couponDiscount,
  couponCode,
  totalAmount,
  paymentGateway,
  refNumber,
}: BookingPaymentSummaryProps) {
  return (
    <>
    <Card>
      <SectionHeader icon={<FileText size={16} />} title="Payment Summary" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Room Price</span>
          <span className="text-sm font-semibold text-gray-900">{currency} {basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Taxes & Fees</span>
          <span className="text-sm font-semibold text-gray-900">{currency} {Math.abs(taxAmount).toLocaleString()}</span>
        </div>
        {specialOfferDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-sm">Special Offer Discount</span>
            <span className="text-sm font-semibold">- {currency} {specialOfferDiscount.toLocaleString()}</span>
          </div>
        )}
        {couponDiscount > 0 && couponCode && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-sm">Coupon ({couponCode})</span>
            <span className="text-sm font-semibold">- {currency} {couponDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">Total Paid</span>
          <span className="text-lg font-bold text-gray-900">{currency} {totalAmount.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <DetailField label="Payment Method" value={paymentGateway === "arrival" ? "Pay at Arrival" : paymentGateway || "—"} />
          <DetailField label="Transaction ID" value={paymentGateway === "arrival" ? "N/A (Pay at Arrival)" : `pay_${refNumber.slice(0, 12)}`} mono={paymentGateway !== "arrival"} />
        </div>
      </div>
    </Card>

    {paymentGateway === "arrival" && (
      <Card>
        <SectionHeader icon={<Banknote size={16} />} title="Pay at Arrival" />
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Banknote size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700 mb-1">Pay at Arrival</p>
            <p className="text-xs text-amber-600 leading-relaxed">You will pay {currency} {totalAmount.toLocaleString()} at the property during check-in. No online payment is required.</p>
          </div>
        </div>
      </Card>
    )}
    </>
  )
}
