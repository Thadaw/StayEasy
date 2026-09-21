import { useState, useMemo } from "react"
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  MessageSquare,
  Wrench,
  CreditCard,
  Users,
  Star,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/pmsApi"
import type { StaffNotification } from "../../types/pms"

type TabKey = "all" | "guest_requests" | "housekeeping" | "payments" | "staff_handoff"

const TYPE_TO_TAB: Record<string, TabKey> = {
  guest_request: "guest_requests",
  housekeeping: "housekeeping",
  payment: "payments",
  staff_handoff: "staff_handoff",
  booking: "guest_requests",
  maintenance: "housekeeping",
}

const TYPE_CONFIG: Record<string, { icon_bg: string; icon_color: string; dot_color: string; Icon: typeof Bell }> = {
  guest_request: { icon_bg: "bg-teal-50", icon_color: "text-teal-600", dot_color: "bg-teal-500", Icon: MessageSquare },
  housekeeping: { icon_bg: "bg-blue-50", icon_color: "text-blue-600", dot_color: "bg-blue-500", Icon: Wrench },
  payment: { icon_bg: "bg-amber-50", icon_color: "text-amber-600", dot_color: "bg-amber-500", Icon: CreditCard },
  staff_handoff: { icon_bg: "bg-purple-50", icon_color: "text-purple-600", dot_color: "bg-purple-500", Icon: Users },
  booking: { icon_bg: "bg-green-50", icon_color: "text-green-600", dot_color: "bg-green-500", Icon: Star },
  maintenance: { icon_bg: "bg-orange-50", icon_color: "text-orange-600", dot_color: "bg-orange-500", Icon: Wrench },
  alert: { icon_bg: "bg-red-50", icon_color: "text-red-600", dot_color: "bg-red-500", Icon: AlertTriangle },
  info: { icon_bg: "bg-sky-50", icon_color: "text-sky-600", dot_color: "bg-sky-500", Icon: Info },
}

const DEFAULT_CONFIG = { icon_bg: "bg-gray-50", icon_color: "text-gray-600", dot_color: "bg-gray-500", Icon: Bell }

function getTabForType(type: string): TabKey {
  return TYPE_TO_TAB[type] ?? "all"
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? DEFAULT_CONFIG
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "guest_requests", label: "Guest Requests" },
  { key: "housekeeping", label: "Housekeeping" },
  { key: "payments", label: "Payments" },
  { key: "staff_handoff", label: "Staff Handoff" },
]

export default function FrontDeskNotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [selectedNotification, setSelectedNotification] = useState<StaffNotification | null>(null)
  const queryClient = useQueryClient()
  const { currentPropertyId } = usePropertyStore()

  const { data: notificationsData, isLoading, isError } = useQuery({
    queryKey: ["staff-notifications", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      return getNotifications({ property_id: currentPropertyId, limit: 50 })
    },
    enabled: !!currentPropertyId,
    refetchInterval: 30000,
  })

  const notifications = notificationsData?.notifications ?? []

  const markReadMutation = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      markNotificationRead({ notificationId, propertyId: currentPropertyId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-notifications", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count", currentPropertyId] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!currentPropertyId) return
      return markAllNotificationsRead(currentPropertyId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-notifications", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count", currentPropertyId] })
    },
  })

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications
    return notifications.filter((n) => getTabForType(n.type) === activeTab)
  }, [activeTab, notifications])

  const unreadCount = notificationsData?.unread_count ?? notifications.filter((n) => !n.is_read).length

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: notifications.length,
      guest_requests: notifications.filter((n) => getTabForType(n.type) === "guest_requests").length,
      housekeeping: notifications.filter((n) => getTabForType(n.type) === "housekeeping").length,
      payments: notifications.filter((n) => getTabForType(n.type) === "payments").length,
      staff_handoff: notifications.filter((n) => getTabForType(n.type) === "staff_handoff").length,
    }
    return counts
  }, [notifications])

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate()
  }

  const handleNotificationClick = (notification: StaffNotification) => {
    setSelectedNotification(notification)
    if (!notification.is_read) {
      markReadMutation.mutate({ notificationId: notification.id })
    }
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
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-1">Inbox</p>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500 mt-1">
                Stay ahead of guest needs, room readiness, and team handoffs.
              </p>
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending || unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {markAllReadMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              Mark all read
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                    activeTab === tab.key
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  {tab.key === "all" && unreadCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 ml-1.5">{unreadCount}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 size={32} className="mx-auto text-gray-400 animate-spin mb-3" />
                <p className="text-gray-500 font-medium">Loading notifications...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Failed to load notifications</p>
                <p className="text-sm text-gray-400 mt-1">Please try again later.</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No notifications</p>
                <p className="text-sm text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const config = getTypeConfig(notification.type)
                  const IconComponent = config.Icon
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.icon_bg}`}>
                        <IconComponent size={18} className={config.icon_color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.is_read && (
                            <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot_color}`} />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{formatTime(notification.created_at)}</span>
                        </div>
                      </div>

                      {/* Chevron */}
                      <ChevronRight size={18} className="text-gray-300 shrink-0" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Notification Detail Modal */}
      {selectedNotification && (() => {
        const config = getTypeConfig(selectedNotification.type)
        const IconComponent = config.Icon
        const priorityColors: Record<string, string> = {
          low: "bg-gray-100 text-gray-600",
          medium: "bg-blue-100 text-blue-700",
          high: "bg-amber-100 text-amber-700",
          urgent: "bg-red-100 text-red-700",
        }
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedNotification(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className={`flex items-center gap-4 p-6 ${config.icon_bg}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.icon_bg} ring-1 ring-black/5`}>
                  <IconComponent size={22} className={config.icon_color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {selectedNotification.type.replace(/_/g, " ")}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priorityColors[selectedNotification.priority] || "bg-gray-100 text-gray-600"}`}>
                      {selectedNotification.priority}
                    </span>
                    {!selectedNotification.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">{selectedNotification.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNotification.message}</p>

                {/* Meta info */}
                {Object.keys(selectedNotification.meta).length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedNotification.meta).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-xs font-medium text-gray-500 min-w-[100px] capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm text-gray-700 break-all">
                            {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{new Date(selectedNotification.created_at).toLocaleString()}</span>
                  </div>
                  {selectedNotification.read_at && (
                    <div className="flex items-center gap-1.5">
                      <Check size={12} />
                      <span>Read {new Date(selectedNotification.read_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
    </FrontDeskSidebarProvider>
  )
}
