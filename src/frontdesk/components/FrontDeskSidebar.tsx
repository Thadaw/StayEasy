import { NavLink, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  CalendarDays, 
  LogIn, 
  LogOut, 
  BedDouble, 
  Users, 
  CreditCard, 
  CheckSquare, 
  Bell
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

const navItems = [
  { to: "/frontdesk", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/frontdesk/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/frontdesk/check-in", icon: LogIn, label: "Check-In" },
  { to: "/frontdesk/check-out", icon: LogOut, label: "Check-Out" },
  { to: "/frontdesk/room-status", icon: BedDouble, label: "Room Status" },
  { to: "/frontdesk/guests", icon: Users, label: "Guests" },
  { to: "/frontdesk/payments", icon: CreditCard, label: "Payments" },
  { to: "/frontdesk/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/frontdesk/notifications", icon: Bell, label: "Notifications" },
]

export function FrontDeskSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { currentPropertyId } = usePropertyStore()

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

  const hotelName = property?.name || "StayEasy"
  const brandColor = property?.brand_color || "#1e3a5f"

  const initials = user
    ? (user.firstName?.[0] || user.first_name?.[0] || 'S')
      + (user.lastName?.[0] || user.last_name?.[0] || '')
    : 'S'

  const displayName = user?.name || user?.full_name || `${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`.trim() || 'Staff'

  const handleLogout = () => {
    logout()
    navigate('/staff/login')
  }

  return (
    <aside className="w-64 text-white flex flex-col sticky top-0 h-screen" style={{ backgroundColor: brandColor }}>
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
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">{hotelName}</h1>
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
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/frontdesk"}
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
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold uppercase text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-white/60 capitalize">{user?.role?.replace('_', ' ') || 'Staff'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
