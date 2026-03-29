// ── Color System ─────────────────────────────────────────────
export const C = {
  // Backgrounds
  bg:         '#1a0612',
  bgMid:      '#2d0d22',
  card:       'rgba(255,192,203,0.07)',
  cardHover:  'rgba(255,192,203,0.12)',
  border:     'rgba(255,182,193,0.14)',
  borderSoft: 'rgba(255,182,193,0.08)',

  // Pinks & Rose
  rose:      '#f43f5e',
  pink:      '#ec4899',
  hotPink:   '#f472b6',
  softPink:  '#fda4af',
  blush:     '#fce7f3',
  mauve:     '#e879f9',
  lavender:  '#c084fc',
  peach:     '#fb923c',

  // Text
  text:      '#fff',
  textTint:  'rgba(253,164,175,0.9)',
  textMid:   'rgba(253,164,175,0.55)',
  textMuted: 'rgba(255,182,193,0.35)',

  // Gradients
  grad:       'linear-gradient(135deg, #f43f5e, #ec4899)',
  gradSoft:   'linear-gradient(135deg, #fda4af, #c084fc)',
  gradRose:   'linear-gradient(135deg, #be185d, #f43f5e)',
  gradPurple: 'linear-gradient(135deg, #ec4899, #c084fc)',
  gradPeach:  'linear-gradient(135deg, #fb923c, #ec4899)',
};

// ── Phase styles ──────────────────────────────────────────────
export const PSTYLES = {
  menstrual:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.22)',   label: 'Menstrual',  emoji: '🌹' },
  follicular: { color: '#f472b6', bg: 'rgba(244,114,182,0.2)', label: 'Follicular', emoji: '🌸' },
  ovulatory:  { color: '#fb923c', bg: 'rgba(251,146,60,0.2)',  label: 'Fertile',    emoji: '🌼' },
  luteal:     { color: '#c084fc', bg: 'rgba(192,132,252,0.2)', label: 'Luteal',     emoji: '🌙' },
};

// ── All JSX SVG components are in theme.jsx ───────────────────
// Import from './theme.jsx' if you need LunaFlowLogo or FeatherDecor
