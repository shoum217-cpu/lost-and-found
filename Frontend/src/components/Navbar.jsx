import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Menu, X, MapPin, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

/**
 * Navbar.jsx – Responsive top navigation bar.
 *
 * Shows the ReFound logo, nav links, and auth buttons.
 * On mobile, collapses into a hamburger menu.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  function toggleMenu() {
    setIsMenuOpen(prev => !prev)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  // Active link style helper for NavLink
  function navLinkClass({ isActive }) {
    return `text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white'
    }`
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={closeMenu}
          >
            <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-extrabold">
              R
            </span>
            ReFound
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/search" className={navLinkClass}>Search</NavLink>
            <NavLink to="/report" className={navLinkClass}>Report Item</NavLink>
          </nav>

          {/* Desktop auth buttons & Theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger & Theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 flex flex-col gap-1"
        >
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">Home</span>
          </NavLink>
          <NavLink to="/search" className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">Search</span>
          </NavLink>
          <NavLink to="/report" className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">Report Item</span>
          </NavLink>
          <div className="border-t border-gray-100 dark:border-neutral-800 mt-2 pt-3 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="text-sm font-medium text-center text-gray-700 dark:text-neutral-200 border border-gray-200 dark:border-neutral-700 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="text-sm font-medium text-center text-white bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
