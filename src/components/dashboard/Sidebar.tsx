import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUIStore } from '../../stores/uiStore'
import { usePropertyStore } from '../../stores/propertyStore'
import logo1 from '../../assets/logo1.png'
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  UserCog,
  Sparkles,
  Tag,
  Calendar,
  Percent,
  Package,
  BarChart3,
  Building2,
  Settings,
  CreditCard,
  Plug,
  Bell,
  Activity,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Wifi,
  Receipt,
  Image,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
  children?: { label: string; icon: React.ReactNode; path: string }[]
}

interface NavSection {
  label: string
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/host/my-properties/dashboard' },
      { label: 'Bookings', icon: <CalendarDays size={18} />, path: '/host/bookings' },
      { label: 'Rooms', icon: <BedDouble size={18} />, path: '/host/rooms' },
      { label: 'Guests', icon: <Users size={18} />, path: '/host/guests' },
      { label: 'Staff', icon: <UserCog size={18} />, path: '/host/staff' },
      { label: 'Housekeeping', icon: <Sparkles size={18} />, path: '/host/housekeeping' },
      {
        label: 'Pricing & Discounts',
        icon: <Tag size={18} />,
        path: '/host/pricing',
        children: [
          { label: 'Overview', icon: <LayoutDashboard size={16} />, path: '/host/pricing' },
          { label: 'Seasonal Pricing', icon: <Calendar size={16} />, path: '/host/pricing/seasonal' },
          { label: 'Discounts & Offers', icon: <Percent size={16} />, path: '/host/pricing/discounts' },
          { label: 'Packages', icon: <Package size={16} />, path: '/host/pricing/packages' },
        ],
      },
      { label: 'Reports', icon: <BarChart3 size={18} />, path: '/host/reports' },
    ],
  },
  {
    label: 'PROPERTY',
    items: [
      {
        label: 'Settings',
        icon: <Settings size={18} />,
        path: '/host/settings',
        children: [
          { label: 'Company Profile', icon: <Building2 size={16} />, path: '/host/settings?tab=company' },
          { label: 'General Settings', icon: <Settings size={16} />, path: '/host/settings?tab=general' },
          { label: 'Booking Settings', icon: <Calendar size={16} />, path: '/host/settings?tab=booking' },
          { label: 'Room & Rate Settings', icon: <BedDouble size={16} />, path: '/host/settings?tab=room' },
          { label: 'Taxes & Policies', icon: <Receipt size={16} />, path: '/host/settings?tab=taxes' },
          { label: 'Amenities', icon: <Wifi size={16} />, path: '/host/settings?tab=amenities' },
          { label: 'Gallery', icon: <Image size={16} />, path: '/host/settings?tab=gallery' },
        ],
      },
      { label: 'Payment Methods', icon: <CreditCard size={18} />, path: '/host/payments' },
      { label: 'Integrations', icon: <Plug size={18} />, path: '/host/integrations' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Notifications', icon: <Bell size={18} />, path: '/host/notifications', badge: 5 },
      { label: 'Activity Logs', icon: <Activity size={18} />, path: '/host/activity' },
      { label: 'Support Tickets', icon: <HelpCircle size={18} />, path: '/host/support' },
    ],
  },
]

interface SidebarProps {
  simplified?: boolean
}

