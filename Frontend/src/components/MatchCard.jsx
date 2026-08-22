import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, MapPin, Tag } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

export default function MatchCard({ matchData, targetItem }) {
  const { item: candidateItem, score, reasons } = matchData;

  const isTargetLost = (targetItem?.type || '').toUpperCase() === 'LOST';
  const lostItem = isTargetLost ? targetItem : candidateItem;
  const foundItem = isTargetLost ? candidateItem : targetItem;

  // Format date helper
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <article className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col gap-5">
      {/* Header: Potential Match + Score badge */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg">
            <Sparkles size={16} />
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              AI Match Analysis
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-none mt-0.5">
              Potential Item Match
            </h3>
          </div>
        </div>

        {/* High contrast refined Match Score pill */}
        <div className="flex items-center gap-1 px-3 py-1 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-full font-mono text-sm font-semibold tracking-tight shadow-sm">
          <span>{score}%</span>
          <span className="text-[10px] font-sans font-medium uppercase text-zinc-300 dark:text-zinc-600">Match</span>
        </div>
      </div>

      {/* Side-by-side comparison images */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Lost Item Column */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
            <img
              src={lostItem?.image || lostItem?.imageUrl || 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&q=80'}
              alt={lostItem?.title || 'Lost item'}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/95 text-white backdrop-blur-xs">
              Reported Lost
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {lostItem?.title}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {lostItem?.location}
            </p>
          </div>
        </div>

        {/* Found Item Column */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
            <img
              src={foundItem?.image || foundItem?.imageUrl || 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&q=80'}
              alt={foundItem?.title || 'Found item'}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600/95 text-white backdrop-blur-xs">
              Reported Found
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {foundItem?.title}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {foundItem?.location}
            </p>
          </div>
        </div>
      </div>

      {/* Why this matches breakdown */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-xl p-3.5 border border-zinc-100 dark:border-zinc-800/80">
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Why this matches:
        </p>
        <ul className="flex flex-col gap-1.5">
          {reasons && reasons.map((reason, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 mt-auto">
        <Link
          to={`/item/${candidateItem?._id || candidateItem?.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white rounded-lg py-2.5 px-4 transition-colors"
        >
          View Item Details
          <ArrowRight size={14} />
        </Link>

        {candidateItem?.allowWhatsapp && (
          <WhatsAppButton
            itemId={candidateItem._id || candidateItem.id}
            allowWhatsapp={candidateItem.allowWhatsapp}
          />
        )}
      </div>
    </article>
  );
}
