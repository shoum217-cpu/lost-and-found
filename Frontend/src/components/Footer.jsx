import { Link } from 'react-router-dom';
import { Shield, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0c0c0e] border-t border-zinc-200/80 dark:border-zinc-800/80 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-2 max-w-md">
            <div className="flex items-center gap-2.5 font-bold text-lg text-zinc-900 dark:text-white">
              <span className="w-7 h-7 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center text-xs font-mono font-bold">
                F
              </span>
              <span>FindIt</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              FindIt is an intelligent, privacy-first public lost and found platform. Using AI-assisted matching and secure ownership verification, we reunite people with their misplaced belongings safely.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 pt-2">
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                AI Smart Identification
              </span>
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-emerald-500" />
                Encrypted Verification
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Platform
            </h3>
            <nav className="flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400" aria-label="Footer navigation">
              <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link>
              <Link to="/search" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Browse Reports</Link>
              <Link to="/report?type=lost" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Report Lost Item</Link>
              <Link to="/report?type=found" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Report Found Item</Link>
              <Link to="/heatmap" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Activity Heatmap</Link>
            </nav>
          </div>

          {/* Safety & Protocol */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Safety &amp; Verification
            </h3>
            <div className="flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <p className="leading-relaxed">
                Always meet in well-lit, public locations when returning or claiming high-value items.
              </p>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
                Never disclose private passwords or bank pins for ownership verification.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          <p>© {currentYear} FindIt Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Platform Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
