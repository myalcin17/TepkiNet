import Spinner from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

export default function LoadingState({
  message = 'Yükleniyor…',
  className = '',
  size = 'md',
  layout = 'inline',
}) {
  const isCentered = layout === 'centered' || layout === 'page'

  return (
    <div
      className={cn(
        'text-slate-600 dark:text-slate-300',
        isCentered && 'flex min-h-[12rem] flex-col items-center justify-center gap-3',
        layout === 'page' && 'min-h-[40vh]',
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner size={size} label={message} />
    </div>
  )
}
