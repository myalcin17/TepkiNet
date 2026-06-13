import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

export function getDefaultRouteForRole(role) {
  switch (role) {
    case ROLES.COMPANY:
      return ROUTES.COMPANY_DASHBOARD
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD
    case ROLES.USER:
      return ROUTES.USER_HOME
    default:
      return ROUTES.HOME
  }
}
