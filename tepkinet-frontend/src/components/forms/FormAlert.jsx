import AlertBanner from '@/components/ui/AlertBanner'

export default function FormAlert({ variant = 'error', className = '', children }) {
  return (
    <AlertBanner variant={variant} className={className}>
      {children}
    </AlertBanner>
  )
}
