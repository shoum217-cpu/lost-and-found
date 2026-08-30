import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    whatsappEnabled: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await register(form);
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-center py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 font-extrabold text-2xl text-ink">
          <div className="w-8 h-8 rounded-lg bg-ink text-canvas flex items-center justify-center font-mono text-sm">
            F
          </div>
          <span className="font-display">FindIt</span>
        </Link>
        <h2 className="mt-4 text-xl font-bold text-ink font-display">
          Create your FindIt account
        </h2>
        <p className="text-xs text-muted mt-1">
          Join the intelligent public lost and found network.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Vance"
                className="text-sm px-4 py-2.5 rounded-xl border border-border bg-canvas text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="text-sm px-4 py-2.5 rounded-xl border border-border bg-canvas text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Phone Number (Optional for WhatsApp)
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                className="text-sm px-4 py-2.5 rounded-xl border border-border bg-canvas text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                name="whatsappEnabled"
                id="regWhatsapp"
                checked={form.whatsappEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-ink focus:ring-ink border-border cursor-pointer bg-canvas"
              />
              <label htmlFor="regWhatsapp" className="text-xs text-muted cursor-pointer font-body">
                Enable WhatsApp direct contact for my listings
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full text-sm px-4 py-2.5 pr-10 rounded-xl border border-border bg-canvas text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 justify-center"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-muted mt-6 font-body">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-ink hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
