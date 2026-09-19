import { useState, useMemo, useRef, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, ChevronDown, X, Camera, Upload, Check, BedDouble } from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyStore } from "../../stores/propertyStore"
import { getRooms } from "../../services/pmsApi"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

interface CalendarDay {
  date: string
  status: string
  booking_ref: string | null
  guest_name: string | null
}

interface CalendarRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  floor_number: number
  base_rate?: number
  days: CalendarDay[]
}

interface CalendarResponse {
  success: boolean
  data: {
    start_date: string
    end_date: string
    rooms: CalendarRoom[]
  }
}

interface RoomDayStatus {
  status: "available" | "occupied" | "reserved" | "turn" | "maintenance" | "blocked" | "checkout"
  guest_name?: string
  booking_ref?: string
  booking_type?: string
  is_vip?: boolean
  notes?: string
}

type ViewMode = "day" | "7days" | "14days" | "month"

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  available: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  occupied: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  reserved: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  turn: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  maintenance: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  blocked: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  checkout: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
}

function formatDateLabel(date: Date, isToday: boolean, isTomorrow: boolean): string {
  if (isToday) return "TODAY"
  if (isTomorrow) return "TOMORROW"
  const day = date.getDay()
  if (day === 0 || day === 6) return "WEEKEND"
  return "WEEKDAY"
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

interface FloorData {
  label: string
  floorNumber: number
  rooms: CalendarRoom[]
}

function mapApiStatus(status: string): RoomDayStatus["status"] {
  const s = status?.toUpperCase() || ""
  if (s.includes("OCCUPIED")) return "occupied"
  if (s.includes("BOOKED") || s.includes("RESERVED")) return "reserved"
  if (s.includes("CLEANING") || s.includes("DIRTY")) return "turn"
  if (s.includes("MAINTENANCE")) return "maintenance"
  if (s.includes("BLOCKED") || s.includes("OUT_OF_SERVICE") || s.includes("OUT OF SERVICE")) return "blocked"
  if (s.includes("CHECKED_OUT") || s.includes("CHECKOUT")) return "checkout"
  return "available"
}

export default function FrontDeskRoomStatusPage() {
  const navigate = useNavigate()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()
  const { formatAmount, currency } = usePropertyCurrency()
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [viewMode, setViewMode] = useState<ViewMode>("7days")
  const [floorFilter, setFloorFilter] = useState("All Floors")
  const [roomStatusFilter, setRoomStatusFilter] = useState("")

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRoomDetail, setShowRoomDetail] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<CalendarRoom | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [toast, setToast] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    nationality: "",
    adults: 1,
    children: 0,
    paymentMethod: "CASH",
    paymentGateway: "",
    amountPaid: "",
    advanceAmount: "",
    couponCode: "",
    specialRequests: "",
    checkoutDate: "",
  })
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [idDocumentBack, setIdDocumentBack] = useState<File | null>(null)
  const [idPreviewBack, setIdPreviewBack] = useState<string | null>(null)

  const daysCount = viewMode === "day" ? 1 : viewMode === "7days" ? 7 : viewMode === "14days" ? 14 : 30

  const formatDateForAPI = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const endDate = useMemo(() => addDays(startDate, daysCount - 1), [startDate, daysCount])

  const { data: calendarRooms = [], isLoading: calendarLoading } = useQuery({
    queryKey: ["room-calendar", currentPropertyId, formatDateForAPI(startDate), formatDateForAPI(endDate), roomStatusFilter],
    queryFn: async (): Promise<CalendarRoom[]> => {
      if (!currentPropertyId) return []
      try {
        const params: Record<string, string> = {
          start_date: formatDateForAPI(startDate),
          end_date: formatDateForAPI(endDate),
        }
        if (roomStatusFilter) params.room_status = roomStatusFilter
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/room-calendar`,
          { params }
        )
        const response = result as CalendarResponse
        return response?.data?.rooms || []
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: roomsWithRates = [] } = useQuery({
    queryKey: ["rooms-rates", currentPropertyId],
    queryFn: async (): Promise<{ room_id: string; base_rate: number }[]> => {
      if (!currentPropertyId) return []
      try {
        const rooms = await getRooms(currentPropertyId)
        return rooms.map((r) => ({ room_id: r.id, base_rate: Number(r.base_rate) || 0 }))
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const rateMap = useMemo(() => {
    return Object.fromEntries(roomsWithRates.map((r) => [r.room_id, r.base_rate]))
  }, [roomsWithRates])

  const calendarRoomsWithRates = useMemo(() => {
    return calendarRooms.map((room) => ({
      ...room,
      base_rate: rateMap[room.room_id] ?? room.base_rate ?? 0,
    }))
  }, [calendarRooms, rateMap])

  const floors = useMemo<FloorData[]>(() => {
    const floorMap = new Map<number, CalendarRoom[]>()
    calendarRoomsWithRates.forEach((room) => {
      const fn = room.floor_number ?? 0
      if (!floorMap.has(fn)) floorMap.set(fn, [])
      floorMap.get(fn)!.push(room)
    })
    return Array.from(floorMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([floorNumber, floorRooms]) => ({
        label: `FLOOR ${floorNumber}`,
        floorNumber,
        rooms: floorRooms.sort((a, b) => a.room_name.localeCompare(b.room_name)),
      }))
  }, [calendarRooms])

  const dates = useMemo(() => {
    return Array.from({ length: daysCount }, (_, i) => addDays(startDate, i))
  }, [startDate, daysCount])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = addDays(today, 1)

  const filteredFloors = floors.filter(
    (f) => floorFilter === "All Floors" || f.label === floorFilter
  )

  const navigateWeek = (direction: number) => {
    setStartDate((prev) => addDays(prev, direction * 7))
  }

  const goToToday = () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    setStartDate(d)
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2600)
  }

  const resetBookingForm = () => {
    setFormData({
      guestName: "",
      email: "",
      phone: "",
      nationality: "",
      adults: 1,
      children: 0,
      paymentMethod: "CASH",
      paymentGateway: "",
      amountPaid: "",
      advanceAmount: "",
      couponCode: "",
      specialRequests: "",
      checkoutDate: "",
    })
    removeIdDocument()
    removeIdDocumentBack()
  }

  const handleRoomClick = (room: CalendarRoom, date: Date, status: RoomDayStatus) => {
    if (status.status === "available") {
      resetBookingForm()
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      const nextDay = addDays(date, 1)
      const nextDayStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`
      navigate(`/frontdesk?panel=new-booking&roomId=${room.room_id}&checkinDate=${dateStr}&checkoutDate=${nextDayStr}`)
    } else if (status.guest_name || status.booking_ref) {
      setSelectedRoom(room)
      setSelectedDate(date)
      setShowRoomDetail(true)
    }
  }

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      notify("File must be under 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      notify("Please upload an image file")
      return
    }
    setIdDocument(file)
    setIdPreview(URL.createObjectURL(file))
  }

  const removeIdDocument = () => {
    if (idPreview) URL.revokeObjectURL(idPreview)
    setIdDocument(null)
    setIdPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const handleIdUploadBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      notify("File must be under 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      notify("Please upload an image file")
      return
    }
    setIdDocumentBack(file)
    setIdPreviewBack(URL.createObjectURL(file))
  }

  const removeIdDocumentBack = () => {
    if (idPreviewBack) URL.revokeObjectURL(idPreviewBack)
    setIdDocumentBack(null)
    setIdPreviewBack(null)
  }

  const createBookingMutation = useMutation({
    mutationFn: async (payload: {
      bookingData: Record<string, unknown>
      idDocumentFront?: File
      idDocumentBack?: File
    }) => {
      const fd = new FormData()

      Object.entries(payload.bookingData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value))
        }
      })

      if (payload.idDocumentFront) {
        fd.append("front", payload.idDocumentFront)
      }
      if (payload.idDocumentBack) {
        fd.append("back", payload.idDocumentBack)
      }

      const TOKEN_KEY = 'token'
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
      const baseURL = (api.defaults.baseURL || '').replace(/\/+$/, '')
      const response = await fetch(`${baseURL}/staff/create-walkin-booking`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || `Request failed with status ${response.status}`)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-calendar"] })
      setShowBookingModal(false)
      resetBookingForm()
      notify("Booking created successfully")
    },
    onError: () => {
      notify("Failed to create booking")
    },
  })

  const handleCreateBooking = () => {
    if (!formData.guestName.trim()) { notify("Enter guest name"); return }
    if (!formData.email.trim()) { notify("Enter guest email"); return }
    if (!selectedRoom || !currentPropertyId) return

    const checkIn = formatDateForAPI(selectedDate)
    const checkOut = formData.checkoutDate || formatDateForAPI(addDays(selectedDate, 1))

    if (checkOut <= checkIn) {
      notify("Check-out date must be after check-in date")
      return
    }

    createBookingMutation.mutate({
      bookingData: {
        idempotency_key: crypto.randomUUID(),
        property_id: currentPropertyId,
        room_ids: [selectedRoom.room_id],
        check_in: checkIn,
        check_out: checkOut,
        adults: formData.adults,
        children: formData.children,
        guest_full_name: formData.guestName,
        guest_email: formData.email,
        guest_phone: formData.phone,
        guest_nationality: formData.nationality,
        coupon_code: formData.couponCode || undefined,
        payment_method: formData.paymentMethod,
        payment_gateway: formData.paymentGateway || undefined,
        amount_paid: Number(formData.amountPaid) || 0,
        advance_amount: Number(formData.advanceAmount || formData.amountPaid) || 0,
        special_requests: formData.specialRequests || undefined,
      },
      idDocumentFront: idDocument || undefined,
      idDocumentBack: idDocumentBack || undefined,
    })
  }

  const getRoomDayStatus = (room: CalendarRoom, dateKey: string): RoomDayStatus => {
    const day = room.days.find((d) => d.date === dateKey)
    if (!day) return { status: "available" }
    if (!day.booking_ref && !day.guest_name) return { status: "available" }
    return {
      status: mapApiStatus(day.status),
      guest_name: day.guest_name || undefined,
      booking_ref: day.booking_ref || undefined,
    }
  }

  const dateRangeLabel = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Room Status</h1>
              <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                Live Grid
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {daysCount}-night view, starting today · tap a cell to open room details or assign guests
            </p>
          </div>

          {/* Top Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="hidden sm:inline">Today · </span>{dateRangeLabel}
                </button>
                <button
                  onClick={() => navigateWeek(1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Floor Filter */}
              <div className="relative">
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="All Floors">All Floors ({floors.reduce((acc, f) => acc + f.rooms.length, 0)} Rooms)</option>
                  {floors.map((f) => (
                    <option key={f.label} value={f.label}>
                      {f.label} ({f.rooms.length} Rooms)
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Room Status Filter */}
              <div className="relative">
                <select
                  value={roomStatusFilter}
                  onChange={(e) => setRoomStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="">All Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="BOOKED">Booked</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="DIRTY">Dirty</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="INSPECTED">Inspected</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                {(["day", "7days", "14days", "month"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-colors ${
                      viewMode === mode
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {mode === "day" ? "Day" : mode === "7days" ? "7D" : mode === "14days" ? "14D" : "Mo"}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 sm:gap-5 mt-4 pt-4 border-t border-gray-100 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-gray-600">Occupied / Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-xs font-medium text-gray-600">Turn / Departure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-xs font-medium text-gray-600">Maintenance / Blocked</span>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:hidden">
            {calendarLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">Loading room calendar...</p>
              </div>
            ) : filteredFloors.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BedDouble size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No rooms found</p>
                <p className="text-sm text-gray-500 mt-1">{roomStatusFilter ? "Try a different filter." : "No rooms available."}</p>
                {roomStatusFilter && (
                  <button onClick={() => setRoomStatusFilter("")} className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Clear filter</button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFloors.map((floor) => (
                  <div key={floor.label}>
                    <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{floor.label}</span>
                      <span className="text-[10px] text-gray-400">— {floor.rooms.length} rooms</span>
                    </div>
                    {floor.rooms.map((room) => {
                      const todayKey = getDateKey(today)
                      const dayStatus = getRoomDayStatus(room, todayKey)
                      const status = dayStatus.status || "available"
                      const style = STATUS_STYLES[status] || STATUS_STYLES.available
                      return (
                        <div
                          key={room.room_id}
                          onClick={() => handleRoomClick(room, today, dayStatus)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.border} border`}>                        
                            <BedDouble size={16} className={style.text} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-gray-900 truncate">{room.room_name}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{status}</span>
                            </div>
                            <p className="text-[10px] text-gray-400">{room.room_type} · {formatAmount(room.base_rate ?? 0)}/night</p>
                            {dayStatus.guest_name && (
                              <p className="text-xs text-gray-600 mt-0.5 truncate">Guest: {dayStatus.guest_name}</p>
                            )}
                          </div>
                          {status === "available" && (
                            <span className="text-[10px] font-semibold text-blue-600 shrink-0">Book →</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Calendar Grid */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            {calendarLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">Loading room calendar...</p>
              </div>
            ) : filteredFloors.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BedDouble size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No rooms found</p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  {roomStatusFilter ? "No rooms match the selected filter. Try a different filter." : "Add rooms to your property to see the room calendar grid."}
                </p>
                {roomStatusFilter && (
                  <button onClick={() => setRoomStatusFilter("")} className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Clear filter</button>
                )}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                {/* Header */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                      Room & Type
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      Rate
                    </th>
                    {dates.map((date, idx) => {
                      const isToday = getDateKey(date) === getDateKey(today)
                      const isTomorrow = getDateKey(date) === getDateKey(tomorrow)
                      const label = formatDateLabel(date, isToday, isTomorrow)
                      return (
                        <th
                          key={idx}
                          className={`text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider ${
                            isToday ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          <div>{label}</div>
                          <div className={`text-[10px] font-normal normal-case mt-0.5 ${isToday ? "text-blue-500" : "text-gray-400"}`}>
                            {formatDayHeader(date)}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>

                <tbody>
                  {filteredFloors.map((floor) => (
                    <Fragment key={floor.label}>
                      {/* Floor Header */}
                      <tr>
                        <td colSpan={dates.length + 2} className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                              {floor.label}
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              — {floor.rooms.length} rooms
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Room Rows */}
                      {floor.rooms.map((room) => (
                        <tr key={room.room_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2">
                            <div className="text-sm font-bold text-gray-900">{room.room_name}</div>
                            <div className="text-[10px] text-gray-400">{room.room_type}</div>
                          </td>
                           <td className="px-4 py-2 text-center">
                            <span className="text-sm font-semibold text-gray-900">{formatAmount(room.base_rate ?? 0)}</span>
                          </td>
                          {dates.map((date, idx) => {
                            const dateKey = getDateKey(date)
                            const dayStatus = getRoomDayStatus(room, dateKey)
                            const status = dayStatus.status || "available"
                            const style = STATUS_STYLES[status] || STATUS_STYLES.available
                            return (
                              <td key={idx} className="px-1.5 py-1.5">
                                <div
                                  onClick={() => handleRoomClick(room, date, dayStatus)}
                                  className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium border ${style.bg} ${style.text} ${style.border} min-h-[48px] flex flex-col items-center justify-center transition-shadow ${
                                    status === "available" ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : "cursor-default"
                                  }`}
                                >
                                  {dayStatus.guest_name ? (
                                    <>
                                      <span className="font-semibold truncate max-w-full">
                                        {dayStatus.is_vip && <span className="text-amber-500">★ </span>}
                                        {dayStatus.guest_name}
                                      </span>
                                      {dayStatus.booking_ref && (
                                        <span className="text-[9px] opacity-70 mt-0.5">{dayStatus.booking_ref}</span>
                                      )}
                                    </>
                                  ) : dayStatus.notes ? (
                                    <>
                                      <span className="font-semibold truncate max-w-full text-[10px]">{dayStatus.notes}</span>
                                      {status === "blocked" && (
                                        <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded mt-0.5 font-bold">BLOCKED</span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="font-semibold capitalize">{status === "turn" ? "Turn" : status}</span>
                                  )}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </main>

      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => { setShowBookingModal(false); resetBookingForm() }}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">New Booking</p>
                <h3 className="text-lg font-bold text-gray-900">Create Walk-in Booking</h3>
              </div>
              <button onClick={() => { setShowBookingModal(false); resetBookingForm() }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Room</span>
                    <p className="font-semibold text-gray-900">{selectedRoom.room_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Check-in</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Guest Details</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="e.g. John Smith"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        placeholder="e.g. Nepali"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={formData.checkoutDate}
                        onChange={(e) => setFormData({ ...formData, checkoutDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Verification Document</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Front Side</p>
                    {idPreview ? (
                      <div className="relative inline-block w-full">
                        <img src={idPreview} alt="ID Front" className="w-full h-32 object-contain rounded-xl border border-gray-200" />
                        <button
                          onClick={removeIdDocument}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">Upload Front</span>
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Back Side</p>
                    {idPreviewBack ? (
                      <div className="relative inline-block w-full">
                        <img src={idPreviewBack} alt="ID Back" className="w-full h-32 object-contain rounded-xl border border-gray-200" />
                        <button
                          onClick={removeIdDocumentBack}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Camera size={20} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">Upload Back</span>
                      </button>
                    )}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
                <input ref={cameraInputRef} type="file" accept="image/*" onChange={handleIdUploadBack} className="hidden" />
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CASH">Cash</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="DEBIT_CARD">Debit Card</option>
                        <option value="KHALTI">Khalti</option>
                        <option value="ESWA">eSewa</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
                      <select
                        value={formData.paymentGateway}
                        onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">None</option>
                        <option value="KHALTI">Khalti</option>
                        <option value="STRIPE">Stripe</option>
                        <option value="ESWA">eSewa</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.amountPaid}
                          onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.advanceAmount}
                          onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                      placeholder="Enter coupon code (optional)"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Any special requests or notes..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowBookingModal(false); resetBookingForm() }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBooking}
                  disabled={createBookingMutation.isPending}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBookingMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating...
                    </span>
                  ) : (
                    "Create Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium z-50">
          <Check size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Room Detail Modal */}
      {showRoomDetail && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowRoomDetail(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Room Details</p>
                <h3 className="text-lg font-bold text-gray-900">{selectedRoom.room_name}</h3>
              </div>
              <button onClick={() => setShowRoomDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {(() => {
                const dateKey = getDateKey(selectedDate)
                const day = selectedRoom.days.find((d) => d.date === dateKey)
                if (!day) return <p className="text-sm text-gray-500">No booking on this date.</p>
                return (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      {day.guest_name && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Guest</span>
                          <span className="font-semibold text-gray-900">{day.guest_name}</span>
                        </div>
                      )}
                      {day.booking_ref && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Booking Ref</span>
                          <span className="font-semibold text-gray-900">#{day.booking_ref}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Room Type</span>
                        <span className="font-semibold text-gray-900">{selectedRoom.room_type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="font-semibold text-gray-900">{day.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          day.status?.toUpperCase() === "CHECKED_IN" || day.status?.toUpperCase() === "IN_HOUSE"
                            ? "bg-green-50 text-green-700"
                            : day.status?.toUpperCase() === "CHECKED_OUT"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {day.status}
                        </span>
                      </div>
                    </div>
                    {day.booking_ref && (
                      <button
                        onClick={() => {
                          setShowRoomDetail(false)
                          navigate(`/frontdesk/checkout/${day.booking_ref}`)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition-colors"
                      >
                        View Booking Details
                      </button>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
    </FrontDeskSidebarProvider>
  )
}
