import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag } from 'lucide-react'

/**
 * ItemCard.jsx – Displays a single Lost or Found item in a card layout.
 *
 * Props:
 *   item – a single item object from mockItems (or Supabase later)
 */
export default function ItemCard({ item }) {
  const isFound = item.type === 'found'

  // Format date as "10 Aug 2026"
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Status badge colors
  const statusColors = {
    open: 'bg-green-50 text-green-700 border border-green-200',
    claimed: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    returned: 'bg-gray-100 text-gray-500 border border-gray-200',
  }

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Item Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Found / Lost badge */}
        <span
          className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isFound
              ? 'bg-blue-600 text-white'
              : 'bg-orange-500 text-white'
          }`}
        >
          {isFound ? 'Found' : 'Lost'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>

        {/* Meta info */}
        <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
          <li className="flex items-center gap-1.5">
            <Tag size={12} className="shrink-0 text-gray-400" aria-hidden="true" />
            {item.category}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0 text-gray-400" aria-hidden="true" />
            {item.location}
          </li>
          <li className="flex items-center gap-1.5">
            <Calendar size={12} className="shrink-0 text-gray-400" aria-hidden="true" />
            {formattedDate}
          </li>
        </ul>

        {/* View Details link */}
        <div className="mt-auto pt-1">
          <Link
            to={`/item/${item.id}`}
            className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg py-1.5 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
