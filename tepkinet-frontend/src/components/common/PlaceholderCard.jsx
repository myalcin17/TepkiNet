export default function PlaceholderCard({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  )
}
