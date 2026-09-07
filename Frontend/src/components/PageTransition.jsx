import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition — Subtle, instantaneous page reveal effect.
 * Triggers a fast 280ms fade and micro-slide on route change without artificial delays.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition-enter w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
