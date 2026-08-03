import { useAuth } from '../../context/AuthContext'
import UserProfileDropdown from './UserProfileDropdown'

interface DashboardHeaderProps {
  onMenuToggle?: () => void
  title?: string
  subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
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
      <div>
        {title && <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--brand-dark)' }}>{title}</h1>}
        {subtitle && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted-foreground)' }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <UserProfileDropdown user={user} />
      </div>
    </header>
  )
}
