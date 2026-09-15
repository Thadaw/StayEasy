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
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Bed,
  CreditCard,
  FileText,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"
import { getBookingStatuses, getPaymentStatuses, getPaymentGateways, getPaymentMethods, getBookingTypes } from "../../services/pmsApi"
import { Pagination } from "../../guestfeatures/search/components/Pagination"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

interface Booking {
  id: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  booking_guest?: {
    full_name?: string
    email?: string
    phone?: string
  }
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

function getBookingGuestName(b: Booking): string {
  return b.booking_guest?.full_name || b.guest_name || "—"
}

function getBookingGuestEmail(b: Booking): string {
  return b.booking_guest?.email || b.guest_email || "—"
}

interface RoomDetail {
  id?: string
  room_name?: string
  room_number?: string
  name?: string
}

interface BookingDetail {
  id: string
  booking_id?: string
  ref_number?: string
  booking_number?: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  guest?: {
    name?: string
    email?: string
    phone?: string
  }
  booking_guest?: {
    full_name?: string
    email?: string
    phone?: string
  }
  room_names?: string[]
  rooms?: (string | RoomDetail)[]
  room_numbers?: string[]
  room?: string
  checkin_date: string
  checkout_date: string
  status: string
  payment_status?: string
  payment_method?: string
  payment_gateway?: string
  booking_type?: string
  subtotal: string | number
  total_amount: string | number
  amount_paid?: string | number
  amount_due?: string | number
  coupon_code?: string
  coupon_discount?: number
  number_of_adults?: number
  number_of_children?: number
  special_requests?: string
  notes?: string
  created_at: string
  adults?: number
  children?: number
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

function extractRoomNames(detail: any): string[] {
  if (detail.rooms && Array.isArray(detail.rooms) && detail.rooms.length > 0) {
    return detail.rooms.map((r: any) => {
      if (typeof r === "string") return r
      if (r && typeof r === "object") return r.room_name || r.room_number || r.name || "Room"
      return String(r)
    })
  }
  if (detail.room_names && Array.isArray(detail.room_names)) {
    return detail.room_names.map((r: any) => typeof r === "string" ? r : r.room_name || "Room")
  }
  return []
}

function extractGuestName(detail: any): string {
  if (detail.booking_guest?.full_name) return detail.booking_guest.full_name
  if (detail.booking_guest?.name) return detail.booking_guest.name
  if (detail.guest_name) return detail.guest_name
  if (detail.guest?.name) return detail.guest.name
  return "—"
}

function extractGuestEmail(detail: any): string {
  if (detail.booking_guest?.email) return detail.booking_guest.email
  if (detail.guest_email) return detail.guest_email
  if (detail.guest?.email) return detail.guest.email
  if (detail.customer_email) return detail.customer_email
  return "—"
}

function extractGuestPhone(detail: any): string {
  if (detail.booking_guest?.phone) return detail.booking_guest.phone
  if (detail.guest_phone) return detail.guest_phone
  if (detail.guest?.phone) return detail.guest.phone
  if (detail.customer_phone) return detail.customer_phone
  return ""
}

const EMPTY_BOOKINGS: Booking[] = []

export default function FrontdeskBookingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentPropertyId } = usePropertyStore()
  const { formatAmount } = usePropertyCurrency()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    checkin_date: "",
    checkout_date: "",
    special_requests: "",
    notes: "",
    number_of_adults: 0,
    number_of_children: 0,
  })
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

  const { data: bookingDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["booking-detail", selectedBookingRef],
    queryFn: async (): Promise<BookingDetail | null> => {
      if (!selectedBookingRef) return null
      try {
        const response = await api.get(`/staff/bookings/${selectedBookingRef}`)
        const res = response.data
        
        console.log("API Response:", res)
        
        // Structure: { success: true, data: { booking_id, ref_number, ... } }
        if (res?.success && res?.data) {
          console.log("Booking guest data:", res.data.booking_guest)
          return res.data as BookingDetail
        }
        
        // Fallback: data is directly in response
        if (res?.data && (res.data.ref_number || res.data.booking_id)) {
          return res.data as BookingDetail
        }
        
        // Fallback: response is the booking directly
        if (res?.ref_number || res?.booking_id) {
          return res as BookingDetail
        }
        
        console.log("No booking detail found in:", res)
        return null
      } catch (err) {
        console.error("Failed to fetch booking detail:", err)
        return null
      }
    },
    enabled: !!selectedBookingRef,
    retry: false,
  })

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (data: { bookingId: string; payload: any }) => {
      const response = await api.patch(`/staff/bookings/${data.bookingId}`, data.payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-detail", selectedBookingRef] })
      queryClient.invalidateQueries({ queryKey: ["frontdesk-bookings"] })
      setIsEditing(false)
    },
  })

  const startEditing = () => {
    if (!bookingDetail) return
    setEditForm({
      guest_name: extractGuestName(bookingDetail),
      guest_email: extractGuestEmail(bookingDetail),
      guest_phone: extractGuestPhone(bookingDetail),
      checkin_date: bookingDetail.checkin_date || "",
      checkout_date: bookingDetail.checkout_date || "",
      special_requests: (bookingDetail as any).special_requests || "",
      notes: (bookingDetail as any).notes || "",
      number_of_adults: (bookingDetail as any).number_of_adults || 0,
      number_of_children: (bookingDetail as any).number_of_children || 0,
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!bookingDetail) return
    const bookingId = (bookingDetail as any).booking_id || bookingDetail.id
    updateMutation.mutate({
      bookingId,
      payload: {
        guest_name: editForm.guest_name,
        guest_email: editForm.guest_email,
        guest_phone: editForm.guest_phone,
        checkin_date: editForm.checkin_date,
        checkout_date: editForm.checkout_date,
        special_requests: editForm.special_requests || null,
        notes: editForm.notes || null,
        number_of_adults: editForm.number_of_adults,
        number_of_children: editForm.number_of_children,
      },
    })
  }

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
        "Guest Name": getBookingGuestName(b),
        "Email": getBookingGuestEmail(b),
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
                          {getInitials(getBookingGuestName(booking))}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{getBookingGuestName(booking)}</p>
                          <p className="text-xs text-gray-500 truncate">{getBookingGuestEmail(booking)}</p>
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
                        {booking.room_names && booking.room_names.length > 0 ? (
                          <ul className="text-sm text-gray-900 space-y-0.5">
                            {booking.room_names.map((room, idx) => (
                              <li key={idx}>{room}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-900">—</p>
                        )}
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
                            onClick={() => setSelectedBookingRef(booking.booking_number || booking.id)}
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

      {/* Booking Detail Slide-Over */}
      {selectedBookingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setSelectedBookingRef(null); setIsEditing(false) }} />
          <div className="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] bg-white shadow-xl rounded-xl overflow-y-auto">
            {isLoadingDetail ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : bookingDetail ? (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
                    <p className="text-sm text-gray-500">#{bookingDetail.ref_number || bookingDetail.booking_number || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={updateMutation.isPending}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedBookingRef(null); setIsEditing(false) }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bookingDetail.status)}`}>
                    {statusLabelMap[bookingDetail.status] || bookingDetail.status?.replace("_", " ") || "—"}
                  </span>
                </div>

                {/* Guest Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Guest Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.guest_name}
                            onChange={(e) => setEditForm({ ...editForm, guest_name: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-900">{extractGuestName(bookingDetail)}</p>
                            <p className="text-xs text-gray-500">Guest</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.guest_email}
                            onChange={(e) => setEditForm({ ...editForm, guest_email: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">{extractGuestEmail(bookingDetail)}</p>
                            <p className="text-xs text-gray-500">Email</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.guest_phone}
                            onChange={(e) => setEditForm({ ...editForm, guest_phone: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">{extractGuestPhone(bookingDetail) || "—"}</p>
                            <p className="text-xs text-gray-500">Phone</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Stay Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={editForm.checkin_date}
                              onChange={(e) => setEditForm({ ...editForm, checkin_date: e.target.value })}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-400">→</span>
                            <input
                              type="date"
                              value={editForm.checkout_date}
                              onChange={(e) => setEditForm({ ...editForm, checkout_date: e.target.value })}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">
                              {new Date(bookingDetail.checkin_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              {" → "}
                              {new Date(bookingDetail.checkout_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            <p className="text-xs text-gray-500">Check-in / Check-out</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Bed size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        {(() => {
                          const rooms = (bookingDetail as any).rooms
                          if (rooms && Array.isArray(rooms) && rooms.length > 0) {
                            return (
                              <ul className="text-sm text-gray-900 space-y-1">
                                {rooms.map((room: any, idx: number) => (
                                  <li key={idx} className="flex items-center justify-between">
                                    <span>
                                      <span className="font-medium">{room.room_name}</span>
                                      <span className="text-gray-500 text-xs ml-1">({room.room_type}{room.bed_type ? `, ${room.bed_type}` : ""})</span>
                                    </span>
                                    {room.base_rate != null && (
                                      <span className="text-xs text-gray-600 font-medium">{formatAmount(Number(room.base_rate))}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )
                          }
                          return <p className="text-sm text-gray-900">—</p>
                        })()}
                        <p className="text-xs text-gray-500">Room(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editForm.number_of_adults}
                              onChange={(e) => setEditForm({ ...editForm, number_of_adults: parseInt(e.target.value) || 0 })}
                              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">adults</span>
                            <input
                              type="number"
                              min="0"
                              value={editForm.number_of_children}
                              onChange={(e) => setEditForm({ ...editForm, number_of_children: parseInt(e.target.value) || 0 })}
                              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">children</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">
                              {(bookingDetail as any).number_of_adults || bookingDetail.adults || 0} adults
                              {((bookingDetail as any).number_of_children || bookingDetail.children) 
                                ? `, ${(bookingDetail as any).number_of_children || bookingDetail.children} children` 
                                : ""}
                            </p>
                            <p className="text-xs text-gray-500">Guests</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{bookingDetail.booking_type?.replace("_", " ") || "—"}</p>
                        <p className="text-xs text-gray-500">Booking Type</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{(bookingDetail.payment_method || bookingDetail.payment_gateway || "—").replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500">Payment Method</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">{formatAmount(Number(bookingDetail.subtotal) || 0)}</span>
                    </div>
                    {(bookingDetail as any).coupon_discount > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                          Coupon{((bookingDetail as any).coupon_code ? ` (${(bookingDetail as any).coupon_code})` : "")}
                        </span>
                        <span className="text-sm font-medium text-green-600">-{formatAmount(Number((bookingDetail as any).coupon_discount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-sm font-bold text-gray-900">{formatAmount(Number(bookingDetail.total_amount) || 0)}</span>
                    </div>
                    {Number(bookingDetail.amount_paid) > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Total Paid</span>
                        <span className="text-sm font-medium text-green-600">{formatAmount(Number(bookingDetail.amount_paid))}</span>
                      </div>
                    )}
                    {Number(bookingDetail.amount_due) > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Amount Due</span>
                        <span className="text-sm font-medium text-orange-600">{formatAmount(Number(bookingDetail.amount_due))}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Special Requests</h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.special_requests}
                      onChange={(e) => setEditForm({ ...editForm, special_requests: e.target.value })}
                      placeholder="No special requests"
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{bookingDetail.special_requests || "—"}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="No notes"
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{bookingDetail.notes || "—"}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No details found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
