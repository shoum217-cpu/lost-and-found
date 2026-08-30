import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, ArrowUpRight } from 'lucide-react';

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

/* ─── Count-up hook (for match % and stats) ──────────────────────────── */
function useCountUp(target, duration = 1200, active = false, reduced = false) {
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (!active || reduced) { setValue(target); return; }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out-back for the lock-in feel
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, reduced]);
  return value;
}

/* ─── Collage item data ───────────────────────────────────────────────── */
const COLLAGE_ITEMS = [
  { id: 'c1', status: 'lost',  name: 'Black JBL Headphones',     location: 'Metro Plaza, Gate 3', time: '2h ago',  matchPct: null,  color: '#2B2B2B', rotate: '-2deg',  zIndex: 3 },
  { id: 'c2', status: 'found', name: 'Silver MacBook Charger',   location: 'Central Library, 2F', time: '45m ago', matchPct: '91%', color: '#A8A8A8', rotate: '2.5deg', zIndex: 4 },
  { id: 'c3', status: 'lost',  name: 'Tan Leather Wallet',       location: 'Noodle Bar, Sec 14',  time: '5h ago',  matchPct: null,  color: '#B5895A', rotate: '-1.5deg',zIndex: 2 },
  { id: 'c4', status: 'found', name: 'AirPods Pro (White)',       location: 'Bus Stop 47B',        time: '1h ago',  matchPct: '87%', color: '#EBEBEB', rotate: '3deg',   zIndex: 5 },
  { id: 'c5', status: 'lost',  name: 'Navy Blue Umbrella',       location: 'Rajiv Chowk Stn.',    time: '3h ago',  matchPct: null,  color: '#1B3A6B', rotate: '-3.5deg',zIndex: 1 },
  { id: 'c6', status: 'found', name: 'Red Fossil Watch',         location: 'Gym, DLF CyberHub',   time: '30m ago', matchPct: '94%', color: '#C0302A', rotate: '1.5deg', zIndex: 6 },
  { id: 'c7', status: 'lost',  name: 'Brown Leather Backpack',   location: 'Saket PVR',            time: '21h ago', matchPct: null,  color: '#7A4E2D', rotate: '-0.5deg',zIndex: 2 },
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

/* ─── Feed items ──────────────────────────────────────────────────────── */
const FEED_ITEMS = [
  { id: 'f1', status: 'lost',  name: 'Keys (Honda Civic keychain)',  location: 'Connaught Place',   time: '08:24', date: 'Today',     itemId: 'FI-2841' },
  { id: 'f2', status: 'found', name: 'Blue Passport Holder',          location: 'T3 Departures',     time: '07:58', date: 'Today',     itemId: 'FI-2839', match: '96%' },
  { id: 'f3', status: 'lost',  name: 'Canon EOS Camera Bag',         location: 'Lodhi Garden',       time: '06:15', date: 'Today',     itemId: 'FI-2837' },
  { id: 'f4', status: 'found', name: 'Kindle Paperwhite',             location: 'IndiGo Flt 6E-401', time: '22:30', date: 'Yesterday', itemId: 'FI-2835', match: '88%' },
  { id: 'f5', status: 'lost',  name: 'Brown Leather Backpack',        location: 'Saket PVR',          time: '21:00', date: 'Yesterday', itemId: 'FI-2833' },
  { id: 'f6', status: 'found', name: 'iPhone 15 Pro (black case)',     location: 'Hauz Khas Village',  time: '19:45', date: 'Yesterday', itemId: 'FI-2831', match: '92%' },
];

/* ─── Collage Tag ─────────────────────────────────────────────────────── */
function CollageTag({ item, position, delay, animated, reduced }) {
  const [stamping, setStamping] = useState(false);

  const springStyle = animated && !reduced ? {
    transform: `rotate(${item.rotate})`,
    animation: `spring-land 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`,
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
      style={{ ...position, zIndex: item.zIndex }}
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
          {/* Color swatch — item photo stand-in */}
          <div
            className="w-full h-24 rounded-lg mb-2.5 relative overflow-hidden"
            style={{ backgroundColor: item.color }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)`,
              }}
            />
          </div>
          <span className={item.status === 'lost' ? 'badge-lost' : 'badge-found'}>
            {item.status}
          </span>
          <p className="mt-1.5 text-xs font-semibold leading-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
            {item.name}
          </p>
          <p className="meta-label mt-1.5 flex items-center gap-1" style={{ fontSize: '9px' }}>
            <MapPin size={8} /> {item.location}
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

/* ─── Feed Row ────────────────────────────────────────────────────────── */
function FeedRow({ item, index, inView, reduced }) {
  const cls = inView && !reduced ? `anim-row-in` : '';
  const style = inView && !reduced
    ? { animationDelay: `${index * 50}ms` }
    : (reduced ? { opacity: 1 } : { opacity: 0 });

  return (
    <Link
      to={`/explore`}
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
        style={{ backgroundColor: item.status === 'lost' ? 'var(--color-lost)' : 'var(--color-found)' }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={item.status === 'lost' ? 'badge-lost' : 'badge-found'}>{item.status}</span>
            <p className="mt-1.5 text-sm font-semibold leading-snug" style={{ color: 'var(--color-ink)' }}>
              {item.name}
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
          <span className="meta-label flex items-center gap-1"><Clock size={9} />{item.date} · {item.time}</span>
          <span className="meta-label">{item.itemId}</span>
          {item.match && (
            <span className="font-mono text-[10px] font-semibold" style={{ color: 'var(--color-found)' }}>
              {item.match} match
            </span>
          )}
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
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-muted)', maxWidth: '360px' }}>
              FindIt compares photos, brands, colors, and locations — then gives you a confidence percentage, not a vague list.
            </p>

            {[
              { label: 'Visual appearance', pct: 97 },
              { label: 'Brand & model',     pct: 100 },
              { label: 'Color match',       pct: 94 },
              { label: 'Location overlap',  pct: 82 },
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
                <div className="w-full h-20 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#1A1A2E' }}>
                  <span className="font-mono text-xs font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>ITEM PHOTO</span>
                </div>
                <span className="badge-lost">Lost · FI-2841</span>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>Black JBL Headphones (Over-ear)</p>
                <p className="meta-label mt-1 flex items-center gap-1"><MapPin size={9} /> Metro Plaza · Reported 08:14</p>
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
                <div className="w-full h-20 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: '#1A1A2E' }}>
                  <span className="font-mono text-xs font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>ITEM PHOTO</span>
                </div>
                <span className="badge-found">Found · FI-2839</span>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>JBL Tune 660NC · Foldable, Black</p>
                <p className="meta-label mt-1 flex items-center gap-1"><MapPin size={9} /> Central Terminal · Found 09:02</p>
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

  // Hero load sequence fires 80ms after mount
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Stats count-up — only triggers once hero is ready
  const stat1 = useCountUp(1247, 1400, heroReady, reduced);
  const stat2 = useCountUp(342,  1000, heroReady, reduced);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <section
        className="relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--color-border)', minHeight: '90vh' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-start gap-0 pt-20 pb-0">

          {/* Left: Headline + CTA */}
          <div className="flex-1 lg:max-w-[520px] pb-16 lg:pb-24 pt-4 lg:pt-12 z-10 relative">

            {/* Eyebrow — fade up */}
            <p
              className={`meta-label mb-6 flex items-center gap-2 ${heroReady && !reduced ? 'anim-fade-up' : ''}`}
              style={{
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '0ms',
              }}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-found)' }} />
              Public Lost &amp; Found · India
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
              className={`mb-10 max-w-sm leading-relaxed ${heroReady && !reduced ? 'anim-fade-up' : ''}`}
              style={{
                fontSize: '16px',
                color: 'var(--color-muted)',
                fontWeight: 400,
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '640ms',
              }}
            >
              AI cross-matches lost and found reports across India. Upload a photo, get a match in minutes.
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

            {/* Stats */}
            <div
              className={`flex flex-wrap gap-6 mt-12 pt-8 ${heroReady && !reduced ? 'anim-count' : ''}`}
              style={{
                borderTop: '1px solid var(--color-border)',
                opacity: heroReady || reduced ? 1 : 0,
                animationDelay: '840ms',
              }}
            >
              {[
                { num: stat1.toLocaleString(), label: 'items reported' },
                { num: stat2.toLocaleString(), label: 'reunited' },
                { num: '94%',                  label: 'match accuracy' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1 }}>
                    {s.num}
                  </p>
                  <p className="meta-label mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Corkboard collage */}
          <div
            className="hidden lg:block relative flex-1 self-stretch overflow-visible"
            style={{ minHeight: '600px' }}
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
              {COLLAGE_ITEMS.map((item, i) => (
                <CollageTag
                  key={item.id}
                  item={item}
                  position={POSITIONS[i] || { top: '50%', left: '50%' }}
                  delay={reduced ? 0 : 600 + i * 55}
                  animated={heroReady}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: horizontal scroll strip */}
        <div className="lg:hidden overflow-x-auto pb-6 px-6 flex gap-3 mt-6" style={{ scrollbarWidth: 'none' }}>
          {COLLAGE_ITEMS.map((item, i) => (
            <div key={item.id} className="shrink-0">
              <div className="claim-tag w-44">
                <div className={`claim-tag-strip ${item.status}`} />
                <div className="px-3 pb-3">
                  <div className="w-full h-20 rounded-lg mb-2.5" style={{ backgroundColor: item.color }} />
                  <span className={item.status === 'lost' ? 'badge-lost' : 'badge-found'}>{item.status}</span>
                  <p className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>{item.name}</p>
                  <p className="meta-label mt-1" style={{ fontSize: '9px' }}>{item.location}</p>
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

          {/* Feed */}
          <div ref={feedRef}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="meta-label mb-1">Real-time</p>
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

            <div>
              {FEED_ITEMS.map((item, i) => (
                <FeedRow key={item.id} item={item} index={i} inView={feedInView} reduced={reduced} />
              ))}
            </div>
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
                { num: '01', title: 'Upload a photo', desc: 'Snap or upload a photo. Our vision engine reads brand, color, and category automatically.' },
                { num: '02', title: 'AI cross-checks 1,200+ reports', desc: 'We compare your submission against every active report — visually, semantically, and by location.' },
                { num: '03', title: 'Contact via WhatsApp', desc: "When there's a high-confidence match, connect securely. Answer ownership questions to verify." },
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
          SOCIAL PROOF + FINAL CTA
          ================================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          <div className="lg:col-span-1">
            <p className="meta-label mb-3">Real people, real returns</p>
            <h2
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--color-ink)',
              }}
            >
              Maybe someone already found it.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-muted)' }}>
              342 items reunited with their owners so far this year.
            </p>
            <Link to="/report?type=lost" className="btn-primary">
              Check if it's been found
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-5">
            <div
              className="flex-1 p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--color-lost-bg)',
                border: '1px solid rgba(232,137,12,0.15)',
                transform: 'rotate(-1deg)',
              }}
            >
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-ink)', fontStyle: 'italic' }}>
                "Lost my wallet at the airport with all my cards. Found a match on FindIt in 20 minutes. Got it back the same day."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'rgba(232,137,12,0.2)', color: 'var(--color-lost)' }}
                >A</div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>Arjun S.</p>
                  <p className="meta-label" style={{ fontSize: '10px' }}>Delhi · Wallet recovered</p>
                </div>
              </div>
            </div>

            <div
              className="flex-1 p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--color-found-bg)',
                border: '1px solid rgba(27,122,76,0.15)',
                transform: 'rotate(1.2deg)',
              }}
            >
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-ink)', fontStyle: 'italic' }}>
                "Found a bag at the metro and listed it here. The owner contacted me within 2 hours. The verification step made both of us feel safe."
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'rgba(27,122,76,0.2)', color: 'var(--color-found)' }}
                >P</div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>Priya M.</p>
                  <p className="meta-label" style={{ fontSize: '10px' }}>Mumbai · Bag returned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
