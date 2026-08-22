import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Search as SearchIcon,
  ShieldCheck,
  Map,
  Bell,
  User,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
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

  const featuresDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      getNotifications(token).then(res => {
        if (res && res.unreadCount !== undefined) {
          setUnreadCount(res.unreadCount);
        }
      });
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, token]);

  // Click outside listener for dropdowns
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

  const navLinkClass = ({ isActive }) =>
    `text-xs sm:text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive
        ? 'text-zinc-900 dark:text-white font-semibold'
        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf9]/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* LEFT: FindIt Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-white tracking-tight"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-mono text-sm font-bold shadow-2xs">
              F
            </div>
            <span className="font-sans">FindIt</span>
          </Link>

          {/* CENTER: Navigation Links */}
          {!isAuthenticated ? (
            /* Logged-Out Nav Links */
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
              <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>

              {/* Features Dropdown */}
              <div className="relative" ref={featuresDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsFeaturesOpen(p => !p)}
                  className="flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  aria-expanded={isFeaturesOpen}
                >
                  <span>Features</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFeaturesOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-2 shadow-lg z-50 flex flex-col gap-1">
                    <Link
                      to="/features/matching"
                      onClick={closeMenu}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">AI Matching</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Intelligent Lost ↔ Found cross matching</p>
                      </div>
                    </Link>

                    <Link
                      to="/features/identification"
                      onClick={closeMenu}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0">
                        <SearchIcon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">Smart Identification</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Auto-detect item type and features</p>
                      </div>
                    </Link>

                    <Link
                      to="/features/verification"
                      onClick={closeMenu}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">Ownership Verification</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Confidential 7-step return security</p>
                      </div>
                    </Link>

                    <Link
                      to="/heatmap"
                      onClick={closeMenu}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shrink-0">
                        <Map size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">Heatmap Activity</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Geographic incident clusters</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          ) : (
            /* Logged-In Nav Links */
            <nav className="hidden md:flex items-center gap-1" aria-label="Authenticated navigation">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
              <NavLink to="/report?type=lost" className={navLinkClass}>Report Lost</NavLink>
              <NavLink to="/report?type=found" className={navLinkClass}>Report Found</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>My Items</NavLink>
            </nav>
          )}

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {!isAuthenticated ? (
              /* Logged-Out Actions: Sign In / Get Started */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              /* Logged-In Actions: Notifications & Profile */
              <div className="flex items-center gap-2">
                <Link
                  to="/notifications"
                  className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(p => !p)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px]">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-medium max-w-[90px] truncate text-zinc-800 dark:text-zinc-200">
                      {user?.name || 'Account'}
                    </span>
                    <ChevronDown size={13} className="text-zinc-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-lg z-50 flex flex-col gap-0.5">
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <User size={14} /> Profile
                      </Link>
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <Settings size={14} /> Settings
                      </Link>
                      <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                          navigate('/');
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full text-left cursor-pointer"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-600 dark:text-zinc-400 rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 text-zinc-600 dark:text-zinc-400 rounded-lg"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(p => !p)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-[#fafaf9] dark:bg-[#09090b] px-4 py-4 flex flex-col gap-1">
          {!isAuthenticated ? (
            <>
              <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/how-it-works" className={navLinkClass} onClick={closeMenu}>How It Works</NavLink>
              <NavLink to="/explore" className={navLinkClass} onClick={closeMenu}>Explore</NavLink>
              <NavLink to="/features/matching" className={navLinkClass} onClick={closeMenu}>AI Matching</NavLink>
              <NavLink to="/features/identification" className={navLinkClass} onClick={closeMenu}>Smart Identification</NavLink>
              <NavLink to="/features/verification" className={navLinkClass} onClick={closeMenu}>Ownership Verification</NavLink>
              <NavLink to="/heatmap" className={navLinkClass} onClick={closeMenu}>Heatmap Activity</NavLink>

              <div className="border-t border-zinc-200 dark:border-zinc-800 mt-2 pt-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/report"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/explore" className={navLinkClass} onClick={closeMenu}>Explore</NavLink>
              <NavLink to="/report?type=lost" className={navLinkClass} onClick={closeMenu}>Report Lost</NavLink>
              <NavLink to="/report?type=found" className={navLinkClass} onClick={closeMenu}>Report Found</NavLink>
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>My Items</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>Profile &amp; Settings</NavLink>

              <div className="border-t border-zinc-200 dark:border-zinc-800 mt-2 pt-3">
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                    navigate('/');
                  }}
                  className="w-full py-2 text-xs font-semibold text-rose-600 text-left"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
