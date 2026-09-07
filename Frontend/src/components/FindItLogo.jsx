import React from 'react';
import logoImg from '../assets/findit-logo.jpg';

/**
 * FindItLogo — Authentic FindIt brand component.
 * Renders the custom stylized FINDIT logo with "lost. found. done."
 */
export default function FindItLogo({
  size = 'md',
  className = '',
  animated = false,
}) {
  const sizes = {
    xs: 'w-20',
    sm: 'w-28',
    md: 'w-40',
    lg: 'w-56',
    xl: 'w-64',
    intro: 'w-72 sm:w-80',
  };

  const widthClass = sizes[size] || sizes.md;

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${widthClass} ${className}`}
    >
      <div className="relative w-full flex items-center justify-center">
        <img
          src={logoImg}
          alt="FindIt - lost. found. done."
          className={`w-full h-auto object-contain transition-opacity duration-300 dark:invert dark:hue-rotate-180 dark:brightness-95 ${
            animated ? 'anim-logo-reveal' : ''
          }`}
          style={{
            mixBlendMode: 'multiply',
          }}
        />
      </div>
    </div>
  );
}
