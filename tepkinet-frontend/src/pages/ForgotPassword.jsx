import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import api from '@/services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')

      await api.post('/auth/forgot-password', {
        email,
      })

      setSuccess(true)
    } catch {
      setError('Mail gönderilemedi.')
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Mail gönderildi
        </h1>

        <p>
          Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
        </p>

        <Link
          to={ROUTES.LOGIN}
          className="text-brand-700"
        >
          Giriş ekranına dön
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Şifremi Unuttum
      </h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
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
        Şifre sıfırlama bağlantısı gönder
      </button>
    </form>
  )
}