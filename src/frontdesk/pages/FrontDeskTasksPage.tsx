import { useState, useMemo } from "react"
import {
  Search,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Calendar,
  Download,
} from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { ResetButton } from "../components/ResetButton"
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
  if (lower.includes("guest") || lower.includes("request")) {
    return "bg-blue-50 text-blue-700 border border-blue-200"
  }
  if (lower.includes("turnover") || lower.includes("turn")) {
    return "bg-purple-50 text-purple-700 border border-purple-200"
  }
  if (lower.includes("maintenance")) {
    return "bg-rose-50 text-rose-700 border border-rose-200"
  }
  if (lower.includes("clean") || lower.includes("submit")) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200"
  }
  if (lower.includes("review")) {
    return "bg-amber-50 text-amber-700 border border-amber-200"
  }
  return "bg-gray-100 text-gray-600 border border-gray-200"
}

function getPriorityDot(activityType: string): string {
  const lower = activityType?.toLowerCase() || ""
  if (lower.includes("urgent") || lower.includes("maintenance")) return "bg-red-500"
  if (lower.includes("created") || lower.includes("request")) return "bg-amber-400"
  return "bg-gray-300"
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-purple-100 text-purple-700",
    "bg-cyan-100 text-cyan-700",
  ]
  let hash = 0
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
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
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

const EMPTY_ACTIVITIES: Activity[] = []

