import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Upload, MapPin, FileText, Tag } from 'lucide-react'
import { categories } from '../data/mockItems'

/**
 * ReportItem.jsx – Form to report a lost or found item.
 *
 * Reads ?type=lost|found from the URL to pre-select the report type.
 * Submission is a stub – will call itemService.createItem() when Supabase is connected.
 */
export default function ReportItem() {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost'

  const [form, setForm] = useState({
    type: initialType,
    title: '',
    category: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    // TODO: call createItem(form) from itemService when Supabase is ready
    await new Promise(r => setTimeout(r, 800)) // simulate network delay
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Report Submitted!</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your {form.type} item report has been received. (Note: backend not connected yet.)
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Report Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Report an Item</h1>
        <p className="text-sm text-gray-500">Fill in the details below. The more info, the better!</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-5">

        {/* Type toggle */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">I am reporting a:</legend>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
              form.type === 'lost'
                ? 'bg-orange-50 border-orange-300 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="type"
                value="lost"
                checked={form.type === 'lost'}
                onChange={handleChange}
                className="sr-only"
              />
              Lost Item
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
              form.type === 'found'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="type"
                value="found"
                checked={form.type === 'found'}
                onChange={handleChange}
                className="sr-only"
              />
              Found Item
            </label>
          </div>
        </fieldset>

        {/* Item title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Item Name *</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Black Wallet, Casio Calculator"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            <Tag size={13} className="inline mr-1 text-gray-400" aria-hidden="true" />
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
          >
            <option value="" disabled>Select a category</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            <FileText size={13} className="inline mr-1 text-gray-400" aria-hidden="true" />
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the item in detail – color, brand, any distinctive features..."
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">
            <MapPin size={13} className="inline mr-1 text-gray-400" aria-hidden="true" />
            Location *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Library, Block B – CS Lab, Basketball Court"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={form.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Image upload placeholder */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">
            <Upload size={13} className="inline mr-1 text-gray-400" aria-hidden="true" />
            Photo (optional)
          </span>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400 bg-gray-50">
            <Upload size={20} className="mx-auto mb-2 text-gray-300" aria-hidden="true" />
            Image upload coming soon (Supabase Storage)
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          * Authentication required to save reports. Login/Register coming soon.
        </p>
      </form>
    </div>
  )
}
