import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ItemCard from '../components/ItemCard'
import { getItems } from '../services/itemService'
import { categories } from '../data/mockItems'

/**
 * Search.jsx – Browse and filter all Lost & Found items.
 *
 * Reads initial `?q=` and `?type=` params from the URL
 * (set by the Hero search bar on the homepage).
 */
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') ?? 'all')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch items whenever filters change
  useEffect(() => {
    setIsLoading(true)
    getItems({ type: typeFilter, category: categoryFilter, query })
      .then(setItems)
      .finally(() => setIsLoading(false))
  }, [query, typeFilter, categoryFilter])

  function handleSearch() {
    setSearchParams({ q: query, type: typeFilter })
  }

  function clearFilters() {
    setQuery('')
    setTypeFilter('all')
    setCategoryFilter('All')
    setSearchParams({})
  }

  const hasActiveFilters = query || typeFilter !== 'all' || categoryFilter !== 'All'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Search Items</h1>
        <p className="text-sm text-gray-500">Browse all lost and found reports on campus.</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-4 mb-8">
        <SearchBar
          value={query}
          onChange={e => setQuery(e.target.value)}
          onSearch={handleSearch}
          placeholder="Search by item name, location..."
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Type filter pills */}
          <div className="flex gap-2" role="group" aria-label="Filter by type">
            {['all', 'found', 'lost'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-sm rounded-full font-medium capitalize transition-colors cursor-pointer ${
                  typeFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Items' : type}
              </button>
            ))}
          </div>

          {/* Category select */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={14} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal size={32} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
          <p className="text-gray-500 font-medium">No items match your search.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
