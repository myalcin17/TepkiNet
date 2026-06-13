import { normalizeRole } from '@/constants/roles'

function pickString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function extractRoleFromClaims(claims) {
  if (!claims || typeof claims !== 'object') {
    return null
  }

  const direct = normalizeRole(claims.role ?? claims.userRole)
  if (direct) {
    return direct
  }

  const authorities = claims.authorities ?? claims.roles ?? claims.scope

  if (Array.isArray(authorities)) {
    for (const entry of authorities) {
      const normalized = normalizeRole(typeof entry === 'string' ? entry : entry?.authority)
      if (normalized) {
        return normalized
      }
    }
  }

  if (typeof authorities === 'string') {
    return normalizeRole(authorities.split(',')[0])
  }

  return null
}

export function normalizeUser(raw, tokenClaims = null) {
  if (!raw || typeof raw !== 'object') {
    if (!tokenClaims) {
      return null
    }

    const role = extractRoleFromClaims(tokenClaims)
    const email = pickString(tokenClaims.email, tokenClaims.sub)

    if (!email && !role) {
      return null
    }

    return {
      id: tokenClaims.id ?? tokenClaims.userId ?? tokenClaims.sub ?? null,
      email,
      username: pickString(tokenClaims.username),
      firstName: pickString(tokenClaims.firstName, tokenClaims.given_name),
      lastName: pickString(tokenClaims.lastName, tokenClaims.family_name),
      role,
    }
  }

  const role =
    normalizeRole(raw.role) ??
    extractRoleFromClaims(raw) ??
    extractRoleFromClaims(tokenClaims)

  const email = pickString(raw.email, tokenClaims?.email, tokenClaims?.sub)

  return {
    id: raw.id ?? raw.userId ?? tokenClaims?.id ?? tokenClaims?.userId ?? null,
    email,
    username: pickString(raw.username),
    firstName: pickString(raw.firstName, raw.firstname),
    lastName: pickString(raw.lastName, raw.lastname),
    role,
  }
}

export function getDisplayName(user) {
  if (!user) {
    return ''
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  const displayName = fullName || user.username || user.email

  return displayName || 'Hesap'
}
