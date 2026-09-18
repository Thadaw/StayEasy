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
} from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"

type TabKey = "all" | "guest_requests" | "housekeeping" | "payments" | "staff_handoff"

interface Notification {
  id: string
  title: string
  description: string
  category: TabKey
  time: string
  read: boolean
  icon_bg: string
  icon_color: string
  dot_color: string
  Icon: typeof Bell
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "guest_requests", label: "Guest Requests" },
  { key: "housekeeping", label: "Housekeeping" },
  { key: "payments", label: "Payments" },
  { key: "staff_handoff", label: "Staff Handoff" },
]

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New message from Marcus Chen",
    description: "Guest asked about late checkout for room 317.",
    category: "guest_requests",
    time: "6 min ago",
    read: false,
    icon_bg: "bg-blue-50",
    icon_color: "text-blue-500",
    dot_color: "bg-blue-500",
    Icon: MessageSquare,
  },
  {
    id: "2",
    title: "Room 203 needs attention",
    description: "Housekeeping marked a turnover as high priority.",
    category: "housekeeping",
    time: "18 min ago",
    read: false,
    icon_bg: "bg-amber-50",
    icon_color: "text-amber-500",
    dot_color: "bg-amber-500",
    Icon: Wrench,
  },
  {
    id: "3",
    title: "Payment captured",
    description: "$480.00 from Sofia Alvarez was recorded.",
    category: "payments",
    time: "42 min ago",
    read: false,
    icon_bg: "bg-emerald-50",
    icon_color: "text-emerald-500",
    dot_color: "bg-emerald-500",
    Icon: CreditCard,
  },
  {
    id: "4",
    title: "Shift handoff received",
    description: "Camila Rivera shared the evening desk notes.",
    category: "staff_handoff",
    time: "1 hr ago",
    read: false,
    icon_bg: "bg-purple-50",
    icon_color: "text-purple-500",
    dot_color: "bg-purple-500",
    Icon: Users,
  },
  {
    id: "5",
    title: "VIP Guest Arrival imminent",
    description: "Olivia Martin (#HH6B2X) scheduled check-in at 2:30 PM.",
    category: "guest_requests",
    time: "2 hr ago",
    read: false,
    icon_bg: "bg-teal-50",
    icon_color: "text-teal-500",
    dot_color: "bg-teal-500",
    Icon: Star,
  },
]

export default function FrontDeskNotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications
    return notifications.filter((n) => n.category === activeTab)
  }, [activeTab, notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: notifications.length,
      guest_requests: notifications.filter((n) => n.category === "guest_requests").length,
      housekeeping: notifications.filter((n) => n.category === "housekeeping").length,
      payments: notifications.filter((n) => n.category === "payments").length,
      staff_handoff: notifications.filter((n) => n.category === "staff_handoff").length,
    }
    return counts
  }, [notifications])

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
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
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Check size={16} />
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
                    <span className="ml-1.5">({tabCounts[tab.key]})</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notification.icon_bg}`}>
                      <notification.Icon size={18} className={notification.icon_color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${notification.dot_color}`} />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}
