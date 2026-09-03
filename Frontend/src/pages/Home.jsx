import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, ArrowUpRight, ShieldCheck, Sparkles, Building, MessageCircle } from 'lucide-react';
import { getItems } from '../services/itemService';

/* ─── Reduced motion detection ───────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = e => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ─── Intersection observer hook ─────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.unobserve(el);
      }
    }, { threshold: 0.2, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── Count-up hook (for match demo) ─────────────────────────────────── */
function useCountUp(target, duration = 1200, active = false, reduced = false) {
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (!active || reduced) { setValue(target); return; }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, reduced]);
  return value;
}

/* ─── MIT Bengaluru Campus Items Visual Showcase ─────────────────────── */
const CAMPUS_COLLAGE_ITEMS = [
  {
    id: 'c1',
    status: 'lost',
    name: 'Black JBL Headphones',
    location: 'AB1 Central Library, 2F',
    time: '2h ago',
    matchPct: null,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    color: '#2B2B2B',
    rotate: '-2.5deg',
    zIndex: 3
  },
  {
    id: 'c2',
    status: 'found',
    name: 'Silver MacBook Charger',
    location: 'Food Court, AB2',
    time: '45m ago',
    matchPct: '94%',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
    color: '#A8A8A8',
    rotate: '2.5deg',
    zIndex: 4
  },
  {
    id: 'c3',
    status: 'lost',
    name: 'Student ID & Key Lanyard',
    location: 'Hostel Block 3 Ground Floor',
    time: '3h ago',
    matchPct: null,
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=400&q=80',
    color: '#1B3A6B',
    rotate: '-1.5deg',
    zIndex: 2
  },
  {
    id: 'c4',
    status: 'found',
    name: 'AirPods Pro Case',
    location: 'Innovation Lab 4',
    time: '1h ago',
    matchPct: '89%',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
    color: '#EBEBEB',
    rotate: '3deg',
    zIndex: 5
  },
  {
    id: 'c5',
    status: 'lost',
    name: 'Casio Scientific Calculator',
    location: 'AB1 Room 304',
    time: '5h ago',
    matchPct: null,
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&q=80',
    color: '#4A5568',
    rotate: '-3deg',
    zIndex: 1
  },
  {
    id: 'c6',
    status: 'found',
    name: 'Matte Black Water Bottle',
    location: 'Sports Arena Court 1',
    time: '30m ago',
    matchPct: '91%',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    color: '#1A202C',
    rotate: '1.5deg',
    zIndex: 6
  },
  {
    id: 'c7',
    status: 'lost',
    name: 'Brown Leather Backpack',
    location: 'Student Activity Center',
    time: 'Yesterday',
    matchPct: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    color: '#7A4E2D',
    rotate: '-0.5deg',
    zIndex: 2
  },
];

/* ─── Corkboard positions ─────────────────────────────────────────────── */
const POSITIONS = [
  { top: '6%',  left: '4%'   },
  { top: '4%',  left: '40%'  },
  { top: '2%',  right: '5%'  },
  { top: '40%', left: '18%'  },
  { top: '37%', right: '4%'  },
  { bottom: '6%', left: '6%' },
  { bottom: '4%', left: '47%'},
];

