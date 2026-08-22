import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Check, ShieldAlert, Lock } from 'lucide-react';

export default function OwnershipVerificationFeature() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mb-4">
          <ShieldCheck size={13} />
          <span>Return Security</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Proof of Ownership Protocol
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
          A neutral, confidential protocol to verify true ownership before high-value items are handed over.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">1. Neutral Trigger</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            If a conversation feels uncertain, the finder can click "Request Ownership Verification" without accusing anyone.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
            <Lock size={18} />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">2. Hidden Details</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Claimants answer specific questions (e.g. inner contents, unique scratches, accessories) with answers strictly concealed.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">3. Verified Confirmation</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Semantic and deterministic algorithms calculate confidence. When verified, both parties proceed with confidence.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <span>Explore Protected Listings</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
