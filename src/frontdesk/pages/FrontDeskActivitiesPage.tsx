import { useState, useMemo } from "react"
import {
  Search,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Calendar,
} from "lucide-react"
import * as XLSX from "xlsx"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { ExportButton } from "../components/ExportButton"

import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

interface Activity {
  id: string
  staff_name: string
  activity_type: string
  description: string
  booking_id: string
  room_id: string
  extra_data: Record<string, unknown>
  created_at: string
}

type StatusTab = "active" | "completed"

function getTypeStyle(type: string): string {
  const lower = type?.toLowerCase() || ""
  if (lower.includes("check_in") || lower.includes("checkin")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("check_out") || lower.includes("checkout")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("room_status") || lower.includes("roomstatus")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("walkin") || lower.includes("walk-in")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("booking")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("guest") || lower.includes("request")) {
    return "bg-gray-100 text-gray-700"
  }
  if (lower.includes("maintenance")) {
    return "bg-gray-100 text-gray-700"
  }
  return "bg-gray-100 text-gray-700"
}

function getPriorityDot(activityType: string): string {
  const lower = activityType?.toLowerCase() || ""
  if (lower.includes("urgent") || lower.includes("maintenance")) return "bg-red-500"
  if (lower.includes("created") || lower.includes("request")) return "bg-amber-400"
  return "bg-gray-300"
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

const EMPTY_ACTIVITIES: Activity[] = []

export default function FrontDeskActivitiesPage() {
  const { currentPropertyId } = usePropertyStore()
  const [activeTab, setActiveTab] = useState<StatusTab>("active")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeExpanded, setActiveExpanded] = useState(true)
  const [completedExpanded, setCompletedExpanded] = useState(true)

  const { data: activitiesData, isLoading, isError } = useQuery({
    queryKey: ["frontdesk-booking-activities", currentPropertyId, searchQuery],
    queryFn: async () => {
      if (!currentPropertyId) return EMPTY_ACTIVITIES
      const params: Record<string, string> = { limit: "100", skip: "0" }
      const { data: result } = await api.get(
        `/staff/properties/${currentPropertyId}/activities/booking`,
        { params }
      )
      
      const apiResult = result as { success?: boolean; data?: Activity[] }
      if (apiResult.success === false) {
        throw new Error("Failed to fetch booking activities")
      }
      
      const apiData = apiResult.data ?? []
      return apiData
    },
    enabled: !!currentPropertyId,
  })

  const filteredActivities = useMemo(() => {
    let activities = activitiesData ?? []
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase()
      activities = activities.filter((activity) => {
        const description = activity.description?.toLowerCase() || ""
        const staffName = activity.staff_name?.toLowerCase() || ""
        const activityType = activity.activity_type?.toLowerCase() || ""
        return description.includes(search) || staffName.includes(search) || activityType.includes(search)
      })
    }
    return activities
  }, [activitiesData, searchQuery])

  const isCompleted = (activity: Activity) => {
    const type = activity.activity_type?.toLowerCase() || ""
    return type.includes("completed") || type.includes("submitted") || type.includes("reviewed")
  }

  const isUrgent = (activity: Activity) => {
    const type = activity.activity_type?.toLowerCase() || ""
    return type.includes("urgent") || type.includes("maintenance")
  }

  const activeTasks = filteredActivities.filter((activity) => !isCompleted(activity))
  const completedTasks = filteredActivities.filter((activity) => isCompleted(activity))
  const urgentCount = activeTasks.filter(isUrgent).length

  const handleReset = () => {
    setSearchInput("")
    setSearchQuery("")
    setActiveTab("active")
  }

  const handleExport = () => {
    const data = filteredActivities.map((a) => ({
      "Staff": a.staff_name,
      "Type": a.activity_type,
      "Description": a.description,
      "Booking ID": a.booking_id,
      "Time": a.created_at,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Activities")
    XLSX.writeFile(wb, `activities-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Operations & Housekeeping
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Booking Activities</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Track and manage all booking-related activities, guest requests, and team assignments.
              </p>
            </div>
            <ExportButton onClick={handleExport} label="Export CSV" />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities, booking, assignee..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchQuery(searchInput)
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                />
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 inline-block">
                Failed to load activities. Please try again.
              </p>
            </div>
          ) : (
            <>
              {/* Active Tasks Section */}
              {activeTab === "active" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                  <button
                    onClick={() => setActiveExpanded(!activeExpanded)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {activeExpanded ? <ChevronDown size={18} className="text-gray-400 shrink-0" /> : <ChevronRight size={18} className="text-gray-400 shrink-0" />}
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Active</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full shrink-0">
                        {activeTasks.length}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">Sorted by urgency</span>
                  </button>

                  {activeExpanded && (
                    <>
                      <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.7fr] gap-4 px-6 py-3 bg-gray-50 border-t border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Booking / Activity</div>
                        <div>Type</div>
                        <div>Description</div>
                        <div>Staff</div>
                        <div className="text-right">Time</div>
                      </div>
                      <div className="hidden lg:grid divide-y divide-gray-100">
                        {activeTasks.map((activity) => (
                          <div key={activity.id} className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.7fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(activity.activity_type)}`} />
                              <span className="text-sm text-gray-900 truncate">{activity.description || "—"}</span>
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600 truncate">{activity.description || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(activity.staff_name)}`}>
                                {getInitials(activity.staff_name)}
                              </span>
                              <span className="text-sm text-gray-700">{activity.staff_name || "—"}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">{formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {activeTasks.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <CheckCircle size={20} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-semibold">No active activities</p>
                            <p className="text-sm text-gray-500">Active tasks will appear here.</p>
                          </div>
                        )}
                      </div>
                      <div className="lg:hidden divide-y divide-gray-100">
                        {activeTasks.map((activity) => (
                          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(activity.activity_type)}`} />
                                <span className="text-sm text-gray-900 truncate">{activity.description || "—"}</span>
                              </div>
                              <span className={`shrink-0 ml-2 inline-block px-2.5 py-1 rounded text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{activity.description || "—"}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(activity.staff_name)}`}>
                                  {getInitials(activity.staff_name)}
                                </span>
                                <span className="text-xs text-gray-600">{activity.staff_name || "—"}</span>
                              </div>
                              <span className="text-xs text-gray-400">{formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {activeTasks.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <CheckCircle size={20} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-semibold">No active activities</p>
                            <p className="text-sm text-gray-500">Active tasks will appear here.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Completed Tasks */}
              {activeTab === "completed" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                  <button
                    onClick={() => setCompletedExpanded(!completedExpanded)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
                      {completedExpanded ? <ChevronDown size={18} className="text-gray-400 shrink-0" /> : <ChevronRight size={18} className="text-gray-400 shrink-0" />}
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">Completed <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{completedTasks.length}</span></h3>
                      <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                        All Finished
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">Auto-archived</span>
                  </button>

                  {completedExpanded && (
                    <>
                      <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.7fr] gap-4 px-6 py-3 bg-gray-50 border-t border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Booking / Activity</div>
                        <div>Type</div>
                        <div>Description</div>
                        <div>Staff</div>
                        <div className="text-right">Time</div>
                      </div>
                      <div className="hidden lg:grid divide-y divide-gray-100">
                        {completedTasks.map((activity) => (
                          <div key={activity.id} className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.7fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center opacity-60">
                            <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                              <span className="text-sm text-gray-700 line-through truncate">{activity.description || "—"}</span>
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 truncate">{activity.description || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(activity.staff_name)}`}>
                                {getInitials(activity.staff_name)}
                              </span>
                              <span className="text-sm text-gray-500">{activity.staff_name || "—"}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-emerald-600">{formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {completedTasks.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <CheckCircle size={20} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-semibold">No completed activities</p>
                            <p className="text-sm text-gray-500">Completed tasks will appear here.</p>
                          </div>
                        )}
                      </div>
                      <div className="lg:hidden divide-y divide-gray-100">
                        {completedTasks.map((activity) => (
                          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors opacity-60">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span className="text-sm text-gray-700 line-through truncate">{activity.description || "—"}</span>
                              </div>
                              <span className={`shrink-0 ml-2 inline-block px-2.5 py-1 rounded text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{activity.description || "—"}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(activity.staff_name)}`}>
                                  {getInitials(activity.staff_name)}
                                </span>
                                <span className="text-xs text-gray-600">{activity.staff_name || "—"}</span>
                              </div>
                                <span className="text-xs text-emerald-600">{formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {completedTasks.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <CheckCircle size={20} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-semibold">No completed activities</p>
                            <p className="text-sm text-gray-500">Completed tasks will appear here.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}
