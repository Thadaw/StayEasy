import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CreditCard, ChevronDown, CheckCircle, FileText, X, Loader2, Wallet } from "lucide-react"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { checkOutGuest } from "../../services/pmsApi"
import api from "../../services/axios"

interface BookingRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  base_rate: number
}

interface BookingFolio {
  folio_id: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  charges_count: number
  settled_at: string | null
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
  folio: BookingFolio | null
  payment_method?: string
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function getNights(booking: Booking): number {
  const checkin = new Date(booking.checkin_date)
  const checkout = new Date(booking.checkout_date)
  return Math.max(1, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const { checkOut, isCheckedOut: isGuestCheckedOut } = useBookingCheckOutStore()
  const queryClient = useQueryClient()

  const [roomStatus, setRoomStatus] = useState("needs_cleaning")
  const [isCheckedOut, setIsCheckedOut] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [folioError, setFolioError] = useState<string | null>(null)
  const [paymentGateway, setPaymentGateway] = useState("CASH")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [discount, setDiscount] = useState("")

  const { data: booking, isLoading } = useQuery({
    queryKey: ["checkout-booking", id],
    queryFn: async (): Promise<Booking | null> => {
      if (!id) return null
      try {
        const { data: result } = await api.get(`/bookings/${id}`)
        const wrapped = result as { data?: Booking }
        return (wrapped?.data ?? result) as Booking
      } catch {
        return null
      }
    },
    enabled: !!id,
  })

  const refNumber = booking?.ref_number
  const bookingId = booking?.booking_id

  const { data: guestFolio } = useQuery({
    queryKey: ["guest-folio", currentPropertyId, refNumber],
    queryFn: async () => {
      if (!currentPropertyId || !refNumber || !bookingId) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/bookings/${bookingId}/guest-folio`
        )
        const wrapped = result as { data?: { folio?: { folio_id: string; status: string; subtotal: number; tax: number; discount: number; total: number; charges_count: number; settled_at: string | null } } }
        const folio = wrapped?.data?.folio
        if (!folio) return null

        let charges: Array<{ id: string; description: string; amount: number; category: string; posted_by_name: string; posted_at: string }> = []
        let folioTotal = folio.total || 0
        let folioSubtotal = folio.subtotal || 0
        let folioTax = folio.tax || 0
        let folioDiscount = folio.discount || 0

        if (folio.folio_id) {
          try {
            const { data: folioResult } = await api.get(`/staff/folios/${folio.folio_id}`)
            const folioData = folioResult as {
              data?: {
                charges?: Array<{ id: string; description: string; amount: string; category: string; posted_by_name: string; posted_at: string }>
                subtotal?: string
                tax?: string
                discount?: string
                total?: string
              }
            }
            if (folioData?.data) {
              charges = (folioData.data.charges || []).map((c) => ({
                ...c,
                amount: Number(c.amount) || 0,
              }))
              folioSubtotal = Number(folioData.data.subtotal) || folioSubtotal
              folioTax = Number(folioData.data.tax) || folioTax
              folioDiscount = Number(folioData.data.discount) || folioDiscount
              folioTotal = Number(folioData.data.total) || folioTotal
            }
          } catch {
            charges = []
          }
        }

        return { ...folio, charges, subtotal: folioSubtotal, tax: folioTax, discount: folioDiscount, total: folioTotal }
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!refNumber && !!bookingId,
  })
  const alreadyCheckedOut = isGuestCheckedOut(id || "")

  const checkOutMutation = useMutation({
    mutationFn: async ({ refNumber, paymentAmount, paymentGateway, discount }: { refNumber: string; paymentAmount: number; paymentGateway: string; discount: number }) => {
      await checkOutGuest(refNumber)
      return { refNumber, paymentAmount, paymentGateway, discount }
    },
    onSuccess: async (_data, { refNumber, paymentAmount, paymentGateway, discount }) => {
      queryClient.invalidateQueries({ queryKey: ["checkout-booking", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["checkout-bookings", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })

      if (currentPropertyId && refNumber && paymentAmount > 0) {
        try {
          await api.post(
            `/staff/properties/${currentPropertyId}/bookings/${refNumber}/folio`,
            {
              tax: "0.00",
              discount: String(discount || "0.00"),
              payment_amount: String(paymentAmount),
              payment_method: paymentGateway || "CASH",
              idempotency_key: crypto.randomUUID(),
            }
          )
          queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } }
          const msg = err.response?.data?.message || "Failed to create folio after checkout."
          setFolioError(msg)
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      }
    },
  })

  useEffect(() => {
    if (isCheckedOut || alreadyCheckedOut) {
      setShowToast(true)
      const timer = setTimeout(() => {
        navigate("/frontdesk/check-out")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCheckedOut, alreadyCheckedOut, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Booking not found</p>
        <button onClick={() => navigate("/frontdesk")} className="text-blue-600 hover:text-blue-700 font-medium">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const nights = getNights(booking)
  const totalBill = booking.total_amount || 0
  const advancePaid = booking.amount_paid || 0
  const additionalChargesTotal = guestFolio?.subtotal || 0
  const additionalChargesTax = guestFolio?.tax || 0
  const additionalChargesDiscount = guestFolio?.discount || 0
  const grandTotal = totalBill + additionalChargesTotal + additionalChargesTax - additionalChargesDiscount
  const remainingBalance = booking.amount_due || 0

  const guest = {
    name: booking.guest_name || "—",
    initials: getInitials(booking.guest_name || "Guest"),
    email: booking.guest_email || "—",
    phone: booking.guest_phone || "—",
    nationality: booking.guest_nationality || "—",
    roomName: booking.rooms?.map((r) => r.room_name).join(", ") || "—",
    bookingNumber: booking.ref_number,
    checkIn: booking.checkin_date,
    checkOut: booking.checkout_date,
    stayDates: `${booking.checkin_date} – ${booking.checkout_date}`,
    nights,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-green-600 text-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm">
            <CheckCircle size={24} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">Checked Out Successfully</p>
              <p className="text-green-100 text-xs">Guest has been checked out. The room status has been updated.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-green-200 hover:text-white flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {folioError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-amber-500 text-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm">
            <FileText size={24} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">Folio Not Created</p>
              <p className="text-amber-100 text-xs">{folioError}</p>
            </div>
            <button onClick={() => setFolioError(null)} className="text-amber-200 hover:text-white flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate("/frontdesk")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Check Out Guest</h1>
          {grandTotal - advancePaid > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Balance Due <span className="text-red-800">{formatAmount(grandTotal - advancePaid)}</span>
            </div>
          )}
        </div>

        {/* Guest Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-orange-100 text-orange-700">
                {guest.initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{guest.name}</h2>
                <p className="text-sm text-gray-500">Room {guest.roomName}</p>
                <p className="text-sm text-gray-500">Booking #{guest.bookingNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Stay</p>
              <p className="text-sm font-semibold text-gray-900">{guest.stayDates}</p>
              <p className="text-sm text-gray-500">{guest.nights} Nights</p>
            </div>
          </div>
        </div>

        {/* Guest Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Guest Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Name</p>
              <p className="font-semibold text-gray-900">{guest.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-gray-900">{guest.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{guest.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Nationality</p>
              <p className="font-semibold text-gray-900">{guest.nationality}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Check-In</p>
              <p className="font-semibold text-gray-900">{guest.checkIn}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Check-Out</p>
              <p className="font-semibold text-gray-900">{guest.checkOut}</p>
            </div>
          </div>
        </div>

        {/* Folio / Bill */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Folio / Bill</h3>

          {/* Table - Desktop */}
          <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <div>Description</div>
              <div className="text-center">QTY</div>
              <div className="text-right">Rate</div>
              <div className="text-right">Amount</div>
            </div>

            <div className="divide-y divide-gray-50">
              {guestFolio && guestFolio.charges.length > 0 && (
                <>
                  {guestFolio.charges.map((charge) => (
                    <div key={charge.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-3 items-center">
                      <div>
                        <span className="text-sm text-gray-900 font-medium">{charge.description}</span>
                        <span className="text-xs text-gray-400 ml-2">{charge.category?.replace("_", " ")}</span>
                      </div>
                      <span className="text-sm text-gray-900 text-center">1</span>
                      <span className="text-sm text-gray-900 text-right">{formatAmount(charge.amount)}</span>
                      <span className="text-sm text-gray-900 text-right font-medium">{formatAmount(charge.amount)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Table - Mobile Card View */}
          <div className="md:hidden space-y-3 mb-4">
            {guestFolio && guestFolio.charges.length > 0 && (
              <>
                {guestFolio.charges.map((charge) => (
                  <div key={charge.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-900 font-medium">{charge.description}</span>
                        <span className="text-xs text-gray-400 ml-2">{charge.category?.replace("_", " ")}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(charge.amount)}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Charges</span>
                <span className="font-semibold text-gray-900">{formatAmount(totalBill)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Additional Charges</span>
                <span className="font-semibold text-gray-900">{formatAmount(additionalChargesTotal)}</span>
              </div>
              {additionalChargesTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">{formatAmount(additionalChargesTax)}</span>
                </div>
              )}
              {additionalChargesDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-red-600">-{formatAmount(additionalChargesDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid Amount</span>
                <span className="font-semibold text-green-600">-{formatAmount(advancePaid)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Remaining Balance</span>
                <span className={`text-xl font-bold ${grandTotal - advancePaid > 0 ? "text-orange-600" : "text-green-600"}`}>
                  {formatAmount(grandTotal - advancePaid)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Received */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">Payments Received</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View full history</button>
          </div>
          {advancePaid > 0 ? (
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-900">{booking.checkin_date}</span>
                <span className="text-sm text-gray-500">Advance Payment · {booking.payment_method || "—"}</span>
              </div>
              <span className="text-sm font-semibold text-green-600">+{formatAmount(advancePaid)}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-3">No payments received yet</p>
          )}
        </div>

        {/* Complete Payment */}
        {remainingBalance > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">Complete Payment</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Total Bill</p>
                <p className="text-lg font-bold text-gray-900">{formatAmount(grandTotal)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Paid Amount</p>
                <p className="text-lg font-bold text-green-600">{formatAmount(advancePaid)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Remaining Balance</p>
                <p className="text-lg font-bold text-red-600">{formatAmount(remainingBalance)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
                  <select
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="KHALTI">Khalti</option>
                    <option value="STRIPE">Stripe</option>
                    <option value="ESWA">eSewa</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      max={remainingBalance}
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  min="0"
                  max={remainingBalance - Number(discount || 0)}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={String(Math.max(0, remainingBalance - Number(discount || 0)))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {Number(discount) > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount Applied</span>
                    <span className="font-semibold text-green-600">-{formatAmount(Number(discount))}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-semibold text-gray-900">Final Amount</span>
                    <span className="font-bold text-gray-900">{formatAmount(Math.max(0, remainingBalance - Number(discount)))}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room after checkout */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Room after checkout</h3>
            <div className="relative">
              <select
                value={roomStatus}
                onChange={(e) => setRoomStatus(e.target.value)}
                className="appearance-none pl-3 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
              >
                <option value="needs_cleaning">Needs Cleaning</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/frontdesk")}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => window.open(`/frontdesk/checkout/${id}/receipt`, "_blank")}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            View Receipt
          </button>
          <button
            onClick={() => {
              checkOut(id || "")
              checkOutMutation.mutate({
                refNumber: booking.ref_number,
                paymentAmount: Number(paymentAmount) || 0,
                paymentGateway,
                discount: Number(discount) || 0,
              })
              setIsCheckedOut(true)
            }}
            disabled={alreadyCheckedOut || isCheckedOut || checkOutMutation.isPending}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkOutMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            {alreadyCheckedOut || isCheckedOut ? "Checked Out" : checkOutMutation.isPending ? "Checking out..." : "Confirm Check-Out"}
          </button>
        </div>
      </div>
    </div>
  )
}
