import { useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Upload, Sparkles, MapPin, Tag, FileText, Shield, Loader2, Check, ArrowRight, MessageSquare, AlertCircle, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { categories } from '../data/mockItems';
import { identifyItemImage } from '../services/aiService';
import { createItem } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';

export default function ReportItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const [form, setForm] = useState({
    type: initialType,
    title: '',
    category: '',
    brand: '',
    color: '',
    itemType: '',
    distinguishingFeatures: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    allowWhatsapp: user?.whatsappEnabled || false,
    contactPhone: user?.phone || '',
    image: '',
  });

  // Private Ownership verification questions
  const [ownershipQuestions, setOwnershipQuestions] = useState([
    { question: 'What distinguishing mark, sticker, or scratch is present on the item?', answer: '' },
    { question: 'What specific contents, accessories, or lock-screen details does it have?', answer: '' }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const isFormDirty = Boolean(form.title || form.description || form.location || form.image);

  const handleCancelExit = () => {
    if (isFormDirty) {
      const confirmExit = window.confirm('You have unsaved changes. Are you sure you want to exit?');
      if (!confirmExit) return;
    }
    navigate(-1);
  };

  const handleTypeChange = (type) => {
    setForm(prev => ({ ...prev, type }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image Upload and AI Analysis
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      setForm(prev => ({ ...prev, image: base64 }));
      
      // Trigger AI identification
      setIsAnalyzing(true);
      try {
        const suggestions = await identifyItemImage(base64, form.title);
        if (suggestions) {
          setForm(prev => ({
            ...prev,
            category: suggestions.category !== 'Other' ? suggestions.category : prev.category || 'Personal Items',
            brand: suggestions.brand || prev.brand,
            color: suggestions.color || prev.color,
            itemType: suggestions.itemType || prev.itemType,
            distinguishingFeatures: suggestions.distinguishingFeatures || prev.distinguishingFeatures,
            title: prev.title || suggestions.itemType || '',
          }));
        }
      } catch (err) {
        console.error('AI identification error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuestion = () => {
    setOwnershipQuestions(prev => [
      ...prev,
      { question: '', answer: '' }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    setOwnershipQuestions(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleRemoveQuestion = (index) => {
    setOwnershipQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        type: form.type.toUpperCase(),
        ownershipQuestions: ownershipQuestions.filter(q => q.question && q.answer),
      };

      const result = await createItem(payload, token);
      setSubmissionResult(result);
    } catch (err) {
      alert('Error creating item report: ' + (err.message || 'Server error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post-submission Match Results Screen
  if (submissionResult) {
    const { item, matches = [] } = submissionResult;
    const hasMatches = matches.length > 0;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-elevated mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check size={20} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Report Submitted Successfully
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Your {form.type} item listing for "{item?.title}" is now active in the database.
              </p>
            </div>
          </div>

          {/* AI Match Notification */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 mb-6">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Automatic AI Match Search
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {matches.length} candidate{matches.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {hasMatches
                ? `FindIt cross-referenced existing real ${form.type === 'lost' ? 'Found' : 'Lost'} items and discovered potential matches ranked by confidence.`
                : 'No potential matches yet. We will automatically monitor new community reports and alert you when a match is found.'}
            </p>
          </div>

          {/* Real Matches List */}
          {hasMatches && (
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Potential Matches
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {matches.map((match, idx) => (
                  <MatchCard key={idx} matchData={match} targetItem={item} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/item/${item?._id || item?.id}`}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              View My Listing
            </Link>
            <Link
              to="/explore"
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Explore All Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Back / Exit Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={handleCancelExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <button
          type="button"
          onClick={handleCancelExit}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Report an Item
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Upload an image to trigger Smart AI identification, or fill in details manually.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">

        {/* Type Toggle: LOST / FOUND */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5 block">
            Listing Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('lost')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                form.type === 'lost'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              I Lost Something
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('found')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                form.type === 'found'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              I Found Something
            </button>
          </div>
        </div>

        {/* Image Upload with AI Analysis */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Item Image &amp; AI Analysis
            </label>
            {isAnalyzing && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Loader2 size={13} className="animate-spin" />
                Analyzing item…
              </span>
            )}
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              form.image
                ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />

            {form.image ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Sparkles size={14} />
                    Photo Analyzed by AI
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Click to replace image. Suggestions have been pre-filled below and are fully editable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Click or drag photo here to auto-identify
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Item Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Item Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Black Leather Bifold Wallet, Casio FX-991EX"
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          />
        </div>

        {/* Category & Brand (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
            >
              <option value="" disabled>Select category</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="brand" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Brand (or 'Unknown')
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Apple, Fossil, Casio, Unknown"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>

        {/* Color & Distinguishing Characteristics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="color" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Primary Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              value={form.color}
              onChange={handleChange}
              placeholder="e.g. Matte Black, Navy Blue, Silver"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="distinguishingFeatures" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Unique Characteristics
            </label>
            <input
              id="distinguishingFeatures"
              name="distinguishingFeatures"
              type="text"
              value={form.distinguishingFeatures}
              onChange={handleChange}
              placeholder="e.g. Scratch on corner, yellow tape on cord"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Approximate Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Central Metro Station, Library Gardens"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Date *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Public Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the context or general condition. Do not disclose secret ownership verification answers here."
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
          />
        </div>

        {/* WhatsApp Contact Toggle */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                Enable WhatsApp Direct Contact
              </span>
            </div>
            <input
              type="checkbox"
              name="allowWhatsapp"
              id="allowWhatsapp"
              checked={form.allowWhatsapp}
              onChange={handleChange}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Allows the other party to initiate a secure WhatsApp chat. Your phone number is never displayed publicly on the listing page.
          </p>
          {form.allowWhatsapp && (
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder="Your WhatsApp phone with country code (e.g. +919876543210)"
              className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
          )}
        </div>

        {/* Private Ownership Verification Questions (for Lost Items) */}
        {form.type === 'lost' && (
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                  Private Ownership Proof Questions
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                Confidential
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              These questions will be asked if someone claims to have found your item. The answers are strictly hidden from the public.
            </p>

            <div className="space-y-3">
              {ownershipQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Question {idx + 1}
                    </span>
                    {ownershipQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                    placeholder="e.g. What specific card was inside the wallet?"
                    className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                    placeholder="Private expected answer (e.g. ICICI blue debit card)"
                    className="text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              <Plus size={14} />
              Add Another Verification Question
            </button>
          </div>
        )}

        {/* Submit CTA & Cancel Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Publishing &amp; Searching Real Matches…</span>
              </>
            ) : (
              <span>Publish Report &amp; Check Matches</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancelExit}
            className="w-full py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel and Discard
          </button>
        </div>
      </form>
    </div>
  );
}
