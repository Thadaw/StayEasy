import { Navigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { useTenantQuery } from "@/services/queries/admin/tenantQuery";
import { PageLoader } from "@/components/ui/PageLoader";
import { ROLES, type AuthRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AuthRole[];
}

// The backend scopes every /properties call to the caller's tenant, so a host
// account without one gets 403 on every dashboard request. These pages are the
// onboarding steps that create the missing prerequisite, so they must stay
// reachable while the rest of the host area is blocked.
const HOST_ONBOARDING_PATHS: string[] = [ROUTES.hostTenantSetup, ROUTES.hostChangePassword];

function errorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) return error.response?.status;
  return undefined;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token, role, loading, mustChangePassword } = useAuth();
  const location = useLocation();

  const isHost = role === ROLES.HOST;
  const onHostOnboardingPage = HOST_ONBOARDING_PATHS.includes(location.pathname);
  // Only hosts need the tenant handshake — guests/staff/managers must not pay
  // for an extra request (or get stuck behind its loading state).
  const tenantQuery = useTenantQuery({
    enabled: isHost && !onHostOnboardingPage && !mustChangePassword,
  });

  if (loading) {
    return <PageLoader />;
  }

  if (!user && !token) {
    const redirectPath = `${location.pathname}${location.search}`;
    const isHostPath = location.pathname.startsWith('/host');
    const isManagerPath = location.pathname.startsWith('/manager');
    const isStaffPath = location.pathname.startsWith('/staff') || location.pathname.startsWith('/frontdesk');
    const loginPath = `${isStaffPath ? '/staff' : isHostPath ? '/host' : isManagerPath ? '/manager' : ''}/login`;
    const loginUrl = `${loginPath}?redirect=${encodeURIComponent(redirectPath)}`;
    return <Navigate to={loginUrl} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === ROLES.STAFF) return <Navigate to={ROUTES.frontDesk} replace />;
    if (role === ROLES.MANAGER) return <Navigate to={ROUTES.managerDashboard} replace />;
    if (role === ROLES.HOST) return <Navigate to={ROUTES.hostOverallDashboard} replace />;
    return <Navigate to={ROUTES.home} replace />;
  }

  if (mustChangePassword && role === ROLES.STAFF && location.pathname !== ROUTES.staffChangePassword) {
    return <Navigate to={ROUTES.staffChangePassword} replace />;
  }

  if (isHost && !onHostOnboardingPage) {
    // Hosts land here straight from signup with a temporary password and no
    // tenant yet — force the missing onboarding step instead of letting every
    // tenant-scoped request 403 behind an endless spinner.
    if (mustChangePassword) {
      return <Navigate to={ROUTES.hostChangePassword} replace />;
    }

    if (tenantQuery.isError) {
      const status = errorStatus(tenantQuery.error);
      if (status === 403 || status === 404) {
        return <Navigate to={ROUTES.hostTenantSetup} replace />;
      }
    } else if (tenantQuery.isSuccess && !tenantQuery.data?.name) {
      return <Navigate to={ROUTES.hostTenantSetup} replace />;
    } else if (tenantQuery.isLoading) {
      return <PageLoader />;
    }
  }

  return <>{children}</>;
}
