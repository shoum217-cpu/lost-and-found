import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Login.jsx – Sign-in page.
 *
 * Currently a UI-only form. Will call authService.signIn() when Supabase is connected.
 * Intentionally uses its own layout (no Navbar/Footer) for a focused auth experience.
 */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    // TODO: await signIn(form.email, form.password)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
    // After real auth: navigate('/dashboard')
    alert('Authentication not yet connected. Coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal top bar */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-gray-900 hover:text-blue-600 transition-colors">
          <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-extrabold">R</span>
          ReFound
        </Link>
      </div>

      {/* Form card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-6">Log in to your ReFound account.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@mitblr.edu.in"
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer mt-1"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
