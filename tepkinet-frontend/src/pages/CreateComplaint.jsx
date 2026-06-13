import CreateComplaintForm from '@/components/complaints/CreateComplaintForm'
import PageHeader from '@/components/common/PageHeader'

export default function CreateComplaint() {
  return (
    <section>
      <PageHeader
        title="Şikayet gönder"
        description="Bir şirketle yaşadığınız deneyimi belgeleyin. Destek ekiplerinin inceleyip yanıtlayabilmesi için net ayrıntılar verin."
      />
      <CreateComplaintForm />
    </section>
  )
}
