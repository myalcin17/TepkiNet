export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  COMPLAINTS: '/complaints',
  CREATE_COMPLAINT: '/complaints/new',
  COMPLAINT_DETAIL: '/complaints/:id',
  MY_COMPLAINTS: '/my-complaints',
  USER_HOME: '/dashboard',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  COMPANY_DASHBOARD: '/company',
  COMPANY_PROFILE: '/company/profile',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_STATISTICS: '/admin/statistics',
  ADMIN_COMPANY_APPLICATIONS: '/admin/company-applications',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_COMPLAINTS: '/admin/complaints',
}

export const COMPLAINT_SUPPORT_HASH = '#support'

export function complaintDetailPath(id) {
  return `/complaints/${id}`
}

export function dashboardComplaintDetailPath(id) {
  return `/complaints/${id}`
}

export function complaintDetailSupportPath(id) {
  return `${complaintDetailPath(id)}${COMPLAINT_SUPPORT_HASH}`
}
