import { STORAGE_KEYS, THEME_MODES } from '@/constants/app'
import { getStorageItem } from '@/utils/storage'

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_MODES.DARK
    : THEME_MODES.LIGHT
}

export function resolveTheme(mode) {
  if (mode === THEME_MODES.SYSTEM || !mode) {
    return getSystemTheme()
  }

  return mode
}

export function readStoredThemeMode() {
  return getStorageItem(STORAGE_KEYS.THEME) ?? THEME_MODES.SYSTEM
}

export function applyThemeClass(resolvedTheme) {
  document.documentElement.classList.toggle('dark', resolvedTheme === THEME_MODES.DARK)
}

export function initThemeFromStorage() {
  applyThemeClass(resolveTheme(readStoredThemeMode()))
}
