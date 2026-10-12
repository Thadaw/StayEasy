import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { usePropertyStore } from '../../stores/propertyStore'
import { getAllProperties } from '../../services/pmsApi'
import { propertyKeys } from '../../lib/queryKeys'
import type { GeneralInfoResponse } from '../../types/pms'
import { Bell, ChevronDown, Calendar, User, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDateRangeStore, DATE_RANGE_PRESETS, type DateRangePreset } from '../../stores/dateRangeStore'

import { Layers } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle?: () => void
  title?: string
  subtitle?: string
  showOverallOption?: boolean
  onPropertyChange?: (propertyId: string | null) => void
  selectedLabel?: string
  hideControls?: boolean
}

export default function DashboardHeader({ title, subtitle, onPropertyChange, selectedLabel, hideControls }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const setCurrentPropertyId = usePropertyStore((s) => s.setCurrentPropertyId)

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => {
      const list = Array.isArray(data) ? data : []
      return list.filter((p) => p.is_active !== false)
    },
  })

  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showAllProperties, setShowAllProperties] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const dateRangeLabel = useDateRangeStore((s) => s.label)
  const dateRangePreset = useDateRangeStore((s) => s.preset)
  const setDateRange = useDateRangeStore((s) => s.setRange)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const dateMenuRef = useRef<HTMLDivElement>(null)
  const propertyMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false)
      }
      if (propertyMenuRef.current && !propertyMenuRef.current.contains(e.target as Node)) {
        setShowPropertyDropdown(false)
        setShowAllProperties(false)
      }
    }
    if (showProfileMenu || showDateDropdown || showPropertyDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu, showDateDropdown, showPropertyDropdown])

  const isOverallPage = location.pathname === '/host/overall-dashboard'
  const isPropertyDashboardPage = location.pathname.startsWith('/host/my-properties/dashboard/')
  const currentProperty = properties.find((p) => p.id === currentPropertyId)
  const isOverallMode = isOverallPage || (!currentPropertyId && !!onPropertyChange)
  const propertyLabel = selectedLabel || currentProperty?.name || properties[0]?.name || 'Overall'
  const displayLabel = isOverallPage ? (selectedLabel || 'Overall') : propertyLabel

  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')

  const notifications = [
    { id: 1, type: 'system', title: 'Payment failure for booking #R302', time: '2 mins ago' },
    { id: 2, type: 'operational', title: 'New booking - Grand Palace Resort', time: '15 mins ago' },
    { id: 3, type: 'operational', title: 'New 5-star review', time: '28 mins ago' },
    { id: 4, type: 'operational', title: 'Maintenance overdue', time: '45 mins ago' },
    { id: 5, type: 'system', title: 'Daily Revenue Report', time: '1 hour ago' },
  ]

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left - Property Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right - Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!hideControls && (
          <>
            {/* Property Selector */}
            <div ref={propertyMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowPropertyDropdown(!showPropertyDropdown)
              if (showPropertyDropdown) setShowAllProperties(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
            }}
          >
            <span>{displayLabel}</span>
            <ChevronDown
              size={14}
              color="#9ca3af"
              style={{
                transform: showPropertyDropdown ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          {showPropertyDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: 200,
              zIndex: 50,
            }}>
              {properties.length === 0 ? (
                <div style={{ padding: '12px 16px', fontSize: 13, color: '#9ca3af' }}>
                  No properties found
                </div>
              ) : (
                <>
                  <div
                    style={{
                      padding: '8px 16px',
                      fontSize: 13,
                      color: isOverallMode ? '#2563eb' : '#374151',
                      fontWeight: isOverallMode ? 600 : 400,
                      background: isOverallMode ? '#eff6ff' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onClick={() => {
                      setCurrentPropertyId(null)
                      onPropertyChange?.(null)
                      setShowPropertyDropdown(false)
                      setShowAllProperties(false)
                      if (!onPropertyChange) {
                        navigate('/host/overall-dashboard')
                      }
                    }}
                  >
                    <Layers size={14} />
                    <span style={{ fontWeight: 500 }}>Overall</span>
                  </div>
                  {(showAllProperties ? properties : properties.slice(0, 5)).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        color: !isOverallMode && currentPropertyId === p.id ? '#2563eb' : '#374151',
                        fontWeight: !isOverallMode && currentPropertyId === p.id ? 600 : 400,
                        background: !isOverallMode && currentPropertyId === p.id ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                      }}
                    onClick={() => {
                      setCurrentPropertyId(p.id)
                      onPropertyChange?.(p.id)
                      setShowPropertyDropdown(false)
                      setShowAllProperties(false)
                      if (isOverallPage || isPropertyDashboardPage) {
                        navigate(`/host/my-properties/dashboard/${p.id}`)
                      }
                    }}
                    >
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      {p.city && <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.city}</div>}
                    </div>
                  ))}
                  {!showAllProperties && properties.length > 5 && (
                    <div
                      style={{
                        padding: '8px 16px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: 13,
                        color: '#2563eb',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      onClick={() => setShowAllProperties(true)}
                    >
                      More ({properties.length - 5} more)
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div ref={dateMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDateDropdown((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              color: '#374151',
            }}
          >
            <Calendar size={14} color="#6b7280" />
            <span>{dateRangeLabel}</span>
            <ChevronDown
              size={14}
              color="#9ca3af"
              style={{ transform: showDateDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {showDateDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              minWidth: 230,
              zIndex: 50,
              padding: '6px 0',
            }}>
              <div style={{ padding: '8px 16px 6px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date Range
              </div>
              {DATE_RANGE_PRESETS.map((preset) => {
                const active = dateRangePreset === preset.id
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setDateRange(preset.id as DateRangePreset)
                      setShowDateDropdown(false)
                      const range = useDateRangeStore.getState()
                      toast.success(`Date range: ${range.label}`)
                    }}
                    style={{
                      padding: '9px 16px',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#2563eb' : '#374151',
                      background: active ? '#eff6ff' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f9fafb' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span>{preset.label}</span>
                    {active && <Calendar size={13} />}
                  </div>
                )
              })}
            </div>
          )}
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
                  <span style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}>Mark all as read</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {['System', 'Operational', 'Staff'].map((type) => (
                    <span key={type} style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      background: type === 'System' ? '#f3f4f6' : '#fff',
                      color: '#6b7280',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                    }}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
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
                <span style={{ fontSize: 13, color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>View All Notifications</span>
              </div>
            </div>
          )}
        </div>
          </>
        )}

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
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                {firstName} {lastName}
              </div>
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
              {/* User info header */}
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
                    overflow: 'hidden',
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      initials.toUpperCase()
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {firstName} {lastName}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.role || 'Administrator'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px 0' }}>
                <button
                  onClick={() => { navigate('/host/admin-profile'); setShowProfileMenu(false) }}
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
                  View Full Profile
                </button>
              </div>

              {/* Divider + Logout */}
              <div style={{ borderTop: '1px solid #e5e7eb', padding: '6px 0' }}>
                <button
                  onClick={() => { logout(); navigate('/'); setShowProfileMenu(false) }}
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
