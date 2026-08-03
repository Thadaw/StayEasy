import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../stores/uiStore'
import { useAuth } from '../context/AuthContext'
import logo1 from '../assets/logo1.png'
import {
  ArrowLeft,
  User,
  Building2,
  MessageSquare,
  Camera,
  ChevronDown,
  LogOut,
} from 'lucide-react'

const sidebarItems = [
  { icon: User, label: 'Profile', path: '/host/profile', active: true },
  { icon: Building2, label: 'My Property', path: '/host/my-properties' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
]

export default function HostProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const firstName = user?.firstName || user?.first_name || ''
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')
  const displayInitials = initials.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: user?.email || '',
    phone: user?.phone || '',
    timezone: '(UTC+00:00) London',
    dateOfBirth: '07/13/1998',
    role: user?.role || 'Host',
    hostId: 'h147-99118822',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: user?.email || '',
      phone: user?.phone || '',
      timezone: '(UTC+00:00) London',
      dateOfBirth: '07/13/1998',
      role: user?.role || 'Host',
      hostId: 'h147-99118822',
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <aside
        style={{
          width: sidebarCollapsed ? 72 : 240,
          background: 'var(--sidebar, #1A3C5E)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: sidebarCollapsed ? '20px 12px' : '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <img src={logo1} alt="StayEasy" style={{ height: 36, width: 'auto' }} />
          {!sidebarCollapsed && (
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
              StayEasy
            </span>
          )}
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: sidebarCollapsed ? '12px 0' : '12px 16px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: item.active ? 'rgba(46, 134, 171, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: item.active ? '#fff' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: item.active ? 600 : 400,
                marginBottom: 4,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!item.active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(e) => {
                if (!item.active) e.currentTarget.style.background = 'transparent'
              }}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            margin: '0 12px 12px',
            padding: '8px 0',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid var(--border, #e5e7eb)',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--foreground, #1C2833)',
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--foreground, #1C2833)' }}>
              Host Profile
            </h1>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--primary, #2E86AB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  displayInitials
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground, #1C2833)' }}>
                {firstName} {lastName}
              </span>
              <ChevronDown size={14} color="#999" />
            </button>

            {showAvatarMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  background: '#fff',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  minWidth: 160,
                  zIndex: 20,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => {
                    setShowAvatarMenu(false)
                    navigate('/host/profile')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--foreground, #1C2833)',
                    textAlign: 'left',
                  }}
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid var(--border, #e5e7eb)',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--destructive, #C0392B)',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div style={{ padding: 32, maxWidth: 800 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid var(--border, #e5e7eb)',
              padding: 32,
              marginBottom: 24,
              display: 'flex',
              gap: 32,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'var(--muted, #F2F3F4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${firstName} ${lastName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--primary, #2E86AB)' }}>
                    {displayInitials}
                  </span>
                )}
              </div>
              <button
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '1px solid var(--border, #e5e7eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                title="Change profile picture"
              >
                <Camera size={14} color="#666" />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--foreground, #1C2833)' }}>
                {firstName} {lastName}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground, #5D6D7E)', margin: '4px 0 0' }}>
                {formData.role}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginTop: 20 }}>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #5D6D7E)' }}>Email Address</span>
                  <p style={{ fontSize: 14, margin: '2px 0 0', fontWeight: 500, color: 'var(--foreground, #1C2833)' }}>
                    {formData.email || '—'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #5D6D7E)' }}>Phone Number</span>
                  <p style={{ fontSize: 14, margin: '2px 0 0', fontWeight: 500, color: 'var(--foreground, #1C2833)' }}>
                    {formData.phone || '—'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground, #5D6D7E)' }}>Timezone</span>
                  <p style={{ fontSize: 14, margin: '2px 0 0', fontWeight: 500, color: 'var(--foreground, #1C2833)' }}>
                    {formData.timezone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid var(--border, #e5e7eb)',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: '20px 32px',
                borderBottom: '1px solid var(--border, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 4, height: 20, borderRadius: 2, background: 'var(--primary, #2E86AB)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--foreground, #1C2833)' }}>
                  Personal Information
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--foreground, #1C2833)',
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--primary, #2E86AB)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            <div style={{ padding: '24px 32px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Time Zone
                  </label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    placeholder="MM/DD/YYYY"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: isEditing ? '#fff' : 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: isEditing ? 1 : 0.8,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid var(--border, #e5e7eb)',
            }}
          >
            <div
              style={{
                padding: '20px 32px',
                borderBottom: '1px solid var(--border, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 4, height: 20, borderRadius: 2, background: 'var(--primary, #2E86AB)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--foreground, #1C2833)' }}>
                  Host Details
                </h3>
              </div>
            </div>

            <div style={{ padding: '24px 32px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: 0.8,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground, #5D6D7E)', marginBottom: 6 }}>
                    Host ID
                  </label>
                  <input
                    type="text"
                    value={formData.hostId}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border, #e5e7eb)',
                      background: 'var(--muted, #F2F3F4)',
                      fontSize: 14,
                      color: 'var(--foreground, #1C2833)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAvatarMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
          onClick={() => setShowAvatarMenu(false)}
        />
      )}
    </div>
  )
}
