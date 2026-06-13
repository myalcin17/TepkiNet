import { useCallback, useMemo } from 'react'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'

export function useToastActions() {
  const { showToast, dismissToast } = useToast()

  const toastSuccess = useCallback(
    (message, options) => showToast({ type: 'success', message, ...options }),
    [showToast],
  )

  const toastError = useCallback(
    (message, options) => showToast({ type: 'error', message, ...options }),
    [showToast],
  )

  const toastInfo = useCallback(
    (message, options) => showToast({ type: 'info', message, ...options }),
    [showToast],
  )

  const toastWarning = useCallback(
    (message, options) => showToast({ type: 'warning', message, ...options }),
    [showToast],
  )

  const toastApiError = useCallback(
    (error, fallback, options) =>
      toastError(getApiErrorMessage(error, fallback), options),
    [toastError],
  )

  return useMemo(
    () => ({
      showToast,
      dismissToast,
      toastSuccess,
      toastError,
      toastInfo,
      toastWarning,
      toastApiError,
    }),
    [
      showToast,
      dismissToast,
      toastSuccess,
      toastError,
      toastInfo,
      toastWarning,
      toastApiError,
    ],
  )
}
