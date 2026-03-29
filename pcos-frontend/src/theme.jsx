import React from 'react';

// ── LunaFlow Logo (Moon + Feather SVG) ───────────────────────
export function LunaFlowLogo({ size = 64, bgColor = '#1a0612' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="60%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Moon crescent */}
      <circle cx="24" cy="21" r="14" fill="url(#logoG)" filter="url(#logoGlow)" />
      <circle cx="30" cy="18" r="11" fill={bgColor} />
      {/* Stars near moon */}
      <circle cx="42" cy="10" r="1.5" fill="#fda4af" opacity="0.8" />
      <circle cx="46" cy="16" r="1" fill="#fda4af" opacity="0.6" />
      <circle cx="38" cy="7" r="1" fill="#fda4af" opacity="0.5" />
      {/* Feather rachis (central stem) */}
      <path d="M 33 31 C 33 37 30 44 27 55" stroke="url(#logoG)" strokeWidth="2" strokeLinecap="round" />
      {/* Left barbs */}
      <path d="M 32 35 C 27 36 22 39 17 43" stroke="url(#logoG)" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      <path d="M 30.5 41 C 25 42 20 45 17 49" stroke="url(#logoG)" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <path d="M 29 47 C 24 48 21 51 20 54" stroke="url(#logoG)" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      {/* Right barbs */}
      <path d="M 33 35 C 38 35 43 37 47 41" stroke="url(#logoG)" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      <path d="M 31.5 41 C 36 41 40 44 43 48" stroke="url(#logoG)" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <path d="M 30 47 C 34 47 36 50 37 54" stroke="url(#logoG)" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      {/* Feather tip */}
      <circle cx="27" cy="55" r="1.5" fill="#c084fc" opacity="0.7" />
    </svg>
  );
}

// ── Feather decoration SVG ────────────────────────────────────
export function FeatherDecor({ size = 120, opacity = 0.06, rotate = 0, color = '#f472b6' }) {
  const barbs = [15, 25, 35, 45, 55, 65, 75, 85, 95, 105];
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 80 130" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, opacity, pointerEvents: 'none' }}>
      {/* Central rachis */}
      <path d="M 40 5 C 38 40 35 80 30 120" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left barbs */}
      {barbs.map((y, i) => (
        <path key={`l${i}`}
          d={`M ${40 - (y - 5) * 0.05} ${y} C ${33 - i * 1.5} ${y + 3} ${26 - i * 2} ${y + 8} ${18 - i * 1.5} ${y + 14}`}
          stroke={color} strokeWidth={1.4 - i * 0.04} strokeLinecap="round" opacity={0.9 - i * 0.07} />
      ))}
      {/* Right barbs */}
      {barbs.map((y, i) => (
        <path key={`r${i}`}
          d={`M ${40 + (y - 5) * 0.02} ${y} C ${47 + i * 1.5} ${y + 3} ${54 + i * 1.8} ${y + 7} ${61 + i * 1.2} ${y + 13}`}
          stroke={color} strokeWidth={1.4 - i * 0.04} strokeLinecap="round" opacity={0.9 - i * 0.07} />
      ))}
    </svg>
  );
}

// Re-export colors from theme.js so files can import everything from one place
export { C, PSTYLES } from './theme.js';
