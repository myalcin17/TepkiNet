import CompanyComplaintRow from '@/components/company/CompanyComplaintRow'
import CompanyComplaintsToolbar from '@/components/company/CompanyComplaintsToolbar'
import CompanyDashboardMetrics from '@/components/company/CompanyDashboardMetrics'
import ComplaintStatusOverview from '@/components/complaints/ComplaintStatusOverview'
import Pagination from '@/components/common/Pagination'
import PageHeader from '@/components/common/PageHeader'
import FormAlert from '@/components/forms/FormAlert'
import {
  AsyncContent,
  ComplaintRowSkeleton,
  EmptyState,
  PageSection,
  SkeletonList,
  Stack,
} from '@/components/ui'
import { getComplaintStatusConfig } from '@/constants/complaintStatus'
import { useCompanyComplaints } from '@/hooks/useCompanyComplaints'
import { useToastActions } from '@/hooks/useToastActions'

export default function CompanyDashboard() {
  const { toastSuccess } = useToastActions()
  const {
    complaints,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize,
    statusCounts,
    hasAnyComplaints,
    hasFilteredResults,
    updatingId,
    statusUpdateError,
    clearStatusUpdateError,
    updateComplaintStatusById,
    openCount,
    inProgressCount,
    resolvedCount,
    reload,
  } = useCompanyComplaints()

  const showToolbar = hasAnyComplaints || isLoading
  const isFilteredEmpty = hasAnyComplaints && !hasFilteredResults && !isLoading && !error

  async function handleStatusChange(complaintId, newStatus, currentStatus) {
    if (newStatus === currentStatus) {
      return
    }

    clearStatusUpdateError()

    const updated = await updateComplaintStatusById(complaintId, newStatus)

    if (updated) {
      const label = getComplaintStatusConfig(newStatus).label
      toastSuccess(`Durum güncellendi — vaka ${label} olarak işaretlendi.`)
    }
  }

  return (
    <section>
      <PageHeader
        title="Şirket paneli"
        description="Gelen şikayetleri inceleyin ve destek görüşmeleri üzerinden yanıt verin."
      />

      <CompanyDashboardMetrics
        openCount={openCount}
        inProgressCount={inProgressCount}
        resolvedCount={resolvedCount}
        totalCount={statusCounts.total}
        isLoading={isLoading}
      />

      <PageSection spacing="lg">
        <ComplaintStatusOverview
          counts={statusCounts}
          activeStatus={status}
          onStatusChange={setStatus}
          isLoading={isLoading}
        />
      </PageSection>

      {showToolbar ? (
        <PageSection>
          <CompanyComplaintsToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </PageSection>
      ) : null}

      {statusUpdateError ? (
        <PageSection>
          <FormAlert>{statusUpdateError}</FormAlert>
        </PageSection>
      ) : null}

      <PageSection>
        <AsyncContent
          isLoading={isLoading}
          error={error}
          onRetry={reload}
          loading={
            <SkeletonList
              count={pageSize}
              SkeletonComponent={ComplaintRowSkeleton}
              className="space-y-4"
            />
          }
          isEmpty={!hasAnyComplaints && !error}
          empty={
            <EmptyState
              icon="inbox"
              title="Henüz atanmış şikayet yok"
              description="Müşteriler kuruluşunuza karşı şikayet gönderdiğinde, inceleme ve yanıt için burada görünecektir."
            />
          }
        >
          {isFilteredEmpty ? (
            <EmptyState
              icon="search"
              title="Eşleşen vaka bulunamadı"
              description="Durum filtresini temizlemeyi veya arama terimlerinizi değiştirmeyi deneyin."
            >
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatus('')
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Filtreleri temizle
              </button>
            </EmptyState>
          ) : (
            <>
              <Stack gap="md">
                {complaints.map((complaint) => (
                  <CompanyComplaintRow
                    key={complaint.id}
                    complaint={complaint}
                    isUpdating={updatingId === complaint.id}
                    onStatusChange={(id, newStatus, currentStatus) =>
                      handleStatusChange(id, newStatus, currentStatus)
                    }
                  />
                ))}
              </Stack>

              <PageSection spacing="lg">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </PageSection>
            </>
          )}
        </AsyncContent>
      </PageSection>
    </section>
  )
}
