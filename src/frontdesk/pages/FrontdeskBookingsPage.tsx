import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"
import {
  Search,
  CalendarCheck,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  ChevronDown,
  CheckCircle,
  Pencil,
  Eye,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { getBookingStatuses, getPaymentStatuses, getPaymentGateways, getPaymentMethods, getBookingTypes } from "../../services/pmsApi"
import { Pagination } from "../../guestfeatures/search/components/Pagination"

interface Booking {
  id: string
  guest_name: string
  guest_email: string
  booking_number: string
  room_names: string[]
  checkin_date: string
  checkout_date: string
  status: string
  payment_gateway: string
  payment_method?: string
  payment_status?: string
  booking_type?: string
  subtotal: string
  total_amount: string
  amount_paid?: string
  amount_due?: string
  created_at: string
}

interface Filters {
  status: string
  payment_status: string
  payment_method: string
  payment_gateway: string
  booking_type: string
}

const PAGE_SIZE = 10

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatArrivalTime(booking: Booking): string {
  return "Arrival 3:00 PM"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-blue-100 text-blue-700"
    case "checked_in":
    case "in_house":
      return "bg-green-100 text-green-700"
    case "checked_out":
      return "bg-gray-100 text-gray-600"
    case "cancelled":
      return "bg-red-100 text-red-700"
    case "pending":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

function getPaymentColor(booking: Booking): string {
  const ps = booking.payment_status?.toLowerCase()
  if (ps === "paid" || ps === "completed") return "bg-green-100 text-green-700"
  if (ps === "partial" || ps === "advance_paid") return "bg-orange-100 text-orange-700"
  if (booking.amount_due && parseFloat(booking.amount_due) > 0) return "bg-orange-100 text-orange-700"
  return "bg-green-100 text-green-700"
}

function getPaymentLabel(booking: Booking): string {
  const ps = booking.payment_status?.toLowerCase()
  if (ps === "paid" || ps === "completed") return "Paid"
  if (ps === "confirmed") return "Confirmed"
  if (ps === "partial" || ps === "advance_paid") return "Partial"
  if (booking.amount_due && parseFloat(booking.amount_due) > 0) return "Balance due"
  return "Paid"
}

const EMPTY_BOOKINGS: Booking[] = []

export default function FrontdeskBookingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentPropertyId } = usePropertyStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [filters, setFilters] = useState<Filters>({
    status: "",
    payment_status: "",
    payment_method: "",
    payment_gateway: "",
    booking_type: "",
  })
  const { isCheckedIn } = useBookingCheckInStore()

  const { data: statusOptions = [] } = useQuery({
    queryKey: ["booking-statuses"],
    queryFn: getBookingStatuses,
  })

  const { data: paymentStatusOptions = [] } = useQuery({
    queryKey: ["payment-statuses"],
    queryFn: getPaymentStatuses,
  })

  const { data: paymentGatewayOptions = [] } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: getPaymentGateways,
  })

  const { data: paymentMethodOptions = [] } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  })

  const { data: bookingTypeOptions = [] } = useQuery({
    queryKey: ["booking-types"],
    queryFn: getBookingTypes,
  })

  const paymentStatusLabelMap = useMemo(() => {
    const map: Record<string, string> = {}
    paymentStatusOptions.forEach((s) => { map[s.value] = s.label })
    return map
  }, [paymentStatusOptions])

  const STATUS_OPTIONS = ["", ...statusOptions.map((s) => s.value)]
  const statusLabelMap = useMemo(() => {
    const map: Record<string, string> = {}
    statusOptions.forEach((s) => { map[s.value] = s.label })
    return map
  }, [statusOptions])

  const handleExport = async () => {
    try {
      let apiData: Booking[] = []

      if (currentPropertyId) {
        let allData: Booking[] = []
        let skip = 0
        let hasMore = true

        while (hasMore) {
          const params: Record<string, string> = { limit: "50", skip: String(skip) }
          if (filters.status) params.status = filters.status
          if (filters.payment_status) params.payment_status = filters.payment_status
          if (filters.payment_method) params.payment_method = filters.payment_method
          if (filters.payment_gateway) params.payment_gateway = filters.payment_gateway
          if (filters.booking_type) params.booking_type = filters.booking_type

          const { data: result } = await api.get(`/properties/${currentPropertyId}/bookings`, { params })
          const wrapped = result as { data?: Booking[]; meta?: { has_more?: boolean } }
          const apiData = (wrapped?.data ?? result) as Booking[]
          allData = [...allData, ...apiData]
          hasMore = wrapped?.meta?.has_more ?? false
          skip += 50
        }

        apiData = allData
      } else {
        apiData = bookings
      }

      if (apiData.length === 0) {
        alert("No bookings to export")
        return
      }

      const exportData = apiData.map((b) => ({
        "Guest Name": b.guest_name,
        "Email": b.guest_email,
        "Booking Number": b.booking_number,
        "Room(s)": b.room_names?.join(", ") || "",
        "Check-In": b.checkin_date,
        "Check-Out": b.checkout_date,
        "Status": b.status?.replace("_", " ") || "",
        "Type": b.booking_type?.replace("_", " ") || "",
        "Payment Status": b.payment_status || "",
        "Payment Method": b.payment_method || "",
        "Payment Gateway": b.payment_gateway || "",
        "Total Amount": b.total_amount,
        "Amount Paid": b.amount_paid,
        "Amount Due": b.amount_due,
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Bookings")

      const colWidths = [
        { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 30 },
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
        { wch: 12 }, { wch: 12 },
      ]
      ws["!cols"] = colWidths

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `bookings-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed:", err)
    }
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["frontdesk-bookings", currentPropertyId, filters, currentPage, searchQuery],
    queryFn: async () => {
      if (!currentPropertyId) return { data: EMPTY_BOOKINGS, total: 0, skip: 0, limit: PAGE_SIZE, has_more: false }
      try {
        const skip = (currentPage - 1) * PAGE_SIZE
        const params: Record<string, string> = { limit: String(PAGE_SIZE), skip: String(skip) }
        if (searchQuery.trim()) params.search = searchQuery.trim()
        if (filters.status) params.status = filters.status
        if (filters.payment_status) params.payment_status = filters.payment_status
        if (filters.payment_method) params.payment_method = filters.payment_method
        if (filters.payment_gateway) params.payment_gateway = filters.payment_gateway
        if (filters.booking_type) params.booking_type = filters.booking_type

        const { data: result } = await api.get(`/properties/${currentPropertyId}/bookings`, { params })
        const wrapped = result as { data?: Booking[]; meta?: { total?: number; skip?: number; limit?: number; has_more?: boolean }; total?: number; skip?: number; limit?: number; has_more?: boolean }
        const apiData = (wrapped?.data ?? result) as Booking[]
        const meta = wrapped?.meta
        const total = meta?.total ?? wrapped?.total ?? apiData.length
        const skipVal = meta?.skip ?? wrapped?.skip ?? 0
        const limitVal = meta?.limit ?? wrapped?.limit ?? PAGE_SIZE
        const has_more = meta?.has_more ?? wrapped?.has_more ?? false
        return { data: apiData, total, skip: skipVal, limit: limitVal, has_more }
      } catch {
        return { data: EMPTY_BOOKINGS, total: 0, skip: 0, limit: PAGE_SIZE, has_more: false }
      }
    },
    enabled: !!currentPropertyId,
    placeholderData: { data: EMPTY_BOOKINGS, total: 0, skip: 0, limit: PAGE_SIZE, has_more: false },
  })

  const bookings = bookingsData?.data ?? EMPTY_BOOKINGS
  const totalBookings = bookingsData?.total ?? bookings.length
  const hasMore = bookingsData?.has_more ?? false
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_SIZE))
  const paginatedBookings = bookings

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Title + New Booking */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Reservations</p>
              <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage every reservation from one calm, searchable workspace.
              </p>
            </div>
            <button
              onClick={() => navigate("/frontdesk?panel=new-booking")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus size={16} />
              New booking
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">Status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filters.payment_status}
                  onChange={(e) => updateFilter("payment_status", e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">Payment Status</option>
                  {paymentStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filters.payment_method}
                  onChange={(e) => updateFilter("payment_method", e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">Payment Method</option>
                  {paymentMethodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filters.payment_gateway}
                  onChange={(e) => updateFilter("payment_gateway", e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">Payment Gateway</option>
                  {paymentGatewayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filters.booking_type}
                  onChange={(e) => updateFilter("booking_type", e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">Booking Type</option>
                  {bookingTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarCheck size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    Bookings
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {totalBookings}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in bookings..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearchQuery(searchInput)
                        setCurrentPage(1)
                      }
                    }}
                    className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : paginatedBookings.length === 0 ? (
              <div className="text-center py-16">
                <CalendarCheck size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No bookings found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try a different search term" : "No reservations yet"}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Guest</div>
                  <div>Stay</div>
                  <div>Room</div>
                  <div>Booking ID</div>
                  <div>Type</div>
                  <div>Payment</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {paginatedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                      {/* Guest */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                          {getInitials(booking.guest_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{booking.guest_name}</p>
                          <p className="text-xs text-gray-500 truncate">{booking.guest_email}</p>
                        </div>
                      </div>

                      {/* Stay */}
                      <div>
                        <p className="text-sm text-gray-900">
                          {formatDate(booking.checkin_date)}–{formatDate(booking.checkout_date)}
                        </p>
                        <p className="text-xs text-gray-500">{formatArrivalTime(booking)}</p>
                      </div>

                      {/* Room */}
                      <div>
                        <p className="text-sm text-gray-900 truncate">
                          {booking.room_names?.join(", ") || "—"}
                        </p>
                      </div>

                      {/* Booking ID */}
                      <div>
                        <p className="text-sm text-gray-600 font-mono">
                          #{booking.booking_number?.slice(0, 8) || booking.id?.slice(0, 8)}
                        </p>
                      </div>

                      {/* Type */}
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          booking.booking_type === "WALK_IN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {booking.booking_type?.replace("_", " ") || "—"}
                        </span>
                      </div>

                      {/* Payment */}
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(booking)}`}
                        >
                          {booking.payment_status ? (paymentStatusLabelMap[booking.payment_status] || getPaymentLabel(booking)) : getPaymentLabel(booking)}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        {isCheckedIn(booking.id) ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle size={14} />
                            Checked In
                          </span>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {statusLabelMap[booking.status] || booking.status?.replace("_", " ") || "—"}
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/frontdesk/booking/${booking.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/frontdesk/booking/${booking.id}/edit`)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">
                    Showing {(bookingsData?.skip ?? 0) + 1} to{" "}
                    {(bookingsData?.skip ?? 0) + bookings.length} of{" "}
                    {totalBookings} reservations
                  </p>
                  {(hasMore || currentPage < totalPages) && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
