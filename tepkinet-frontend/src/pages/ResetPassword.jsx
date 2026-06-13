import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import api from '@/services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    try {
      setError('')

      await api.post('/auth/reset-password', {
        token,
        newPassword,
      })

      setSuccess(true)

      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 3000)

    } catch (err) {
      setError(
        err?.response?.data ||
        'Şifre sıfırlanamadı.'
      )
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-5xl text-green-600">
          ✓
        </div>

        <h1 className="text-2xl font-semibold">
          Şifreniz başarıyla güncellendi
        </h1>

        <p>
          Giriş ekranına yönlendiriliyorsunuz...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Yeni Şifre Belirle
      </h1>

      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Yeni şifre"
        className="w-full rounded-lg border p-3"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Yeni şifre tekrar"
        className="w-full rounded-lg border p-3"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-700 p-3 text-white"
      >
        Şifreyi Güncelle
      </button>
    </form>
  )
}