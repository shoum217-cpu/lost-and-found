import { Search } from 'lucide-react'

/**
 * SearchBar.jsx – Controlled search input with icon.
 *
 * Props:
 *   value        – current input value (controlled)
 *   onChange     – (e) => void
 *   onSearch     – () => void  called when form is submitted
 *   placeholder  – input placeholder text
 *   className    – additional wrapper classes
 */
export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search for lost or found items...',
  className = '',
}) {
  function handleSubmit(e) {
    e.preventDefault()
    if (onSearch) onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${className}`}
      role="search"
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-label="Search items"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer whitespace-nowrap"
      >
        Search
      </button>
    </form>
  )
}
