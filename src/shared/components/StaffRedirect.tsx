import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PageLoader } from './PageLoader'

export function StaffRedirect({ children }: { children: React.ReactNode }) {
  const { role, user, loading } = useAuth()

  if (loading) return <PageLoader />

  if (user && role === 'staff') {
    return <Navigate to="/frontdesk" replace />
  }

  return <>{children}</>
}