export default function FrontDeskTasksPage() {
  const { currentPropertyId } = usePropertyStore()
  const [activeTab, setActiveTab] = useState<StatusTab>("active")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeExpanded, setActiveExpanded] = useState(true)
  const [completedExpanded, setCompletedExpanded] = useState(true)

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ["frontdesk-booking-activities", currentPropertyId, searchQuery],
    queryFn: async () => {
      if (!currentPropertyId) return EMPTY_ACTIVITIES
      try {
        const params: Record<string, string> = { limit: "100", skip: "0" }
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/activities/booking`,
          { params }
        )
        
        const apiResult = result as { success?: boolean; data?: Activity[] }
        if (apiResult.success === false) {
          console.error("API error:", result)
          return EMPTY_ACTIVITIES
        }
        
        const apiData = apiResult.data ?? []
        return apiData
      } catch (error) {
        console.error("Failed to fetch booking activities:", error)
        return EMPTY_ACTIVITIES
      }
    },
    enabled: !!currentPropertyId,
  })

  const filteredActivities = useMemo(() => {
    let activities = activitiesData ?? []
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      activities = activities.filter(
        (a) =>
          a.description?.toLowerCase().includes(q) ||
          a.staff_name?.toLowerCase().includes(q) ||
          a.activity_type?.toLowerCase().includes(q)
      )
    }
    return activities
  }, [activitiesData, searchQuery])

  const isCompleted = (a: Activity) => {
    const t = a.activity_type?.toLowerCase() || ""
    return t.includes("completed") || t.includes("submitted") || t.includes("reviewed")
  }

  const activeTasks = filteredActivities.filter((a) => !isCompleted(a))
  const completedTasks = filteredActivities.filter((a) => isCompleted(a))
  const urgentCount = activeTasks.filter((a) => {
    const t = a.activity_type?.toLowerCase() || ""
    return t.includes("urgent") || t.includes("maintenance")
  }).length

  const handleReset = () => {
    setSearchInput("")
    setSearchQuery("")
    setActiveTab("active")
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Operations & Housekeeping
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Tasks & Requests</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Coordinate room turnovers, guest requests, maintenance workflows, and team assignments.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Download size={14} />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{filteredActivities.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active / In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeTasks.length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 text-lg">⏱️</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Urgent & Due Soon</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{urgentCount}</p>
                {urgentCount > 0 && <span className="text-xs text-red-500 font-medium">Needs attention</span>}
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <span className="text-red-500 text-lg">⚠️</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{completedTasks.length}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 text-lg">✅</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks, room, assignee..."
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

              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <span className="pl-9 pr-4 py-2.5 text-sm text-gray-700 font-medium">
                  Today: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(["active", "completed"] as StatusTab[]).map((tab) => {
                  const count = tab === "active" ? activeTasks.length : completedTasks.length
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        activeTab === tab
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab === "active" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                    </button>
                  )
                })}
              </div>

              <ResetButton onClick={handleReset} label="Reset Filters" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Active Tasks Section */}
              {activeTab === "active" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                  <button
                    onClick={() => setActiveExpanded(!activeExpanded)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {activeExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Active Tasks</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {activeTasks.length} Ongoing
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Sorted by urgency</span>
                  </button>

                  {activeExpanded && (
                    <>
                      <div className="hidden lg:grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] gap-4 px-6 py-2 bg-gray-50 border-t border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Request / Task</div>
                        <div>Type</div>
                        <div>Description</div>
                        <div>Staff</div>
                        <div>Time</div>
                      </div>
                      <div className="hidden lg:grid divide-y divide-gray-50">
                        {activeTasks.map((activity) => (
                          <div key={activity.id} className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPriorityDot(activity.activity_type)}`} />
                              <span className="text-sm font-medium text-gray-900 truncate">{activity.description || "—"}</span>
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-700 truncate">{activity.description || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(activity.staff_name)}`}>
                                {getInitials(activity.staff_name)}
                              </span>
                              <span className="text-sm text-gray-700">{activity.staff_name || "—"}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">{formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {activeTasks.length === 0 && (
                          <div className="px-6 py-8 text-center text-sm text-gray-400">No active tasks</div>
                        )}
                      </div>
                      <div className="lg:hidden divide-y divide-gray-100">
                        {activeTasks.map((activity) => (
                          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPriorityDot(activity.activity_type)}`} />
                                <span className="text-sm font-medium text-gray-900 truncate">{activity.description || "—"}</span>
                              </div>
                              <span className={`shrink-0 ml-2 inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
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
                          <div className="px-6 py-8 text-center text-sm text-gray-400">No active tasks</div>
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
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {completedExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Completed Tasks ({completedTasks.length})</h3>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                        All Finished
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Auto-archived at 12:00 AM</span>
                  </button>

                  {completedExpanded && (
                    <>
                      <div className="hidden lg:grid grid-cols-[2fr_1fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-2 bg-gray-50 border-t border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Request / Task</div>
                        <div>Type</div>
                        <div>Description</div>
                        <div>Staff</div>
                        <div>Time</div>
                      </div>
                      <div className="hidden lg:grid divide-y divide-gray-50">
                        {completedTasks.map((activity) => (
                          <div key={activity.id} className="grid grid-cols-[2fr_1fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center opacity-60">
                            <div className="flex items-center gap-3">
                              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                              <span className="text-sm font-medium text-gray-700 line-through truncate">{activity.description || "—"}</span>
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
                                {activity.activity_type || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 truncate">{activity.description || "—"}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">{activity.staff_name || "—"}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-emerald-600">✓ {formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {completedTasks.length === 0 && (
                          <div className="px-6 py-8 text-center text-sm text-gray-400">No completed tasks</div>
                        )}
                      </div>
                      <div className="lg:hidden divide-y divide-gray-100">
                        {completedTasks.map((activity) => (
                          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors opacity-60">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span className="text-sm font-medium text-gray-700 line-through truncate">{activity.description || "—"}</span>
                              </div>
                              <span className={`shrink-0 ml-2 inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(activity.activity_type)}`}>
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
                              <span className="text-xs font-medium text-emerald-600">✓ {formatTime(activity.created_at)}</span>
                            </div>
                          </div>
                        ))}
                        {completedTasks.length === 0 && (
                          <div className="px-6 py-8 text-center text-sm text-gray-400">No completed tasks</div>
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