export default function Sidebar({ simplified }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const navRef = useRef<HTMLElement>(null)
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    if (currentPropertyId) {
      localStorage.setItem('currentPropertyId', currentPropertyId)
    }
  }, [currentPropertyId])

  useEffect(() => {
    sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children && isParentActive(item)) {
          setExpandedItems((prev) => ({ ...prev, [item.label]: true }))
        }
      })
    })
  }, [location.pathname])

  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => {
        const childPathname = child.path.split('?')[0]
        return location.pathname === childPathname
      })
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  }

  const toggleExpand = (label: string) => {
    if (collapsed) return
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleNavClick = (item: NavItem) => {
    if (navRef.current) {
      scrollPositionRef.current = navRef.current.scrollTop
    }
    if (item.children) {
      toggleExpand(item.label)
    } else if (item.label === 'Dashboard' && item.path === '/host/my-properties/dashboard') {
      const id = currentPropertyId || localStorage.getItem('currentPropertyId')
      navigate(id ? `/host/my-properties/dashboard/${id}` : '/host/my-properties')
    } else {
      navigate(item.path)
    }
  }

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = scrollPositionRef.current
    }
  }, [location.pathname])

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        background: 'var(--sidebar)',
        color: 'var(--sidebar-foreground)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--sidebar-border)' }}>
        <img src={logo1} alt="StayEasy" style={{ height: 36, width: 'auto' }} />
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>StayEasy</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Hotel & Restaurant</div>
          </div>
        )}
      </div>

      <nav ref={navRef} style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 8px' : '12px 12px' }} className="sidebar-scrollbar">
        {simplified ? (
          <>
          <button
            onClick={() => navigate('/host/my-properties')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: location.pathname === '/host/my-properties' ? 'var(--sidebar-accent)' : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: location.pathname === '/host/my-properties' ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: location.pathname === '/host/my-properties' ? 600 : 400,
              transition: 'background 0.15s',
            }}
            title={collapsed ? 'My Property' : undefined}
          >
            <Building2 size={18} />
            {!collapsed && <span>My Property</span>}
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: location.pathname === '/host/notifications' ? 'var(--sidebar-accent)' : 'transparent',
              border: 'none',
              borderRadius: 8,
              color: location.pathname === '/host/notifications' ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: location.pathname === '/host/notifications' ? 600 : 400,
              transition: 'background 0.15s',
              marginTop: 16,
            }}
            title={collapsed ? 'Notifications' : undefined}
          >
            <Bell size={18} />
            {!collapsed && <span>Notifications</span>}
          </button>
          </>
        ) : (
          sections.map((section) => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.5, padding: '0 8px', marginBottom: 8 }}>
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const parentActive = isParentActive(item)
              const expanded = expandedItems[item.label] || false

              return (
                <div key={item.label}>
                  <button
                    onClick={() => handleNavClick(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: collapsed ? '10px 0' : '10px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: parentActive && !item.children ? 'var(--sidebar-accent)' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      color: parentActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: parentActive ? 600 : 400,
                      marginBottom: 2,
                      transition: 'background 0.15s',
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                        {item.badge && (
                          <span style={{ background: 'var(--destructive)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                            {item.badge}
                          </span>
                        )}
                        {item.children && (
                          <span style={{ flexShrink: 0, opacity: 0.6 }}>
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        )}
                      </>
                    )}
                  </button>

                  {!collapsed && item.children && expanded && (
                    <div style={{ paddingLeft: 20, marginTop: 2 }}>
                      {item.children.map((child) => {
                        const childPathname = child.path.split('?')[0]
                        const childSearchParams = child.path.split('?')[1] || ''
                        const childActive = location.pathname === childPathname && location.search.includes(childSearchParams)
                        return (
                          <button
                            key={child.label}
                            onClick={() => navigate(child.path)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              width: '100%',
                              padding: '8px 12px',
                              background: childActive ? 'var(--sidebar-accent)' : 'transparent',
                              border: 'none',
                              borderRadius: 6,
                              color: childActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: childActive ? 600 : 400,
                              marginBottom: 1,
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>{child.icon}</span>
                            <span>{child.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )))}
      </nav>

      {!simplified && (
      <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid var(--sidebar-border)' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '0 4px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sidebar-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                initials.toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {firstName} {lastName}
              </div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Super Admin</div>
            </div>
            <button
              onClick={toggleSidebar}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', opacity: 0.6 }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
        {collapsed && (
          <button
            onClick={toggleSidebar}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', opacity: 0.6 }}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      )}
    </aside>
  )
}
