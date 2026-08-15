import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Tag, User, ArrowLeft, AlertTriangle } from 'lucide-react'
import { getItemById } from '../services/itemService'

/**
 * ItemDetails.jsx – Full detail view for a single item.
 *
 * Route: /item/:id
 * When Supabase is connected, the claim submission will POST to a 'claims' table.
 */
export default function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getItemById(id)
      .then(setItem)
      .finally(() => setIsLoading(false))
  }, [id])

  const formattedDate = item
    ? new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400 text-sm">
        Loading item...
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle size={36} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
        <p className="text-gray-500 font-medium">Item not found.</p>
        <Link to="/search" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Search
        </Link>
      </div>
    )
  }

  const isFound = item.type === 'found'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        to="/search"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 mb-6 transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" /> Back to Search
      </Link>

      <article className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-hidden transition-colors">
        {/* Image */}
        <div className="aspect-video bg-gray-100 dark:bg-neutral-700 overflow-hidden transition-colors">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-2 ${
                  isFound ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}
              >
                {isFound ? 'Found Item' : 'Lost Item'}
              </span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-300 capitalize border border-gray-200 dark:border-neutral-600 transition-colors">
              {item.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">{item.description}</p>

          {/* Meta */}
          <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-neutral-300">
            <li className="flex items-center gap-2.5">
              <Tag size={15} className="text-gray-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-gray-700 dark:text-neutral-200">Category:</span> {item.category}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={15} className="text-gray-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-gray-700 dark:text-neutral-200">Location:</span> {item.location}
            </li>
            <li className="flex items-center gap-2.5">
              <Calendar size={15} className="text-gray-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-gray-700 dark:text-neutral-200">Date:</span> {formattedDate}
            </li>
            <li className="flex items-center gap-2.5">
              <User size={15} className="text-gray-400 shrink-0" aria-hidden="true" />
              <span className="font-medium text-gray-700 dark:text-neutral-200">Reported by:</span> {item.reportedBy}
            </li>
          </ul>

          {/* Claim section – placeholder for now */}
          {item.status === 'open' && (
            <div className="border-t border-gray-100 dark:border-neutral-700 pt-6 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {isFound ? 'Is this yours?' : 'Did you find this?'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
                {isFound
                  ? 'If this item belongs to you, submit a claim and we\'ll connect you with the finder.'
                  : 'If you found this item, let the owner know by contacting the reporter.'}
              </p>
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                disabled
                title="Login required – authentication coming soon"
              >
                {isFound ? 'Submit a Claim' : 'Contact Reporter'}
              </button>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                You'll need to log in to submit a claim. (Coming soon)
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
