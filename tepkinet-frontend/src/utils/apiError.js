export function getValidationFieldErrors(error) {
  const data = error?.response?.data

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null
  }

  if (typeof data.message === 'string' || typeof data.error === 'string') {
    return null
  }

  const entries = Object.entries(data).filter(
    ([, value]) => typeof value === 'string' && value.trim(),
  )

  if (entries.length === 0) {
    return null
  }

  return Object.fromEntries(entries)
}

export function getApiErrorMessage(error, fallback = 'Bir şeyler ters gitti. Lütfen tekrar deneyin.') {
  const data = error?.response?.data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((entry) => entry?.message ?? entry).join(' ')
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error
  }

  if (error?.message) {
    return error.message
  }

  return fallback
}
