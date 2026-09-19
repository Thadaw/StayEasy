import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Printer, FileText, X } from "lucide-react"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

interface BookingRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  base_rate: number
}

interface Booking {
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  guest_nationality: string
  ref_number: string
  status: string
  checkin_date: string
  checkout_date: string
  total_amount: number
  amount_paid: number
  amount_due: number
  rooms: BookingRoom[]
  payment_method?: string
}

export default function CheckoutReceiptPage() {
  const { id } = useParams()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()

  const { data: property } = useQuery({
    queryKey: ["property", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data } = await api.get(`/properties/${currentPropertyId}`)
        return data?.data || data
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: booking, isLoading } = useQuery({
    queryKey: ["checkout-receipt-booking", currentPropertyId, id],
    queryFn: async (): Promise<Booking | null> => {
      if (!currentPropertyId || !id) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/bookings/${id}/guest-folio`
        )
        const wrapped = result as { data?: Booking }
        return (wrapped?.data ?? result) as Booking
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!id,
  })

  useEffect(() => {
    if (booking) window.print()
  }, [booking])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    )
  }

  const nights = Math.max(1, Math.ceil(
    (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
  ))
  const totalBill = booking.total_amount || 0
  const advancePaid = booking.amount_paid || 0
  const checkoutPayment = booking.amount_due > 0 ? booking.amount_due : 0
  const roomNames = booking.rooms?.map((r) => r.room_name).join(", ") || "—"

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" id="receipt-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{property?.name || "StayEasy"}</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-500">#{booking.ref_number}</p>
              <p className="text-sm text-gray-500">{booking.checkout_date}</p>
            </div>
          </div>

          {/* Guest Info + Payment Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8 items-start">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Guest Name</span>
                <span className="text-sm font-semibold text-gray-900">{booking.guest_name || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-semibold text-gray-900">{booking.guest_email || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-semibold text-gray-900">{booking.guest_phone || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Nationality</span>
                <span className="text-sm font-semibold text-gray-900">{booking.guest_nationality || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Room</span>
                <span className="text-sm font-semibold text-gray-900">{roomNames}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Check-in</span>
                <span className="text-sm font-semibold text-gray-900">{booking.checkin_date}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Check-out</span>
                <span className="text-sm font-semibold text-gray-900">{booking.checkout_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Guests</span>
                <span className="text-sm font-semibold text-gray-900">—</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Payment Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Charges ({nights} nights, incl. tax)</span>
                <span className="font-semibold text-gray-900">{formatAmount(totalBill)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Bill</span>
                <span className="font-semibold text-gray-900">{formatAmount(totalBill)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Advance Paid</span>
                <span className="font-semibold text-gray-900">{formatAmount(advancePaid)}</span>
              </div>
              {checkoutPayment > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Checkout Payment</span>
                  <span className="font-semibold text-gray-900">{formatAmount(checkoutPayment)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className="font-semibold text-gray-900">{formatAmount(advancePaid + checkoutPayment)}</span>
              </div>
              <div className="flex justify-between bg-green-50 px-3 py-2 rounded-lg mt-1">
                <span className="font-bold text-green-700">Balance</span>
                <span className="font-bold text-green-700">{formatAmount(0)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Charges + Payment History */}
          <div className="grid grid-cols-2 gap-8 mb-8 items-start">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Charges</h4>
              <div className="space-y-2">
                {booking.rooms?.map((room, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-600">{room.room_name} ({nights} nights, incl. tax)</span>
                    <span className="font-semibold text-gray-900">{formatAmount(room.base_rate * nights)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{formatAmount(totalBill)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Payment History</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 text-center min-w-[70px]">
                    <p className="text-xs font-bold text-gray-900">{booking.checkin_date}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">Advance Payment · {booking.payment_method}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-green-600">+{formatAmount(advancePaid)}</span>
                </div>
                {checkoutPayment > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 text-center min-w-[70px]">
                      <p className="text-xs font-bold text-gray-900">{booking.checkout_date}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Checkout Payment · {booking.payment_method}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-green-600">+{formatAmount(checkoutPayment)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 mt-6 pt-4 text-center">
            <p className="font-bold text-gray-900 text-sm">Thank you for staying with us!</p>
            <p className="text-sm text-gray-500">We hope to see you again soon.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
