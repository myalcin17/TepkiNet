import { Navigate, Outlet } from 'react-router-dom'
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen'
import { useAuth } from '@/hooks/useAuth'

export default function GuestRoute() {
  const { isAuthenticated, isBootstrapping, getDefaultRoute } = useAuth()

  if (isBootstrapping) {
    return <AuthLoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  return <Outlet />
}
