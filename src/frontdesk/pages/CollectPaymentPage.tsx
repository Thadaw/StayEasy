import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Banknote, CreditCard, Wallet, Globe } from "lucide-react"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

const MOCK_PAYMENT = {
  id: "2",
  guestName: "Sofia Rodriguez",
  initials: "SR",
  avatarColor: "bg-orange-100 text-orange-700",
  roomNumber: "305",
  roomType: "Deluxe Queen",
  bookingNumber: "#HH9Q8P",
  totalBill: 605,
  paidAdvance: 300,
  balanceDue: 305,
  advanceMethod: "cash",
}

type PaymentMethod = "cash" | "credit_card" | "debit_card" | "online"

export default function CollectPaymentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { formatAmount, currency } = usePropertyCurrency()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentAmount, setPaymentAmount] = useState(MOCK_PAYMENT.balanceDue.toString())
  const [transactionId, setTransactionId] = useState("")

  const guest = MOCK_PAYMENT

  const paymentMethods = [
    { id: "cash" as PaymentMethod, label: "Cash", icon: Banknote, color: "text-green-600" },
    { id: "credit_card" as PaymentMethod, label: "Credit Card", icon: CreditCard, color: "text-blue-600" },
    { id: "debit_card" as PaymentMethod, label: "Debit Card", icon: Wallet, color: "text-purple-600" },
    { id: "online" as PaymentMethod, label: "Online Payment", icon: Globe, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/frontdesk/checkout/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Collect Payment</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
            Balance Due <span className="text-red-800">{formatAmount(guest.balanceDue)}</span>
          </div>
        </div>

        {/* Guest Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${guest.avatarColor}`}>
              {guest.initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{guest.guestName}</h2>
              <p className="text-sm text-gray-500">Room {guest.roomNumber} · {guest.roomType}</p>
              <p className="text-sm text-gray-500">Booking {guest.bookingNumber}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Bill</span>
              <span className="font-semibold text-gray-900">{formatAmount(guest.totalBill)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Paid (Advance via {guest.advanceMethod === "cash" ? "Cash" : "Card"})</span>
              <span className="font-semibold text-gray-900">-{formatAmount(guest.paidAdvance)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-semibold text-red-600">Balance Due</span>
              <span className="text-2xl font-bold text-red-600">{formatAmount(guest.balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Choose Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === method.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <method.icon size={20} className={paymentMethod === method.id ? "text-blue-600" : method.color} />
                <span className={`text-xs font-medium ${paymentMethod === method.id ? "text-blue-600" : "text-gray-700"}`}>
                  {method.label}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  min="0"
                  max={guest.balanceDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                />
              </div>
            </div>

            {paymentMethod !== "cash" && (
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(`/frontdesk/checkout/${id}`)}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate(`/frontdesk/checkout/${id}`)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  )
}
