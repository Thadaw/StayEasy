import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { 
  CalendarCheck, 
  CalendarX, 
  BedDouble, 
  Users, 
  TrendingUp,
  Clock,
  Bell,
  Search,
  User,
  LogOut,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { ErrorBoundary } from "../../shared/components/ErrorBoundary"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { getFrontDeskSummary } from "../../services/pmsApi"
import api from "../../services/axios"
import { StatCard } from "../components/StatCard"
import { OccupancyChart } from "../components/OccupancyChart"
import { RevenueChart } from "../components/RevenueChart"
import { QuickActions } from "../components/QuickActions"
import { NewBookingForm } from "../components/NewBookingForm"
import { ArrivalsPanel } from "../components/ArrivalsPanel"
import { DeparturesPanel } from "../components/DeparturesPanel"
import { RoomStatusPanel } from "../components/RoomStatusPanel"

interface Notification {
  id: number
  type: "info" | "success" | "warning" | "alert"
  title: string
  message: string
  time: string
  read: boolean
}

export function FrontDeskPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, logout } = useAuth()
  const { formatAmount, currency } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
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

  useEffect(() => {
    if (showNewBooking) {
      setTimeout(() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }
  }, [showNewBooking])

  useEffect(() => {
    if (showArrivals) {
      setTimeout(() => arrivalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }
  }, [showArrivals])

  useEffect(() => {
    if (showDepartures) {
      setTimeout(() => departuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    }
  }, [showDepartures])

  useEffect(() => {
    if (showRooms) {
      setTimeout(() => roomsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
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
    navigate('/staff/login')
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alert",
      title: "VIP Guest Arrival",
      message: "John Smith (VIP) checking in at 3:00 PM - Room 501",
      time: "5 min ago",
      read: false
    },
    {
      id: 2,
      type: "success",
      title: "Check-in Completed",
      message: "Emily Johnson checked into Room 205",
      time: "15 min ago",
      read: false
    },
    {
      id: 3,
      type: "warning",
      title: "Late Checkout Request",
      message: "Room 302 requested late checkout until 2:00 PM",
      time: "32 min ago",
      read: false
    },
    {
      id: 4,
      type: "info",
      title: "Maintenance Scheduled",
      message: "Room 108 AC maintenance at 4:00 PM",
      time: "1 hr ago",
      read: true
    },
    {
      id: 5,
      type: "alert",
      title: "Payment Overdue",
      message: "Room 405 outstanding balance of NPR 250",
      time: "2 hr ago",
      read: true
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    weekday: 'short'
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle size={16} className="text-red-500" />
      case "success":
        return <CheckCircle size={16} className="text-green-500" />
      case "warning":
        return <AlertCircle size={16} className="text-yellow-500" />
      default:
        return <Info size={16} className="text-blue-500" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-50"
      case "success":
        return "bg-green-50"
      case "warning":
        return "bg-yellow-50"
      default:
        return "bg-blue-50"
    }
  }

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
        const wrapped = result as { data?: any[] }
        return (wrapped?.data ?? result) as any[]
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

    bookingsRevenue.forEach((b: any) => {
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
    console.log("Quick action:", actionId)
  }

  const handleNewBookingComplete = (booking: any) => {
    console.log("Booking completed:", booking)
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
            <h1 className="text-2xl font-bold text-gray-900">Front Desk</h1>              <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search booking, guest, phone..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">
                  Ctrl + K
                </span>
              </div>
              
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
                            markAllRead()
                            setShowNotifications(false)
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${
                              !notification.read ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getNotificationBg(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))}
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
                  <ChevronDown size={16} className="text-gray-400" />
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
              vsLastWeek={0}
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

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default FrontDeskPage
