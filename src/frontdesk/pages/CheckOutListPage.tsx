import { useState } from "react"
import { Search, LogOut, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
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

export default function CheckOutListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [todayOnly, setTodayOnly] = useState(false)
  const { isCheckedOut } = useBookingCheckOutStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["checkout-bookings", currentPropertyId, currentPage, searchQuery, todayOnly],
    queryFn: async () => {
      if (!currentPropertyId) return { data: EMPTY, total: 0, has_more: false }
      try {
        const skip = (currentPage - 1) * PAGE_SIZE
        const params: Record<string, string> = { limit: String(PAGE_SIZE), skip: String(skip), status: "CHECKED_IN" }
        if (todayOnly) params.checkout_date = new Date().toISOString().slice(0, 10)
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

  const bookings = bookingsData?.data ?? EMPTY
  const totalBookings = bookingsData?.total ?? bookings.length
  const hasMore = bookingsData?.has_more ?? false
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_SIZE))

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />
      
      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="flex items-center gap-4 mb-6">
            <LogOut size={22} className="text-orange-600" />
            <h1 className="text-xl font-bold text-gray-900">Check-Out</h1>
            <span className="bg-orange-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {bookings.length}
            </span>
            <div className="flex-1" />
            <button
              onClick={() => { setTodayOnly(!todayOnly); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                todayOnly
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today's Check-out
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
                <p className="text-sm text-gray-500 mt-2">Loading departures...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                {searchQuery ? `No bookings found matching "${searchQuery}"` : "No checkout bookings"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => {
                  const name = booking.guest_name || "Guest"
                  const roomName = booking.room_names?.join(", ") || "—"
                  const nights = Math.max(1, Math.ceil(
                    (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
                  ))
                  const totalBill = booking.total_amount || 0

                  return (
                    <div key={booking.ref_number} className="p-4 space-y-3">
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
                          <p className="font-medium text-gray-900">{booking.checkout_date}</p>
                          <p className="text-xs text-gray-500">{nights} nights</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Amount Due</p>
                          <p className="font-semibold text-gray-900">{formatAmount(totalBill)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
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
                        {isCheckedOut(booking.ref_number) ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            Checked Out
                          </span>
                        ) : (
                          <button
                            onClick={() => navigate(`/frontdesk/checkout/${booking.ref_number}`)}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                            Check out
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
                      <p className="text-sm text-gray-500 mt-2">Loading departures...</p>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-sm">
                      {searchQuery ? `No bookings found matching "${searchQuery}"` : "No checkout bookings"}
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const name = booking.guest_name || "Guest"
                    const roomName = booking.room_names?.join(", ") || "—"
                    const nights = Math.max(1, Math.ceil(
                      (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) / (1000 * 60 * 60 * 24)
                    ))
                    const totalBill = booking.total_amount || 0

                    return (
                      <tr
                        key={booking.ref_number}
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
                          <p className="text-sm text-gray-900">{booking.checkout_date}</p>
                          <p className="text-xs text-gray-500">{nights} nights</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">{formatAmount(totalBill)}</p>
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
                          {isCheckedOut(booking.ref_number) ? (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                              Checked Out
                            </span>
                          ) : (
                            <button
                              onClick={() => navigate(`/frontdesk/checkout/${booking.ref_number}`)}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Check out
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
                {totalBookings} checkout bookings
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
    </div>
    </FrontDeskSidebarProvider>
  )
}
