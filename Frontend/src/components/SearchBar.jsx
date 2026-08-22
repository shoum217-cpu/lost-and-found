import { Search } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by item title, brand, category, or location...',
  className = '',
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2.5 ${className}`}
      role="search"
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
        />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 shadow-subtle transition-all"
          aria-label="Search items"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
      >
        Search
      </button>
    </form>
  );
}
