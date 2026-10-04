import { useState, useMemo } from "react"
import {
  Search,
  ChevronDown,
  Users,
} from "lucide-react"
import { usePropertyStore } from "../../stores/propertyStore"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { ResetButton } from "../components/ResetButton"
import { FrontdeskGridSkeleton } from "../components/FrontdeskTableSkeleton"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { FrontDeskPagination } from "../components/FrontDeskPagination"

interface Booking {
  id: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  booking_number: string
  room_names: string[]
  checkin_date: string
  checkout_date: string
  status: string
  payment_status?: string
  total_amount: string
  created_at: string
}

interface GuestProfile {
  id: string
  name: string
  email: string
  total_stays: number
  last_stay: string
  total_spent: number
  preferences: string[]
  status: string
  room_number?: string
}

type TabKey = "all" | "in_house"

const PAGE_SIZE = 20

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
]

function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function getStatusStyle(status: string, roomNumber?: string): { bg: string; text: string; dot?: string } {
  if (roomNumber) {
    return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" }
  }
  switch (status?.toLowerCase()) {
    case "upcoming":
      return { bg: "bg-blue-50", text: "text-blue-700" }
    case "departed":
      return { bg: "bg-gray-50", text: "text-gray-500" }
    case "inactive":
      return { bg: "bg-gray-50", text: "text-gray-400" }
    default:
      return { bg: "bg-gray-50", text: "text-gray-500" }
  }
}

function deriveGuestsFromBookings(bookings: Booking[]): GuestProfile[] {
  const guestMap = new Map<string, GuestProfile>()

  bookings.forEach((b) => {
    if (!b.guest_email) return
    const email = b.guest_email.toLowerCase()
    const existing = guestMap.get(email)

    const s = b.status?.toUpperCase() || ""
    const isCurrentlyCheckedIn = s === "CHECKED_IN" || s === "IN_HOUSE" || s === "CHECKED-IN" || s === "IN HOUSE"
    const isCheckedOut = s === "CHECKED_OUT" || s === "CHECKED-OUT" || s === "COMPLETED" || s === "CANCELLED"
    const roomNumber = isCurrentlyCheckedIn ? b.room_names?.[0] : undefined

    if (existing) {
      existing.total_stays += 1
      existing.total_spent += parseFloat(b.total_amount) || 0
      if (b.checkin_date > existing.last_stay) existing.last_stay = b.checkin_date
      if (roomNumber && !existing.room_number) existing.room_number = roomNumber
    } else {
      guestMap.set(email, {
        id: b.id,
        name: b.guest_name || "Unknown Guest",
        email: b.guest_email,
        total_stays: 1,
        last_stay: b.checkin_date,
        total_spent: parseFloat(b.total_amount) || 0,
        preferences: [],
        status: isCurrentlyCheckedIn ? "in_house" : isCheckedOut ? "departed" : "active",
        room_number: roomNumber,
      })
    }
  })

  return Array.from(guestMap.values()).sort(
    (a, b) => new Date(b.last_stay).getTime() - new Date(a.last_stay).getTime()
  )
}

const EMPTY_BOOKINGS: Booking[] = []

