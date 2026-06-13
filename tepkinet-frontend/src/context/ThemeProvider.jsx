import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, THEME_MODES } from '@/constants/app'
import { ThemeContext } from '@/context/themeContext'
import { setStorageItem } from '@/utils/storage'
import {
  applyThemeClass,
  getSystemTheme,
  readStoredThemeMode,
  resolveTheme,
} from '@/utils/theme'

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredThemeMode)

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme])

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme)
    setStorageItem(STORAGE_KEYS.THEME, nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK)
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    applyThemeClass(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== THEME_MODES.SYSTEM) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      applyThemeClass(getSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      isDark: resolvedTheme === THEME_MODES.DARK,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
