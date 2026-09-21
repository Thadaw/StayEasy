import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Bell, Calendar } from 'lucide-react'

interface HousekeepingHeaderProps {
  propertyName?: string
  dateRange?: string
  userName?: string
  userRole?: string
  userInitials?: string
  notificationCount?: number
}

const properties = ['StayEasy Pokhara', 'StayEasy Kathmandu', 'StayEasy Chitwan']

export default function HousekeepingHeader({
  propertyName = 'StayEasy Pokhara',
  dateRange = 'Jul 1, 2026 - Jul 31, 2026',
  userName = 'Aswin Pandit',
  userRole = 'Admin',
  userInitials = 'AP',
  notificationCount = 2,
}: HousekeepingHeaderProps) {
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(propertyName)
  const propertyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyRef.current && !propertyRef.current.contains(e.target as Node)) {
        setShowPropertyDropdown(false)
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
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2, textAlign: 'right' }}>Property</div>
          <button
            onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
            }}
          >
            <span>{selectedProperty}</span>
            <ChevronDown size={14} color="#9CA3AF" />
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
              {properties.map((prop) => (
                <div
                  key={prop}
                  onClick={() => { setSelectedProperty(prop); setShowPropertyDropdown(false) }}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    color: selectedProperty === prop ? '#2563EB' : '#374151',
                    fontWeight: selectedProperty === prop ? 600 : 400,
                    background: selectedProperty === prop ? '#EFF6FF' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { if (selectedProperty !== prop) e.currentTarget.style.background = '#F9FAFB' }}
                  onMouseLeave={(e) => { if (selectedProperty !== prop) e.currentTarget.style.background = 'transparent' }}
                >
                  {prop}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2, textAlign: 'right' }}>&nbsp;</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 13,
              color: '#374151',
            }}
          >
            <Calendar size={14} color="#6B7280" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Notification Bell */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2, textAlign: 'right' }}>&nbsp;</div>
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

        {/* User Avatar */}
        <div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2, textAlign: 'right' }}>&nbsp;</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 10px 5px 5px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
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
              }}
            >
              {userInitials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.2 }}>
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
