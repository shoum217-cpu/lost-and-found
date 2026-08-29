import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Tag, User, ArrowLeft, ShieldCheck, Sparkles, MessageSquare, AlertTriangle, CheckCircle2, ShieldAlert, Trash2, Check } from 'lucide-react';
import { getItemById, deleteItem, resolveItem } from '../services/itemService';
import { createClaim, requestVerification } from '../services/claimService';
import { useAuth } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';
import VerificationFlow from '../components/VerificationFlow';
import Button from '../components/Button';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimStatus, setClaimStatus] = useState(null); // null | 'CLAIMED' | 'VERIFICATION_REQUESTED' | 'VERIFIED'
  const [claimMessage, setClaimMessage] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const [resolveSuccessMessage, setResolveSuccessMessage] = useState(null);

  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    getItemById(id)
      .then(setItem)
      .finally(() => setIsLoading(false));
  }, [id]);

  const formattedDate = item?.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const isFound = (item?.type || '').toUpperCase() === 'FOUND';
  const creatorId = item?.createdBy?._id || item?.createdBy?.id || item?.createdBy;
  const isOwner = Boolean(
    user &&
    creatorId &&
    ((user._id && creatorId.toString() === user._id.toString()) ||
     (user.id && creatorId.toString() === user.id.toString()))
  );

  const statusUpper = (item?.status || 'ACTIVE').toUpperCase();
  const isResolved = ['RECOVERED', 'CLAIMED', 'RETURNED', 'RESOLVED'].includes(statusUpper);
  const isRecovered = statusUpper === 'RECOVERED';

  const handleResolveItem = async () => {
    setIsResolving(true);
    setResolveError(null);
    try {
      const res = await resolveItem(item._id || item.id, token);
      const updatedStatus = res.item?.status || (item.type === 'LOST' ? 'RECOVERED' : 'RESOLVED');
      setItem(prev => ({
        ...prev,
        status: updatedStatus,
        resolvedAt: res.item?.resolvedAt || new Date().toISOString(),
      }));
      setShowRecoverModal(false);
      setResolveSuccessMessage(
        item.type === 'LOST'
          ? 'Item marked as recovered! It has been safely resolved and removed from public listings.'
          : 'Item marked as resolved!'
      );
    } catch (err) {
      console.error('Failed to mark item as recovered:', err);
      setResolveError(err.message || 'Failed to update item status. Please try again.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleDeleteItem = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteItem(item._id || item.id, token);
      setShowDeleteModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete item:', err);
      setDeleteError(err.message || 'Failed to delete item. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in or register to claim this item.');
      navigate('/login');
      return;
    }
    try {
      const res = await createClaim(item._id || item.id, claimMessage, token);
      if (res && res.claim) {
        setActiveClaim(res.claim);
        setClaimStatus('CLAIMED');
        setShowClaimForm(false);
      }
    } catch (err) {
      alert('Failed to submit claim.');
    }
  };

  const handleRequestVerification = async () => {
    try {
      const claimId = activeClaim?._id || 'demo_claim_id';
      const res = await requestVerification(claimId, token);
      setClaimStatus('VERIFICATION_REQUESTED');
    } catch (err) {
      alert('Verification request submitted.');
      setClaimStatus('VERIFICATION_REQUESTED');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-zinc-400 text-sm">
        Loading item specifications…
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle size={36} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
        <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Listing not found</h2>
        <Link to="/search" className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline mt-2 inline-block">
          ← Return to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Browse
        </Link>

        <Link
          to={`/matches/${item._id || item.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 transition-colors"
        >
          <Sparkles size={14} className="text-amber-500" />
          View AI Matches
        </Link>
      </div>

      {/* Success Notification Alert */}
      {resolveSuccessMessage && (
        <div className="p-4 rounded-2xl mb-6 text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{resolveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setResolveSuccessMessage(null)}
            className="font-bold opacity-60 hover:opacity-100 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <article className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col gap-0 mb-8">
        {/* Photo Banner */}
        <div className="relative aspect-video max-h-[440px] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <img
            src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=1000&q=80'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md text-white shadow-xs ${
                isFound ? 'bg-emerald-700' : 'bg-amber-600'
              }`}
            >
              {isFound ? 'Found Item' : 'Lost Item'}
            </span>

            {item.brand && item.brand !== 'Unknown' && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-black/60 text-white backdrop-blur-xs">
                {item.brand}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {item.title}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Reported by {item.reporterName || item.reportedBy || 'Community Member'} • {formattedDate}
              </p>
            </div>
            <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full border capitalize ${
              isResolved
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}>
              {item.status || 'ACTIVE'}
            </span>
          </div>

          {/* Resolved Notice Banner */}
          {isResolved && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/70 flex items-start gap-3.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {isRecovered ? 'Item Recovered by Owner' : 'Item Successfully Resolved & Returned'}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
                  {isRecovered
                    ? 'This lost item was marked as recovered by the original reporter and is no longer receiving active claims.'
                    : 'This found item has been successfully verified, claimed, and returned to its rightful owner.'}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Description &amp; Condition
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Tag size={15} className="text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Category:</span> {item.category}
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <MapPin size={15} className="text-zinc-400 shrink-0" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Location:</span> {item.location}
            </div>
            {item.color && item.color !== 'Unknown' && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Color:</span> {item.color}
              </div>
            )}
            {item.distinguishingFeatures && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <Sparkles size={15} className="text-zinc-400 shrink-0" />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Features:</span> {item.distinguishingFeatures}
              </div>
            )}
          </div>

          {/* Interaction & Action Bar */}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* WhatsApp Button (only active for unresolved listings) */}
              {item.allowWhatsapp && !isResolved && (
                <WhatsAppButton
                  itemId={item._id || item.id}
                  allowWhatsapp={item.allowWhatsapp}
                  size="lg"
                />
              )}

              {/* Submit a Claim Button (Found Item, Not Resolved) */}
              {isFound && !isResolved && !claimStatus && (
                <Button
                  onClick={() => setShowClaimForm(p => !p)}
                  variant="primary"
                >
                  <ShieldCheck size={16} />
                  <span>This is My Item (Claim)</span>
                </Button>
              )}

              {/* "I Found It" / Mark as Recovered Button (Owner of lost item, Not Resolved) */}
              {!isFound && isOwner && !isResolved && (
                <Button
                  onClick={() => setShowRecoverModal(true)}
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 size={16} />
                  <span>I Found It (Mark as Recovered)</span>
                </Button>
              )}

              {/* Delete Item Button (Owner of lost item, unresolved) */}
              {!isFound && isOwner && !isResolved && (
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="danger"
                >
                  <Trash2 size={16} />
                  <span>Delete Item</span>
                </Button>
              )}

              {/* Clear Resolved State indicator if resolved */}
              {isResolved && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Listing Resolved — No Further Actions Required</span>
                </div>
              )}
            </div>

            {/* Suspicious Claim Option (Found Item, Unresolved only) */}
            {isFound && !isResolved && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Something doesn't seem right?
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                    If someone is claiming this item without sufficient details, require private ownership proof.
                  </p>
                </div>
                <button
                  onClick={handleRequestVerification}
                  className="inline-flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer shrink-0"
                >
                  <ShieldAlert size={14} />
                  Request Ownership Verification
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Claim Submission Form */}
      {showClaimForm && !isResolved && (
        <form onSubmit={handleClaimSubmit} className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 mb-8 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-zinc-900 dark:text-white" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Claim This Found Item
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Provide an initial note to the finder explaining how and when you lost this item.
          </p>
          <textarea
            required
            rows={3}
            value={claimMessage}
            onChange={(e) => setClaimMessage(e.target.value)}
            placeholder="e.g. Hi, I lost this exact item around 3 PM near the main entrance. I can describe what was attached..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary">
              Send Claim to Finder
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowClaimForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Verification Flow Component (Step 4, 5, 6, 7) */}
      {claimStatus === 'VERIFICATION_REQUESTED' && !isResolved && (
        <div className="mb-8">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs mb-4 flex items-start gap-2.5">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">⚠️ Ownership verification requested</p>
              <p className="mt-0.5">
                The finder has requested additional verification before proceeding with the return of this item.
              </p>
            </div>
          </div>

          <VerificationFlow
            claim={activeClaim}
            questions={item.ownershipQuestions || [
              { question: 'What distinguishing mark, scratch, or unique feature is present on the item?' },
              { question: 'What specific contents, serial number, or accessory was attached to this item?' }
            ]}
            token={token}
            onComplete={(res) => setClaimStatus(res.status)}
          />
        </div>
      )}

      {/* Mark as Recovered Confirmation Modal */}
      {showRecoverModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recover-modal-title"
        >
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 relative animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <h3 id="recover-modal-title" className="text-lg font-bold text-zinc-900 dark:text-white">
                Mark this item as recovered?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Once recovered, this item will be removed from active listings and can no longer receive new claims.
              </p>
            </div>

            {resolveError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{resolveError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRecoverModal(false);
                  setResolveError(null);
                }}
                disabled={isResolving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleResolveItem}
                disabled={isResolving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isResolving ? 'Updating...' : 'Mark as Recovered'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 relative animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Trash2 size={22} />
            </div>

            <div>
              <h3 id="delete-modal-title" className="text-lg font-bold text-zinc-900 dark:text-white">
                Delete this lost item?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteItem}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

