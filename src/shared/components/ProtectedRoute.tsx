import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "./PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    const redirectPath = `${location.pathname}${location.search}`;
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectPath)}`;
    return <Navigate to={loginUrl} replace />;
  }

  return <>{children}</>;
}
