import SelectField from '@/components/forms/SelectField'
import TextField from '@/components/forms/TextField'
import {
  COMPLAINT_SORT_OPTIONS,
  COMPLAINT_STATUS_FILTER_OPTIONS,
} from '@/constants/complaintList'

export default function ComplaintsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  company,
  onCompanyChange,
  sortBy,
  onSortChange,
  companyOptions,

}) {
  const companySelectOptions = [
    { value: '', label: 'Tüm şirketler' },
    ...companyOptions.map((name) => ({ value: name, label: name })),
  ]


  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <TextField
          className="lg:col-span-5"
          label="Ara"
          name="complaint-search"
          type="search"
          placeholder="Başlığa göre ara…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          hint="Sunucudaki şikayet başlıklarıyla eşleşir."
        />

        <SelectField
          className="lg:col-span-2"
          label="Durum"
          name="complaint-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          options={COMPLAINT_STATUS_FILTER_OPTIONS}
        />

        <SelectField
          className="lg:col-span-2"
          label="Şirket"
          name="complaint-company"
          value={company}
          onChange={(event) => onCompanyChange(event.target.value)}
          options={companySelectOptions}
        />


        <SelectField
          className="lg:col-span-3"
          label="Sırala"
          name="complaint-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={COMPLAINT_SORT_OPTIONS}
        />
      </div>
    </div>
  )
}
