import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/AuthContext'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import { useQuery } from '@tanstack/react-query'
import { getAllProperties } from '../../services/pmsApi'
import { propertyKeys } from '../../lib/queryKeys'
import { Bell, ChevronDown, Calendar, Menu, User, LogOut, Search } from 'lucide-react'

interface ManagerHeaderProps {
  onMenuToggle?: () => void
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  breadcrumb?: React.ReactNode
}

export default function ManagerHeader({ onMenuToggle, title, subtitle, searchPlaceholder, breadcrumb }: ManagerHeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)
  const assignedPropertyName = useManagerPropertyStore((s) => s.assignedPropertyName)
  const clearAssignedProperty = useManagerPropertyStore((s) => s.clearAssignedProperty)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [readIds, setReadIds] = useState<number[]>([])
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--manager-header-h', `${el.getBoundingClientRect().height}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0] ?? null
  const displayName = assignedPropertyName || property?.name || 'Your Property'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu])

  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const notifications = [
    { id: 1, type: 'system', title: 'Payment failure for booking #R302', time: '2 mins ago' },
    { id: 2, type: 'operational', title: 'New booking - Grand Palace Resort', time: '15 mins ago' },
    { id: 3, type: 'operational', title: 'New 5-star review', time: '28 mins ago' },
  ]

  const handleLogout = () => {
    clearAssignedProperty()
    logout()
    navigate('/manager/login')
  }

  const hasUnread = notifications.some((notification) => !readIds.includes(notification.id))

  const markAllRead = () => {
    setReadIds(notifications.map((notification) => notification.id))
    toast.success('All notifications marked as read')
  }

  const openNotification = (id: number, title: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setShowNotifications(false)
    navigate('/manager/notifications')
    toast(title, { icon: '🔔' })
  }

  return (
    <header
      ref={headerRef}
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        rowGap: 10,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left - Welcome Message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          {breadcrumb && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>{breadcrumb}</div>
          )}
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {title || <>Welcome back, Manager <span style={{ fontSize: 20 }}>👋</span></>}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
            {subtitle || "Here's your hotel overview for today."}
          </p>
        </div>
      </div>

      {/* Right - Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          marginLeft: 'auto',
          minWidth: 0,
        }}
      >
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          minWidth: 220,
        }}>
          <Search size={15} color="#9ca3af" />
          <input
            type="text"
            placeholder={searchPlaceholder || "Search reservations, guests, rooms..."}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const term = e.currentTarget.value.trim()
                if (!term) {
                  toast.error('Type something to search')
                  return
                }
                toast.success(`Searching for "${term}"`)
                navigate('/manager/bookings')
              }
            }}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 13,
              color: '#374151',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 13,
          color: '#374151',
        }}>
          <Calendar size={14} color="#6b7280" />
          <span>{dateStr}</span>
        </div>

        {/* Property Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          color: '#374151',
        }}>
          <span>{displayName}</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              position: 'relative',
              color: '#6b7280',
            }}
          >
            <Bell size={18} />
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #fff',
              }} />
            )}
          </button>
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              width: 320,
              zIndex: 50,
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Notifications</h3>
                  <span
                    onClick={markAllRead}
                    style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}
                  >
                    Mark all as read
                  </span>
                </div>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => openNotification(notification.id, notification.title)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: notification.type === 'system' ? '#ef4444' : '#2563eb',
                        marginTop: 6,
                        flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{notification.title}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <span
                  onClick={() => { setShowNotifications(false); navigate('/manager/notifications') }}
                  style={{ fontSize: 13, color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}
                >
                  View All Notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={profileMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 12px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                initials.toUpperCase()
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                {firstName} {lastName}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Hotel Manager</div>
            </div>
            <ChevronDown
              size={14}
              color="#9ca3af"
              style={{
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              zIndex: 50,
              width: 240,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {initials.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                      {firstName} {lastName}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Hotel Manager</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '6px 0' }}>
                <button
                  onClick={() => { navigate('/manager/settings'); setShowProfileMenu(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#374151',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                >
                  <User size={16} style={{ color: '#6b7280' }} />
                  View Profile
                </button>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', padding: '6px 0' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#ef4444',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
