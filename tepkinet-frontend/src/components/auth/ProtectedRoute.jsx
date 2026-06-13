import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isBootstrapping, userHasRole } = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !userHasRole(allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <Outlet />
}
