import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import FindItLogo from './FindItLogo';

/**
 * NetworkErrorState — Native FindIt offline / connection error UI.
 * Can be used as a full screen offline view or an inline error state with active retry.
 */
export default function NetworkErrorState({
  title = "Looks like you're offline.",
  message = "Check your connection and try again.",
  onRetry,
  inline = false,
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        window.location.reload();
      }
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  if (inline) {
    return (
      <div className="py-12 px-6 rounded-2xl bg-surface border border-border text-center max-w-md mx-auto my-8">
        <div className="w-10 h-10 rounded-xl bg-canvas flex items-center justify-center mx-auto mb-3 text-muted">
          <WifiOff size={18} />
        </div>
        <h3 className="text-sm font-bold text-ink font-display">{title}</h3>
        <p className="text-xs text-muted mt-1 mb-5 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-ink text-canvas hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Checking…' : 'Try again'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-canvas">
      <div className="flex flex-col items-center max-w-sm">
        {/* FindIt Brand Logo */}
        <div className="mb-6 opacity-90">
          <FindItLogo size="md" />
        </div>

        {/* Minimal connection icon indicator */}
        <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted mb-4 shadow-2xs">
          <WifiOff size={19} />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-ink font-display tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1.5 mb-6 leading-relaxed">
          {message}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-canvas font-semibold text-xs hover:opacity-90 transition-all cursor-pointer shadow-btn disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Retrying…' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
