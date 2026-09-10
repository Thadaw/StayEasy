import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CreditCard, ChevronDown, CheckCircle, FileText, X, Loader2 } from "lucide-react"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTodayDepartures, checkOutGuest } from "../../services/pmsApi"
import type { ArrivalGuest } from "../../types/pms"

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function getNights(booking: ArrivalGuest): number {
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

  const { data: departures = [], isLoading } = useQuery({
    queryKey: ["today-departures", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      try {
        return await getTodayDepartures(currentPropertyId)
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const booking = departures.find((d) => d.booking_id === id) || null
  const alreadyCheckedOut = isGuestCheckedOut(id || "")

  const checkOutMutation = useMutation({
    mutationFn: (refNumber: string) => checkOutGuest(refNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-departures", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
  const roomCharges = booking.rooms?.reduce((sum, r) => sum + Number(r.base_rate) * nights, 0) ?? 0
  const tax = roomCharges * 0.1
  const totalBill = roomCharges + tax
  const advancePaid = booking.amount_paid ?? 0
  const remainingBalance = booking.amount_due ?? (totalBill - advancePaid)

  const guest = {
    name: booking.guest?.full_name || "—",
    initials: getInitials(booking.guest?.full_name || "Guest"),
    email: booking.guest?.email || "—",
    phone: booking.guest?.phone || "—",
    nationality: booking.guest?.nationality || "—",
    roomName: booking.rooms?.map((r) => r.room_name).join(", ") || "—",
    roomType: booking.rooms?.map((r) => r.room_type).join(", ") || "—",
    bookingNumber: booking.ref_number?.slice(0, 8) || booking.booking_id?.slice(0, 8),
    checkIn: booking.checkin_date,
    checkOut: booking.checkout_date,
    stayDates: `${booking.checkin_date} – ${booking.checkout_date}`,
    nights,
    adults: booking.number_of_adults,
    children: booking.number_of_children,
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
          {remainingBalance > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Balance Due <span className="text-red-800">{formatAmount(remainingBalance)}</span>
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
                <p className="text-sm text-gray-500">Room {guest.roomName} · {guest.roomType}</p>
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

        {/* Guest Info + Payment Summary */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Adults</p>
                <p className="font-semibold text-gray-900">{guest.adults}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Children</p>
                <p className="font-semibold text-gray-900">{guest.children}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Charges ({nights} nights)</span>
                <span className="font-semibold text-gray-900">{formatAmount(roomCharges)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold text-gray-900">{formatAmount(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Bill</span>
                <span className="font-semibold text-gray-900">{formatAmount(totalBill)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Advance Paid</span>
                <span className="font-semibold text-green-600">-{formatAmount(advancePaid)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Remaining Balance</span>
                <span className={`text-2xl font-bold ${remainingBalance > 0 ? "text-orange-600" : "text-green-600"}`}>
                  {formatAmount(remainingBalance)}
                </span>
              </div>
            </div>
            {remainingBalance > 0 && (
              <button
                onClick={() => navigate(`/frontdesk/checkout/${id}/collect-payment`)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard size={18} />
                Collect Payment {formatAmount(remainingBalance)}
              </button>
            )}
          </div>
        </div>

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
        <div className="flex justify-end gap-3 mt-6">
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
              checkOutMutation.mutate(booking.ref_number)
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
