import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { PageLoader } from "./PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('host' | 'guest' | 'staff')[];
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
    if (role === 'staff') return <Navigate to="/frontdesk" replace />;
    if (role === 'host') return <Navigate to="/host/overall-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  if (mustChangePassword && role === 'staff' && location.pathname !== '/frontdesk/change-password') {
    return <Navigate to="/frontdesk/change-password" replace />;
  }

  return <>{children}</>;
}
