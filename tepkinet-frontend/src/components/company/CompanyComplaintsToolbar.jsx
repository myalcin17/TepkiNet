import SelectField from '@/components/forms/SelectField'
import TextField from '@/components/forms/TextField'
import {
  COMPLAINT_SORT_OPTIONS,
  COMPLAINT_STATUS_FILTER_OPTIONS,
} from '@/constants/complaintList'

export default function CompanyComplaintsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        <TextField
          className="md:col-span-6"
          label="Vaka ara"
          name="company-complaint-search"
          type="search"
          placeholder="Başlık, müşteri veya kategoriye göre ara…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          hint="Bu sayfada kuruluşunuza atanmış vakaları filtreler."
        />

        <SelectField
          className="md:col-span-3"
          label="Durum"
          name="company-complaint-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          options={COMPLAINT_STATUS_FILTER_OPTIONS}
        />

        <SelectField
          className="md:col-span-3"
          label="Sırala"
          name="company-complaint-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={COMPLAINT_SORT_OPTIONS}
        />
      </div>
    </div>
  )
}