export default function FrontDeskGuestsPage() {
  const { currentPropertyId } = usePropertyStore()
  const { formatAmount } = usePropertyCurrency()

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("recent")

  const { data: bookingsData, isLoading: isLoadingBookings, isError } = useQuery({
    queryKey: ["frontdesk-guests", currentPropertyId, searchQuery],
    queryFn: async () => {
      if (!currentPropertyId) return EMPTY_BOOKINGS
      let allBookings: Booking[] = []
      let skip = 0
      let hasMore = true
      let iterations = 0
      const MAX_ITERATIONS = 100

      while (hasMore && iterations < MAX_ITERATIONS) {
        iterations++
        const params: Record<string, string> = { limit: "50", skip: String(skip) }
        if (searchQuery.trim()) params.search = searchQuery.trim()

        const { data: result } = await api.get(
          `/properties/${currentPropertyId}/bookings`,
          { params }
        )
        const wrapped = result as {
          data?: Booking[]
          meta?: { has_more?: boolean }
          has_more?: boolean
        }
        const apiData = (wrapped?.data ?? result) as Booking[]
        allBookings = [...allBookings, ...apiData]
        hasMore = wrapped?.meta?.has_more ?? wrapped?.has_more ?? false
        skip += 50
      }

      return allBookings
    },
    enabled: !!currentPropertyId,
  })

  interface InHouseGuest {
    guest_id: string | null
    booking_guest_id: string | null
    full_name: string
    email: string
    phone: string
    nationality: string
    ref_number: string
    checkin_date: string
    checkout_date: string
  }

  const { data: inHouseGuestsData = [], isLoading: isLoadingInHouse } = useQuery({
    queryKey: ["in-house-guests", currentPropertyId],
    queryFn: async (): Promise<InHouseGuest[]> => {
      if (!currentPropertyId) return []
      try {
        const { data: result } = await api.get(`/staff/properties/${currentPropertyId}/booking-guests`, {
          params: { skip: 0, limit: 100 },
        })
        const wrapped = result as { data?: InHouseGuest[] }
        return wrapped?.data || []
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const allGuests = useMemo(() => deriveGuestsFromBookings(bookingsData ?? []), [bookingsData])

  const isLoading = activeTab === "in_house" ? isLoadingInHouse : isLoadingBookings

  const sortedGuests = useMemo(() => {
    const sorted = [...allGuests]
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.last_stay).getTime() - new Date(a.last_stay).getTime())
    } else if (sortBy === "spending") {
      sorted.sort((a, b) => b.total_spent - a.total_spent)
    } else if (sortBy === "stays") {
      sorted.sort((a, b) => b.total_stays - a.total_stays)
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    return sorted
  }, [allGuests, sortBy])

  const filteredGuests = useMemo(() => {
    if (activeTab === "in_house") {
      const q = searchQuery.toLowerCase()
      return inHouseGuestsData.filter((g) => {
        if (!q) return true
        const name = g.full_name?.toLowerCase() || ""
        const email = g.email?.toLowerCase() || ""
        const ref = g.ref_number?.toLowerCase() || ""
        return name.includes(q) || email.includes(q) || ref.includes(q)
      })
    }
    return sortedGuests
  }, [sortedGuests, activeTab, inHouseGuestsData, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE))
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const inHouseCount = inHouseGuestsData.length

  const handleReset = () => {
    setSearchInput("")
    setSearchQuery("")
    setSortBy("recent")
    setCurrentPage(1)
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Operations & Records
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Guest CRM Directory</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Comprehensive guest directory, stay history, VIP tiers, and personalized stay preferences.
            </p>
          </div>

          {/* Tabs + Controls */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab("all"); setCurrentPage(1) }}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === "all"
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  All Guests <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ml-1.5">{allGuests.length.toLocaleString()}</span>
                </button>
                <button
                  onClick={() => { setActiveTab("in_house"); setCurrentPage(1) }}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === "in_house"
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  In-House <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 ml-1.5">{inHouseCount}</span>
                </button>
              </div>
            </div>

            {/* Search + Sort */}
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter guests by name, email, or stay notes..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchQuery(searchInput)
                      setCurrentPage(1)
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Sort: Most Recent Stays</option>
                  <option value="spending">Sort: Highest Spending</option>
                  <option value="stays">Sort: Most Stays</option>
                  <option value="name">Sort: Name A–Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <ResetButton onClick={handleReset} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <FrontdeskGridSkeleton
                template="2fr 1.2fr 0.8fr 1.5fr 1.2fr"
                header={["Guest Profile", "Stays & Recency", "Total Spent", "Preferences & Stay Notes", "Current Status"]}
                columns={[
                  { kind: "avatar" },
                  { kind: "title" },
                  { kind: "text" },
                  { kind: "text" },
                  { kind: "badge" },
                ]}
              />
            ) : isError ? (
              <div className="text-center py-16">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 inline-block">
                  Failed to load guest records. Please try again.
                </p>
              </div>
            ) : paginatedGuests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">
                  {searchQuery ? "No guests match your search" : "No guest records yet"}
                </p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms or clear the filter to see all guests."
                    : "Guest profiles will appear here once bookings are created and guests check in."}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleReset}
                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-[2fr_1.2fr_0.8fr_1.5fr_1.2fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Guest Profile</div>
                  <div>Stays & Recency</div>
                  <div>Total Spent</div>
                  <div>Preferences & Stay Notes</div>
                  <div>Current Status</div>
                </div>

                {/* Table Rows */}
                <div className="hidden lg:block divide-y divide-gray-50">
                  {activeTab === "in_house" ? (
                    paginatedGuests.map((guest: any) => (
                      <div
                        key={guest.guest_id || guest.ref_number}
                        className="grid grid-cols-[2fr_1.2fr_0.8fr_1.5fr_1.2fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(guest.full_name || "")}`}>
                            {getInitials(guest.full_name || "G")}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{guest.full_name || "Guest"}</p>
                            <p className="text-xs text-gray-400 truncate">{guest.email || "—"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{guest.checkin_date} → {guest.checkout_date}</p>
                        </div>
                        <div><span className="text-xs text-gray-400">—</span></div>
                        <div><span className="text-xs text-gray-400">{guest.nationality || "—"}</span></div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In-House
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    (paginatedGuests as GuestProfile[]).map((guest) => {
                    const statusStyle = getStatusStyle(guest.status, guest.room_number)
                    return (
                      <div
                        key={guest.id}
                        className="grid grid-cols-[2fr_1.2fr_0.8fr_1.5fr_1.2fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                      >
                        {/* Guest Profile */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(
                              guest.name
                            )}`}
                          >
                            {getInitials(guest.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {guest.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{guest.email}</p>
                          </div>
                        </div>

                        {/* Stays & Recency */}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {guest.total_stays} stay{guest.total_stays !== 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-gray-400">
                            Last: {formatDate(guest.last_stay)}
                          </p>
                        </div>

                        {/* Total Spent */}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatAmount(guest.total_spent)}
                          </p>
                        </div>

                        {/* Preferences */}
                        <div>
                          {guest.preferences.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {guest.preferences.slice(0, 3).map((pref, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full"
                                >
                                  {pref}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>

                        {/* Current Status */}
                        <div>
                          {guest.room_number ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              In-House · Room {guest.room_number}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </div>
                    )
                  })
                  )}
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-gray-50">
                  {activeTab === "in_house" ? (
                    paginatedGuests.map((guest: any) => (
                      <div
                        key={guest.guest_id || guest.ref_number}
                        className="px-4 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(guest.full_name || "")}`}>
                            {getInitials(guest.full_name || "G")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{guest.full_name || "Guest"}</p>
                                <p className="text-xs text-gray-400 truncate">{guest.email || "—"}</p>
                              </div>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                In-House
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Stay Dates</p>
                                <p className="text-sm text-gray-700">{guest.checkin_date} → {guest.checkout_date}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Phone</p>
                                <p className="text-sm text-gray-700">{guest.phone || "—"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    (paginatedGuests as GuestProfile[]).map((guest) => {
                    const statusStyle = getStatusStyle(guest.status, guest.room_number)
                    return (
                      <div
                        key={guest.id}
                        className="px-4 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(
                              guest.name
                            )}`}
                          >
                            {getInitials(guest.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {guest.name}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{guest.email}</p>
                              </div>
                              {guest.room_number ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  In-House
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Stay Dates</p>
                                <p className="text-sm text-gray-700">
                                  {guest.total_stays} stay{guest.total_stays !== 1 ? "s" : ""} · Last: {formatDate(guest.last_stay)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Total Spent</p>
                                <p className="text-sm font-semibold text-gray-900">{formatAmount(guest.total_spent)}</p>
                              </div>
                            </div>

                            {guest.preferences.length > 0 && (
                              <div className="mt-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Preferences</p>
                                <div className="flex flex-wrap gap-1">
                                  {guest.preferences.slice(0, 3).map((pref, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full"
                                    >
                                      {pref}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                  )}
                </div>

                {/* Pagination */}
                <FrontDeskPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredGuests.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  itemLabel="guest profiles"
                />
              </>
            )}
          </div>

        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}
