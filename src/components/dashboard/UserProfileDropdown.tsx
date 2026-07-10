import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, Lock, HelpCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface UserProfileDropdownProps {
  user: {
    firstName?: string
    lastName?: string
    first_name?: string
    last_name?: string
    avatar?: string
    email?: string
    role?: string
  } | null
}

const menuItems = [
  { label: 'My Profile', icon: User, path: '/host/profile' },
  { label: 'Account Settings', icon: Settings, path: '/host/settings' },
  { label: 'Change Password', icon: Lock, path: '/host/settings' },
  { label: 'Help', icon: HelpCircle, path: '/host/support' },
]

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')
  const displayName = firstName || 'User'
  const displayRole = user?.role || 'Administrator'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 10px 6px 6px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--muted)',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            initials.toUpperCase()
          )}
        </div>
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>{displayName}</div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{displayRole}</div>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--muted-foreground)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
            marginLeft: 2,
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--card)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            zIndex: 50,
            width: 240,
            overflow: 'hidden',
          }}
        >
          {/* User info header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--primary)',
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
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {firstName} {lastName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayRole}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px 0' }}>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
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
                  color: 'var(--brand-dark)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--muted)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
              >
                <item.icon size={16} style={{ color: 'var(--muted-foreground)' }} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider + Logout */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '6px 0' }}>
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
  )
}
