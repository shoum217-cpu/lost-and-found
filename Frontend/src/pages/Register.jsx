import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (googleClientId && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
        }
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [googleClientId]);

  async function handleGoogleCredentialResponse(response) {
    setIsGoogleLoading(true);
    setError('');
    try {
      const res = await loginWithGoogle({ credential: response.credential });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google sign-up failed');
      }
    } catch (err) {
      setError(err.message || 'Google sign-up error occurred');
    } finally {
      setIsGoogleLoading(false);
    }
  }

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

  const handleGoogleClick = () => {
    setError('');
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setShowGooglePrompt(true);
        }
      });
    } else {
      setShowGooglePrompt(true);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    setIsGoogleLoading(true);
    setError('');
    const res = await loginWithGoogle({
      email: googleEmailInput,
      name: googleNameInput || googleEmailInput.split('@')[0],
    });
    setIsGoogleLoading(false);
    if (res.success) {
      setShowGooglePrompt(false);
      navigate('/dashboard');
    } else {
      setError(res.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-center py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink mb-6"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

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
          Join MAHE BLR's campus lost and found platform.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Continue with Google (Top Option) */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-canvas hover:bg-surface text-ink text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60 mb-5"
          >
            {isGoogleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>{isGoogleLoading ? 'Connecting…' : 'Sign up with Google'}</span>
          </button>

          {/* Google Prompt Modal for direct sign-up */}
          {showGooglePrompt && (
            <div className="mb-5 p-4 rounded-2xl bg-canvas border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-ink">Sign up with Google</p>
                <button
                  type="button"
                  onClick={() => setShowGooglePrompt(false)}
                  className="text-xs text-muted hover:text-ink cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-muted mb-3">
                Enter your Google / Manipal email to create your FindIt account:
              </p>
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="name@learner.manipal.edu or Gmail"
                  value={googleEmailInput}
                  onChange={e => setGoogleEmailInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
                />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={googleNameInput}
                  onChange={e => setGoogleNameInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
                />
                <button
                  type="submit"
                  disabled={isGoogleLoading}
                  className="btn-primary w-full justify-center text-xs py-2"
                >
                  {isGoogleLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Sign Up'}
                </button>
              </form>
            </div>
          )}

          {/* Social Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-muted font-mono text-[10px]">
                Or register with email
              </span>
            </div>
          </div>

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
                placeholder="Student / Faculty Name"
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
                placeholder="name@learner.manipal.edu"
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
                Enable WhatsApp direct contact for my campus listings
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

