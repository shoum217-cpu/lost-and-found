import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getItemMatches } from '../services/itemService';
import MatchCard from '../components/MatchCard';

export default function MatchResults() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getItemMatches(id)
      .then(res => setData(res))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-zinc-900 dark:text-zinc-100" />
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Finding potential matches…
        </p>
        <p className="text-xs text-zinc-400 max-w-xs">
          Cross-examining reported visual parameters, categories, and locations across actual community listings.
        </p>
      </div>
    );
  }

  const { targetItem, matches = [] } = data || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <Link
        to={targetItem ? `/item/${targetItem._id || targetItem.id}` : '/explore'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg">
              <Sparkles size={16} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Potential Matches
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Comparing database listings against: <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{targetItem?.title || 'Reported Item'}"</span>
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          {matches.length} match candidate{matches.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Matches Grid or Polished Empty State */}
      {matches.length === 0 ? (
        <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-16 text-center max-w-lg mx-auto shadow-2xs">
          <AlertCircle size={36} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No potential matches yet.
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 mb-6 leading-relaxed">
            There are currently no existing opposite listings in the database that correspond with this item. We will continue checking automatically.
          </p>
          <Link
            to="/explore"
            className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Explore All Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match, idx) => (
            <MatchCard key={idx} matchData={match} targetItem={targetItem} />
          ))}
        </div>
      )}
    </div>
  );
}
