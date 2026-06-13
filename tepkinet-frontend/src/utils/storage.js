export function getStorageItem(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore quota / privacy errors
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore
  }
}
