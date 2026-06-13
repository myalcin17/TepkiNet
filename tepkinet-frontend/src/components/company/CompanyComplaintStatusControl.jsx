import SelectField from '@/components/forms/SelectField'
import StatusBadge from '@/components/complaints/StatusBadge'
import { COMPANY_STATUS_UPDATE_OPTIONS } from '@/constants/complaintList'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'

export default function CompanyComplaintStatusControl({
  complaintId,
  status,
  isUpdating,
  onStatusChange,
}) {
  const isClosed =
    status === COMPLAINT_STATUS.RESOLVED ||
    status === COMPLAINT_STATUS.CLOSED_BY_CUSTOMER

  if (isClosed) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Durum</p>
        <StatusBadge status={status} />
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Bu şikayet kapatıldığı için durum değiştirilemez.
        </p>
      </div>
    )
  }

  return (
    <SelectField
      label="Durumu güncelle"
      name={`company-status-${complaintId}`}
      value={status ?? COMPLAINT_STATUS.OPEN}
      onChange={(event) => onStatusChange(event.target.value)}
      options={COMPANY_STATUS_UPDATE_OPTIONS}
      disabled={isUpdating}
      className="min-w-[10rem]"
    />
  )
}
