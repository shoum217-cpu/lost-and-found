import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, AlertCircle, CheckCircle, RotateCcw, Package } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ItemCard from '../components/ItemCard'
import { mockItems } from '../data/mockItems'

/**
 * Home.jsx – Landing page for ReFound.
 *
 * Sections:
 *  1. Hero – headline, search bar, CTAs
 *  2. Quick Actions – Lost / Found cards
 *  3. Recently Found Items – item card grid
 *  4. How It Works – 3-step explainer
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Show only the 4 most recent "found" items in the preview grid
  const recentItems = mockItems
    .filter(item => item.type === 'found' && item.status === 'open')
    .slice(0, 4)

  function handleSearch() {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <>
      {/* ─────────────────────────────── HERO ─────────────────────────────── */}
      <section className="bg-white pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow label */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-5">
            <Package size={12} aria-hidden="true" />
            MIT Bengaluru Lost &amp; Found
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Lost something?<br />
            <span className="text-blue-600">Let's help you find it.</span>
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            ReFound helps MIT Bengaluru students report, discover, and
            return lost belongings — quickly and without the hassle.
          </p>

          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search for a lost wallet, AirPods, ID card..."
            className="max-w-2xl mx-auto mb-6"
          />

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/report?type=lost"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Report Lost Item
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/report?type=found"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Report Found Item
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── QUICK ACTIONS ─────────────────────────── */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6" aria-labelledby="quick-actions-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* I Lost Something */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} className="text-orange-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">I Lost Something</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Lost something on campus? Report it here so someone who found it can return it to you.
                </p>
              </div>
              <Link
                to="/report?type=lost"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors mt-auto"
              >
                Report Lost Item <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {/* I Found Something */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">I Found Something</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Found something that doesn't belong to you? Post it here so the owner can claim it back.
                </p>
              </div>
              <Link
                to="/report?type=found"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mt-auto"
              >
                Report Found Item <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── RECENTLY FOUND ──────────────────────────── */}
      <section className="py-14 px-4 sm:px-6" aria-labelledby="recent-items-heading">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="recent-items-heading" className="text-xl font-bold text-gray-900">
                Recently Found Items
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Could one of these be yours?</p>
            </div>
            <Link
              to="/search?type=found"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Item grid – 4 columns on large screens, responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── HOW IT WORKS ───────────────────────────── */}
      <section className="bg-gray-50 py-14 px-4 sm:px-6" aria-labelledby="how-it-works-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="how-it-works-heading" className="text-xl font-bold text-gray-900 mb-2">
            How ReFound Works
          </h2>
          <p className="text-sm text-gray-500 mb-10">Three simple steps to reunite items with their owners.</p>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none">
            {/* Step 1 */}
            <li className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={22} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 1</span>
              <h3 className="text-base font-semibold text-gray-900">Report</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Submit a quick report with a photo and description of the item you lost or found.
              </p>
            </li>

            {/* Step 2 */}
            <li className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Search size={22} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 2</span>
              <h3 className="text-base font-semibold text-gray-900">Find</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Browse reports or search by name, category, and location to find a matching item.
              </p>
            </li>

            {/* Step 3 */}
            <li className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <RotateCcw size={22} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 3</span>
              <h3 className="text-base font-semibold text-gray-900">Return</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Connect with the finder or claimant and arrange to return the item. Mark it as returned.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  )
}
