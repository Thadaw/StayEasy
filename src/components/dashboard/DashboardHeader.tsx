import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { usePropertyStore } from '../../stores/propertyStore'
import { getAllProperties } from '../../services/pmsApi'
import { propertyKeys } from '../../lib/queryKeys'
import type { GeneralInfoResponse } from '../../types/pms'
import { Bell, ChevronDown, Calendar, Menu } from 'lucide-react'

import { Layers } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle?: () => void
  title?: string
  subtitle?: string
  showOverallOption?: boolean
  onPropertyChange?: (propertyId: string | null) => void
  selectedLabel?: string
}

export default function DashboardHeader({ title, subtitle, onMenuToggle, showOverallOption, onPropertyChange, selectedLabel }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
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
  const [selectedDateRange, setSelectedDateRange] = useState('M 1, 2026 - Jul 31, 2026')

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
        {/* Property Selector */}
        <div style={{ position: 'relative' }}>
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
            <span>{selectedLabel || 'Property'}</span>
            <ChevronDown size={14} color="#9ca3af" />
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
              {properties.length === 0 && !showOverallOption ? (
                <div style={{ padding: '12px 16px', fontSize: 13, color: '#9ca3af' }}>
                  No properties found
                </div>
              ) : (
                <>
                  {showOverallOption && (
                    <div
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        color: !currentPropertyId && onPropertyChange ? '#2563eb' : onPropertyChange ? '#374151' : '#374151',
                        fontWeight: !currentPropertyId && onPropertyChange ? 600 : 400,
                        background: !currentPropertyId && onPropertyChange ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onClick={() => {
                        if (onPropertyChange) {
                          onPropertyChange(null)
                          setShowPropertyDropdown(false)
                        } else {
                          setCurrentPropertyId(null as any)
                          setShowPropertyDropdown(false)
                          navigate('/host/overall-dashboard')
                        }
                      }}
                    >
                      <Layers size={14} />
                      <span style={{ fontWeight: 500 }}>Overall Bookings</span>
                    </div>
                  )}
                  {(showAllProperties ? properties : properties.slice(0, 5)).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        color: currentPropertyId === p.id && onPropertyChange ? '#2563eb' : '#374151',
                        fontWeight: currentPropertyId === p.id && onPropertyChange ? 600 : 400,
                        background: currentPropertyId === p.id && onPropertyChange ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                      }}
                    onClick={() => {
                      if (onPropertyChange) {
                        onPropertyChange(p.id)
                        setShowPropertyDropdown(false)
                      } else {
                        setCurrentPropertyId(p.id)
                        setShowPropertyDropdown(false)
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
        <div style={{
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
        }}>
          <Calendar size={14} color="#6b7280" />
          <span>{selectedDateRange}</span>
          <ChevronDown size={14} color="#9ca3af" />
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

        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          cursor: 'pointer',
        }}>
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
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </header>
  )
}
