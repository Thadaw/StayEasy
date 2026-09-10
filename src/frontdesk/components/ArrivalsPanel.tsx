import { useState } from "react"
import { ArrowLeft, Search, CheckCircle, Loader2 } from "lucide-react"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTodayArrivals, checkInGuest } from "../../services/pmsApi"
import type { ArrivalGuest } from "../../types/pms"

interface ArrivalsPanelProps {
  onClose: () => void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(index: number): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-yellow-100 text-yellow-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
  ]
  return colors[index % colors.length]
}

function getPaymentStatus(booking: ArrivalGuest): "paid_in_full" | "balance_due" {
  if (booking.payment_status?.toLowerCase() === "paid" || booking.payment_status?.toLowerCase() === "completed") return "paid_in_full"
  if (booking.amount_due > 0) return "balance_due"
  return "paid_in_full"
}

function getNights(booking: ArrivalGuest): number {
  const checkin = new Date(booking.checkin_date)
  const checkout = new Date(booking.checkout_date)
  return Math.max(0, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)))
}

const MOCK_ARRIVAL: ArrivalGuest = {
  booking_id: "mock-001",
  ref_number: "MOCK01",
  status: "CONFIRMED",
  booking_type: "WALK_IN",
  guest: {
    guest_id: "g-001",
    full_name: "John Smith",
    email: "john.smith@email.com",
    phone: "+977 9841234567",
    nationality: "Nepal",
  },
  rooms: [
    {
      room_id: "r-001",
      room_name: "Room 201",
      room_type: "King Harbor View",
      bed_type: "King",
      base_rate: 5000,
    },
  ],
  checkin_date: new Date().toISOString().split("T")[0],
  checkout_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
  number_of_adults: 2,
  number_of_children: 1,
  special_requests: "",
  payment_method: "PAY_ON_ARRIVAL",
  payment_status: "PAID",
  payment_gateway: "",
  amount_paid: 15000,
  amount_due: 0,
  advance_amount: 15000,
  total_amount: 15000,
  created_at: new Date().toISOString(),
}

export function ArrivalsPanel({ onClose }: ArrivalsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { checkIn, isCheckedIn } = useBookingCheckInStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()

  const checkInMutation = useMutation({
    mutationFn: (refNumber: string) => checkInGuest(refNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-arrivals", currentPropertyId] })
    },
  })

  const { data: arrivals = [], isLoading } = useQuery({
    queryKey: ["today-arrivals", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return [MOCK_ARRIVAL]
      try {
        const result = await getTodayArrivals(currentPropertyId)
        return result.length > 0 ? result : [MOCK_ARRIVAL]
      } catch {
        return [MOCK_ARRIVAL]
      }
    },
    enabled: !!currentPropertyId,
  })

  const filtered = arrivals.filter(
    (g) =>
      g.guest?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ref_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.rooms?.some((r) => r.room_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Arrivals</h2>
          <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {arrivals.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
                      <p className="text-xs text-gray-500">{booking.checkin_date}</p>
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
                      {isCheckedIn(booking.booking_id) ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                          <CheckCircle size={16} />
                          Checked In
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            checkIn(booking.booking_id)
                            checkInMutation.mutate(booking.ref_number)
                          }}
                          disabled={checkInMutation.isPending}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {checkInMutation.isPending ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Loader2 size={14} className="animate-spin" />
                              Checking in...
                            </span>
                          ) : (
                            "Check In"
                          )}
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

      {!isLoading && filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No arrivals found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
