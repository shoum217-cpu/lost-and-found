import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  ShieldCheck,
  Check,
  Layers,
  MapPin,
  Clock,
  Radio,
  FileText
} from 'lucide-react';
import Button from '../components/Button';

export default function Home() {
  // Showcase animation state: 0 = Lost Item, 1 = AI Analyzing, 2 = Found Match + 94% Match
  const [showcaseStep, setShowcaseStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowcaseStep(prev => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">

      {/* =========================================================================
          SECTION 1 — HERO
          Spacious, minimal, confident editorial headline & intelligent connection visual
          ========================================================================= */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 md:pt-28 md:pb-32 overflow-hidden border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

          {/* Section Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 mb-8 border border-zinc-200/80 dark:border-zinc-700/80">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span>Public Lost &amp; Found Reconnection Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.08] mb-6">
            Lost it? <span className="text-zinc-500 dark:text-zinc-400 font-medium">Find it.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
            FindIt helps you reconnect with the things you’ve lost.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
            <Link
              to="/report?type=lost"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Report Lost Item</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/report?type=found"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 transition-all shadow-2xs active:scale-[0.98]"
            >
              <span>Report Found Item</span>
            </Link>
          </div>

          {/* Sophisticated Connection Visual (Connecting Lost ↔ Found with minimal elegance) */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6">

              {/* Lost Item Block */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/60">
                  Lost Report
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Black Leather Wallet
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Metro Plaza • Reported 2h ago
                </p>
              </div>

              {/* Central Intelligent Bridge */}
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
                  <Sparkles size={18} />
                </div>
                <span className="text-[11px] font-mono font-medium text-zinc-400">
                  Intelligent Matching
                </span>
              </div>

              {/* Found Item Block */}
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right gap-2 p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                  Found Listing
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Black Leather Wallet
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Central Terminal • 94% Match
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HOW FINDIT WORKS
          Clean 3-step layout with refined typography, subtle borders, soft shadows
          ========================================================================= */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 md:py-32">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
              Three steps to recovery.
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              A thoughtful, secure platform designed to safely reunite people with misplaced belongings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Step 1: Report */}
            <div className="group bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-8 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  01 — Report
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-3 mb-2">
                  Tell FindIt what you lost or found.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Submit basic details and upload a photo. Our vision engine automatically identifies characteristics, brand, and color.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center self-start">
                <FileText size={18} />
              </div>
            </div>

            {/* Step 2: Discover */}
            <div className="group bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-8 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  02 — Discover
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-3 mb-2">
                  FindIt searches for potential matches.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Our algorithm cross-examines visual features, categories, and locations to calculate accurate match scores in real time.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center self-start">
                <Search size={18} />
              </div>
            </div>

            {/* Step 3: Reconnect */}
            <div className="group bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-8 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  03 — Reconnect
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-3 mb-2">
                  Contact the finder and get your item back.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Initiate secure communication via WhatsApp and confirm genuine ownership with private verification questions.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center self-start">
                <ShieldCheck size={18} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — AI MATCHING SHOWCASE
          Conceptual interactive demonstration:
          LOST (Black Wireless Headphones) -> FindIt AI -> FOUND (Black Wireless Headphones) -> 94% MATCH
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 md:py-32 bg-zinc-50/70 dark:bg-zinc-900/30 border-y border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              AI Matching Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2">
              Automated visual &amp; semantic matching.
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
              How FindIt continuously compares reported parameters to detect true matches.
            </p>
          </div>

          {/* Product Demonstration Container */}
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm">
            
            {/* Step Sequence Indicators */}
            <div className="flex items-center justify-center gap-2 mb-8 text-xs font-medium">
              <button
                onClick={() => setShowcaseStep(0)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  showcaseStep === 0
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                1. Item Reported
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">→</span>
              <button
                onClick={() => setShowcaseStep(1)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  showcaseStep === 1
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                2. Analyzing
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">→</span>
              <button
                onClick={() => setShowcaseStep(2)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  showcaseStep === 2
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                3. Match Score
              </button>
            </div>

            {/* Demonstration Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Lost & Found Comparison View */}
              <div className="space-y-4">
                {/* Lost Card */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-500">
                      LOST
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400">Reported Lost</p>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Black Wireless Headphones</h4>
                      <p className="text-[11px] text-zinc-400">JBL • Over-ear design</p>
                    </div>
                  </div>
                </div>

                {/* Processing Bridge */}
                <div className="flex items-center justify-center py-1 text-xs font-mono font-medium text-zinc-400">
                  {showcaseStep === 1 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                      <Sparkles size={14} className="animate-spin" />
                      FindIt AI: Analyzing attributes…
                    </span>
                  ) : (
                    <span>↓ Cross-referenced with FindIt database</span>
                  )}
                </div>

                {/* Found Card */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-500">
                      FOUND
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">Reported Found</p>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Black Wireless Headphones</h4>
                      <p className="text-[11px] text-zinc-400">JBL Tune • Foldable frame</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Factors and Score Result */}
              <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Evaluated Factors
                    </span>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs">
                      94% MATCH
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>Similar appearance &amp; category</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>Same brand (JBL)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>Similar color (Black)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>Nearby location reporting</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-400">
                  Concept Demonstration • Real reports cross-reference genuine community submissions
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — FINAL CTA
          Simple, minimal, confident
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 md:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4 leading-tight">
            Maybe someone has already found it.
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 mb-10">
            Give FindIt a try.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/report?type=lost"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Report Lost Item</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/report?type=found"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 transition-all shadow-2xs active:scale-[0.98]"
            >
              <span>Report Found Item</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
