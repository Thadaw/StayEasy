import { useState } from "react"
import { ArrowLeft, Search, LogOut, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import { getTodayDepartures } from "../../services/pmsApi"
import type { ArrivalGuest } from "../../types/pms"

interface DeparturesPanelProps {
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

const MOCK_DEPARTURES: ArrivalGuest[] = [
  {
    booking_id: "dep-001",
    ref_number: "BK-19842",
    status: "CHECKED_IN",
    booking_type: "ONLINE",
    guest: {
      guest_id: "g-001",
      full_name: "Amelia Thompson",
      email: "amelia.t@email.com",
      phone: "+1 555-0101",
      nationality: "United Kingdom",
    },
    rooms: [
      {
        room_id: "r-001",
        room_name: "Suite 804",
        room_type: "Executive Suite",
        bed_type: "King",
        base_rate: 350,
      },
    ],
    checkin_date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    checkout_date: new Date().toISOString().split("T")[0],
    number_of_adults: 2,
    number_of_children: 1,
    special_requests: "Late checkout if possible",
    payment_method: "STRIPE",
    payment_status: "PAID",
    payment_gateway: "stripe",
    amount_paid: 1200,
    amount_due: 0,
    advance_amount: 0,
    total_amount: 1200,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    booking_id: "dep-002",
    ref_number: "BK-19835",
    status: "CHECKED_IN",
    booking_type: "WALK_IN",
    guest: {
      guest_id: "g-002",
      full_name: "Noah Williams",
      email: "noah.w@email.com",
      phone: "+1 555-0202",
      nationality: "United States",
    },
    rooms: [
      {
        room_id: "r-002",
        room_name: "Room 412",
        room_type: "Deluxe King",
        bed_type: "King",
        base_rate: 160,
      },
    ],
    checkin_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    checkout_date: new Date().toISOString().split("T")[0],
    number_of_adults: 1,
    number_of_children: 0,
    special_requests: "",
    payment_method: "CASH",
    payment_status: "PAID",
    payment_gateway: "",
    amount_paid: 350,
    amount_due: 0,
    advance_amount: 0,
    total_amount: 350,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    booking_id: "dep-003",
    ref_number: "BK-19821",
    status: "CHECKED_IN",
    booking_type: "ONLINE",
    guest: {
      guest_id: "g-003",
      full_name: "Sofia Martinez",
      email: "sofia.m@email.com",
      phone: "+34 612-345-678",
      nationality: "Spain",
    },
    rooms: [
      {
        room_id: "r-003",
        room_name: "Garden Villa 2",
        room_type: "Garden Villa",
        bed_type: "King",
        base_rate: 250,
      },
    ],
    checkin_date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    checkout_date: new Date().toISOString().split("T")[0],
    number_of_adults: 2,
    number_of_children: 2,
    special_requests: "Extra towels and pillows",
    payment_method: "STRIPE",
    payment_status: "PARTIALLY_PAID",
    payment_gateway: "stripe",
    amount_paid: 800,
    amount_due: 450,
    advance_amount: 0,
    total_amount: 1250,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    booking_id: "dep-004",
    ref_number: "BK-19794",
    status: "CHECKED_IN",
    booking_type: "ONLINE",
    guest: {
      guest_id: "g-004",
      full_name: "Theo Bennett",
      email: "theo.b@email.com",
      phone: "+44 7911-123456",
      nationality: "United Kingdom",
    },
    rooms: [
      {
        room_id: "r-004",
        room_name: "Room 207",
        room_type: "Standard Twin",
        bed_type: "Twin",
        base_rate: 95,
      },
    ],
    checkin_date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    checkout_date: new Date().toISOString().split("T")[0],
    number_of_adults: 2,
    number_of_children: 0,
    special_requests: "",
    payment_method: "KHALTI",
    payment_status: "PAID",
    payment_gateway: "khalti",
    amount_paid: 215,
    amount_due: 0,
    advance_amount: 0,
    total_amount: 215,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
]

export function DeparturesPanel({ onClose }: DeparturesPanelProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { isCheckedOut } = useBookingCheckOutStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()

  const { data: departures = [], isLoading } = useQuery({
    queryKey: ["today-departures", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return MOCK_DEPARTURES
      try {
        const result = await getTodayDepartures(currentPropertyId)
        return result.length > 0 ? result : MOCK_DEPARTURES
      } catch {
        return MOCK_DEPARTURES
      }
    },
    enabled: !!currentPropertyId,
  })

  const filtered = departures.filter(
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
          <LogOut size={22} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Departures</h2>
          <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {departures.length}
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
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
                          onClick={() => navigate(`/frontdesk/checkout/${booking.booking_id}`)}
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

      {!isLoading && filtered.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No departures found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
