import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, ShieldCheck, Sparkles, MapPin, ArrowRight, AlertCircle, Inbox, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getItems } from '../services/itemService';
import { getMyClaims } from '../services/claimService';
import ItemCard from '../components/ItemCard';
import Button from '../components/Button';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [claims, setClaims] = useState({ claimsMade: [], claimsReceived: [] });
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'claims'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Fetch user items
    getItems().then(res => {
      const items = res?.items || res || [];
      // If items have createdBy, filter for current user if logged in
      if (user && user._id) {
        const userItems = items.filter(item => {
          const creatorId = item.createdBy?._id || item.createdBy;
          return creatorId && creatorId.toString() === user._id.toString();
        });
        setMyItems(userItems.length > 0 ? userItems : items);
      } else {
        setMyItems(items);
      }
    }).finally(() => setIsLoading(false));

    if (token) {
      getMyClaims(token).then(res => {
        if (res) setClaims(res);
      });
    }
  }, [token, user]);

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
            <div className="py-20 text-center text-xs text-zinc-400">Loading your reports…</div>
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
          {/* Claims Received Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Inbox size={18} className="text-blue-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Claims Received on Your Found Items ({claims.claimsReceived?.length || 0})
              </h2>
            </div>

            {(!claims.claimsReceived || claims.claimsReceived.length === 0) ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                No claims received yet from other users.
              </div>
            ) : (
              <div className="space-y-3">
                {claims.claimsReceived.map(claim => (
                  <div
                    key={claim._id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          claim.status === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : claim.status === 'REJECTED'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {claim.status}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                          Claim from {claim.claimantName || claim.claimant?.name || 'Claimant'} on &ldquo;{claim.item?.title || 'Found Item'}&rdquo;
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Received {new Date(claim.createdAt).toLocaleDateString()} • {claim.initialMessage ? `"${claim.initialMessage.slice(0, 60)}..."` : 'No note'}
                      </p>
                    </div>

                    <Link
                      to={`/claims/${claim._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      Review Claim <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Claims Made Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Send size={18} className="text-amber-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Claims You Submitted ({claims.claimsMade?.length || 0})
              </h2>
            </div>

            {(!claims.claimsMade || claims.claimsMade.length === 0) ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                You haven&rsquo;t submitted any claims on found items yet.
              </div>
            ) : (
              <div className="space-y-3">
                {claims.claimsMade.map(claim => (
                  <div
                    key={claim._id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          claim.status === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : claim.status === 'REJECTED'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {claim.status}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                          Claim on &ldquo;{claim.item?.title || 'Found Item'}&rdquo;
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Initiated {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      to={`/claims/${claim._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 transition-colors shrink-0"
                    >
                      View Details <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
