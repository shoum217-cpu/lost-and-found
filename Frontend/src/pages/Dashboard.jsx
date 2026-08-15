import { Link } from 'react-router-dom'
import { Package, Plus, Settings } from 'lucide-react'

/**
 * Dashboard.jsx – User dashboard (placeholder).
 *
 * Will show the logged-in user's posted items, claims, and notifications.
 * Requires authentication – protect this route with an auth guard later.
 */
export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Manage your item reports and claims.</p>
      </div>

      {/* Auth notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5 mb-8 flex items-start gap-3">
        <Settings size={18} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Authentication coming soon</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
            The dashboard will be available once Supabase Auth is connected.
            Log in to see your posted items, submitted claims, and messages.
          </p>
        </div>
      </div>

      {/* Placeholder stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Items Reported', value: '—' },
          { label: 'Claims Submitted', value: '—' },
          { label: 'Items Returned', value: '—' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-300 dark:text-neutral-600 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400 dark:text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl shadow-sm p-12 text-center">
        <Package size={36} className="mx-auto text-gray-200 dark:text-neutral-700 mb-3" aria-hidden="true" />
        <p className="text-gray-400 dark:text-neutral-500 text-sm font-medium">No items yet.</p>
        <p className="text-gray-300 dark:text-neutral-600 text-sm mt-1 mb-5">Once you report an item, it will appear here.</p>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} aria-hidden="true" /> Report an Item
        </Link>
      </div>
    </div>
  )
}
