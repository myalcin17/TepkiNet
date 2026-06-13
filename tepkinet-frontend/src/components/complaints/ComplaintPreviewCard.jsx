import ComplaintCard from '@/components/complaints/ComplaintCard'

/** @deprecated Use ComplaintCard directly */
export default function ComplaintPreviewCard({ complaint }) {
  return <ComplaintCard complaint={complaint} />
}
