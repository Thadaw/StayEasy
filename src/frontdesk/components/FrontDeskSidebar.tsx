import { NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect, createContext, useContext } from "react"
import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  BedDouble,
  Users,
  CreditCard,
  CheckSquare,
  FileText,
  LogIn,
  Menu,
  X,
  Home,
  Bell,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { getUnreadNotificationCount } from "../../services/pmsApi"

interface SidebarContextType {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  toggle: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType>({
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  toggle: () => {},
  isMobile: false,
})

export function useFrontDeskSidebar() {
  return useContext(SidebarContext)
}

export function FrontDeskSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobile, isMobileOpen])

  const toggle = () => setIsMobileOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen, toggle, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function MobileMenuButton() {
  const { toggle, isMobile } = useFrontDeskSidebar()
  if (!isMobile) return null
  return (
    <button
      onClick={toggle}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors lg:hidden"
      aria-label="Toggle menu"
    >
      <Menu size={20} className="text-gray-700" />
    </button>
  )
}

interface NavItem {
  to: string
  icon: React.ComponentType<{ size?: number | string }>
  label: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "WORKSPACE",
    items: [
      { to: "/frontdesk", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/frontdesk/bookings", icon: CalendarDays, label: "Bookings" },
      { to: "/frontdesk/check-in", icon: LogIn, label: "Check-In" },
      { to: "/frontdesk/check-out", icon: LogOut, label: "Check-Out" },
      { to: "/frontdesk/in-house", icon: Home, label: "In House" },
      { to: "/frontdesk/room-status", icon: BedDouble, label: "Room Status" },
      { to: "/frontdesk/guests", icon: Users, label: "Guests" },
      { to: "/frontdesk/tasks", icon: CheckSquare, label: "Booking Activities" },
    ],
  },
  {
    title: "FINANCE & ADMIN",
    items: [
      { to: "/frontdesk/payments", icon: CreditCard, label: "Payments" },
      { to: "/frontdesk/folios", icon: FileText, label: "Folios" },
      { to: "/frontdesk/notifications", icon: Bell, label: "Notifications" },
    ],
  },
]

function SidebarContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { currentPropertyId } = usePropertyStore()
  const { setIsMobileOpen } = useFrontDeskSidebar()

  const { data: property } = useQuery({
    queryKey: ["property", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data } = await api.get(`/properties/${currentPropertyId}`)
        return data?.data || data
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications-count", currentPropertyId],
    queryFn: () => getUnreadNotificationCount(currentPropertyId!),
    enabled: !!currentPropertyId,
    refetchInterval: 30000,
  })

  const hotelName = property?.name || "StayEasy"
  const brandColor = property?.brand_color || "#1e3a5f"

  useEffect(() => {
    if (!property) return
    const root = document.documentElement
    root.style.setProperty('--brand-primary', brandColor)
    root.style.setProperty('--brand-dark', brandColor)
    root.style.setProperty('--chart-1', brandColor)
    root.style.setProperty('--sidebar', brandColor)
    return () => {
      root.style.removeProperty('--brand-primary')
      root.style.removeProperty('--brand-dark')
      root.style.removeProperty('--chart-1')
      root.style.removeProperty('--sidebar')
    }
  }, [brandColor, property])

  const initials = user
    ? (user.firstName?.[0] || user.first_name?.[0] || 'S')
      + (user.lastName?.[0] || user.last_name?.[0] || '')
    : 'S'

  const displayName = user?.name || user?.full_name || `${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`.trim() || 'Staff'

  const handleLogout = () => {
    logout()
    // Staff log in through the host section — /staff/login is a guest-mode
    // form that can never authenticate users-table staff credentials.
    navigate('/host/login')
  }

  const handleNavClick = () => {
    setIsMobileOpen(false)
  }

  return (
    <aside className="w-64 text-white flex flex-col h-full" style={{ backgroundColor: brandColor }}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          {property?.brand_logo_url ? (
            <img
              src={property.brand_logo_url}
              alt={hotelName}
              className="w-10 h-10 rounded-lg object-cover bg-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold uppercase">
              {hotelName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg leading-tight text-white truncate">{hotelName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {property?.is_active !== undefined && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  property.is_active
                    ? "bg-green-400/20 text-green-300"
                    : "bg-red-400/20 text-red-300"
                }`}>
                  {property.is_active ? "Active" : "Inactive"}
                </span>
              )}
              <p className="text-xs text-white font-semibold uppercase tracking-wider">Front Desk</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={sectionIdx > 0 ? "mt-6" : ""}>
            {section.title && (
              <h3 className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isNotifications = item.to === "/frontdesk/notifications"
                return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/frontdesk"}
                    onClick={handleNavClick}
                    style={({ isActive }) =>
                      isActive
                        ? { backgroundColor: "white", color: brandColor }
                        : undefined
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "font-semibold"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span className="text-sm flex-1">{item.label}</span>
                    {isNotifications && unreadCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-2 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold uppercase text-white shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate leading-tight">{displayName}</p>
            <p className="text-[9px] text-white/50 uppercase tracking-wider leading-tight">{user?.role?.replace('_', ' ') || 'Staff'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function FrontDeskSidebar() {
  const { isMobileOpen, setIsMobileOpen, isMobile } = useFrontDeskSidebar()

  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </div>
      </>
    )
  }

  return (
    <div className="sticky top-0 h-screen shrink-0">
      <SidebarContent />
    </div>
  )
}
