import { Link } from 'react-router-dom';
import { Search, ArrowRight, Check, Sparkles, Upload } from 'lucide-react';

export default function SmartIdentificationFeature() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mb-4">
          <Search size={13} />
          <span>Vision Analysis</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Smart Item Identification
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
          Upload any photo of a lost or found item to automatically detect its category, brand, colors, and unique features.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 mb-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Vision Output</span>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">Auto-Identified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Category:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Electronics</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Type:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Wireless Earbuds</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Brand:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Apple</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Color:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">White</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Characteristics:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Silicone ear tips, charging case</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            User-Editable Suggestions
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            FindIt provides accurate starting values while giving you full control to adjust or fine-tune any detail before publishing your report.
          </p>
          <p className="text-xs text-zinc-400">
            Zero hallucinations: If a brand or marking is unclear, the model defaults to "Unknown" rather than guessing.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <span>Try Smart Identification</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
