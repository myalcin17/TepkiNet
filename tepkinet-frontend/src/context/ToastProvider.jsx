import { useCallback, useMemo, useState } from 'react'
import ToastViewport from '@/components/ui/ToastViewport'
import { ToastContext } from '@/context/toastContext'

const TOAST_DURATION_MS = 5000

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'success', message, duration = TOAST_DURATION_MS }) => {
      if (!message?.trim()) {
        return
      }

      const id = createToastId()

      setToasts((current) => [...current, { id, type, message }])

      window.setTimeout(() => {
        dismissToast(id)
      }, duration)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
