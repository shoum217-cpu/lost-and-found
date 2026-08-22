import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Sparkles } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function ItemCard({ item }) {
  const isFound = (item.type || '').toUpperCase() === 'FOUND';

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const statusLabel = (item.status || 'ACTIVE').toLowerCase();

  return (
    <article className="group bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-subtle hover:shadow-elevated transition-all duration-200 overflow-hidden flex flex-col">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=600&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
          loading="lazy"
        />
        
        {/* Status Tag */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
            isFound
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-amber-600 text-white shadow-xs'
          }`}
        >
          {isFound ? 'Found' : 'Lost'}
        </span>

        {item.brand && item.brand !== 'Unknown' && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
            {item.brand}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {item.title}
          </h3>
          <span className="shrink-0 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
            {statusLabel}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <Tag size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span className="truncate">{item.category}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <Link
            to={`/item/${item._id || item.id}`}
            className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            View Details
          </Link>

          {item.allowWhatsapp && (
            <WhatsAppButton
              itemId={item._id || item.id}
              allowWhatsapp={item.allowWhatsapp}
              size="sm"
            />
          )}
        </div>
      </div>
    </article>
  );
}
