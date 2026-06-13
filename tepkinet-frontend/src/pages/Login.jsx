import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormAlert from '@/components/forms/FormAlert'
import SubmitButton from '@/components/forms/SubmitButton'
import TextField from '@/components/forms/TextField'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'
import { getDefaultRouteForRole } from '@/utils/authRedirect'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTarget = location.state?.from?.pathname ?? null
  const returnTarget = location.state?.returnTo ?? null

  function handleBack() {
    if (returnTarget) {
      navigate(returnTarget, { replace: true })
      return
    }

    navigate(-1)
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  function validate() {
    const errors = {}

    if (!form.email.trim()) {
      errors.email = 'E-posta gereklidir.'
    }

    if (!form.password) {
      errors.password = 'Şifre gereklidir.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const session = await login({
        email: form.email.trim(),
        password: form.password,
      })

      navigate(redirectTarget ?? getDefaultRouteForRole(session.user?.role), { replace: true })
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-4">
        <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-300">
          ← Geri
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Giriş yap</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Kurumsal hesabınızla TepkiNet çalışma alanınıza erişin.</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <TextField
          label="E-posta"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField}
          error={fieldErrors.email}
          required
        />

        <TextField
          label="Şifre"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={updateField}
          error={fieldErrors.password}
          required
        />

        <SubmitButton isLoading={isSubmitting}>Giriş yap</SubmitButton>
      </form>
      <div className="text-right">
  <Link
    to={ROUTES.FORGOT_PASSWORD}
    className="text-sm text-brand-700 hover:underline dark:text-slate-100"
  >
    Şifremi unuttum
  </Link>
</div>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Hesabınız yok mu?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-700 dark:text-brand-100">
          Kayıt ol
        </Link>
      </p>
    </div>
  )
}
