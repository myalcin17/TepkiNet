import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen'
import DashboardLayout from '@/layouts/DashboardLayout'
import MainLayout from '@/layouts/MainLayout'

export default function DashboardAwareLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return <AuthLoadingScreen />
  }

  return isAuthenticated ? <DashboardLayout /> : <MainLayout />
}
