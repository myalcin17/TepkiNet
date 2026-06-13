import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function AdminBackButton() {
  return (
    <Link
      to={ROUTES.ADMIN_DASHBOARD}
      className="
        inline-flex
        rounded-lg
        border
        px-4
        py-2
        transition
        hover:bg-slate-100
        dark:hover:bg-slate-800
      "
    >
      ← Ana Menü
    </Link>
  )
}