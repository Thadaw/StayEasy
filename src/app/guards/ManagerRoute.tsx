import { ProtectedRoute } from './ProtectedRoute'
import { ROLES } from '@/constants/roles'

interface ManagerRouteProps {
  children: React.ReactNode
}

export function ManagerRoute({ children }: ManagerRouteProps) {
  return <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>{children}</ProtectedRoute>
}
