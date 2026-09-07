import { useState, useEffect } from 'react';
import FindItLogo from './FindItLogo';

/**
 * OpeningSplash — Custom initial loading transition.
 * 
 * Shows the main FindIt logo centered on the screen over the actual page.
 * Once loaded, the logo and overlay smoothly fade out.
 */
export default function OpeningSplash({ fading: externalFading, onFade, onComplete }) {
  const [internalFading, setInternalFading] = useState(false);
  const isFading = externalFading !== undefined ? externalFading : internalFading;

  useEffect(() => {
    // Stage 1: Trigger fade out (~850ms)
    const fadeTimer = setTimeout(() => {
      setInternalFading(true);
      if (onFade) onFade();
    }, 850);

    // Stage 2: Complete transition and unmount (~1350ms)
    const finishTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('findit_intro_shown', 'true');
      } catch (e) {}
      if (onComplete) onComplete();
    }, 1350);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFade, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ease-out bg-canvas/90 dark:bg-[#141210]/90 backdrop-blur-sm ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center px-6">
        <FindItLogo size="intro" animated={true} />
      </div>
    </div>
  );
}

