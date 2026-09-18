import { useState } from "react"
import { Calendar, Mail, Phone, Search, Home } from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function nightsBetween(a: string, b: string): number {
  return Math.max(1, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)))
}

export default function InHousePage() {
  const { currentPropertyId } = usePropertyStore()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: inHouseGuests = [], isLoading } = useQuery({
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
    refetchOnMount: true,
  })

  const filtered = inHouseGuests.filter((g) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const name = g.full_name?.toLowerCase() || ""
    const ref = g.ref_number?.toLowerCase() || ""
    return name.includes(q) || ref.includes(q)
  })

  return (
    <FrontDeskSidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <FrontDeskSidebar />
        <main className="flex-1 overflow-auto">
          <MobileMenuButton />
          <div className="p-4 lg:p-6 pt-14 lg:pt-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Guests</p>
                <h2 className="text-2xl font-bold text-gray-900">In House</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Guests currently checked in and staying at the property.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">{inHouseGuests.length} guest{inHouseGuests.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by guest, room, or ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">Loading in-house guests...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">
                  {searchQuery ? "No guests match your search" : "No guests currently in-house"}
                </p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Checked-in guests will appear here."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((guest) => {
                  const nights = nightsBetween(guest.checkin_date, guest.checkout_date)
                  return (
                    <div
                      key={guest.guest_id || guest.ref_number}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-200 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700 shrink-0">
                            {getInitials(guest.full_name || "G")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{guest.full_name || "Guest"}</p>
                            <p className="text-xs text-gray-500 truncate">{guest.nationality || "—"}</p>
                          </div>
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 shrink-0">
                          IN HOUSE
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{guest.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={13} className="text-gray-400 shrink-0" />
                          <span>{guest.phone || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={13} className="text-gray-400 shrink-0" />
                          <span>{guest.checkin_date} → {guest.checkout_date} ({nights} night{nights !== 1 ? "s" : ""})</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">#{guest.ref_number}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </FrontDeskSidebarProvider>
  )
}
