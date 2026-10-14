import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/PageLoader'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

// Landing-page guard: signed-in visitors never see the guest landing page.
// staff → /frontdesk, host → host dashboard (stay in your role until logout,
// exactly like frontdesk already behaved). Only guests and signed-out
// visitors see the landing page.
export function StaffRedirect({ children }: { children: React.ReactNode }) {
  const { role, user, token, loading } = useAuth()

  if (loading) return <PageLoader />

  if (user || token) {
    if (role === ROLES.STAFF) return <Navigate to={ROUTES.frontDesk} replace />
    if (role === ROLES.HOST) return <Navigate to={ROUTES.hostOverallDashboard} replace />
  }

  return <>{children}</>
}