/* ─── Collage Tag ─────────────────────────────────────────────────────── */
function CollageTag({ item, position, delay, animated, reduced }) {
  const [stamping, setStamping] = useState(false);

  const springStyle = animated && !reduced ? {
    transform: `rotate(${item.rotate})`,
    animation: `spring-land 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms forwards`,
  } : {
    transform: `rotate(${item.rotate})`,
    opacity: 1,
  };

  function handleClick() {
    if (reduced) return;
    setStamping(true);
    setTimeout(() => setStamping(false), 320);
  }

  return (
    <div
      className="absolute"
      style={{
        ...position,
        zIndex: item.zIndex,
        opacity: animated || reduced ? 1 : 0,
        transition: reduced ? 'none' : 'opacity 300ms ease',
      }}
    >
      <div
        className="claim-tag w-44"
        style={{
          ...springStyle,
          ...(stamping && !reduced ? {
            animation: `stamp 280ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
          } : {}),
        }}
        onMouseEnter={e => {
          if (reduced) return;
          const angle = parseFloat(item.rotate);
          e.currentTarget.style.transform = `rotate(${angle > 0 ? angle + 2 : angle - 2}deg) translateY(-5px)`;
          e.currentTarget.style.boxShadow = 'var(--shadow-tag-hover)';
        }}
        onMouseLeave={e => {
          if (reduced || stamping) return;
          e.currentTarget.style.transform = `rotate(${item.rotate})`;
          e.currentTarget.style.boxShadow = '';
        }}
        onClick={handleClick}
      >
        <div className={`claim-tag-strip ${item.status}`} />
        <div className="px-3 pb-3">
          {/* Photo thumbnail */}
          <div
            className="w-full h-24 rounded-lg mb-2.5 relative overflow-hidden bg-surface flex items-center justify-center"
            style={{ backgroundColor: item.color }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                }}
              />
            )}
          </div>
          <span className={item.status === 'lost' ? 'badge-lost' : 'badge-found'}>
            {item.status}
          </span>
          <p className="mt-1.5 text-xs font-semibold leading-tight line-clamp-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
            {item.name}
          </p>
          <p className="meta-label mt-1.5 flex items-center gap-1 truncate" style={{ fontSize: '9px' }}>
            <MapPin size={8} className="shrink-0" /> {item.location}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="meta-label" style={{ fontSize: '9px' }}>{item.time}</span>
            {item.matchPct && (
              <span className="meta-label font-semibold" style={{ fontSize: '9px', color: 'var(--color-found)' }}>
                {item.matchPct}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Real Feed Row ───────────────────────────────────────────────────── */
function RealFeedRow({ item, index, inView, reduced }) {
  const cls = inView && !reduced ? `anim-row-in` : '';
  const style = inView && !reduced
    ? { animationDelay: `${index * 50}ms` }
    : (reduced ? { opacity: 1 } : { opacity: 0 });

  const isLost = (item.type || '').toUpperCase() === 'LOST';
  const displayDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Recent';

  return (
    <Link
      to={`/item/${item._id || item.id}`}
      className={`group flex items-start gap-4 py-4 border-b transition-colors ${cls}`}
      style={{
        borderColor: 'var(--color-border)',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(26,21,18,0.03)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
    >
      <div
        className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: isLost ? 'var(--color-lost)' : 'var(--color-found)' }}
      />
      {/* Thumbnail */}
      {item.image && (
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface border border-border">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={isLost ? 'badge-lost' : 'badge-found'}>
              {isLost ? 'lost' : 'found'}
            </span>
            <p className="mt-1.5 text-sm font-semibold leading-snug truncate" style={{ color: 'var(--color-ink)' }}>
              {item.title}
            </p>
          </div>
          <ArrowUpRight
            size={14}
            className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-muted)' }}
          />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="meta-label flex items-center gap-1"><MapPin size={9} />{item.location}</span>
          <span className="meta-label flex items-center gap-1"><Clock size={9} />{displayDate}</span>
          <span className="meta-label">{item.category}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Matching Demo Section ───────────────────────────────────────────── */
function MatchShowcase({ reduced }) {
  const [sectionRef, inView] = useInView({ threshold: 0.3 });
  const [lineAnimated, setLineAnimated] = useState(false);
  const matchPct = useCountUp(94, 1000, inView, reduced);

  useEffect(() => {
    if (inView && !reduced) {
      const t = setTimeout(() => setLineAnimated(true), 200);
      return () => clearTimeout(t);
    }
    if (reduced) setLineAnimated(true);
  }, [inView, reduced]);

  return (
    <section
      ref={sectionRef}
      className="py-20"
      style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: confidence bars */}
          <div>
            <p className="meta-label mb-3">How matching works</p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(30px, 4vw, 46px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: 'var(--color-ink)',
              }}
            >
              Visual + semantic.<br />
              <span style={{ fontWeight: 300 }}>Not just keyword search.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-muted)', maxWidth: '380px' }}>
              FindIt compares photos, brands, colors, and campus locations — then provides a real confidence score for MIT Bengaluru reports.
            </p>

            {[
              { label: 'Visual appearance', pct: 97 },
              { label: 'Brand & model',     pct: 100 },
              { label: 'Color match',       pct: 94 },
              { label: 'Campus location match', pct: 88 },
            ].map((f, i) => (
              <div key={f.label} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-ink)' }}>{f.label}</span>
                  <span className="meta-label">{f.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: inView ? `${f.pct}%` : '0%',
                      backgroundColor: f.pct > 90 ? 'var(--color-found)' : 'var(--color-lost)',
                      transition: reduced ? 'none' : `width ${600 + i * 120}ms cubic-bezier(0.34, 1.3, 0.64, 1) ${inView ? i * 80 + 'ms' : '0ms'}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Two claim-tag cards + animated connector + match % */}
          <div className="flex flex-col items-center gap-0">

            {/* Lost tag */}
            <div
              className="claim-tag w-full max-w-sm"
              style={{ transform: 'rotate(-1deg)', zIndex: 2 }}
              onMouseEnter={e => { if (!reduced) { e.currentTarget.style.transform = 'rotate(-2.5deg) translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-tag-hover)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(-1deg)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className="claim-tag-strip lost" />
              <div className="px-5 pb-5">
                <div className="w-full h-28 rounded-lg mb-3 overflow-hidden bg-surface border border-border flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                    alt="Black JBL Headphones"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="badge-lost">Lost · Campus Report</span>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>Black JBL Headphones (Over-ear)</p>
                <p className="meta-label mt-1 flex items-center gap-1"><MapPin size={9} /> AB1 Central Library · Reported 08:14</p>
              </div>
            </div>

            {/* Animated connector */}
            <div className="relative w-full max-w-sm flex items-center justify-center" style={{ height: '64px', zIndex: 10 }}>
              <svg
                viewBox="0 0 200 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute"
                style={{ width: '80%', height: '40px' }}
              >
                {/* Pulse rings on ends */}
                {inView && (
                  <>
                    <circle cx="20" cy="20" r="6" fill="none" stroke="var(--color-lost)" strokeWidth="1.5"
                      className={reduced ? '' : 'match-ring-pulse'}
                      style={reduced ? { opacity: 1 } : { animationDelay: '0ms' }}
                    />
                    <circle cx="180" cy="20" r="6" fill="none" stroke="var(--color-found)" strokeWidth="1.5"
                      className={reduced ? '' : 'match-ring-pulse'}
                      style={reduced ? { opacity: 1 } : { animationDelay: '400ms' }}
                    />
                  </>
                )}
                {/* Center dots */}
                <circle cx="20" cy="20" r="3" fill="var(--color-lost)" />
                <circle cx="180" cy="20" r="3" fill="var(--color-found)" />
                {/* The line that draws */}
                <line
                  x1="26" y1="20" x2="174" y2="20"
                  stroke="url(#matchGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="200"
                  strokeDashoffset={lineAnimated ? 0 : 200}
                  style={{ transition: reduced ? 'none' : 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms' }}
                />
                <defs>
                  <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-lost)" />
                    <stop offset="100%" stopColor="var(--color-found)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Match % badge — snaps in when inView */}
              <div
                className={`absolute rounded-lg px-4 py-1.5 ${inView && !reduced ? 'anim-score-snap' : ''}`}
                style={{
                  backgroundColor: 'var(--color-canvas)',
                  border: '1.5px solid var(--color-border)',
                  boxShadow: 'var(--shadow-tag)',
                  opacity: inView ? 1 : 0,
                  transition: reduced ? 'opacity 200ms' : 'none',
                  zIndex: 11,
                }}
              >
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: '18px', color: 'var(--color-found)' }}
                >
                  {matchPct}%
                </span>
                <span className="meta-label ml-1" style={{ fontSize: '10px' }}>match</span>
              </div>
            </div>

            {/* Found tag */}
            <div
              className="claim-tag w-full max-w-sm"
              style={{ transform: 'rotate(1.2deg)', zIndex: 2 }}
              onMouseEnter={e => { if (!reduced) { e.currentTarget.style.transform = 'rotate(2.8deg) translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-tag-hover)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(1.2deg)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className="claim-tag-strip found" />
              <div className="px-5 pb-5">
                <div className="w-full h-28 rounded-lg mb-3 overflow-hidden bg-surface border border-border flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                    alt="JBL Tune Foldable"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="badge-found">Found · Campus Report</span>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>JBL Tune 660NC · Foldable, Black</p>
                <p className="meta-label mt-1 flex items-center gap-1"><MapPin size={9} /> Food Court AB2 · Found 09:02</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const reduced = usePrefersReducedMotion();
  const [heroReady, setHeroReady] = useState(false);
  const [feedRef, feedInView] = useInView({ threshold: 0.1 });
  const [realItems, setRealItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Hero load sequence fires 80ms after mount
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Fetch real items from database/service for the live reports feed
  useEffect(() => {
    setLoadingItems(true);
    getItems()
      .then(items => {
        if (Array.isArray(items)) {
          setRealItems(items.slice(0, 6));
        }
      })
      .catch(err => {
        console.warn('Real items fetch warning:', err);
      })
      .finally(() => {
        setLoadingItems(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <section
        className="relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--color-border)', minHeight: '90vh' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-start gap-0 pt-16 pb-0">

          {/* Left: Headline + CTA */}
          <div className="flex-1 lg:max-w-[540px] pb-16 lg:pb-24 pt-4 lg:pt-8 z-10 relative">

            {/* Eyebrow — fade up */}
            <p
              className={`meta-label mb-6 flex items-center gap-2 ${heroReady && !reduced ? 'anim-fade-up' : ''}`}
              style={{
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '0ms',
              }}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-found)' }} />
              MIT Bengaluru Campus · Lost &amp; Found
            </p>

            {/* HEADLINE — two parts, different animations */}
            <h1
              className="leading-[0.94] mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(64px, 9vw, 112px)',
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
              }}
            >
              {/* "Lost it?" — glitches in like a search query */}
              <span
                className={`block ${heroReady && !reduced ? 'anim-glitch-in' : ''}`}
                style={{
                  fontWeight: 200,
                  display: 'block',
                  opacity: heroReady || reduced ? 1 : 0,
                  animationDelay: '120ms',
                }}
              >
                Lost it?
              </span>

              {/* "Find it." — snaps in bold right after, like an answer */}
              <span
                className={`block ${heroReady && !reduced ? 'anim-snap-in' : ''}`}
                style={{
                  fontWeight: 800,
                  display: 'block',
                  color: 'var(--color-lost)',
                  letterSpacing: '-0.04em',
                  opacity: heroReady || reduced ? 1 : 0,
                  animationDelay: '460ms',
                }}
              >
                Find it.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className={`mb-10 max-w-md leading-relaxed ${heroReady && !reduced ? 'anim-fade-up' : ''}`}
              style={{
                fontSize: '16px',
                color: 'var(--color-muted)',
                fontWeight: 400,
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '640ms',
              }}
            >
              MIT Bengaluru's dedicated lost &amp; found network. Report lost belongings, register found items, and reconnect with fellow students quickly.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap items-center gap-4 ${heroReady && !reduced ? 'anim-slide-left' : ''}`}
              style={{
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '720ms',
              }}
            >
              <Link to="/report?type=lost" className="btn-primary">
                Report Lost Item
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/report?type=found"
                className="text-sm font-semibold underline underline-offset-4"
                style={{ color: 'var(--color-muted)', textDecorationColor: 'var(--color-border)' }}
              >
                I found something →
              </Link>
            </div>

            {/* Value Highlights (Non-fake badges) */}
            <div
              className={`grid grid-cols-3 gap-4 mt-12 pt-8 ${heroReady && !reduced ? 'anim-count' : ''}`}
              style={{
                borderTop: '1px solid var(--color-border)',
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '840ms',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2 }}>
                  MIT Bengaluru
                </p>
                <p className="meta-label mt-1 text-[11px]">Campus Hub</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2 }}>
                  Visual AI
                </p>
                <p className="meta-label mt-1 text-[11px]">Smart Matching</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2 }}>
                  Secure Return
                </p>
                <p className="meta-label mt-1 text-[11px]">Verified Handoff</p>
              </div>
            </div>
          </div>

          {/* Right: Corkboard collage with photos & campus spots */}
          <div
            className="hidden lg:block relative flex-1 self-stretch overflow-visible"
            style={{ minHeight: '620px' }}
          >
            {/* Cork panel */}
            <div
              className="absolute inset-0 right-[-80px]"
              style={{
                backgroundColor: 'var(--color-surface)',
                backgroundImage: 'radial-gradient(circle, rgba(26,21,18,0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            {/* Cards */}
            <div className="absolute inset-0">
              {CAMPUS_COLLAGE_ITEMS.map((item, i) => (
                <CollageTag
                  key={item.id}
                  item={item}
                  position={POSITIONS[i] || { top: '50%', left: '50%' }}
                  delay={reduced ? 0 : 400 + i * 65}
                  animated={heroReady}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: horizontal scroll strip */}
        <div className="lg:hidden overflow-x-auto pb-6 px-6 flex gap-3 mt-4" style={{ scrollbarWidth: 'none' }}>
          {CAMPUS_COLLAGE_ITEMS.map((item) => (
            <div key={item.id} className="shrink-0">
              <div className="claim-tag w-44">
                <div className={`claim-tag-strip ${item.status}`} />
                <div className="px-3 pb-3">
                  <div className="w-full h-24 rounded-lg mb-2.5 overflow-hidden bg-surface flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={item.status === 'lost' ? 'badge-lost' : 'badge-found'}>{item.status}</span>
                  <p className="mt-1.5 text-xs font-semibold line-clamp-1" style={{ color: 'var(--color-ink)' }}>{item.name}</p>
                  <p className="meta-label mt-1 truncate" style={{ fontSize: '9px' }}>{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          LIVE FEED + HOW IT WORKS
          ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* Real Feed */}
          <div ref={feedRef}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="meta-label mb-1">Campus Activity</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.1,
                    color: 'var(--color-ink)',
                  }}
                >
                  Latest reports
                </h2>
              </div>
              <Link
                to="/explore"
                className="text-xs font-semibold underline underline-offset-4 shrink-0"
                style={{ color: 'var(--color-muted)', textDecorationColor: 'var(--color-border)' }}
              >
                Browse all →
              </Link>
            </div>

            {loadingItems ? (
              <div className="py-12 text-center text-xs text-muted">
                Loading campus reports…
              </div>
            ) : realItems.length > 0 ? (
              <div>
                {realItems.map((item, i) => (
                  <RealFeedRow key={item._id || item.id} item={item} index={i} inView={feedInView} reduced={reduced} />
                ))}
              </div>
            ) : (
              /* Polished empty state for new platform */
              <div
                className="p-8 rounded-2xl border text-center my-4"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'var(--color-canvas)', color: 'var(--color-muted)' }}
                >
                  <Sparkles size={20} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>
                  No active reports on campus right now
                </h3>
                <p className="text-xs mt-1.5 mb-5 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  Have you lost or found something at MIT Bengaluru? Report it now to start the matching process.
                </p>
                <Link to="/report" className="btn-primary inline-flex text-xs py-2 px-4">
                  Report First Item
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* How it works — vertical timeline */}
          <div
            className="p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <p className="meta-label mb-2">Process</p>
            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '26px',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: 'var(--color-ink)',
              }}
            >
              Three steps to get it back
            </h2>

            <div className="relative flex flex-col gap-0">
              <div
                className="absolute left-[15px] top-6 bottom-6 w-px"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
              {[
                { num: '01', title: 'Upload a photo or description', desc: 'Snap or upload a photo. Our vision engine detects brand, color, and distinguishing attributes automatically.' },
                { num: '02', title: 'AI campus cross-matching', desc: 'We compare your submission against every active campus report at MIT Bengaluru visually and semantically.' },
                { num: '03', title: 'Direct WhatsApp & verified return', desc: "When a high-confidence match is detected, connect securely and verify ownership questions before handoff." },
              ].map((step, i) => (
                <div key={step.num} className="flex gap-5 pb-8 last:pb-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10"
                    style={{
                      backgroundColor: i === 0 ? 'var(--color-ink)' : 'var(--color-canvas)',
                      border: '1.5px solid var(--color-border)',
                      color: i === 0 ? 'var(--color-canvas)' : 'var(--color-muted)',
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold">{step.num}</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{step.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/report?type=lost"
              className="btn-primary justify-center"
              style={{ marginTop: '24px', width: '100%' }}
            >
              Report an item
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          MATCH SHOWCASE — signature interaction
          ================================================================ */}
      <MatchShowcase reduced={reduced} />

      {/* ================================================================
          MIT BENGALURU CAMPUS VALUE SECTION (Zero Fake Numbers)
          ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="mb-12">
          <p className="meta-label mb-2">Campus Community</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--color-ink)',
            }}
          >
            Built for the MIT Bengaluru Community
          </h2>
          <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Your campus. Your belongings. One place to find them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1 */}
          <div
            className="p-7 rounded-2xl flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--color-lost-bg)',
              border: '1px solid rgba(232,137,12,0.2)',
              transform: 'rotate(-0.8deg)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(232,137,12,0.25)', color: 'var(--color-lost)' }}
              >
                <Building size={20} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                Campus-Wide Coverage
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink)', opacity: 0.85 }}>
                From Academic Blocks (AB1 &amp; AB2) to Central Library, Food Courts, and Hostels — report items wherever you are on campus.
              </p>
            </div>
            <div className="pt-6">
              <span className="badge-lost">Academic &amp; Hostel Blocks</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="p-7 rounded-2xl flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--color-found-bg)',
              border: '1px solid rgba(27,122,76,0.2)',
              transform: 'rotate(0.8deg)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(27,122,76,0.25)', color: 'var(--color-found)' }}
              >
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                Anti-Theft Verification
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink)', opacity: 0.85 }}>
                Custom ownership verification questions keep private item details hidden so belongings are only returned to their rightful student owner.
              </p>
            </div>
            <div className="pt-6">
              <span className="badge-found">Verified Claim Protocol</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="p-7 rounded-2xl flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              transform: 'rotate(-0.5deg)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-canvas)', color: 'var(--color-ink)' }}
              >
                <MessageCircle size={20} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                Direct Coordination
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Protected WhatsApp links allow finders and owners to coordinate seamless campus handoffs without publicly leaking phone numbers.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/report" className="text-xs font-semibold text-ink hover:underline inline-flex items-center gap-1">
                Report an item on campus →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

