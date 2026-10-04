import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import logo1 from '../../assets/logo1.png'
import { useUIStore } from '../../stores/uiStore'
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  UserCog,
  Sparkles,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  Receipt,
  RotateCcw,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
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
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/manager/dashboard' },
      { label: 'Bookings', icon: <CalendarDays size={18} />, path: '/manager/bookings' },
      { label: 'Room Management', icon: <Building2 size={18} />, path: '/manager/rooms' },
      { label: 'Guest Management', icon: <Users size={18} />, path: '/manager/guests' },
      { label: 'Staff Management', icon: <UserCog size={18} />, path: '/manager/staff' },
      { label: 'Housekeeping', icon: <Sparkles size={18} />, path: '/manager/housekeeping' },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Billing & Payments', icon: <CreditCard size={18} />, path: '/manager/billing',
        children: [
          { label: 'Invoices', icon: <FileText size={16} />, path: '/manager/billing' },
          { label: 'Payment Records', icon: <Receipt size={16} />, path: '/manager/billing/payments' },
          { label: 'Refund Requests', icon: <RotateCcw size={16} />, path: '/manager/billing/refunds' },
        ],
      },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Reports & Analytics', icon: <BarChart3 size={18} />, path: '/manager/reports' },
      { label: 'Feedback & Reviews', icon: <MessageSquare size={18} />, path: '/manager/feedback' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Notifications', icon: <Bell size={18} />, path: '/manager/notifications' },
      { label: 'Settings', icon: <Settings size={18} />, path: '/manager/settings' },
    ],
  },
]

export default function ManagerSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const clearAssignedProperty = useManagerPropertyStore((s) => s.clearAssignedProperty)
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const navRef = useRef<HTMLElement>(null)
  const scrollPositionRef = useRef(0)
  const asideRef = useRef<HTMLElement>(null)

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
      return item.children.some((child) => location.pathname === child.path)
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

  const handleLogout = () => {
    clearAssignedProperty()
    logout()
    navigate('/manager/login')
  }

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = scrollPositionRef.current
    }
  }, [location.pathname])

  useLayoutEffect(() => {
    const el = asideRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--manager-sidebar-w', `${el.getBoundingClientRect().width}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filteredSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <aside
      ref={asideRef}
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
        {filteredSections.map((section) => (
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
                        const childActive = location.pathname === child.path
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
        ))}
      </nav>

      {/* Logout & Collapse */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8,
            width: '100%',
            padding: '10px 12px',
            background: 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>

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
    </aside>
  )
}
