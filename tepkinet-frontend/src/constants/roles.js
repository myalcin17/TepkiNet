export const ROLES = {
  USER: 'USER',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
}

export const REGISTERABLE_ROLES = [ROLES.USER, ROLES.COMPANY]

const ROLE_PREFIX = 'ROLE_'

export function normalizeRole(role) {
  if (!role || typeof role !== 'string') {
    return null
  }

  const upper = role.toUpperCase().trim()
  const withoutPrefix = upper.startsWith(ROLE_PREFIX) ? upper.slice(ROLE_PREFIX.length) : upper

  return Object.values(ROLES).includes(withoutPrefix) ? withoutPrefix : null
}

export function hasRole(userRole, allowedRoles) {
  if (!allowedRoles?.length) {
    return true
  }

  const normalized = normalizeRole(userRole)
  return normalized != null && allowedRoles.includes(normalized)
}
