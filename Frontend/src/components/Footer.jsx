import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">

        {/* Top: Brand + nav columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '22px',
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              FindIt
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-found)',
                  marginBottom: '8px',
                }}
              />
            </p>
            <p
              className="mt-3 text-sm leading-relaxed max-w-xs"
              style={{ color: 'var(--color-muted)' }}
            >
              AI-powered public lost &amp; found for India. Upload a photo, find a match, get it back.
            </p>
            <div className="flex flex-wrap gap-5 mt-6 text-xs" style={{ color: 'var(--color-muted)' }}>
              <span className="font-mono">1,247 reports</span>
              <span className="font-mono">342 reunited</span>
              <span className="font-mono">94% accuracy</span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
            >
              Platform
            </p>
            <nav className="flex flex-col gap-2.5" aria-label="Footer platform navigation">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Browse Reports' },
                { to: '/report?type=lost', label: 'Report Lost Item' },
                { to: '/report?type=found', label: 'Report Found Item' },
                { to: '/heatmap', label: 'Activity Heatmap' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Safety */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.1em' }}
            >
              Safety
            </p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
              Always meet in well-lit public locations when collecting high-value items.
            </p>
            <p
              className="text-xs leading-relaxed p-3 rounded-lg"
              style={{
                color: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Never share bank PINs or passwords for ownership verification.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            © {currentYear} FindIt. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-found)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-found)', display: 'inline-block', animation: 'pulse 2s infinite' }}
            />
            SYSTEM ONLINE
          </div>
        </div>

      </div>
    </footer>
  );
}
