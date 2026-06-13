import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { changePassword } from '@/services/authService'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
const [newPassword, setNewPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')

const [showPasswordForm, setShowPasswordForm] = useState(false)
const [showCurrentPassword, setShowCurrentPassword] = useState(false)
const [showNewPassword, setShowNewPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
const [isSaving, setIsSaving] = useState(false)
const [passwordError, setPasswordError] = useState('')
const [passwordSuccess, setPasswordSuccess] = useState(false)

  function handleLogout() {
    logout()
    navigate(ROUTES.HOME, { replace: true })
  }
  async function handleChangePassword() {
  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordError('Lütfen tüm alanları doldurun.')
    return
  }

  if (newPassword !== confirmPassword) {
  setPasswordError('Yeni şifreler eşleşmiyor.')
    return
  }

  try {
    setPasswordError('')
    setIsSaving(true)

    await changePassword({
      currentPassword,
      newPassword,
    })

    setPasswordSuccess(true)
    setPasswordError('')

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    setShowPasswordForm(false)

    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  } catch (error) {
    setPasswordError(
      error?.response?.data?.message ||
      'Mevcut şifrenizi yanlış girdiniz. Şifre güncellenemedi.'
    )
  } finally {
    setIsSaving(false)
  }
}

  return (
    <div>
      <PageHeader
        title="Profilim"
        description="Hesap bilgilerinizi ve ayarlarınızı görüntüleyin."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_1fr]">
        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Hesap Bilgileri
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Hesabınızla ilgili temel bilgileri burada görebilirsiniz.
            </p>

            <dl className="mt-6 space-y-6 border-t border-slate-100 pt-6 dark:border-slate-800">
             <div className="flex flex-col gap-2">
  <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">
    Ad Soyad
  </dt>
  <dd className="text-lg text-slate-900 dark:text-slate-100">
    {user?.username || 'Belirtilmedi'}
  </dd>
</div>

              <div className="flex flex-col gap-2">
                <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-posta Adresi
                </dt>
                <dd className="text-lg text-slate-900 dark:text-slate-100">
                  {user?.email || 'Belirtilmedi'}
                </dd>
              </div>

              <div className="flex flex-col gap-2">
                <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hesap Rolü
                </dt>
                <dd className="text-lg text-slate-900 dark:text-slate-100">
                  Kullanıcı
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Gizlilik & Güvenlik
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Hesabınızın güvenliğini ve gizliliğini yönetin.
            </p>

            <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
  {!showPasswordForm ? (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          Şifre Değiştir
        </h3>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Hesabınızın güvenliği için şifrenizi güncelleyebilirsiniz.
        </p>
      </div>

      <button
  type="button"
  onClick={() => {
  setPasswordError('')
  setPasswordSuccess(false)
  setShowPasswordForm(true)
}}
  className="rounded-lg bg-brand-700 px-4 py-2 text-white hover:bg-brand-800"
>
  Şifreyi Değiştir
</button>
    </div>
  ) : (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Mevcut Şifre
        </label>

        <div className="flex gap-2">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />

          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="rounded-lg border px-3"
          >
            👁
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Yeni Şifre
        </label>

        <div className="flex gap-2">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="rounded-lg border px-3"
          >
            👁
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Yeni Şifre Tekrar
        </label>

        <div className="flex gap-2">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="rounded-lg border px-3"
          >
            👁
          </button>
        </div>
      </div>

      <div className="flex gap-3">
       <button
  type="button"
  onClick={handleChangePassword}
  disabled={isSaving}
  className="rounded-lg bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:opacity-50"
>
  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
</button>
<button
  type="button"
  onClick={() => {
    setShowPasswordForm(false)

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')

    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }}
  className="rounded-lg border border-slate-300 px-4 py-2"
>
  Vazgeç
</button>
      </div>
      {passwordError && (
  <p className="text-sm text-red-600 dark:text-red-400">
    {passwordError}
  </p>
)}
    </div>
  )}
</div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Eylemler
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800"
                >
                  Çıkış Yap
                </button>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Bilgi
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-700 dark:text-slate-300">
                  Platform Versiyonu
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">1.0.0</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700 dark:text-slate-300">
                  Hesap Türü
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">Bireysel Kullanıcı</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
      {passwordSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-700">
        ✓
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Şifreniz başarıyla değiştirildi
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Yeni şifreniz artık kullanılabilir.
      </p>

      <button
        type="button"
        onClick={() => setPasswordSuccess(false)}
        className="mt-5 rounded-lg bg-brand-700 px-4 py-2 text-white"
      >
        Tamam
      </button>
    </div>
  </div>
)}
    </div>
  )
}
