import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const tokenClientRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1043329241416-5k8r2n46b8j2u4f3n5039p2p72619n54.apps.googleusercontent.com';

  const handleGoogleTokenResponse = async (tokenResponse) => {
    if (tokenResponse?.error) {
      setError('Google sign-in was cancelled or encountered an error.');
      setIsGoogleLoading(false);
      return;
    }

    if (tokenResponse?.access_token) {
      setIsGoogleLoading(true);
      setError('');
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch Google account information');
        }

        const userInfo = await userInfoRes.json();
        const res = await loginWithGoogle({
          email: userInfo.email,
          name: userInfo.name || userInfo.given_name || userInfo.email?.split('@')[0],
          credential: tokenResponse.access_token,
        });

        if (res.success) {
          navigate('/dashboard');
        } else {
          setError(res.message || 'Google sign-in failed');
        }
      } catch (err) {
        setError(err.message || 'Google sign-in error occurred');
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scriptId = 'google-gsi-script';
      let script = document.getElementById(scriptId);

      const initClient = () => {
        if (googleClientId && window.google?.accounts?.oauth2) {
          try {
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
              client_id: googleClientId,
              scope: 'email profile openid',
              callback: handleGoogleTokenResponse,
            });
          } catch (e) {
            console.warn('GSI initTokenClient warning:', e);
          }
        }
      };

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initClient;
        document.body.appendChild(script);
      } else if (window.google?.accounts?.oauth2) {
        initClient();
      }
    }
  }, [googleClientId]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await login(form.email, form.password);
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  }

  const handleGoogleClick = () => {
    setError('');
    setIsGoogleLoading(true);

    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else if (googleClientId && window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: handleGoogleTokenResponse,
      });
      tokenClientRef.current = client;
      client.requestAccessToken({ prompt: 'select_account' });
    } else {
      const redirectUri = window.location.origin;
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=${encodeURIComponent(
        'email profile openid'
      )}&prompt=select_account`;

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        oauthUrl,
        'google_oauth_login',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!popup) {
        setIsGoogleLoading(false);
        setError('Popup blocked by browser. Please allow popups for Google sign-in.');
        return;
      }

      const checkPopup = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            setIsGoogleLoading(false);
          } else if (popup.location.href.includes('access_token=')) {
            const hash = popup.location.hash || popup.location.search;
            const params = new URLSearchParams(hash.replace('#', '?'));
            const accessToken = params.get('access_token');
            popup.close();
            clearInterval(checkPopup);
            if (accessToken) {
              handleGoogleTokenResponse({ access_token: accessToken });
            }
          }
        } catch (e) {
          // Cross-origin before redirect back
        }
      }, 500);
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
        <h2 className="mt-4 text-2xl font-bold text-ink font-display">
          Sign In
        </h2>
        <p className="text-xs text-muted mt-1">
          Access your listings, match notifications, and claims.
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
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="text-sm px-4 py-2.5 rounded-xl border border-border bg-canvas text-ink placeholder:text-muted/65 focus:outline-none focus:ring-2 focus:ring-ink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset: Provide your registered email to receive reset instructions.')}
                  className="text-[11px] font-medium text-muted hover:text-ink cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-muted font-mono text-[10px]">
                Or
              </span>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-canvas hover:bg-surface text-ink text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
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
            <span>{isGoogleLoading ? 'Connecting…' : 'Continue with Google'}</span>
          </button>

          <p className="text-xs text-center text-muted mt-6 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-ink hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

