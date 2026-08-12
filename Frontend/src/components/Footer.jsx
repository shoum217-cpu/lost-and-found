import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

/**
 * Footer.jsx – Site footer with branding, links, and copyright.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-extrabold">
                R
              </span>
              ReFound
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A Lost &amp; Found platform for MIT Bengaluru students.
              Report, discover, and return lost belongings on campus.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
              <Link to="/search" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Search Items</Link>
              <Link to="/report" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Report an Item</Link>
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">My Dashboard</Link>
            </nav>
          </div>

          {/* Help / Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Help
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Need help? Contact the student helpdesk:</p>
              <a
                href="mailto:helpdesk@mitblr.edu.in"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                helpdesk@mitblr.edu.in
              </a>
              <p className="text-sm text-gray-500 mt-1">
                MIT Bengaluru Campus,<br />
                Yelahanka, Bengaluru – 560064
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {currentYear} ReFound · MIT Bengaluru. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-red-400" aria-hidden="true" /> by MIT students
          </p>
        </div>
      </div>
    </footer>
  )
}
