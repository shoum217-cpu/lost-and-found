import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Search, ShieldCheck, Sparkles, MessageSquare, MapPin } from 'lucide-react';
import Button from '../components/Button';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Guide &amp; Principles
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
          How FindIt Works
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
          FindIt is built around privacy, speed, and genuine recovery. Here is the step-by-step lifecycle from report to safe handoff.
        </p>
      </div>

      <div className="space-y-12 mb-16">
        {/* Step 1 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-900 dark:text-white shrink-0">
            01
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Report Lost or Found Item
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Upload a clear photo and provide general context. Our Smart Item Identification model automatically detects the item category, brand, color, and unique characteristics so you don’t have to type extensive forms.
            </p>
            <div className="pt-2 text-xs text-zinc-400">
              ✓ Optional: Add private verification questions (e.g. "What was inside?") to secure your listing.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-900 dark:text-white shrink-0">
            02
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Automatic Cross-Matching
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              When a report is submitted, FindIt automatically checks opposite listings (Lost ↔ Found) for visual and textual overlap. A confidence Match Score is generated alongside an itemized checklist of common attributes.
            </p>
            <div className="pt-2 text-xs text-zinc-400">
              ✓ Match cards showcase side-by-side comparison photos and locations.
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-900 dark:text-white shrink-0">
            03
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Direct Contact &amp; Confidential Verification
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Connect directly via WhatsApp if enabled by the finder. If anything feels suspicious, the finder can trigger an Ownership Verification request. The claimant answers private questions which are verified without ever exposing confidential details.
            </p>
            <div className="pt-2 text-xs text-zinc-400">
              ✓ Both parties receive verified confirmation once confidence thresholds are met.
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
          Ready to find your item?
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Submit a report or explore current community listings.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/report?type=lost"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold"
          >
            Report Lost Item
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-100"
          >
            Explore Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
