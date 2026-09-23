import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { PageLoader } from './PageLoader'

const HOME_BY_ROLE: Record<'host' | 'guest' | 'staff', string> = {
  host: '/host/overall-dashboard',
  staff: '/frontdesk',
  guest: '/',
}

// Auth pages (login / signup / forgot-password) are for signed-out visitors
// only. If a session already exists, send the user straight to their own area —
// a logged-in host must never end up on the guest login page, and vice versa.
// Everyone stays in their role until they log out (same idea as frontdesk).
export function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
  const { user, token, role, loading } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  if (loading) return <PageLoader />

  if (user || token) {
    // Honour a valid ?redirect= target (same rules as Login.tsx) so deep links
    // that bounced through a login page still land where they were headed.
    const redirect = searchParams.get('redirect')
    const isAuthPage =
      redirect === '/login' ||
      redirect === '/signup' ||
      redirect === '/host/login' ||
      redirect === '/host/signup'
    const isHostPage = location.pathname.startsWith('/host')
    const isValidRedirect =
      !!redirect &&
      redirect.startsWith('/') &&
      !redirect.startsWith('//') &&
      !redirect.includes('://') &&
      !isAuthPage &&
      // Staff refresh-failure redirects arrive here from /frontdesk/* pages
      // while on /host/login — allow those deep links through.
      (redirect.startsWith('/host') === isHostPage || redirect.startsWith('/frontdesk'))

    if (isValidRedirect && redirect) return <Navigate to={redirect} replace />
    return <Navigate to={HOME_BY_ROLE[role]} replace />
  }

  return <>{children}</>
}
