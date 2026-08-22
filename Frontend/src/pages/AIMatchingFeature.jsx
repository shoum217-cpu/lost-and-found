import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Layers, Check } from 'lucide-react';

export default function AIMatchingFeature() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mb-4">
          <Sparkles size={13} className="text-amber-500" />
          <span>Core Technology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          AI-Powered Item Matching
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
          How FindIt cross-examines lost and found submissions to discover high-confidence matches automatically.
        </p>
      </div>

      {/* Feature Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Multimodal Factor Scoring</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We evaluate multiple dimensions beyond simple text keywords: visual appearance, category taxonomy, brand recognition, color matching, proximity in location, and timeframes.
          </p>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 pt-2">
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Category &amp; subcategory alignment
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Brand &amp; model name similarity
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Color profile &amp; distinguishing features
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Geographic cluster proximity
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Privacy First Cross-Search</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Matches are calculated without ever leaking confidential verification answers or private contact data to unauthorized parties.
          </p>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 pt-2">
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Hidden ownership proof answers
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Secure phone masking
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-emerald-600" /> Approximate location clustering
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <span>Report an Item &amp; Check Matches</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
