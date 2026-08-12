import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Register.jsx – Account creation page.
 *
 * UI-only form for now. Will call authService.signUp() when Supabase is connected.
 */
export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    setIsLoading(true)
    // TODO: await signUp(form.email, form.password, form.fullName)
    await new Promise(r => setTimeout(r, 600))
    setIsLoading(false)
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

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Create an account</h1>
            <p className="text-sm text-gray-500 mb-6">Join ReFound with your college email.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">College Email</label>
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
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
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

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer mt-1"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
