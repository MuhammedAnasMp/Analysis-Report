function ToolbarButton({ onClick, isActive, disabled, children }: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 border rounded-md text-sm transition-all
        ${isActive ? 'bg-blue-600  text-white border-blue-600 ' : 'dark:bg-neutral-700 dark:text-white hover:bg-gray-200 hover:text-black border border-gray-300 dark:border-neutral-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

export default ToolbarButton ;