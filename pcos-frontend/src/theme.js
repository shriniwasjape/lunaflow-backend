// ── Color System ─────────────────────────────────────────────
export const C = {
  // Backgrounds — warm white / blush base
  bg:         '#fff8f9',
  bgMid:      '#fef0f3',
  card:       'rgba(255,255,255,0.92)',
  cardHover:  'rgba(255,255,255,1.0)',
  border:     'rgba(236,72,153,0.15)',
  borderSoft: 'rgba(236,72,153,0.07)',

  // Pinks & Rose
  rose:      '#f43f5e',
  pink:      '#ec4899',
  hotPink:   '#db2777',
  softPink:  '#f9a8c9',
  blush:     '#fce7f3',
  mauve:     '#d946a8',
  lavender:  '#a855f7',
  peach:     '#fb923c',

  // Text — dark charcoal on light bg
  text:      '#1f1235',
  textTint:  'rgba(31,18,53,0.78)',
  textMid:   'rgba(31,18,53,0.52)',
  textMuted: 'rgba(31,18,53,0.36)',

  // Gradients
  grad:       'linear-gradient(135deg, #f43f5e, #ec4899)',
  gradSoft:   'linear-gradient(135deg, #f9a8c9, #c084fc)',
  gradRose:   'linear-gradient(135deg, #be185d, #f43f5e)',
  gradPurple: 'linear-gradient(135deg, #ec4899, #a855f7)',
  gradPeach:  'linear-gradient(135deg, #fb923c, #ec4899)',
};

// ── Phase styles ──────────────────────────────────────────────
export const PSTYLES = {
  menstrual:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.09)',   label: 'Menstrual',  emoji: '🌹' },
  follicular: { color: '#ec4899', bg: 'rgba(236,72,153,0.09)', label: 'Follicular', emoji: '🌸' },
  ovulatory:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.09)', label: 'Fertile',    emoji: '🌼' },
  luteal:     { color: '#a855f7', bg: 'rgba(168,85,247,0.09)', label: 'Luteal',     emoji: '🌙' },
};

// ── All JSX SVG components are in theme.jsx ───────────────────
// Import from './theme.jsx' if you need LunaFlowLogo or FeatherDecor
