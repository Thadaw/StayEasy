import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/PageLoader";
import { ROLES, type AuthRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AuthRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token, role, loading, mustChangePassword } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user && !token) {
    const redirectPath = `${location.pathname}${location.search}`;
    const isHostPath = location.pathname.startsWith('/host');
    const isStaffPath = location.pathname.startsWith('/staff') || location.pathname.startsWith('/frontdesk');
    const loginPath = `${isStaffPath ? '/staff' : isHostPath ? '/host' : ''}/login`;
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

  return <>{children}</>;
}
