import { useState } from "react"
import { Search, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

interface CheckOutBooking {
  id: string
  guestName: string
  bookingNumber: string
  initials: string
  avatarColor: string
  roomNumber: string
  roomType: string
  checkOutTime: string
  nights: number
  totalBill: number
  paymentMethod: string
  status: "paid_in_full" | "balance_due"
}

const checkOutData: CheckOutBooking[] = [
  {
    id: "1",
    guestName: "Olivia Martin",
    bookingNumber: "#HH6B2X",
    initials: "OM",
    avatarColor: "bg-blue-100 text-blue-700",
    roomNumber: "201",
    roomType: "King Harbor View",
    checkOutTime: "11:00 AM",
    nights: 3,
    totalBill: 450,
    paymentMethod: "Card",
    status: "paid_in_full",
  },
  {
    id: "2",
    guestName: "Sofia Rodriguez",
    bookingNumber: "#HH9Q8P",
    initials: "SR",
    avatarColor: "bg-yellow-100 text-yellow-700",
    roomNumber: "305",
    roomType: "Deluxe Queen",
    checkOutTime: "11:00 AM",
    nights: 3,
    totalBill: 605,
    paymentMethod: "Cash advance",
    status: "balance_due",
  },
  {
    id: "3",
    guestName: "Ethan Thompson",
    bookingNumber: "#HH4K3W",
    initials: "ET",
    avatarColor: "bg-green-100 text-green-700",
    roomNumber: "204",
    roomType: "Standard King",
    checkOutTime: "12:00 PM",
    nights: 2,
    totalBill: 300,
    paymentMethod: "Khalti",
    status: "paid_in_full",
  },
  {
    id: "4",
    guestName: "Maya Lewis",
    bookingNumber: "#HH7H8R",
    initials: "ML",
    avatarColor: "bg-pink-100 text-pink-700",
    roomNumber: "308",
    roomType: "Harbor Suite",
    checkOutTime: "12:00 PM",
    nights: 4,
    totalBill: 820,
    paymentMethod: "Stripe advance",
    status: "balance_due",
  },
]

export default function CheckOutListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { isCheckedOut } = useBookingCheckOutStore()
  const { formatAmount } = usePropertyCurrency()

  const filtered = checkOutData.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomNumber.includes(searchQuery)
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <LogOut size={22} className="text-orange-600" />
            <h1 className="text-xl font-bold text-gray-900">Check-Out</h1>
            <span className="bg-orange-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {checkOutData.length}
            </span>
            <div className="flex-1" />
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
                    Check-out Time
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Total Bill
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
                {filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${booking.avatarColor}`}
                        >
                          {booking.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {booking.guestName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.bookingNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.roomNumber}
                      </p>
                      <p className="text-xs text-gray-500">{booking.roomType}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{booking.checkOutTime}</p>
                      <p className="text-xs text-gray-500">{booking.nights} nights</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        ${formatAmount(booking.totalBill)}
                      </p>
                      <p className="text-xs text-gray-500">{booking.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "paid_in_full"
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {booking.status === "paid_in_full"
                          ? "PAID IN FULL"
                          : "BALANCE DUE"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isCheckedOut(booking.id) ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Checked Out
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/frontdesk/checkout/${booking.id}`)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          Check out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No bookings found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </main>
    </div>
  )
}
