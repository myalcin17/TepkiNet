export const COMPLAINTS_PAGE_SIZE = 9

export const COMPLAINT_SORT_OPTIONS = [
  { value: 'newest', label: 'En yeni önce' },
  { value: 'oldest', label: 'En eski önce' },
  { value: 'title-asc', label: 'Başlık (A–Z)' },
  { value: 'title-desc', label: 'Başlık (Z–A)' },
]

export const COMPLAINT_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Tüm durumlar' },
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'OPEN', label: 'Açık' },
  { value: 'IN_REVIEW', label: 'İnceleniyor' },
  { value: 'ANSWERED', label: 'Yanıtlandı' },
  { value: 'RESOLVED', label: 'Çözüldü' },
]

/** Status values a company operator may set via PATCH /complaints/{id}/status */
export const COMPANY_STATUS_UPDATE_OPTIONS = [
  { value: 'OPEN', label: 'Açık' },
  { value: 'IN_REVIEW', label: 'İnceleniyor' },
  { value: 'ANSWERED', label: 'Yanıtlandı' },
]
