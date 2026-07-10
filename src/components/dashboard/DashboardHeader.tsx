import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import DateRangePickerDropdown from './DateRangePickerDropdown'
import NotificationDropdown from './NotificationDropdown'
import UserProfileDropdown from './UserProfileDropdown'

interface DashboardHeaderProps {
  onMenuToggle?: () => void
  title?: string
  subtitle?: string
}

export default function DashboardHeader({ onMenuToggle, title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left: Hamburger + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--muted)',
              cursor: 'pointer',
              color: 'var(--muted-foreground)',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--brand-dark)' }}>{title || 'Dashboard'}</h1>
          {subtitle && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Date Range + Notifications + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <DateRangePickerDropdown />
        <NotificationDropdown />
        <UserProfileDropdown user={user} />
      </div>
    </header>
  )
}
