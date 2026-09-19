import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
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
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { ResetButton } from "../components/ResetButton"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"
import { getBookingStatuses, getPaymentStatuses, getPaymentGateways, getPaymentMethods, getBookingTypes } from "../../services/pmsApi"
import { FrontDeskPagination } from "../components/FrontDeskPagination"
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
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null)
  const [cancelBookingName, setCancelBookingName] = useState<string>("")
  const [cancelReason, setCancelReason] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(""), 4000)
    return () => clearTimeout(timer)
  }, [toastMessage])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    checkin_date: "",
    checkout_date: "",
    special_requests: "",
    notes: "",
    number_of_adults: 0,
    number_of_children: 0,
    room_unit_ids: [] as string[],
    reason: "",
  })
  const [filters, setFilters] = useState<Filters>({
    status: "",
    payment_status: "",
    payment_method: "",
    payment_gateway: "",
    booking_type: "",
  })
  const [activeTab, setActiveTab] = useState<"overview" | "payment" | "notes">("overview")
  const { isCheckedIn } = useBookingCheckInStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeMenu) return
    const handler = () => setActiveMenu(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [activeMenu])

  // Reset tab when selecting a new booking
  useEffect(() => {
    if (selectedBookingRef) setActiveTab("overview")
  }, [selectedBookingRef])

  // Auto-open booking from URL param
  useEffect(() => {
    const bookingRef = searchParams.get("booking")
    if (bookingRef) {
      setSelectedBookingRef(bookingRef)
    }
  }, [searchParams])

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

  // Auto-populate edit form when opening in edit mode
  useEffect(() => {
    if (isEditing && bookingDetail) {
      startEditing()
    }
  }, [isEditing, bookingDetail])

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (data: { refNumber: string; payload: any }) => {
      const response = await api.patch(`/staff/${data.refNumber}/booking-modify`, data.payload)
      return response.data
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["booking-detail", selectedBookingRef] })
      queryClient.invalidateQueries({ queryKey: ["frontdesk-bookings"] })
      setIsEditing(false)
      const msg = result?.data?.message || result?.message || "Booking updated successfully"
      setToastType("success")
      setToastMessage(msg)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.message || "Failed to update booking"
      setToastType("error")
      setToastMessage(msg)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (data: { refNumber: string; reason: string }) => {
      const response = await api.post(`/staff/cancel-booking/${data.refNumber}`, { reason: data.reason, idempotency_key: crypto.randomUUID() })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-bookings"] })
      setCancelBookingId(null)
      setCancelBookingName("")
      setCancelReason("")
    },
  })

  const startEditing = () => {
    if (!bookingDetail) return
    const rooms = (bookingDetail as any).rooms
    const roomUnitIds = Array.isArray(rooms)
      ? rooms.map((r: any) => r.room_unit_id || r.id).filter(Boolean)
      : []
    setEditForm({
      checkin_date: bookingDetail.checkin_date || "",
      checkout_date: bookingDetail.checkout_date || "",
      special_requests: (bookingDetail as any).special_requests || "",
      notes: (bookingDetail as any).notes || "",
      number_of_adults: (bookingDetail as any).number_of_adults || 0,
      number_of_children: (bookingDetail as any).number_of_children || 0,
      room_unit_ids: roomUnitIds,
      reason: "",
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!bookingDetail) return
    const refNumber = bookingDetail.ref_number || bookingDetail.booking_number || bookingDetail.id
    updateMutation.mutate({
      refNumber,
      payload: {
        checkin_date: editForm.checkin_date,
        checkout_date: editForm.checkout_date,
        room_unit_ids: editForm.room_unit_ids,
        number_of_adults: editForm.number_of_adults,
        number_of_children: editForm.number_of_children,
        special_requests: editForm.special_requests || null,
        reason: editForm.reason || "Booking updated by front desk",
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
  })

  const bookings = bookingsData?.data ?? EMPTY_BOOKINGS
  const totalBookings = bookingsData?.total ?? bookings.length
  const hasMore = bookingsData?.has_more ?? false
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_SIZE))
  const paginatedBookings = bookings

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* Title + New Booking */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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

              <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
                <ResetButton
                  onClick={() => setFilters({ status: "", payment_status: "", payment_method: "", payment_gateway: "", booking_type: "" })}
                />
                <button
                  onClick={handleExport}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-auto">
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
                    className="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">Loading bookings...</p>
              </div>
            ) : paginatedBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarCheck size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">
                  {searchQuery ? "No bookings match your search" : "No bookings yet"}
                </p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms or clear the filter to see all bookings."
                    : "Bookings will appear here once guests make reservations."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchInput(""); setSearchQuery(""); setCurrentPage(1) }}
                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 px-4 py-4">
                  {paginatedBookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                          {getInitials(getBookingGuestName(booking))}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{getBookingGuestName(booking)}</p>
                          <p className="text-xs text-gray-500 truncate">{getBookingGuestEmail(booking)}</p>
                        </div>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : booking.status === "checked_in" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                          {booking.status?.replace("_", " ") || "—"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Stay</p>
                          <p className="text-gray-900">{formatDate(booking.checkin_date)} – {formatDate(booking.checkout_date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Room</p>
                          <p className="text-gray-900">{booking.room_names?.[0] || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Booking ID</p>
                          <p className="text-gray-600 font-mono text-xs">#{booking.booking_number?.slice(0, 8) || booking.id?.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Type</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${booking.booking_type === "WALK_IN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {booking.booking_type?.replace("_", " ") || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                <div className="hidden lg:grid divide-y divide-gray-50">
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
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === booking.id ? null : booking.id) }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {activeMenu === booking.id && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                              <button
                                onClick={() => { setSelectedBookingRef(booking.booking_number || booking.id); setIsEditing(false); setActiveMenu(null) }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                onClick={() => { setSelectedBookingRef(booking.booking_number || booking.id); setIsEditing(true); setActiveMenu(null) }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  const status = booking.status?.toUpperCase()
                                  if (status === "CHECKED_IN" || status === "CHECKED-OUT" || status === "IN_HOUSE") {
                                    setToastType("error")
                                    setToastMessage("Booking in status CHECKED_IN cannot be cancelled. Only PENDING, CONFIRMED, or EXPIRED bookings can be cancelled.")
                                    setActiveMenu(null)
                                    return
                                  }
                                  setCancelBookingId(booking.booking_number || booking.id)
                                  setCancelBookingName(getBookingGuestName(booking))
                                  setActiveMenu(null)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <FrontDeskPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalBookings}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  itemLabel="reservations"
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Booking Detail Slide-Over */}
      {selectedBookingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setSelectedBookingRef(null); setIsEditing(false) }} />
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
            {isLoadingDetail ? (
              <div className="flex flex-col h-full">
                <div className="shrink-0 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-9 w-24 bg-gray-200 rounded-t-lg animate-pulse" />
                    <div className="h-9 w-24 bg-gray-200 rounded-t-lg animate-pulse" />
                    <div className="h-9 w-20 bg-gray-200 rounded-t-lg animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-2.5 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-2.5 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : bookingDetail ? (
              <div className="flex flex-col h-full">
                {/* Sticky Header */}
                <div className="shrink-0 border-b border-gray-100">
                  <div className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-base font-bold text-gray-900 truncate">
                            {extractGuestName(bookingDetail)}
                          </h2>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(bookingDetail.status)}`}>
                            {statusLabelMap[bookingDetail.status] || bookingDetail.status?.replace("_", " ") || "—"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">
                          #{bookingDetail.ref_number || bookingDetail.booking_number || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              Cancel
                            </button>
                            <button onClick={handleSaveEdit} disabled={updateMutation.isPending} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
                              {updateMutation.isPending ? "Saving..." : "Save"}
                            </button>
                          </>
                        ) : (
                          <button onClick={startEditing} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil size={14} />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/frontdesk/folios?booking=${(bookingDetail as any).booking_id || bookingDetail.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FileText size={14} />
                          Folio
                        </button>
                        <button onClick={() => { setSelectedBookingRef(null); setIsEditing(false) }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <X size={18} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Tab Bar */}
                  <div className="flex gap-1 px-5">
                    {([
                      { key: "overview" as const, label: "Overview", icon: User },
                      { key: "payment" as const, label: "Payment", icon: CreditCard },
                      { key: "notes" as const, label: "Notes", icon: FileText },
                    ]).map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === key
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-5">
                    {activeTab === "overview" && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Guest Info Card */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Guest Information</h3>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <User size={13} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{extractGuestName(bookingDetail)}</p>
                              <p className="text-xs text-gray-500">Guest Name</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <Mail size={13} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{extractGuestEmail(bookingDetail)}</p>
                              <p className="text-xs text-gray-500">Email</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <Phone size={13} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{extractGuestPhone(bookingDetail) || "—"}</p>
                              <p className="text-xs text-gray-500">Phone</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stay Details Card */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Stay Details</h3>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                              <Calendar size={13} className="text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input type="date" value={editForm.checkin_date} onChange={(e) => setEditForm({ ...editForm, checkin_date: e.target.value })} className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  <span className="text-gray-400 text-xs shrink-0">to</span>
                                  <input type="date" value={editForm.checkout_date} onChange={(e) => setEditForm({ ...editForm, checkout_date: e.target.value })} className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-900">
                                    {new Date(bookingDetail.checkin_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    <span className="text-gray-400 mx-1.5">&rarr;</span>
                                    {new Date(bookingDetail.checkout_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </p>
                                  <p className="text-xs text-gray-500">Check-in / Check-out</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <Bed size={13} className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {(() => {
                                const rooms = (bookingDetail as any).rooms
                                if (rooms && Array.isArray(rooms) && rooms.length > 0) {
                                  return (
                                    <ul className="space-y-0.5">
                                      {rooms.map((room: any, idx: number) => (
                                        <li key={idx} className="flex items-center justify-between gap-2">
                                          <div className="min-w-0">
                                            <span className="text-sm font-medium text-gray-900">{room.room_name}</span>
                                            <span className="text-xs text-gray-500 ml-1.5">({room.room_type}{room.bed_type ? `, ${room.bed_type}` : ""})</span>
                                          </div>
                                          {room.base_rate != null && (
                                            <span className="text-xs text-gray-600 font-medium shrink-0">{formatAmount(Number(room.base_rate))}</span>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )
                                }
                                return <p className="text-sm text-gray-900">&mdash;</p>
                              })()}
                              <p className="text-xs text-gray-500 mt-0.5">Room(s)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                              <User size={13} className="text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input type="number" min="0" value={editForm.number_of_adults} onChange={(e) => setEditForm({ ...editForm, number_of_adults: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  <span className="text-xs text-gray-600">adults</span>
                                  <input type="number" min="0" value={editForm.number_of_children} onChange={(e) => setEditForm({ ...editForm, number_of_children: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  <span className="text-xs text-gray-600">children</span>
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
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                              <FileText size={13} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{bookingDetail.booking_type?.replace("_", " ") || "—"}</p>
                              <p className="text-xs text-gray-500">Booking Type</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "payment" && (
                    <div className="space-y-4">
                      {/* Payment Progress */}
                      {Number(bookingDetail.total_amount) > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Progress</h3>
                            <span className="text-xs font-medium text-gray-500">
                              {Math.min(100, Math.round((Number(bookingDetail.amount_paid) || 0) / Number(bookingDetail.total_amount) * 100))}% paid
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                Number(bookingDetail.amount_due) > 0 ? "bg-orange-500" : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, (Number(bookingDetail.amount_paid) || 0) / Number(bookingDetail.total_amount) * 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-green-600 font-medium">{formatAmount(Number(bookingDetail.amount_paid) || 0)} paid</span>
                            {Number(bookingDetail.amount_due) > 0 && (
                              <span className="text-xs text-orange-600 font-medium">{formatAmount(Number(bookingDetail.amount_due))} due</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Details</h3>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <CreditCard size={13} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{(bookingDetail.payment_method || bookingDetail.payment_gateway || "\u2014").replace(/_/g, " ")}</p>
                              <p className="text-xs text-gray-500">Payment Method</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Subtotal</span>
                              <span className="text-sm font-medium text-gray-900">{formatAmount(Number(bookingDetail.subtotal) || 0)}</span>
                            </div>
                            {(bookingDetail as any).coupon_discount > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Coupon{((bookingDetail as any).coupon_code ? ` (${(bookingDetail as any).coupon_code})` : "")}
                                </span>
                                <span className="text-sm font-medium text-green-600">-{formatAmount(Number((bookingDetail as any).coupon_discount))}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                              <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                              <span className="text-sm font-bold text-gray-900">{formatAmount(Number(bookingDetail.total_amount) || 0)}</span>
                            </div>
                            {Number(bookingDetail.amount_paid) > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Paid</span>
                                <span className="text-sm font-medium text-green-600">{formatAmount(Number(bookingDetail.amount_paid))}</span>
                              </div>
                            )}
                            {Number(bookingDetail.amount_due) > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Amount Due</span>
                                <span className="text-sm font-bold text-orange-600">{formatAmount(Number(bookingDetail.amount_due))}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Special Requests</h3>
                        {isEditing ? (
                          <textarea
                            value={editForm.special_requests}
                            onChange={(e) => setEditForm({ ...editForm, special_requests: e.target.value })}
                            placeholder="No special requests"
                            rows={3}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{bookingDetail.special_requests || "\u2014"}</p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Internal Notes</h3>
                        {isEditing ? (
                          <textarea
                            value={editForm.notes}
                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                            placeholder="No notes"
                            rows={2}
                            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{bookingDetail.notes || "\u2014"}</p>
                        )}
                      </div>
                      {isEditing && (
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                          <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Modification Reason</h3>
                          <textarea
                            value={editForm.reason}
                            onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                            placeholder="e.g. Guest requested date adjustment"
                            rows={2}
                            className="w-full px-2.5 py-1.5 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  </div>
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

      {/* Cancel Booking Confirmation */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setCancelBookingId(null); setCancelBookingName(""); setCancelReason("") }} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Booking</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel the booking for <span className="font-semibold text-gray-900">{cancelBookingName}</span>? The guest will be notified and the booking status will be updated to cancelled.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Guest requested cancellation"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCancelBookingId(null); setCancelBookingName(""); setCancelReason("") }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => cancelMutation.mutate({ refNumber: cancelBookingId, reason: cancelReason || "No reason provided" })}
                disabled={cancelMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`${toastType === "success" ? "bg-green-600" : "bg-red-600"} text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm`}>
            <CheckCircle size={20} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage("")} className={`${toastType === "success" ? "text-green-200" : "text-red-200"} hover:text-white flex-shrink-0`}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </FrontDeskSidebarProvider>
  )
}
