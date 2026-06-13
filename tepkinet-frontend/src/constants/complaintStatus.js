export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  IN_REVIEW: 'IN_REVIEW',
  ANSWERED: 'ANSWERED',
  RESOLVED: 'RESOLVED',
  CLOSED_BY_CUSTOMER: 'CLOSED_BY_CUSTOMER',
}

export const COMPLAINT_STATUS_CONFIG = {
  [COMPLAINT_STATUS.PENDING]: {
    label: 'Beklemede',
    className:
      'bg-slate-50 text-slate-900 ring-slate-200 dark:bg-slate-950/50 dark:text-slate-200 dark:ring-slate-900',
  },
  [COMPLAINT_STATUS.OPEN]: {
    label: 'Açık',
    className:
      'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-900',
  },
  [COMPLAINT_STATUS.IN_REVIEW]: {
    label: 'İnceleniyor',
    className:
      'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900',
  },
  [COMPLAINT_STATUS.ANSWERED]: {
    label: 'Yanıtlandı',
    className:
      'bg-violet-50 text-violet-900 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-900',
  },
  [COMPLAINT_STATUS.RESOLVED]: {
    label: 'Çözüldü',
    className:
      'bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900',
  },
  [COMPLAINT_STATUS.CLOSED_BY_CUSTOMER]: {
    label: 'Müşteri tarafından kapatıldı',
    userLabel: 'Kapattınız',
    className:
      'bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900',
  },
}

export function getComplaintStatusConfig(status, isUserViewing = false) {
  const config = COMPLAINT_STATUS_CONFIG[status]
  if (!config) {
    return {
      label: status ?? 'Bilinmiyor',
      className:
        'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    }
  }

  if (status === COMPLAINT_STATUS.CLOSED_BY_CUSTOMER && isUserViewing) {
    return {
      ...config,
      label: config.userLabel,
    }
  }

  return config
}
