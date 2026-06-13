import { ROUTES } from '@/constants/routes'

export function getNavbarConfig({ isAuthenticated }) {
  if (!isAuthenticated) {
    return {
      guestActions: true,
      showLogout: false,
    }
  }

  return {
    guestActions: false,
    showLogout: true,
  }
}
