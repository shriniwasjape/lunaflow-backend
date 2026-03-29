import React, { useState } from 'react';
import { SYMPTOMS } from './constants';
import { C } from './theme.js';
import { Check } from 'lucide-react';

const CATEGORY_META = {
  Flow:     { emoji: '🩸', color: C.rose,     bg: 'rgba(244,63,94,0.14)' },
  Physical: { emoji: '💪', color: C.peach,    bg: 'rgba(251,146,60,0.12)' },
  Mood:     { emoji: '💭', color: C.hotPink,  bg: 'rgba(244,114,182,0.12)' },
  Sleep:    { emoji: '🌙', color: C.lavender, bg: 'rgba(192,132,252,0.12)' },
};

export default function LogTab({ onSymptomsUpdate, initialSelected = [] }) {
  const [selected, setSelected] = useState(initialSelected);
  const [activeCategory, setActiveCategory] = useState('Flow');
  const [saved, setSaved] = useState(false);

  const toggle = (label) => {
    setSelected(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);
    setSaved(false);
  };

  const handleSave = () => { onSymptomsUpdate(selected); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ padding: '20px 18px', overflowY: 'auto', height: '100%', paddingBottom: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, margin: '0 0 3px', color: C.text }}>How are you today? 🌸</h2>
        <p style={{ color: C.textMid, fontSize: 13, margin: 0 }}>Tap to log your symptoms</p>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
        {Object.keys(SYMPTOMS).map(cat => {
          const meta = CATEGORY_META[cat];
          const count = selected.filter(s => SYMPTOMS[cat].some(sy => sy.label === s)).length;
          const on = activeCategory === cat;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: '8px 16px', borderRadius: 20, border: `2px solid ${on ? meta.color : C.border}`, background: on ? meta.bg : 'rgba(255,192,203,0.03)', cursor: 'pointer', whiteSpace: 'nowrap', color: on ? meta.color : C.textMuted, fontWeight: 700, fontSize: 13, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span>{meta.emoji}</span> {cat}
              {count > 0 && <span style={{ background: meta.color, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Symptom chips */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {SYMPTOMS[activeCategory].map(({ label, emoji }) => {
            const meta = CATEGORY_META[activeCategory];
            const on = selected.includes(label);
            return (
              <button key={label} onClick={() => toggle(label)}
                style={{ padding: '10px 15px', borderRadius: 22, cursor: 'pointer', transition: 'all 0.18s', border: `2px solid ${on ? meta.color : C.border}`, background: on ? meta.bg : 'rgba(255,192,203,0.04)', display: 'flex', alignItems: 'center', gap: 7, transform: on ? 'scale(1.04)' : 'scale(1)', boxShadow: on ? `0 4px 14px ${meta.color}44` : 'none' }}>
                <span style={{ fontSize: 17 }}>{emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: on ? meta.color : C.textMid }}>{label}</span>
                {on && <Check size={13} color={meta.color} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {selected.length > 0 && (
        <div style={{ marginTop: 18, background: C.card, borderRadius: 18, padding: '12px 16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.textMid, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🌸 Today's log</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {selected.map(s => {
              const cat = Object.keys(SYMPTOMS).find(c => SYMPTOMS[c].some(sy => sy.label === s));
              const item = SYMPTOMS[cat]?.find(sy => sy.label === s);
              return <span key={s} style={{ fontSize: 11, background: 'rgba(236,72,153,0.1)', borderRadius: 9, padding: '3px 9px', color: C.hotPink }}>{item?.emoji} {s}</span>;
            })}
          </div>
        </div>
      )}

      <button onClick={handleSave}
        style={{ marginTop: 14, width: '100%', padding: '15px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15, background: saved ? 'linear-gradient(135deg,#fb7185,#ec4899)' : C.grad, color: '#fff', boxShadow: `0 8px 22px rgba(236,72,153,0.38)`, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {saved ? <>✨ Saved!</> : `Save ${selected.length} Symptom${selected.length !== 1 ? 's' : ''} 🌸`}
      </button>
    </div>
  );
}
