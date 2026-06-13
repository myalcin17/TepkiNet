import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormAlert from '@/components/forms/FormAlert'
import SelectField from '@/components/forms/SelectField'
import SubmitButton from '@/components/forms/SubmitButton'
import TextField from '@/components/forms/TextField'
import TextareaField from '@/components/forms/TextareaField'
import { complaintDetailPath } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import { createComplaint } from '@/services/complaintService'
import { fetchCompanies } from '@/services/companyService'
import { getApiErrorMessage, getValidationFieldErrors } from '@/utils/apiError'

const EMPTY_SELECT = { value: '', label: 'Bir seçenek seçin…' }

const TITLE_MIN_LENGTH = 3
const CONTENT_MIN_LENGTH = 20

function validateForm(form) {
  const errors = {}

  const title = form.title.trim()
  const content = form.content.trim()

  if (!title) {
    errors.title = 'Başlık gereklidir.'
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Başlık en az ${TITLE_MIN_LENGTH} karakter olmalıdır.`
  }

  if (!content) {
    errors.content = 'Açıklama gereklidir.'
  } else if (content.length < CONTENT_MIN_LENGTH) {
    errors.content = `Sorununuzu en az ${CONTENT_MIN_LENGTH} karakterle açıklayın.`
  }

  if (!form.companyId) {
    errors.companyId = 'Şikayetin ilgili olduğu şirketi seçin.'
  }

  return errors
}

export default function CreateComplaintForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    title: '',
    content: '',
    companyId: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [companies, setCompanies] = useState([])
  const [optionsError, setOptionsError] = useState('')
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadOptions() {
      setIsLoadingOptions(true)
      setOptionsError('')

      try {
        const [companyData] = await Promise.all([
          fetchCompanies(),
        ])

        if (isMounted) {
          setCompanies(companyData)
        }
      } catch (error) {
        if (isMounted) {
          setCompanies([])
          setOptionsError(
            getApiErrorMessage(
              error,
              'Şirketler ve kategoriler yüklenemedi. Lütfen sayfayı yenileyin.',
            ),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false)
        }
      }
    }

    loadOptions()

    return () => {
      isMounted = false
    }
  }, [])

  const companyOptions = [
    { ...EMPTY_SELECT, label: 'Bir şirket seçin…' },
    ...companies.map((company) => ({
      value: String(company.id),
      label: company.verified
        ? `${company.companyName} (Doğrulanmış)`
        : company.companyName,
    })),
  ]


  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const errors = validateForm(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      showToast({
        type: 'error',
        message: 'Göndermeden önce işaretli alanları düzeltin.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const created = await createComplaint({
        title: form.title.trim(),
        content: form.content.trim(),
        companyId: Number(form.companyId),
      })

      showToast({
        type: 'success',
        message: 'Şikayetiniz başarıyla gönderildi.',
      })

      if (created?.id) {
        navigate(complaintDetailPath(created.id), { state: { complaint: created } })
      } else {
        setForm({ title: '', content: '', companyId: '',})
      }
    } catch (error) {
      const serverFieldErrors = getValidationFieldErrors(error)

      if (serverFieldErrors) {
        setFieldErrors((current) => ({ ...current, ...serverFieldErrors }))
      }

      const message = getApiErrorMessage(
        error,
        'Şikayetiniz gönderilemedi. Lütfen tekrar deneyin.',
      )

      setFormError(message)
      showToast({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const optionsUnavailable = !isLoadingOptions && companies.length === 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Şikayet detayları</h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          Net bir başlık ve açıklama girin. Vakanızın doğru yönlendirilmesi için ilgili şirketi seçin.
        </p>
      </div>

      {optionsError ? <FormAlert className="mb-4">{optionsError}</FormAlert> : null}

      {optionsUnavailable && !optionsError ? (
        <FormAlert className="mb-4">
          Henüz kayıtlı şirket yok. Şikayet göndermeden önce sisteme şirket ekleyin.
        </FormAlert>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <TextField
          label="Başlık"
          name="title"
          value={form.title}
          onChange={updateField}
          error={fieldErrors.title}
          placeholder="Sorununuzun kısa özeti"
          maxLength={200}
          required
          disabled={isSubmitting}
        />

        <TextareaField
          label="Açıklama"
          name="content"
          value={form.content}
          onChange={updateField}
          error={fieldErrors.content}
          placeholder="Ne olduğunu, tarihleri ve varsa referans numaralarını açıklayın."
          hint={`En az ${CONTENT_MIN_LENGTH} karakter.`}
          rows={6}
          required
          disabled={isSubmitting}
        />

        <div>
          <SelectField
            label="Şirket"
            name="companyId"
            value={form.companyId}
            onChange={updateField}
            options={companyOptions}
            error={fieldErrors.companyId}
            disabled={isLoadingOptions || isSubmitting || companies.length === 0}
            required
          />

        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isLoadingOptions
              ? 'Şirketler yükleniyor…'
              : 'Şikayetiniz incelenecek ve açık durumu atanacaktır.'}
          </p>
          <SubmitButton
            className="sm:w-auto sm:min-w-[10rem]"
            isLoading={isSubmitting}
            disabled={isLoadingOptions || companies.length === 0}
          >
            Şikayeti gönder
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
