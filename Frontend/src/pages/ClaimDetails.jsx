import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Lock,
  ExternalLink,
  Loader2,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { getClaimById, requestVerification, approveClaim, rejectClaim } from '../services/claimService';
import { useAuth } from '../context/AuthContext';
import VerificationFlow from '../components/VerificationFlow';
import WhatsAppButton from '../components/WhatsAppButton';
import Button from '../components/Button';

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [claim, setClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // null | 'NOT_FOUND' | 'UNAUTHORIZED' | 'INVALID_ID' | 'ERROR' | 'UNAUTHENTICATED' | 'NETWORK_ERROR'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchClaim = async () => {
    if (!token) {
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setErrorStatus(null);
      const data = await getClaimById(id, token);

      if (!data) {
        setErrorStatus('NOT_FOUND');
      } else if (data.error === 'INVALID_ID' || data.status === 400) {
        setErrorStatus('INVALID_ID');
      } else if (data.error === 'UNAUTHENTICATED' || data.status === 401) {
        setErrorStatus('UNAUTHENTICATED');
      } else if (data.error === 'UNAUTHORIZED' || data.status === 403) {
        setErrorStatus('UNAUTHORIZED');
      } else if (data.error === 'NOT_FOUND' || data.status === 404) {
        setErrorStatus('NOT_FOUND');
      } else if (data.error || data.status >= 500) {
        setErrorStatus('ERROR');
      } else {
        setClaim(data);
      }
    } catch (err) {
      setErrorStatus('ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchClaim();
    }
  }, [id, token, authLoading]);

  const currentUserId = user?._id || user?.id;
  const claimantId = claim?.claimant?._id || claim?.claimant;
  const finderId = claim?.finder?._id || claim?.finder;
  const itemCreatorId = claim?.item?.createdBy?._id || claim?.item?.createdBy;

  const isClaimant = currentUserId && claimantId && currentUserId.toString() === claimantId.toString();
  const isFinder = currentUserId && (
    (finderId && currentUserId.toString() === finderId.toString()) ||
    (itemCreatorId && currentUserId.toString() === itemCreatorId.toString())
  );

  const handleRequestVerification = async () => {
    try {
      setActionLoading(true);
      const res = await requestVerification(claim._id || id, token);
      if (res && (res.success || res.claim)) {
        setActionMessage({ type: 'success', text: 'Ownership verification requested from claimant.' });
        fetchClaim();
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to request verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this claim?')) return;

    try {
      setActionLoading(true);
      const res = await approveClaim(claim._id || id, token);
      if (res && (res.success || res.claim)) {
        setActionMessage({ type: 'success', text: 'Claim approved successfully!' });
        fetchClaim();
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to approve claim.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to decline this claim?')) return;

    try {
      setActionLoading(true);
      const res = await rejectClaim(claim._id || id, token);
      if (res && (res.success || res.claim)) {
        setActionMessage({ type: 'success', text: 'Claim declined.' });
        fetchClaim();
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to reject claim.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    fetchClaim();
  };

  // Loading state (auth or fetch)
  if (authLoading || (isLoading && token)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Loader2 size={32} className="animate-spin text-zinc-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Loading claim specifications…
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated && !token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-zinc-600 dark:text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          Please log in to view claim details and ownership verification status.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  // Unauthorized (Access Restricted)
  if (errorStatus === 'UNAUTHORIZED') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Access Restricted</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6 leading-relaxed">
          You are not authorized to view this claim. For privacy and security, only the item reporter and the claimant have access.
        </p>
        <Link
          to="/notifications"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Notifications
        </Link>
      </div>
    );
  }

  // Invalid Claim ID
  if (errorStatus === 'INVALID_ID') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Invalid Claim Identifier</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          The claim link or identifier provided is invalid or malformed.
        </p>
        <Link
          to="/notifications"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Notifications
        </Link>
      </div>
    );
  }

  // Not Found
  if (errorStatus === 'NOT_FOUND') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Claim Not Found</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          The requested claim does not exist or may have been removed.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={14} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  // API / Network Error
  if (errorStatus === 'ERROR' || errorStatus === 'NETWORK_ERROR' || (!claim && !isLoading)) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Unable to Load Claim</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6 leading-relaxed">
          A server or network error occurred while retrieving this claim. Please try again.
        </p>
        <button
          onClick={fetchClaim}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 cursor-pointer transition-colors"
        >
          <RotateCcw size={14} /> Retry
        </button>
      </div>
    );
  }

  const item = claim.item || {};
  const status = claim.status || 'PENDING';

  const statusBadge = () => {
    switch (status) {
      case 'VERIFIED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 size={13} />
            Verified &amp; Approved
          </span>
        );
      case 'VERIFICATION_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <ShieldAlert size={13} />
            Verification Requested
          </span>
        );
      case 'ANSWERS_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Sparkles size={13} />
            Answers Submitted
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
            <XCircle size={13} />
            Verification Unsuccessful
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle size={13} />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            <Sparkles size={13} />
            Pending Review
          </span>
        );
    }
  };

  const claimantName = claim.claimantName || (claim.claimant && claim.claimant.name) || 'Claimant';
  const claimantEmail = claim.claimantEmail || (claim.claimant && claim.claimant.email) || '';
  const claimantPhone = claim.claimant && claim.claimant.phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/notifications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Notifications
        </Link>

        {statusBadge()}
      </div>

      {actionMessage && (
        <div className={`p-4 rounded-2xl mb-6 text-xs flex items-center justify-between ${
          actionMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Main Claim Header */}
      <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
              <ShieldCheck size={14} />
              Ownership Claim Record
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Claim on &ldquo;{item.title || 'Found Item'}&rdquo;
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Submitted on {new Date(claim.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} • Claim ID: <span className="font-mono">{claim._id}</span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {isFinder ? 'You are the Finder / Reporter' : isClaimant ? 'You are the Claimant' : 'Admin View'}
            </span>
            <span className="text-[11px] text-zinc-400">
              {isFinder ? 'Review claimant proof below' : 'Track your verification status'}
            </span>
          </div>
        </div>

        {/* Claimed Item Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="sm:col-span-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden aspect-video sm:aspect-square relative max-h-48">
            <img
              src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=1000&q=80'}
              alt={item.title || 'Item image'}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
              {item.type || 'FOUND'}
            </span>
          </div>

          <div className="sm:col-span-2 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {item.title || 'Item Details'}
                </h3>
                {item._id && (
                  <Link
                    to={`/item/${item._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    View Listing <ExternalLink size={12} />
                  </Link>
                )}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-zinc-400 shrink-0" />
                <span className="truncate">Category: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.category || 'General'}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-zinc-400 shrink-0" />
                <span className="truncate">Location: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.location || 'Not specified'}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claimant Information & Initial Message */}
      <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User size={16} /> Claimant Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="text-zinc-400 block mb-1">Claimant Name</span>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">{claimantName}</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="text-zinc-400 block mb-1">Claimant Contact</span>
            <div className="flex flex-col gap-0.5">
              {claimantEmail && (
                <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <Mail size={12} className="text-zinc-400" /> {claimantEmail}
                </span>
              )}
              {claimantPhone && (
                <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                  <Phone size={12} className="text-zinc-400" /> {claimantPhone}
                </span>
              )}
              {!claimantEmail && !claimantPhone && (
                <span className="text-zinc-400 italic">Contact details provided securely via platform</span>
              )}
            </div>
          </div>
        </div>

        {/* Initial Claim Message */}
        <div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Initial Claim Note
          </span>
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic flex items-start gap-2.5">
            <MessageSquare size={16} className="text-zinc-400 shrink-0 mt-0.5" />
            <span>&ldquo;{claim.initialMessage || 'I believe this is my item.'}&rdquo;</span>
          </div>
        </div>
      </div>

      {/* 7-STEP OWNERSHIP VERIFICATION SECTION */}
      <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              7-Step Ownership Verification Protocol
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Confidential, AI and rule-evaluated proof verification
            </p>
          </div>
        </div>

        {/* CASE 1: Claimant needs to answer questions */}
        {isClaimant && status === 'VERIFICATION_REQUESTED' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <ShieldAlert size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold">⚠️ Ownership verification requested by the finder</p>
                <p className="mt-0.5">
                  To ensure safe return, please answer the specific questions below about the item. Correct answers are kept strictly private.
                </p>
              </div>
            </div>

            <VerificationFlow
              claim={claim}
              questions={claim.verificationQuestions && claim.verificationQuestions.length > 0
                ? claim.verificationQuestions
                : (item.ownershipQuestions || [
                    { question: 'What distinguishing mark, scratch, or unique feature is present on the item?' },
                    { question: 'What specific contents, serial number, or accessory was attached to this item?' }
                  ])
              }
              token={token}
              onComplete={handleVerificationComplete}
            />
          </div>
        )}

        {/* CASE 2: Status is VERIFIED */}
        {(status === 'VERIFIED' || status === 'APPROVED') && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    ✓ Ownership Confirmed
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Confidence Match: <span className="font-mono font-bold">{claim.verificationScore || 95}%</span>
                  </p>
                </div>
              </div>

              {item.allowWhatsapp && (
                <WhatsAppButton
                  itemId={item._id}
                  allowWhatsapp={item.allowWhatsapp}
                  size="md"
                />
              )}
            </div>

            {claim.verificationFeedback && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <span className="font-semibold block mb-1 text-zinc-900 dark:text-white">AI Verification Summary:</span>
                {claim.verificationFeedback}
              </div>
            )}

            {claim.questionBreakdown && claim.questionBreakdown.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Evaluated Verification Criteria
                </h5>
                {claim.questionBreakdown.map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 text-xs">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{q.question}</span>
                    <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      ✓ Matches
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CASE 3: Status is FAILED */}
        {status === 'FAILED' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  Verification Unsuccessful
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  The information provided did not sufficiently match the ownership details. Private details remain confidential.
                </p>
                <p className="text-xs font-mono mt-2 text-zinc-600 dark:text-zinc-300">
                  Confidence Score: {claim.verificationScore || 0}%
                </p>
              </div>
            </div>

            {isFinder && (
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleRequestVerification}
                  disabled={actionLoading}
                  variant="outline"
                  className="text-xs"
                >
                  <ShieldAlert size={14} /> Re-request Verification
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={actionLoading}
                  variant="ghost"
                  className="text-xs text-rose-600 hover:text-rose-700"
                >
                  <X size={14} /> Decline Claim
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CASE 4: Finder viewing in PENDING status */}
        {isFinder && status === 'PENDING' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Need additional proof before handing over?
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Trigger the confidential 7-step ownership verification. The claimant will be sent specific questions to confirm their ownership.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleRequestVerification}
                  disabled={actionLoading}
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  <ShieldAlert size={15} />
                  <span>Request Ownership Verification (Step 2/3)</span>
                </Button>
              </div>
            </div>

            {/* Direct Approval / Rejection Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">
                Or take direct action on this claim:
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  variant="outline"
                  className="text-xs text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Check size={14} />
                  <span>Directly Approve Claim</span>
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={actionLoading}
                  variant="ghost"
                  className="text-xs text-rose-600 hover:text-rose-700"
                >
                  <X size={14} />
                  <span>Decline Claim</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CASE 5: Finder viewing in VERIFICATION_REQUESTED status */}
        {isFinder && status === 'VERIFICATION_REQUESTED' && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
              <span>Verification questions sent to claimant</span>
            </div>
            <p className="leading-relaxed">
              The claimant has been notified to answer confidential questions. Once they submit their answers, FindIt&rsquo;s AI and rule engine will evaluate and update you here.
            </p>
          </div>
        )}

        {/* CASE 6: Claimant viewing in PENDING status */}
        {isClaimant && status === 'PENDING' && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
            <p className="font-bold text-zinc-900 dark:text-white">Claim Submitted</p>
            <p>Your claim has been delivered to the finder for review. If additional verification is needed, you will receive a prompt to answer verification questions.</p>
          </div>
        )}

        {/* CASE 7: Status is REJECTED */}
        {status === 'REJECTED' && (
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-3">
            <XCircle size={20} className="text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Claim Closed / Declined</p>
              <p className="mt-0.5">This claim was declined by the finder.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
