import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Tag, MapPin, Sparkles, Plus, AlertCircle, Search as SearchIcon } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import { getItems } from '../services/itemService';
import { categories } from '../data/mockItems';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') ?? 'all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getItems({ type: typeFilter, category: categoryFilter, query })
      .then(res => setItems(res || []))
      .finally(() => setIsLoading(false));
  }, [query, typeFilter, categoryFilter]);

  function handleSearch() {
    setSearchParams({ q: query, type: typeFilter });
  }

  function clearFilters() {
    setQuery('');
    setTypeFilter('all');
    setCategoryFilter('All');
    setSearchParams({});
  }

  const hasActiveFilters = query || typeFilter !== 'all' || categoryFilter !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Explore Listings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse real community reports for lost and found items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report?type=lost"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Report Lost
          </Link>
          <Link
            to="/report?type=found"
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Report Found
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 mb-10">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          placeholder="Search by title, brand, description, or location..."
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter Pills */}
          <div className="flex gap-1.5" role="group" aria-label="Filter by type">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'lost', label: 'Lost' },
              { id: 'found', label: 'Found' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setTypeFilter(type.id)}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                  typeFilter === type.id
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer px-2 py-1"
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-zinc-400">
          Loading listings…
        </div>
      ) : items.length === 0 ? (
        /* Polished Empty State for Real Data */
        <div className="text-center py-20 bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <SearchIcon size={22} />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No items found yet.
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 mb-6 leading-relaxed">
            {hasActiveFilters
              ? 'No reports match your selected filters. Try broadening your keywords.'
              : 'There are currently no active lost or found listings reported in the database.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Reset Filters
              </button>
            )}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              <Plus size={14} />
              Report an Item
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs font-mono font-medium text-zinc-400 mb-6">
            Showing {items.length} active report{items.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <ItemCard key={item._id || item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
