import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications } from '../services/notificationService';

export default function Navbar() {
  const { user, isAuthenticated, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const featuresDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      getNotifications(token).then(res => {
        if (res && res.unreadCount !== undefined) setUnreadCount(res.unreadCount);
      });
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsFeaturesOpen(false);
    setIsProfileOpen(false);
  };

  /* Nav link: underline slide, no bg boxes */
  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors pb-0.5 ${
      isActive
        ? 'text-[var(--color-ink)] dark:text-[var(--color-ink-dark)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-current after:rounded-full'
        : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-ink-dark)]'
    }`;

  const featuresMenuItems = [
    { to: '/features/matching',      label: 'AI Matching',           desc: 'Visual + semantic cross-matching' },
    { to: '/features/identification', label: 'Smart Identification',  desc: 'Auto-detect item type & features' },
    { to: '/features/verification',   label: 'Ownership Verification',desc: 'Secure 7-step return protocol' },
    { to: '/heatmap',                 label: 'Heatmap Activity',      desc: 'Geographic incident clusters' },
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled
          ? (theme === 'dark' ? 'rgba(20, 18, 16, 0.95)' : 'rgba(245, 241, 235, 0.95)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-1.5 tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '20px',
              color: 'var(--color-ink)',
              letterSpacing: '-0.03em',
            }}
          >
            FindIt
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-found)', marginBottom: '6px' }}
            />
          </Link>

          {/* Desktop Nav */}
          {!isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
              <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>

              {/* Features dropdown */}
              <div className="relative" ref={featuresDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFeaturesOpen(p => !p)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer"
                  style={{ color: isFeaturesOpen ? 'var(--color-ink)' : 'var(--color-muted)' }}
                  aria-expanded={isFeaturesOpen}
                >
                  <span>Features</span>
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-200"
                    style={{ transform: isFeaturesOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {isFeaturesOpen && (
                  <div
                    className="absolute top-full left-0 mt-3 w-72 rounded-xl p-1.5 z-50"
                    style={{
                      backgroundColor: 'var(--color-canvas)',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 8px 32px rgba(26,21,18,0.12), 0 2px 8px rgba(26,21,18,0.06)',
                    }}
                  >
                    {featuresMenuItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMenu}
                        className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors"
                        style={{}}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                      >
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{item.label}</span>
                        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-7" aria-label="Authenticated navigation">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
              <NavLink to="/report" className={navLinkClass}>Report Item</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>My Items</NavLink>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md transition-colors cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
              aria-label="Toggle theme"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                >
                  Sign in
                </Link>
                <Link to="/report" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
                  Get started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-1.5 rounded-md transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label="Notifications"
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-lost)' }}
                    />
                  )}
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(p => !p)}
                    className="flex items-center gap-2 rounded-lg transition-colors cursor-pointer"
                    style={{
                      padding: '6px 10px 6px 6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: isProfileOpen ? 'var(--color-surface)' : 'transparent',
                    }}
                    aria-expanded={isProfileOpen}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px]"
                      style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-canvas)' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-medium max-w-[80px] truncate" style={{ color: 'var(--color-ink)' }}>
                      {user?.name || 'Account'}
                    </span>
                    <ChevronDown size={12} style={{ color: 'var(--color-muted)' }} />
                  </button>

                  {isProfileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl p-1.5 z-50"
                      style={{
                        backgroundColor: 'var(--color-canvas)',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 8px 32px rgba(26,21,18,0.12), 0 2px 8px rgba(26,21,18,0.06)',
                      }}
                    >
                      {[
                        { to: '/profile', icon: User, label: 'Profile' },
                        { to: '/profile', icon: Settings, label: 'Settings' },
                      ].map(item => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                          style={{ color: 'var(--color-ink)' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                        >
                          <item.icon size={13} />
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
                      <button
                        onClick={() => { logout(); closeMenu(); navigate('/'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer"
                        style={{ color: '#DC2626' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                      >
                        <LogOut size={13} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md"
              style={{ color: 'var(--color-muted)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-md"
                style={{ color: 'var(--color-muted)' }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-lost)' }}
                  />
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(p => !p)}
              className="p-2 rounded-md"
              style={{ color: 'var(--color-ink)' }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div
          className="md:hidden px-6 py-5 flex flex-col gap-1"
          style={{
            backgroundColor: 'var(--color-canvas)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {!isAuthenticated ? (
            <>
              {[
                { to: '/', label: 'Home', end: true },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/explore', label: 'Explore' },
                { to: '/features/matching', label: 'AI Matching' },
                { to: '/features/identification', label: 'Smart Identification' },
                { to: '/features/verification', label: 'Ownership Verification' },
                { to: '/heatmap', label: 'Heatmap' },
              ].map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMenu}
                  className="py-2 text-sm font-medium"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {link.label}
                </NavLink>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '12px' }} className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="py-2.5 text-center text-sm font-semibold rounded-lg"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-ink)' }}
                >
                  Sign in
                </Link>
                <Link
                  to="/report"
                  onClick={closeMenu}
                  className="btn-primary justify-center"
                >
                  Get started
                </Link>
              </div>
            </>
          ) : (
            <>
              {[
                { to: '/', label: 'Home', end: true },
                { to: '/explore', label: 'Explore' },
                { to: '/report', label: 'Report Item' },
                { to: '/dashboard', label: 'My Items' },
                { to: '/profile', label: 'Profile & Settings' },
              ].map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMenu}
                  className="py-2 text-sm font-medium"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {link.label}
                </NavLink>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '12px' }}>
                <button
                  onClick={() => { logout(); closeMenu(); navigate('/'); }}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: '#DC2626' }}
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
