import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/AuthContext'
import { usePropertyStore } from '../../stores/propertyStore'
import { getAllProperties } from '../../services/pmsApi'
import { propertyKeys } from '../../lib/queryKeys'
import type { GeneralInfoResponse } from '../../types/pms'
import { ChevronDown, Bell, Calendar, User, LogOut, Layers } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDateRangeStore, DATE_RANGE_PRESETS, type DateRangePreset } from '../../stores/dateRangeStore'

interface HousekeepingHeaderProps {
  propertyName?: string
  dateRange?: string
  userName?: string
  userRole?: string
  userInitials?: string
  notificationCount?: number
}

export default function HousekeepingHeader({
  userName = 'Aswin Pandit',
  userRole = 'Admin',
  userInitials = 'AP',
  notificationCount = 2,
}: HousekeepingHeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const setCurrentPropertyId = usePropertyStore((s) => s.setCurrentPropertyId)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const dateRangeLabel = useDateRangeStore((s) => s.label)
  const dateRangePreset = useDateRangeStore((s) => s.preset)
  const setDateRange = useDateRangeStore((s) => s.setRange)
  const propertyRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const { data: properties = [] } = useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => {
      const list = Array.isArray(data) ? data : []
      return list.filter((p) => p.is_active !== false)
    },
  })

  const currentProperty = properties.find((p) => p.id === currentPropertyId)
  const selectedProperty = currentProperty?.name || properties[0]?.name || ''
  const isOverall = !currentPropertyId

  const firstName = user?.firstName || user?.first_name || userName.split(' ')[0] || ''
  const lastName = user?.lastName || user?.last_name || userName.split(' ').slice(1).join(' ') || ''
  const initials = ((firstName?.[0] || '') + (lastName?.[0] || '')) || userInitials
  const role = user?.role || userRole

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyRef.current && !propertyRef.current.contains(e.target as Node)) {
        setShowPropertyDropdown(false)
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left: Title */}
      <div>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
          Housekeeping
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
          Manage room cleaning status, tasks and housekeeping activities.
        </p>
      </div>

      {/* Right: Property, Date, Bell, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Property Selector */}
        <div ref={propertyRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
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
            <span>{selectedProperty || 'Overall'}</span>
            <ChevronDown
              size={14}
              color="#9CA3AF"
              style={{
                transform: showPropertyDropdown ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          {showPropertyDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: 200,
                zIndex: 50,
              }}
            >
              <div
                onClick={() => {
                  setCurrentPropertyId(null)
                  setShowPropertyDropdown(false)
                  navigate('/host/overall-dashboard')
                }}
                style={{
                  padding: '10px 14px',
                  fontSize: 13,
                  color: isOverall ? '#2563EB' : '#374151',
                  fontWeight: isOverall ? 600 : 400,
                  background: isOverall ? '#EFF6FF' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => { if (!isOverall) e.currentTarget.style.background = '#F9FAFB' }}
                onMouseLeave={(e) => { if (!isOverall) e.currentTarget.style.background = 'transparent' }}
              >
                <Layers size={14} />
                <span style={{ fontWeight: 500 }}>Overall</span>
              </div>
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => { setCurrentPropertyId(prop.id); setShowPropertyDropdown(false) }}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    color: currentPropertyId === prop.id ? '#2563EB' : '#374151',
                    fontWeight: currentPropertyId === prop.id ? 600 : 400,
                    background: currentPropertyId === prop.id ? '#EFF6FF' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { if (currentPropertyId !== prop.id) e.currentTarget.style.background = '#F9FAFB' }}
                  onMouseLeave={(e) => { if (currentPropertyId !== prop.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ fontWeight: 500 }}>{prop.name}</div>
                  {prop.city && <div style={{ fontSize: 12, color: '#9CA3AF' }}>{prop.city}</div>}
                </div>
              ))}
              {properties.length === 0 && (
                <div style={{ padding: '12px 14px', fontSize: 13, color: '#9CA3AF' }}>
                  No properties found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div ref={dateRef} style={{ position: 'relative' }}>
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
            <Calendar size={14} color="#6B7280" />
            <span>{dateRangeLabel}</span>
            <ChevronDown
              size={13}
              color="#9CA3AF"
              style={{ transform: showDateDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {showDateDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                minWidth: 230,
                zIndex: 50,
                padding: '6px 0',
              }}
            >
              <div style={{ padding: '8px 16px 6px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
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
                      toast.success(`Date range: ${useDateRangeStore.getState().label}`)
                    }}
                    style={{
                      padding: '9px 16px',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#2563EB' : '#374151',
                      background: active ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F9FAFB' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    {preset.label}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              background: '#fff',
              cursor: 'pointer',
              position: 'relative',
              color: '#6B7280',
            }}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div ref={profileMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
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
            <div
              style={{
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
              }}
            >
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
            <div
              style={{
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
              }}
            >
              {/* User info header */}
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
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
                    }}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      initials.toUpperCase()
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {firstName} {lastName}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {role || 'Administrator'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px 0' }}>
                <button
                  onClick={() => {
                    navigate('/host/admin-profile')
                    setShowProfileMenu(false)
                  }}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <User size={16} style={{ color: '#6b7280' }} />
                  View Full Profile
                </button>
              </div>

              {/* Divider + Logout */}
              <div style={{ borderTop: '1px solid #e5e7eb', padding: '6px 0' }}>
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                    setShowProfileMenu(false)
                  }}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                  }}
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
