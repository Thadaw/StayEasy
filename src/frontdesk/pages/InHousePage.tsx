import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Mail, Phone, Search, Home, LogOut, CheckCircle, LayoutGrid, List } from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { FrontDeskPagination } from "../components/FrontDeskPagination"
import { FrontdeskTableSkeleton } from "../components/FrontdeskTableSkeleton"
import { usePropertyStore } from "../../stores/propertyStore"
import { useBookingCheckOutStore } from "../stores/bookingCheckOutStore"
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
  const navigate = useNavigate()
  const { currentPropertyId } = usePropertyStore()
  const { isCheckedOut } = useBookingCheckOutStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [page, setPage] = useState(1)
  const pageSize = 12

  const handleCheckout = (refNumber: string) => {
    navigate(`/frontdesk/checkout/${refNumber}`)
  }

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">In House <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{inHouseGuests.length}</span></h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Guests currently checked in and staying at the property.
                </p>
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
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <FrontdeskTableSkeleton columns={9} />
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
            ) : viewMode === "list" ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Guest</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-in</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-out</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Nights</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Ref</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paged.map((guest) => {
                        const nights = nightsBetween(guest.checkin_date, guest.checkout_date)
                        return (
                          <tr key={guest.guest_id || guest.ref_number} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                                  {getInitials(guest.full_name || "G")}
                                </div>
                                <span className="font-medium text-gray-900 truncate">{guest.full_name || "Guest"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">{guest.email || "—"}</td>
                            <td className="px-4 py-3 text-gray-600">{guest.phone || "—"}</td>
                            <td className="px-4 py-3 text-gray-600">{guest.checkin_date}</td>
                            <td className="px-4 py-3 text-gray-600">{guest.checkout_date}</td>
                            <td className="px-4 py-3 text-gray-600">{nights}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">#{guest.ref_number}</td>
                            <td className="px-4 py-3 text-center">
                              {isCheckedOut(guest.ref_number) ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                  <CheckCircle size={14} />
                                  Checked Out
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                                  IN HOUSE
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {!isCheckedOut(guest.ref_number) && (
                                <button
                                  onClick={() => handleCheckout(guest.ref_number)}
                                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <LogOut size={13} />
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paged.map((guest) => {
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

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">#{guest.ref_number}</span>
                        {isCheckedOut(guest.ref_number) ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle size={14} />
                            Checked Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCheckout(guest.ref_number) }}
                            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <LogOut size={13} />
                            Check Out
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <FrontDeskPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              itemLabel="guests"
            />
          </div>
        </main>
      </div>
    </FrontDeskSidebarProvider>
  )
}
