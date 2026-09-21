import { useState } from "react"
import { Search, LogOut, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { FrontdeskTableSkeleton } from "../components/FrontdeskTableSkeleton"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import { getTodayDepartures } from "../../services/pmsApi"
import type { ArrivalGuest } from "../../types/pms"

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-yellow-100 text-yellow-700",
  "bg-green-100 text-green-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarColor(index: number): string {
  return avatarColors[index % avatarColors.length]
}

function getPaymentStatus(booking: ArrivalGuest): "paid_in_full" | "balance_due" {
  const status = booking.payment_status?.toLowerCase()
  if (status === "paid" || status === "completed") {
    return "paid_in_full"
  }
  if (booking.amount_due > 0) {
    return "balance_due"
  }
  return "paid_in_full"
}

function getNights(booking: ArrivalGuest): number {
  const checkin = new Date(booking.checkin_date)
  const checkout = new Date(booking.checkout_date)
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.max(0, Math.ceil((checkout.getTime() - checkin.getTime()) / msPerDay))
}

export default function CheckOutListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { isCheckedOut } = useBookingCheckOutStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()

  const { data: departures = [], isLoading, isError } = useQuery({
    queryKey: ["today-departures", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      return await getTodayDepartures(currentPropertyId)
    },
    enabled: !!currentPropertyId,
  })

  const handleCheckout = (refNumber: string) => {
    navigate(`/frontdesk/checkout/${refNumber}`)
  }

  const search = searchQuery.trim().toLowerCase()
  const filtered = departures.filter((departure) => {
    const guestName = departure.guest?.full_name?.toLowerCase() || ""
    const refNumber = departure.ref_number?.toLowerCase() || ""
    return (
      guestName.includes(search) ||
      refNumber.includes(search) ||
      departure.rooms?.some((room) => room.room_name?.toLowerCase().includes(search))
    )
  })

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
            <LogOut size={22} className="text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900">Check-Out</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {departures.length}
            </span>
            <div className="sm:flex-1" />
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <FrontdeskTableSkeleton columns={7} />
            ) : isError ? (
              <div className="p-8 text-center text-red-500 text-sm">
                Failed to load departures. Please try again later.
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                        Guests
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Balance
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking, index) => {
                      const paymentStatus = getPaymentStatus(booking)
                      const nights = getNights(booking)
                      const roomNames = booking.rooms?.map((r) => r.room_name).join(", ") || "—"
                      const roomTypes = booking.rooms?.map((r) => r.room_type).join(", ") || ""
                      return (
                        <tr
                          key={booking.booking_id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(index)}`}
                              >
                                {getInitials(booking.guest?.full_name || "")}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {booking.guest?.full_name || "—"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  #{booking.ref_number?.slice(0, 8) || booking.booking_id?.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900 text-sm">
                              {roomNames}
                            </p>
                            <p className="text-xs text-gray-500">{roomTypes}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{nights} nights</p>
                            <p className="text-xs text-gray-500">{booking.checkout_date}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{booking.number_of_adults} Adults</p>
                            {booking.number_of_children > 0 && (
                              <p className="text-xs text-gray-500">{booking.number_of_children} Children</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p
                              className={`text-sm font-semibold ${
                                booking.amount_due > 0
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {formatAmount(booking.amount_due)}
                            </p>
                            <p className="text-xs text-gray-500">{booking.payment_method || "—"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentStatus === "paid_in_full"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-orange-50 text-orange-700"
                              }`}
                            >
                              {paymentStatus === "paid_in_full" ? "PAID IN FULL" : "BALANCE DUE"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {isCheckedOut(booking.booking_id) ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                                <CheckCircle size={16} />
                                Checked Out
                              </span>
                            ) : (
                              <button
                                onClick={() => handleCheckout(booking.ref_number)}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                              >
                                Check Out
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && departures.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <LogOut size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No departures today</p>
                <p className="text-sm text-gray-500">Guests checking out today will appear here.</p>
              </div>
            )}

            {!isLoading && departures.length > 0 && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-gray-500 text-sm">No departures match your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}
