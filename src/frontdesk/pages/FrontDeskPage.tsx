import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  CalendarCheck, 
  CalendarX, 
  BedDouble, 
  Users, 
  TrendingUp,
  Clock,
  Bell,
  User,
  LogOut,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  LogOut as LogOutIcon,
  MessageSquare,
  Wrench,
  CreditCard,
  Star,
  Plus,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { ErrorBoundary } from "../../shared/components/ErrorBoundary"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import {
  getFrontDeskSummary,
  getTodayDepartures,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/pmsApi"
import type { StaffNotification } from "../../types/pms"
import api from "../../services/axios"
import { StatCard } from "../components/StatCard"
import { OccupancyChart } from "../components/OccupancyChart"
import { RevenueChart } from "../components/RevenueChart"
import { QuickActions } from "../components/QuickActions"
import { NewBookingForm } from "../components/NewBookingForm"
import { ArrivalsPanel } from "../components/ArrivalsPanel"
import { DeparturesPanel } from "../components/DeparturesPanel"
import { RoomStatusPanel } from "../components/RoomStatusPanel"
import { useWebSocket } from "../hooks/useWebSocket"

const NOTIF_ICON_MAP: Record<string, { Icon: typeof Bell; bg: string; color: string }> = {
  guest_request: { Icon: MessageSquare, bg: "bg-teal-50", color: "text-teal-500" },
  housekeeping: { Icon: Wrench, bg: "bg-blue-50", color: "text-blue-500" },
  payment: { Icon: CreditCard, bg: "bg-amber-50", color: "text-amber-500" },
  staff_handoff: { Icon: Users, bg: "bg-purple-50", color: "text-purple-500" },
  booking: { Icon: Star, bg: "bg-green-50", color: "text-green-500" },
  maintenance: { Icon: Wrench, bg: "bg-orange-50", color: "text-orange-500" },
  alert: { Icon: AlertCircle, bg: "bg-red-50", color: "text-red-500" },
  info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-500" },
}

function getNotifDisplay(type: string) {
  return NOTIF_ICON_MAP[type] ?? { Icon: Info, bg: "bg-gray-50", color: "text-gray-500" }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  return `${diffDays}d ago`
}

export function FrontDeskPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, logout } = useAuth()
  const { formatAmount, currency } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [showArrivals, setShowArrivals] = useState(false)
  const [showDepartures, setShowDepartures] = useState(false)
  const [showRooms, setShowRooms] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [initialRoomId, setInitialRoomId] = useState<string | null>(null)
  const [initialCheckinDate, setInitialCheckinDate] = useState<string | null>(null)
  const [initialCheckoutDate, setInitialCheckoutDate] = useState<string | null>(null)
  const bookingFormRef = useRef<HTMLDivElement>(null)
  const arrivalsRef = useRef<HTMLDivElement>(null)
  const departuresRef = useRef<HTMLDivElement>(null)
  const roomsRef = useRef<HTMLDivElement>(null)

  const { data: summary } = useQuery({
    queryKey: ["front-desk-summary", currentPropertyId],
    queryFn: () => getFrontDeskSummary(currentPropertyId!),
    enabled: !!currentPropertyId,
    refetchInterval: 30000,
  })

  const { data: todayDepartures = [] } = useQuery({
    queryKey: ["today-departures", currentPropertyId],
    queryFn: () => getTodayDepartures(currentPropertyId!),
    enabled: !!currentPropertyId,
    refetchInterval: 60000,
  })

  useEffect(() => {
    if (showNewBooking) {
      const timer = setTimeout(() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      return () => clearTimeout(timer)
    }
  }, [showNewBooking])

  useEffect(() => {
    if (showArrivals) {
      const timer = setTimeout(() => arrivalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      return () => clearTimeout(timer)
    }
  }, [showArrivals])

  useEffect(() => {
    if (showDepartures) {
      const timer = setTimeout(() => departuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      return () => clearTimeout(timer)
    }
  }, [showDepartures])

  useEffect(() => {
    if (showRooms) {
      const timer = setTimeout(() => roomsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      return () => clearTimeout(timer)
    }
  }, [showRooms])

  useEffect(() => {
    const panel = searchParams.get("panel")
    if (panel === "new-booking") {
      setShowNewBooking(true)
      const roomId = searchParams.get("roomId")
      const checkinDate = searchParams.get("checkinDate")
      const checkoutDate = searchParams.get("checkoutDate")
      if (roomId) setInitialRoomId(roomId)
      if (checkinDate) setInitialCheckinDate(checkinDate)
      if (checkoutDate) setInitialCheckoutDate(checkoutDate)
    } else if (panel === "arrivals") {
      setShowArrivals(true)
    } else if (panel === "departures") {
      setShowDepartures(true)
    } else if (panel === "rooms") {
      setShowRooms(true)
    }
  }, [searchParams])

  const initials = user
    ? (user.firstName?.[0] || user.first_name?.[0] || 'S')
      + (user.lastName?.[0] || user.last_name?.[0] || '')
    : 'S'

  const displayName = user?.name || user?.full_name || `${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`.trim() || 'Staff'

  const handleSignOut = () => {
    logout()
    // Staff log in through the host section — /staff/login is a guest-mode
    // form that can never authenticate users-table staff credentials.
    navigate('/host/login')
  }

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ["staff-notifications-dropdown", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      const res = await getNotifications({ property_id: currentPropertyId, limit: 10 })
      return res?.notifications ?? []
    },
    enabled: !!currentPropertyId,
    refetchInterval: 30000,
  })

  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: ["unread-notifications-count", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return 0
      const count = await getUnreadNotificationCount(currentPropertyId)
      return count
    },
    enabled: !!currentPropertyId,
    refetchInterval: 30000,
  })

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!currentPropertyId) return
      return markAllNotificationsRead(currentPropertyId)
    },
    onSuccess: () => {
      refetchNotifications()
      refetchUnreadCount()
    },
  })

  const markReadMutation = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      markNotificationRead({ notificationId, propertyId: currentPropertyId! }),
    onSuccess: () => {
      refetchNotifications()
      refetchUnreadCount()
    },
  })

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        const eventType = data.type || data.event

        if (!eventType || eventType === "connected" || eventType === "ping" || eventType === "pong") return

        if (eventType === "booking_update" || eventType === "new_booking" || eventType === "booking") {
          queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
          queryClient.invalidateQueries({ queryKey: ["today-departures", currentPropertyId] })
          queryClient.invalidateQueries({ queryKey: ["revenue-bookings", currentPropertyId] })
          refetchNotifications()
          refetchUnreadCount()
        } else if (eventType === "check_in" || eventType === "check_out") {
          queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
          queryClient.invalidateQueries({ queryKey: ["today-departures", currentPropertyId] })
          refetchNotifications()
          refetchUnreadCount()
        } else if (eventType === "room_status" || eventType === "housekeeping") {
          queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
          refetchNotifications()
          refetchUnreadCount()
        } else if (eventType === "notification") {
          refetchNotifications()
          refetchUnreadCount()
        } else {
          queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
          queryClient.invalidateQueries({ queryKey: ["today-departures", currentPropertyId] })
          refetchNotifications()
          refetchUnreadCount()
        }
      } catch {
        // Ignore invalid JSON
      }
    },
    [currentPropertyId, queryClient, refetchNotifications, refetchUnreadCount]
  )

  useWebSocket({
    propertyId: currentPropertyId,
    onMessage: handleWebSocketMessage,
    enabled: !!currentPropertyId,
  })

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    weekday: 'short'
  })

  const stats = [
    {
      title: "Today's Arrivals",
      value: String(summary?.todays_arrivals ?? 0),
      subtitle: `of ${summary?.total_rooms ?? 0} total rooms`,
      icon: <CalendarCheck size={16} />,
    },
    {
      title: "Today's Departures",
      value: String(summary?.todays_departures ?? 0),
      subtitle: "departures today",
      icon: <CalendarX size={16} />,
    },
    {
      title: "Checked In",
      value: String(summary?.todays_checked_in ?? 0),
      subtitle: "today",
      icon: <Users size={16} />,
    },
    {
      title: "Checked Out",
      value: String(summary?.todays_checked_out ?? 0),
      subtitle: "completed today",
      icon: <CheckCircle size={16} />,
    },
    {
      title: "Available Rooms",
      value: String(summary?.total_available_rooms ?? 0),
      subtitle: `of ${summary?.total_rooms ?? 0} total rooms`,
      icon: <BedDouble size={16} />,
    },
    {
      title: "Occupied Rooms",
      value: String(summary?.occupied_rooms ?? 0),
      subtitle: summary?.total_rooms ? `${Math.round(((summary?.occupied_rooms ?? 0) / summary.total_rooms) * 100)}% occupancy` : "0% occupancy",
      icon: <TrendingUp size={16} />,
    },
    {
      title: "Dirty Rooms",
      value: String(summary?.dirty_rooms ?? 0),
      subtitle: "needs cleaning",
      icon: <Clock size={16} />,
    }
  ]

  const occupancyData = {
    occupied: summary?.occupied_rooms ?? 0,
    available: summary?.total_available_rooms ?? 0,
    cleaning: summary?.dirty_rooms ?? 0,
    maintenance: 0
  }

  const { data: bookingsRevenue = [] } = useQuery({
    queryKey: ["revenue-bookings", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      try {
        const { data: result } = await api.get(`/properties/${currentPropertyId}/bookings`, { params: { limit: "50", skip: "0" } })
        const wrapped = result as { data?: Array<{ created_at: string; total_amount: string }> }
        return (wrapped?.data ?? result) as Array<{ created_at: string; total_amount: string }>
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const { revenueData, currentRevenue, lastWeekRevenue, growth } = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfWeek.getDate() - 7)
    const endOfLastWeek = new Date(endOfWeek)
    endOfLastWeek.setDate(endOfWeek.getDate() - 7)

    const thisWeekRev = Array(7).fill(0)
    const lastWeekRev = Array(7).fill(0)

    bookingsRevenue.forEach((b) => {
      const created = new Date(b.created_at)
      const amount = parseFloat(b.total_amount) || 0

      if (created >= startOfWeek && created <= endOfWeek) {
        const dayIdx = created.getDay()
        thisWeekRev[dayIdx] += amount
      } else if (created >= startOfLastWeek && created <= endOfLastWeek) {
        const dayIdx = created.getDay()
        lastWeekRev[dayIdx] += amount
      }
    })

    const data = dayNames.map((day, i) => ({ day, revenue: Math.round(thisWeekRev[i]) }))
    const curTotal = thisWeekRev.reduce((a, b) => a + b, 0)
    const lastTotal = lastWeekRev.reduce((a, b) => a + b, 0)
    const pct = lastTotal > 0 ? Math.round(((curTotal - lastTotal) / lastTotal) * 100) : 0

    return { revenueData: data, currentRevenue: Math.round(curTotal), lastWeekRevenue: Math.round(lastTotal), growth: pct }
  }, [bookingsRevenue])

  const handleQuickAction = (actionId: string) => {
    setShowNewBooking(false)
    setShowArrivals(false)
    setShowDepartures(false)
    setShowRooms(false)
    if (actionId === "new-booking") {
      setShowNewBooking(true)
    } else if (actionId === "arrivals") {
      setShowArrivals(true)
    } else if (actionId === "departures") {
      setShowDepartures(true)
    } else if (actionId === "rooms") {
      navigate("/frontdesk/room-status")
    } else if (actionId === "activities") {
      navigate("/frontdesk/tasks")
    }
  }

  const handleNewBookingComplete = (_booking: unknown) => {
    setShowNewBooking(false)
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <FrontDeskSidebar />
      
      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Front Desk</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <CalendarCheck size={16} />
                <span>{formattedDate}</span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div 
                      onClick={() => setShowNotifications(false)} 
                      className="fixed inset-0 z-40"
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button 
                          onClick={() => {
                            markAllReadMutation.mutate()
                            setShowNotifications(false)
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 text-sm">No notifications</div>
                        ) : (
                          notifications.map((notification) => {
                            const display = getNotifDisplay(notification.type)
                            const IconComp = display.Icon
                            return (
                              <div
                                key={notification.id}
                                onClick={() => {
                                  if (!notification.is_read) {
                                    markReadMutation.mutate({ notificationId: notification.id })
                                  }
                                }}
                                className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${
                                  !notification.is_read ? "bg-blue-50/50" : ""
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${display.bg}`}>
                                  <IconComp size={16} className={display.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`}>
                                      {notification.title}
                                    </p>
                                    {!notification.is_read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.created_at)}</p>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate("/frontdesk/notifications")
                            setShowNotifications(false)
                          }}
                          className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm text-white font-semibold uppercase">
                    {initials}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      onClick={() => setShowUserMenu(false)} 
                      className="fixed inset-0 z-40"
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate("/frontdesk/account")
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} />
                          Account Settings
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={() => {
                            handleSignOut()
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Handover</span>
            </button>
            <button
              onClick={() => setShowNewBooking(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Booking</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <OccupancyChart 
              data={occupancyData}
              totalRooms={summary?.total_rooms ?? 0}
              occupancyRate={summary?.total_rooms ? Math.round(((summary?.occupied_rooms ?? 0) / summary.total_rooms) * 100) : 0}
              vsLastWeek={summary?.occupancy_vs_last_week ?? 0}
            />
            <RevenueChart 
              data={revenueData}
              currentRevenue={currentRevenue}
              lastWeekRevenue={lastWeekRevenue}
              growth={growth}
              formatAmount={formatAmount}
            />
          </div>

          <div className="mb-6">
            <QuickActions onAction={handleQuickAction} />
          </div>

          {showNewBooking && (
            <div ref={bookingFormRef}>
              <ErrorBoundary>
                <NewBookingForm
                  onComplete={handleNewBookingComplete}
                  onCancel={() => {
                    setShowNewBooking(false)
                    setInitialRoomId(null)
                    setInitialCheckinDate(null)
                    setInitialCheckoutDate(null)
                  }}
                  formatAmount={formatAmount}
                  currency={currency}
                  initialRoomId={initialRoomId}
                  initialCheckinDate={initialCheckinDate}
                  initialCheckoutDate={initialCheckoutDate}
                />
              </ErrorBoundary>
            </div>
          )}

          {showArrivals && (
            <div ref={arrivalsRef}>
              <ArrivalsPanel onClose={() => setShowArrivals(false)} />
            </div>
          )}

          {showDepartures && (
            <div ref={departuresRef}>
              <DeparturesPanel onClose={() => setShowDepartures(false)} />
            </div>
          )}

          {showRooms && (
            <div ref={roomsRef}>
              <RoomStatusPanel onClose={() => setShowRooms(false)} />
            </div>
          )}
        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}

export default FrontDeskPage
