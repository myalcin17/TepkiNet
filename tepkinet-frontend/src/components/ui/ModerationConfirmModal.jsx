import React from 'react'

export default function ModerationConfirmModal({ open, title = 'Onay', message, onConfirm, onCancel, confirmLabel = 'Onayla' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded border px-3 py-2">İptal</button>
          <button onClick={onConfirm} className="rounded bg-red-600 px-3 py-2 text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
