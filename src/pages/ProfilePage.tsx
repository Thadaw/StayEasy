import { useAuth } from '../context/AuthContext'
import { Camera } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  const firstName = user && (user.firstName || user.first_name)
  const lastName = user && (user.lastName || user.last_name)
  const initials = ((firstName || '')?.[0] || '') + ((lastName || '')?.[0] || '')
  const displayInitials = initials.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: 480,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
          overflow: 'hidden',
        }}
      >
        {/* Header area */}
        <div
          style={{
            background: '#dde0ee',
            padding: '40px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: '#2E86AB' }}
            >
              {displayInitials}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              title="Change profile picture"
            >
              <Camera size={14} color="#555" />
            </div>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>
            {firstName} {lastName}
          </h1>
          {user?.countryFlag && user?.country && (
            <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{user.countryFlag}</span>
              <span>{user.country}</span>
            </p>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 2 }}>
              Email
            </label>
            <p style={{ fontSize: 14, color: '#111', margin: 0 }}>{user?.email || '—'}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 2 }}>
              Phone
            </label>
            <p style={{ fontSize: 14, color: '#111', margin: 0 }}>{user?.phone || '—'}</p>
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 2 }}>
              Member since
            </label>
            <p style={{ fontSize: 14, color: '#111', margin: 0 }}>
              {user?.joinedDate
                ? new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
