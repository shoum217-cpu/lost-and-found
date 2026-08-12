import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Menu, X, MapPin } from 'lucide-react'

/**
 * Navbar.jsx – Responsive top navigation bar.
 *
 * Shows the ReFound logo, nav links, and auth buttons.
 * On mobile, collapses into a hamburger menu.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

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
        ? 'text-blue-600'
        : 'text-gray-600 hover:text-gray-900'
    }`
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors"
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

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1"
        >
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50">Home</span>
          </NavLink>
          <NavLink to="/search" className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50">Search</span>
          </NavLink>
          <NavLink to="/report" className={navLinkClass} onClick={closeMenu}>
            <span className="block px-3 py-2 rounded-lg hover:bg-gray-50">Report Item</span>
          </NavLink>
          <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="text-sm font-medium text-center text-gray-700 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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
