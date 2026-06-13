import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormAlert from '@/components/forms/FormAlert'
import SubmitButton from '@/components/forms/SubmitButton'
import TextField from '@/components/forms/TextField'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/apiError'
import { getDefaultRouteForRole } from '@/utils/authRedirect'
import { submitCompanyApplication } from '@/services/authService'

const tabs = [
  { id: 'individual', label: 'Bireysel Kayıt' },
  { id: 'corporate', label: 'Kurumsal Başvuru' },
]

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  companyEmail: '',
  phone: '',
  taxOffice: '',
  taxNumber: '',
  city: '',
  district: '',
  address: '',
  authorizedPersonName: '',
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [activeTab, setActiveTab] = useState('individual')
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationComplete, setApplicationComplete] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  function switchTab(tab) {
    setActiveTab(tab)
    setFieldErrors({})
    setFormError('')
    setApplicationComplete(false)
  }

  function validateIndividual() {
    const errors = {}

    if (!form.firstName.trim()) {
      errors.firstName = 'Ad gereklidir.'
    }

    if (!form.lastName.trim()) {
      errors.lastName = 'Soyad gereklidir.'
    }


    if (!form.email.trim()) {
      errors.email = 'E-posta gereklidir.'
    }

    if (!form.password) {
      errors.password = 'Şifre gereklidir.'
    } else if (form.password.length < 8) {
      errors.password = 'Şifre en az 8 karakter olmalıdır.'
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function validateCorporate() {
    const errors = {}

    if (!form.companyName.trim()) {
      errors.companyName = 'Şirket adı gereklidir.'
    }

    if (!form.companyEmail.trim()) {
      errors.companyEmail = 'Şirket e-postası gereklidir.'
    }

    if (!form.password) {
      errors.password = 'Şifre gereklidir.'
    } else if (form.password.length < 8) {
      errors.password = 'Şifre en az 8 karakter olmalıdır.'
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor.'
    }

    if (!form.phone.trim()) {
      errors.phone = 'Telefon numarası gereklidir.'
    }

    if (!form.taxOffice.trim()) {
      errors.taxOffice = 'Vergi dairesi gereklidir.'
    }

    if (!form.taxNumber.trim()) {
      errors.taxNumber = 'Vergi numarası gereklidir.'
    }

    if (!form.city.trim()) {
      errors.city = 'Şehir gereklidir.'
    }

    if (!form.district.trim()) {
      errors.district = 'İlçe gereklidir.'
    }

    if (!form.address.trim()) {
      errors.address = 'Adres gereklidir.'
    }

    if (!form.authorizedPersonName.trim()) {
      errors.authorizedPersonName = 'Yetkili kişi adı gereklidir.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const isValid = activeTab === 'individual' ? validateIndividual() : validateCorporate()
    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      if (activeTab === 'individual') {
        const session = await register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
           username: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          password: form.password,
        })

        navigate(getDefaultRouteForRole(session.user?.role), { replace: true })
      } else {
        await submitCompanyApplication({
          companyName: form.companyName.trim(),
          companyEmail: form.companyEmail.trim(),
          password: form.password,
          phone: form.phone.trim(),
          taxOffice: form.taxOffice.trim(),
          taxNumber: form.taxNumber.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          address: form.address.trim(),
          authorizedPersonName: form.authorizedPersonName.trim(),
        })

        setForm({
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  companyEmail: '',
  password: '',
  confirmPassword: '',
  phone: '',
  taxOffice: '',
  taxNumber: '',
  city: '',
  district: '',
  address: '',
  authorizedPersonName: '',
})
        setApplicationComplete(true)
        
      }
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          activeTab === 'individual'
            ? 'Kaydınız oluşturulamadı. Bilgilerinizi kontrol edin ve tekrar deneyin.'
            : 'Kurumsal başvurunuz gönderilemedi. Lütfen alanları kontrol edin ve tekrar deneyin.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Kayıt ol</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Bireysel kullanıcılar veya şirketler için kayıt ve başvuru formu.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => switchTab(tab.id)}
            className={
              tab.id === activeTab
                ? 'rounded-full bg-white px-4 py-2 font-semibold text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                : 'rounded-full px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'corporate' && applicationComplete ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-slate-900 dark:border-brand-800 dark:bg-slate-950 dark:text-white">
          <h2 className="mb-3 text-lg font-semibold">Başvurunuz alındı</h2>
          <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
            Kurumsal başvurunuz başarıyla alındı. Onaylandığında e-posta adresine bilgi gönderilecektir.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
            >
              Giriş sayfasına dön
            </Link>
            <button
              type="button"
              onClick={() => switchTab('individual')}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Bireysel kayıt yap
            </button>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {formError ? <FormAlert>{formError}</FormAlert> : null}

          {activeTab === 'individual' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Ad"
                  name="firstName"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={updateField}
                  error={fieldErrors.firstName}
                  required
                />
                <TextField
                  label="Soyad"
                  name="lastName"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={updateField}
                  error={fieldErrors.lastName}
                  required
                />
              </div>


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
            </>
          ) : (
            <>
              <TextField
                label="Şirket adı"
                name="companyName"
                value={form.companyName}
                onChange={updateField}
                error={fieldErrors.companyName}
                required
              />
              <TextField
                label="Şirket e-postası"
                name="companyEmail"
                type="email"
                autoComplete="email"
                value={form.companyEmail}
                onChange={updateField}
                error={fieldErrors.companyEmail}
                required
              />
              <TextField
                label="Telefon"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={updateField}
                error={fieldErrors.phone}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Vergi dairesi"
                  name="taxOffice"
                  value={form.taxOffice}
                  onChange={updateField}
                  error={fieldErrors.taxOffice}
                  required
                />
                <TextField
                  label="Vergi numarası"
                  name="taxNumber"
                  value={form.taxNumber}
                  onChange={updateField}
                  error={fieldErrors.taxNumber}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Şehir"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  error={fieldErrors.city}
                  required
                />
                <TextField
                  label="İlçe"
                  name="district"
                  value={form.district}
                  onChange={updateField}
                  error={fieldErrors.district}
                  required
                />
              </div>
              <TextField
                label="Adres"
                name="address"
                value={form.address}
                onChange={updateField}
                error={fieldErrors.address}
                required
              />
              <TextField
                label="Yetkili kişi"
                name="authorizedPersonName"
                value={form.authorizedPersonName}
                onChange={updateField}
                error={fieldErrors.authorizedPersonName}
                required
              />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Şifre"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={activeTab === 'individual' ? 'new-password' : 'new-password'}
              value={form.password}
              onChange={updateField}
              error={fieldErrors.password}
              hint="En az 8 karakter."
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-200"
                >
                  {showPassword ? 'Gizle' : 'Göster'}
                </button>
              }
              required
            />
            <TextField
              label="Şifre tekrar"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={updateField}
              error={fieldErrors.confirmPassword}
              required
            />
          </div>

          <SubmitButton isLoading={isSubmitting}>
            {activeTab === 'individual' ? 'Hesap oluştur' : 'Başvuruyu gönder'}
          </SubmitButton>
        </form>
      )}

      {!applicationComplete ? (
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          {activeTab === 'individual'
            ? 'Zaten hesabınız var mı?'
            : 'Kurumsal başvurular yöneticinin onayına tabidir.'}{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-brand-700 dark:text-brand-100">
            Giriş yap
          </Link>
        </p>
      ) : null}
    </div>
  )
}
