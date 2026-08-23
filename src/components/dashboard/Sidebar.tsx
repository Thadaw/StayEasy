import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import logo1 from '../../assets/logo1.png'
import { useUIStore } from '../../stores/uiStore'
import { usePropertyStore } from '../../stores/propertyStore'
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Users,
  UserCog,
  BarChart3,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  CreditCard,
  Plug,
  HelpCircle,
  BedDouble,
  Receipt,
  Wifi,
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
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/host/overall-dashboard' },
      {
        label: 'Property Management',
        icon: <Building2 size={18} />,
        path: '/host/my-properties',
        children: [
          { label: 'Overview', icon: <LayoutDashboard size={16} />, path: '/host/my-properties' },
          { label: 'Room Management', icon: <Building2 size={16} />, path: '/host/rooms' },
          { label: 'Pricing & Discount', icon: <Tag size={16} />, path: '/host/pricing' },
        ],
      },
      { label: 'Bookings', icon: <CalendarDays size={18} />, path: '/host/bookings' },
      { label: 'Guests', icon: <Users size={18} />, path: '/host/guests' },
      {
        label: 'Staff Management',
        icon: <UserCog size={18} />,
        path: '/host/staff',
        children: [
          { label: 'Staffs', icon: <Users size={16} />, path: '/host/staff' },
          { label: 'Shift & Attendance', icon: <CalendarDays size={16} />, path: '/host/staff/shifts' },
        ],
      },
      { label: 'Housekeeping', icon: <Sparkles size={18} />, path: '/host/housekeeping' },
      { label: 'Reports & Analytics', icon: <BarChart3 size={18} />, path: '/host/reports' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        label: 'Settings',
        icon: <Settings size={18} />,
        path: '/host/settings',
        children: [
          { label: 'Company Profile', icon: <Building2 size={16} />, path: '/host/settings?tab=company' },
          { label: 'General Settings', icon: <Settings size={16} />, path: '/host/settings?tab=general' },
          { label: 'Booking Settings', icon: <CalendarDays size={16} />, path: '/host/settings?tab=booking' },
          { label: 'Room & Rate Settings', icon: <BedDouble size={16} />, path: '/host/settings?tab=room' },
          { label: 'Taxes & Policies', icon: <Receipt size={16} />, path: '/host/settings?tab=taxes' },
          { label: 'Amenities', icon: <Wifi size={16} />, path: '/host/settings?tab=amenities' },
          { label: 'Gallery', icon: <Image size={16} />, path: '/host/settings?tab=gallery' },
        ],
      },
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
  const [searchQuery, setSearchQuery] = useState('')
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
    } else {
      navigate(item.path)
    }
  }

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = scrollPositionRef.current
    }
  }, [location.pathname])

  const filteredSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        background: '#fff',
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderRight: '1px solid #e5e7eb',
      }}
    >
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 12px' : '20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={logo1} alt="StayEasy" style={{ height: 34, width: 'auto', flexShrink: 0 }} />
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: '-0.5px',
              color: '#111827',
              lineHeight: 1.2,
            }}>StayEasy</div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: '#f3f4f6',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
          }}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                color: '#374151',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav ref={navRef} style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 8px' : '0 12px' }} className="sidebar-scrollbar">
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
                background: location.pathname === '/host/my-properties' ? '#eff6ff' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: location.pathname === '/host/my-properties' ? '#2563eb' : '#374151',
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
          </>
        ) : (
          filteredSections.map((section) => (
            <div key={section.label} style={{ marginBottom: 20 }}>
              {!collapsed && (
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#9ca3af', padding: '0 12px', marginBottom: 8 }}>
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
                        background: parentActive ? '#eff6ff' : 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        color: parentActive ? '#2563eb' : '#374151',
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
                            <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                              {item.badge}
                            </span>
                          )}
                          {item.children && (
                            <span style={{ flexShrink: 0, color: '#9ca3af' }}>
                              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {!collapsed && item.children && expanded && (
                      <div style={{ paddingLeft: 12, marginTop: 2 }}>
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
                                background: childActive ? '#eff6ff' : 'transparent',
                                border: 'none',
                                borderLeft: childActive ? '3px solid #2563eb' : '3px solid transparent',
                                borderRadius: 6,
                                color: childActive ? '#2563eb' : '#6b7280',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: childActive ? 600 : 400,
                                marginBottom: 2,
                                textAlign: 'left',
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
          ))
        )}
      </nav>

      {/* Collapse Button */}
      {!simplified && (
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={toggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              width: '100%',
              padding: '10px 12px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      )}
    </aside>
  )
}
