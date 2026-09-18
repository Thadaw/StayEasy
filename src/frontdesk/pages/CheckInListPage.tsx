import { useState } from "react"
import { Search, LogIn, CheckCircle, Loader2, X, User, Bed, Calendar, CreditCard } from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"

interface Booking {
  id: string
  guest_name: string
  guest_email: string
  ref_number: string
  room_names: string[]
  checkin_date: string
  checkout_date: string
  status: string
  payment_method: string
  payment_status: string
  total_amount: number
  amount_paid: number
  amount_due: number
  booking_type: string
}

const PAGE_SIZE = 10
const EMPTY: Booking[] = []

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-yellow-100 text-yellow-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function CheckInListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [todayOnly, setTodayOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentGateway, setPaymentGateway] = useState("CASH")
  const { checkIn, isCheckedIn } = useBookingCheckInStore()
  const { formatAmount, currency } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["checkin-bookings", currentPropertyId, currentPage, searchQuery, todayOnly, statusFilter],
    queryFn: async () => {
      if (!currentPropertyId) return { data: EMPTY, total: 0, has_more: false }
      try {
        const skip = (currentPage - 1) * PAGE_SIZE
        const params: Record<string, string> = { limit: String(PAGE_SIZE), skip: String(skip) }
        if (statusFilter) {
          params.status = statusFilter
        } else {
          params.status = "CONFIRMED,PENDING"
        }
        if (todayOnly) params.checkin_date = new Date().toISOString().slice(0, 10)
        if (searchQuery.trim()) params.search = searchQuery.trim()

        const { data: result } = await api.get(
          `/properties/${currentPropertyId}/bookings`,
          { params }
        )
        const wrapped = result as { data?: Booking[]; meta?: { total?: number; has_more?: boolean }; total?: number; has_more?: boolean }
        const apiData = (wrapped?.data ?? result) as Booking[]
        const meta = wrapped?.meta
        const total = meta?.total ?? wrapped?.total ?? apiData.length
        const has_more = meta?.has_more ?? wrapped?.has_more ?? false
        return { data: Array.isArray(apiData) ? apiData : [], total, has_more }
      } catch {
        return { data: EMPTY, total: 0, has_more: false }
      }
    },
    enabled: !!currentPropertyId,
  })

  const checkInMutation = useMutation({
    mutationFn: async ({ refNumber, amount, paymentGateway }: { refNumber: string; amount: number; paymentGateway: string }) => {
      const payload: Record<string, unknown> = { idempotency_key: crypto.randomUUID() }
      if (amount > 0) {
        payload.amount = amount
        payload.payment_gateway = paymentGateway
      }
      const { data } = await api.post(`/staff/check-in/${refNumber}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkin-bookings", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
      checkIn(selectedBooking?.id || "")
      setSelectedBooking(null)
      setPaymentAmount("")
      setPaymentGateway("CASH")
    },
  })

  const bookings = bookingsData?.data ?? EMPTY
  const totalBookings = bookingsData?.total ?? bookings.length
  const hasMore = bookingsData?.has_more ?? false
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_SIZE))
  const pendingCount = bookings.filter((b) => {
    const s = b.status?.toUpperCase() || ""
    return s === "CONFIRMED" || s === "PENDING"
  }).length
  const checkedInCount = bookings.filter((b) => b.status?.toUpperCase() === "CHECKED_IN").length

  const handleCheckIn = () => {
    if (!selectedBooking) return
    const amount = parseFloat(paymentAmount) || 0
    checkInMutation.mutate({
      refNumber: selectedBooking.ref_number,
      amount,
      paymentGateway,
    })
  }

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking)
    const remaining = Math.max(0, (booking.total_amount || 0) - (booking.amount_paid || 0))
    setPaymentAmount(String(remaining))
    setPaymentGateway(booking.payment_method === "ONLINE" ? "ONLINE" : "CASH")
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="flex items-center gap-4 mb-6">
            <LogIn size={22} className="text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Check-In</h1>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
            {checkedInCount > 0 && (
              <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {checkedInCount} checked in
              </span>
            )}
            <div className="flex-1" />
            <button
              onClick={() => { setTodayOnly(!todayOnly); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                todayOnly
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today's Check-in
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-72 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Mobile Card View */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-blue-600" />
                <p className="text-sm text-gray-500 mt-2">Loading arrivals...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                {searchQuery ? `No bookings found matching "${searchQuery}"` : "No check-in bookings"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => {
                  const name = booking.guest_name || "Guest"
                  const roomName = booking.room_names?.join(", ") || "—"
                  const nights = Math.max(1, Math.ceil(
                    (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
                  ))
                  const amountPaid = booking.amount_paid || 0
                  const balance = booking.amount_due || 0

                  return (
                    <div key={booking.id} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(name)}`}>
                          {getInitials(name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                          <p className="text-xs text-gray-400">#{booking.ref_number}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Room</p>
                          <p className="font-medium text-gray-900">{roomName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Stay</p>
                          <p className="font-medium text-gray-900">{booking.checkin_date}</p>
                          <p className="text-xs text-gray-500">{nights} nights</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Amount Paid</p>
                          <p className={`font-semibold ${balance > 0 ? "text-orange-600" : "text-green-600"}`}>
                            {formatAmount(amountPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Payment</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.payment_status?.toUpperCase() === "PAID"
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-50 text-orange-700"
                          }`}>
                            {booking.payment_status?.toUpperCase() || "UNPAID"}
                          </span>
                        </div>
                      </div>
                      <div className="pt-1">
                        {isCheckedIn(booking.id) ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle size={14} />
                            Checked In
                          </span>
                        ) : (
                          <button
                            onClick={() => openModal(booking)}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Guest
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Room
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Stay
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Payment
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Loader2 size={24} className="animate-spin mx-auto text-blue-600" />
                      <p className="text-sm text-gray-500 mt-2">Loading arrivals...</p>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-sm">
                      {searchQuery ? `No bookings found matching "${searchQuery}"` : "No check-in bookings"}
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const name = booking.guest_name || "Guest"
                    const roomName = booking.room_names?.join(", ") || "—"
                    const nights = Math.max(1, Math.ceil(
                      (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
                    ))
                    const amountPaid = parseFloat(booking.amount_paid) || 0
                    const balance = parseFloat(booking.amount_due) || 0

                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(name)}`}>
                              {getInitials(name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{name}</p>
                              <p className="text-xs text-gray-400">#{booking.ref_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 text-sm">{roomName}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-900">{booking.checkin_date}</p>
                          <p className="text-xs text-gray-500">{nights} nights</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`text-sm font-semibold ${balance > 0 ? "text-orange-600" : "text-green-600"}`}>
                            {formatAmount(amountPaid)}
                          </p>
                          <p className="text-xs text-gray-500">{booking.payment_method || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.payment_status?.toUpperCase() === "PAID"
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-50 text-orange-700"
                          }`}>
                            {booking.payment_status?.toUpperCase() || "UNPAID"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {isCheckedIn(booking.id) ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                              <CheckCircle size={14} />
                              Checked In
                            </span>
                          ) : (
                            <button
                              onClick={() => openModal(booking)}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Check In
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {bookings.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, totalBookings)} of{" "}
                {totalBookings} check-in bookings
              </p>
              {(hasMore || currentPage < totalPages) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage)}
                    className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
                  >
                    {currentPage}
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      currentPage >= totalPages
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>

    {/* Check-In Modal */}
    {selectedBooking && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBooking(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Check-In</p>
              <h3 className="text-lg font-bold text-gray-900">Confirm Guest Check-In</h3>
            </div>
            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Guest Card */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(selectedBooking.guest_name || "Guest")}`}>
                  {getInitials(selectedBooking.guest_name || "Guest")}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900">{selectedBooking.guest_name || "—"}</h4>
                  <p className="text-sm text-gray-500">{selectedBooking.guest_email || "—"}</p>
                  <p className="text-xs text-gray-400">#{selectedBooking.booking_number}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Bed size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Room</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.room_names?.join(", ") || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Stay</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.checkin_date} → {selectedBooking.checkout_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <User size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.status}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <CreditCard size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                  <p className="text-sm font-semibold text-gray-900">{formatAmount(selectedBooking.total_amount || 0)}</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {selectedBooking.amount_due > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                    <input
                      type="number"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ESEWA">eSewa</option>
                    <option value="KHALTI">Khalti</option>
                    <option value="RAZORPAY">Razorpay</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                <span>Balance Due: {formatAmount(selectedBooking.amount_due)}</span>
              </div>
            </div>
            )}
            {new Date(selectedBooking.checkin_date) > new Date(new Date().toISOString().slice(0, 10)) && (
              <div className="mb-5 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <span>Check-in date is {selectedBooking.checkin_date}. Guest cannot check in before this date.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                disabled={checkInMutation.isPending || new Date(selectedBooking.checkin_date) > new Date(new Date().toISOString().slice(0, 10))}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkInMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Check In Guest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
    </FrontDeskSidebarProvider>
  )
}
