import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from '@/components/auth/GuestRoute'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import CompanyDashboard from '@/pages/CompanyDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminStatistics from '@/pages/AdminStatistics'
import AdminCompanyApplications from '@/pages/AdminCompanyApplications'
import AdminCompanies from '@/pages/AdminCompanies'
import ComplaintDetail from '@/pages/ComplaintDetail'
import Complaints from '@/pages/Complaints'
import CreateComplaint from '@/pages/CreateComplaint'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import MyComplaints from '@/pages/MyComplaints'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import UserDashboard from '@/pages/UserDashboard'
import Unauthorized from '@/pages/Unauthorized'
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import CompanyProfile from '@/pages/CompanyProfile'
import AdminProfile from '@/pages/AdminProfile'
import AdminComplaints from '@/pages/AdminComplaints'
import AdminUsers from '@/pages/AdminUsers'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.COMPLAINTS} element={<Complaints />} />
          <Route
            path={ROUTES.COMPLAINT_DETAIL}
            element={
              <RouteErrorBoundary>
                <ComplaintDetail />
              </RouteErrorBoundary>
            }
          />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
            <Route path={ROUTES.USER_HOME} element={<UserDashboard />} />
            <Route path={ROUTES.MY_COMPLAINTS} element={<MyComplaints />} />
            <Route path={ROUTES.CREATE_COMPLAINT} element={<CreateComplaint />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.COMPANY]} />}>
            <Route path={ROUTES.COMPANY_DASHBOARD} element={<CompanyDashboard />} />
            <Route path={ROUTES.COMPANY_PROFILE} element={<CompanyProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_STATISTICS} element={<AdminStatistics />} />
            <Route path={ROUTES.ADMIN_COMPANY_APPLICATIONS} element={<AdminCompanyApplications />} />
            <Route path={ROUTES.ADMIN_COMPANIES} element={<AdminCompanies />} />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
            <Route path={ROUTES.ADMIN_PROFILE} element={<AdminProfile />} />
            <Route path={ROUTES.ADMIN_COMPLAINTS} element={<AdminComplaints />} />
          </Route>
        </Route>

      <Route element={<GuestRoute />}>
  <Route element={<AuthLayout />}>
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />
    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
  </Route>
</Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}