import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }


  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-900 shadow-sm dark:border-rose-900/20 dark:bg-rose-950 dark:text-rose-100">
        <h1 className="text-2xl font-semibold">Bir hata oluştu</h1>
        <p className="mt-3 text-sm leading-relaxed">
          Bu sayfayı yüklerken bir sorun çıktı. Lütfen tekrar deneyin veya şikayetler sayfasına geri dönün.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={ROUTES.COMPLAINTS}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-slate-100 dark:bg-rose-900 dark:text-white"
          >
            Şikayetler sayfasına dön
          </Link>
        </div>
      </section>
    )
  }
}