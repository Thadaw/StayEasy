import { useState, useMemo } from "react"
import {
  Search,
  Download,
  Plus,
  Grid3X3,
  List,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

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

function avatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-purple-100 text-purple-700",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-700",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
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

    const isCurrentlyCheckedIn = b.status === "checked_in" || b.status === "in_house"
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
        status: isCurrentlyCheckedIn ? "in_house" : "active",
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
  const { user } = useAuth()
  const { currentPropertyId } = usePropertyStore()
  const { formatAmount } = usePropertyCurrency()

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("recent")

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["frontdesk-guests", currentPropertyId, searchQuery],
    queryFn: async () => {
      if (!currentPropertyId) return EMPTY_BOOKINGS
      try {
        let allBookings: Booking[] = []
        let skip = 0
        let hasMore = true

        while (hasMore) {
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
      } catch {
        return EMPTY_BOOKINGS
      }
    },
    enabled: !!currentPropertyId,
    placeholderData: EMPTY_BOOKINGS,
  })

  const allGuests = useMemo(() => deriveGuestsFromBookings(bookingsData ?? []), [bookingsData])

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
      return sortedGuests.filter((g) => g.room_number)
    }
    return sortedGuests
  }, [sortedGuests, activeTab])

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE))
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const inHouseCount = allGuests.filter((g) => g.room_number).length

  const handleReset = () => {
    setSearchInput("")
    setSearchQuery("")
    setSortBy("recent")
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
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
                  All Guests ({allGuests.length.toLocaleString()})
                </button>
                <button
                  onClick={() => { setActiveTab("in_house"); setCurrentPage(1) }}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === "in_house"
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  In-House ({inHouseCount})
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
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Sort: Most Recent Stays</option>
                  <option value="spending">Sort: Highest Spending</option>
                  <option value="stays">Sort: Most Stays</option>
                  <option value="name">Sort: Name A–Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : paginatedGuests.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 font-medium">No guests found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try a different search term" : "No guest records yet"}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1.2fr_0.8fr_1.5fr_1.2fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Guest Profile</div>
                  <div>Stays & Recency</div>
                  <div>Total Spent</div>
                  <div>Preferences & Stay Notes</div>
                  <div>Current Status</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {paginatedGuests.map((guest) => {
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
                  })}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredGuests.length)} of{" "}
                    {filteredGuests.length.toLocaleString()} guest profiles
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors ${
                        currentPage === 1
                          ? "opacity-40 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="w-9 h-9 flex items-center justify-center bg-gray-900 text-white text-sm font-semibold rounded-lg">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors ${
                        currentPage >= totalPages
                          ? "opacity-40 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            All guest records and tier privileges are synchronized real-time across property management systems.
          </p>
        </div>
      </main>
    </div>
  )
}
