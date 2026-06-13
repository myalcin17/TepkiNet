import { getComplaintStatusConfig } from '@/constants/complaintStatus'
import { ROLES } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs',
}

export default function StatusBadge({ status, size = 'md', className = '' }) {
  const { user } = useAuth()
  const isUserViewing = user?.role === ROLES.USER
  const config = getComplaintStatusConfig(status, isUserViewing)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
        sizeStyles[size],
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
