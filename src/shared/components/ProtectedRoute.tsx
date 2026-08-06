import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { PageLoader } from "./PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user && !token) {
    const redirectPath = `${location.pathname}${location.search}`;
    const isHostPath = location.pathname.startsWith('/host');
    const loginPath = `${isHostPath ? '/host' : ''}/login`;
    const loginUrl = `${loginPath}?redirect=${encodeURIComponent(redirectPath)}`;
    return <Navigate to={loginUrl} replace />;
  }

  return <>{children}</>;
}
