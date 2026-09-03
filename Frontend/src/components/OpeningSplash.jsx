import { useState, useEffect } from 'react';
import FindItLogo from './FindItLogo';

/**
 * OpeningSplash — Custom initial loading transition.
 * 
 * Shows the main FindIt logo centered on the screen over the actual homepage
 * (which is visible behind it at 20-30% opacity).
 * Once loaded, the logo and overlay smoothly fade out as the homepage
 * transitions to 100% opacity.
 */
export default function OpeningSplash({ fading, onFade, onComplete }) {
  useEffect(() => {
    // Stage 1: Reveal logo over low opacity homepage (~950ms)
    const fadeTimer = setTimeout(() => {
      if (onFade) onFade();
    }, 950);

    // Stage 2: Fade out overlay completely and transition homepage to 100% (~1400ms)
    const finishTimer = setTimeout(() => {
      sessionStorage.setItem('findit_intro_shown', 'true');
      if (onComplete) onComplete();
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFade, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-600 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: 'rgba(245, 241, 235, 0.72)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center px-6">
        <FindItLogo size="intro" animated={true} />
      </div>
    </div>
  );
}
