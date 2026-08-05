import { FileText } from "lucide-react"
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
          <DetailField label="Payment Method" value={paymentGateway || "—"} />
          <DetailField label="Transaction ID" value={`pay_${refNumber.slice(0, 12)}`} mono />
        </div>
      </div>
    </Card>
  )
}
