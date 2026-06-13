export default function SubmitButton({ isLoading, children, className = '', ...props }) {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className={[
        'inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white',
        'transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40',
        'disabled:cursor-not-allowed disabled:brightness-90',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? 'Lütfen bekleyin…' : children}
    </button>
  )
}
