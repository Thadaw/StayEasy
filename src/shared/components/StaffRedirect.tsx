import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PageLoader } from './PageLoader'

// Landing-page guard: signed-in visitors never see the guest landing page.
// staff → /frontdesk, host → host dashboard (stay in your role until logout,
// exactly like frontdesk already behaved). Only guests and signed-out
// visitors see the landing page.
export function StaffRedirect({ children }: { children: React.ReactNode }) {
  const { role, user, token, loading } = useAuth()

  if (loading) return <PageLoader />

  if (user || token) {
    if (role === 'staff') return <Navigate to="/frontdesk" replace />
    if (role === 'host') return <Navigate to="/host/overall-dashboard" replace />
  }

  return <>{children}</>
}
