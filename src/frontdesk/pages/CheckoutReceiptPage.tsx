import { useEffect } from "react"
import { Printer, FileText, X } from "lucide-react"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

const MOCK_RECEIPT = {
  guestName: "Sofia Rodriguez",
  roomNumber: "305",
  roomType: "Deluxe Queen",
  bookingNumber: "#HH9Q8P",
  checkIn: "Aug 3, 2026",
  checkOut: "Aug 6, 2026",
  guests: 2,
  totalBill: 605,
  advancePaid: 300,
  checkoutPayment: 305,
  tax: 50,
  charges: [
    { description: "Deluxe Queen", qty: "3 nights", amount: 450 },
    { description: "Breakfast", qty: "2", amount: 40 },
    { description: "Laundry", qty: "1", amount: 25 },
    { description: "Minibar", qty: "1", amount: 35 },
  ],
  payments: [
    { date: "Aug 03, 2026", type: "Advance Payment", method: "Cash", amount: 300 },
    { date: "Aug 06, 2026", type: "Checkout Payment", method: "Khalti", amount: 305 },
  ],
}

export default function CheckoutReceiptPage() {
  const receipt = MOCK_RECEIPT
  const { formatAmount } = usePropertyCurrency()

  useEffect(() => {
    window.print()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Screen-only buttons */}
      <div className="print:hidden flex justify-center gap-3 py-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Printer size={16} />
          Print Receipt
        </button>
        <button
          onClick={() => window.close()}
          className="px-3 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Receipt Content */}
      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" id="receipt-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StayEasy</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-500">#INV-2026-00821</p>
              <p className="text-sm text-gray-500">Aug 6, 2026 · 10:42 AM</p>
            </div>
          </div>

          {/* Guest Info + Payment Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Guest Name</span>
                <span className="text-sm font-semibold text-gray-900">{receipt.guestName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Room</span>
                <span className="text-sm font-semibold text-gray-900">{receipt.roomNumber} · {receipt.roomType}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Check-in</span>
                <span className="text-sm font-semibold text-gray-900">{receipt.checkIn}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Check-out</span>
                <span className="text-sm font-semibold text-gray-900">{receipt.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Guests</span>
                <span className="text-sm font-semibold text-gray-900">{receipt.guests}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bill</span>
                  <span className="font-semibold text-gray-900">${formatAmount(receipt.totalBill)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Advance Paid</span>
                  <span className="font-semibold text-gray-900">${formatAmount(receipt.advancePaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Checkout Payment</span>
                  <span className="font-semibold text-gray-900">${formatAmount(receipt.checkoutPayment)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                  <span className="font-semibold text-gray-900">Total Paid</span>
                  <span className="font-semibold text-gray-900">${formatAmount(receipt.totalBill)}</span>
                </div>
                <div className="flex justify-between bg-green-50 px-3 py-2 rounded-lg mt-2">
                  <span className="font-bold text-green-700">Balance</span>
                  <span className="font-bold text-green-700">{formatAmount(0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Charges + Payment History */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Charges</h4>
              <div className="space-y-2">
                {receipt.charges.map((charge, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-600">{charge.description} ({charge.qty})</span>
                    <span className="font-semibold text-gray-900">${formatAmount(charge.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${formatAmount(receipt.tax)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${formatAmount(receipt.totalBill)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Payment History</h4>
              <div className="space-y-3">
                {receipt.payments.map((payment, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-900">{payment.date.split(" ")[0]}</p>
                      <p className="text-xs text-gray-500">{payment.date.split(" ")[1]?.replace(",", "")}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{payment.type} · {payment.method}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+${formatAmount(payment.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 mt-6 pt-4">
                <p className="font-bold text-gray-900 text-sm">Thank you for staying with us!</p>
                <p className="text-sm text-gray-500">We hope to see you again soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
