import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, ShieldCheck, Sparkles, Lock, ArrowRight, ArrowUpRight, Inbox, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyItems } from '../services/itemService';
import { getMyClaims } from '../services/claimService';
import ItemCard from '../components/ItemCard';
import { ItemCardSkeletonGrid } from '../components/Skeletons';

export default function Dashboard() {
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [claims, setClaims] = useState({ claimsMade: [], claimsReceived: [] });
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'claims'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      Promise.all([
        getMyItems(token).catch(() => []),
        getMyClaims(token).catch(() => ({ claimsMade: [], claimsReceived: [] })),
      ]).then(([items, claimsData]) => {
        setMyItems(items || []);
        if (claimsData) {
          setClaims({
            claimsMade: claimsData.claimsMade || [],
            claimsReceived: claimsData.claimsReceived || [],
          });
        }
      }).finally(() => {
        setIsLoading(false);
      });
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [token, authLoading]);

  if (!isAuthenticated && !authLoading && !token) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-zinc-600 dark:text-zinc-300">
          <Lock size={28} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6 leading-relaxed">
          Please log in to view and manage your reported items, track active claims, and review ownership verification requests.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const totalClaimsCount = (claims.claimsMade?.length || 0) + (claims.claimsReceived?.length || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            My Items &amp; Activity
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your active reports, review potential matches, and track ownership claims.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-2xs self-start"
        >
          <Plus size={14} />
          Report New Item
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'items'
              ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          My Reported Items ({myItems.length})
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'claims'
              ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          Claims &amp; Verification Inquiries ({totalClaimsCount})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'items' ? (
        <div className="space-y-6">
          {isLoading ? (
            <ItemCardSkeletonGrid count={3} />
          ) : myItems.length === 0 ? (
            <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-16 text-center max-w-md mx-auto shadow-2xs">
              <Package size={36} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                No items reported yet.
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-6 leading-relaxed">
                When you report a lost or found item, it will appear here alongside potential match notifications.
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Plus size={14} /> Report an Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map(item => (
                <div key={item._id || item.id} className="relative">
                  <ItemCard item={item} />
                  <div className="mt-2 text-center">
                    <Link
                      to={`/matches/${item._id || item.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Sparkles size={13} className="text-amber-500" />
                      Check AI Matches for this item
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {totalClaimsCount === 0 ? (
            <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-16 text-center max-w-md mx-auto shadow-2xs">
              <ShieldCheck size={36} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                No claims in progress.
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                When you claim a found item or receive verification requests from finders, they will be tracked here.
              </p>
            </div>
          ) : (
            <>
              {/* Claims Made by User */}
              {claims.claimsMade?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Send size={14} /> Claims You Submitted ({claims.claimsMade.length})
                  </div>
                  <div className="space-y-3">
                    {claims.claimsMade.map(claim => {
                      const itemTitle = claim.item?.title || 'Reported Item';
                      const itemId = claim.item?._id || claim.item;
                      return (
                        <div
                          key={claim._id}
                          className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase">
                                {claim.status}
                              </span>
                              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {itemTitle}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Claim ID: <span className="font-mono">{claim._id?.slice(-6)}</span> • Submitted {new Date(claim.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {itemId && (
                              <Link
                                to={`/item/${itemId}`}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                View Item
                              </Link>
                            )}
                            <Link
                              to={`/claims/${claim._id}`}
                              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
                            >
                              View Claim &amp; Verification
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Claims Received on User's Found Items */}
              {claims.claimsReceived?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Inbox size={14} /> Claims Received on Your Found Items ({claims.claimsReceived.length})
                  </div>
                  <div className="space-y-3">
                    {claims.claimsReceived.map(claim => {
                      const itemTitle = claim.item?.title || 'Found Item';
                      const itemId = claim.item?._id || claim.item;
                      const claimantName = claim.claimant?.name || claim.claimantName || 'Community Member';
                      return (
                        <div
                          key={claim._id}
                          className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 uppercase">
                                {claim.status}
                              </span>
                              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {itemTitle}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Claimant: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{claimantName}</span> • Received {new Date(claim.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {itemId && (
                              <Link
                                to={`/item/${itemId}`}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                View Item
                              </Link>
                            )}
                            <Link
                              to={`/claims/${claim._id}`}
                              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
                            >
                              Review Proof &amp; Verify
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

