import React, { useState } from 'react';
import { PCOS_TYPES } from './constants';
import { C, LunaFlowLogo, FeatherDecor } from './theme.jsx';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', lastPeriod: '', pcosType: null });
  const canNext = [form.name.trim(), form.lastPeriod, form.pcosType][step];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px', position: 'relative' }}>
      {/* Feather decoration */}
      <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.09, pointerEvents: 'none' }}>
        <FeatherDecor size={130} rotate={25} color={C.hotPink} opacity={1} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: '-10px', opacity: 0.07, pointerEvents: 'none' }}>
        <FeatherDecor size={100} rotate={-20} color={C.lavender} opacity={1} />
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ padding: 16, borderRadius: '50%', background: 'rgba(244,114,182,0.12)', border: `1.5px solid rgba(244,114,182,0.2)`, boxShadow: '0 0 40px rgba(244,63,94,0.25)' }}>
            <LunaFlowLogo size={64} bgColor={C.bg} />
          </div>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: '0 0 4px', background: C.gradSoft, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>LunaFlow</h1>
        <p style={{ color: C.textMid, fontSize: 13, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Your PCOS Cycle Companion</p>
        {/* Feather divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 14, opacity: 0.4 }}>
          <div style={{ height: 1, width: 40, background: C.hotPink }} />
          <span style={{ fontSize: 14, color: C.hotPink }}>🪶</span>
          <div style={{ height: 1, width: 40, background: C.hotPink }} />
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ height: 6, borderRadius: 3, background: i === step ? C.grad : C.borderSoft, width: i === step ? 36 : 10, transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }} />
        ))}
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,192,203,0.07)', backdropFilter: 'blur(28px)', borderRadius: 28, border: `1px solid ${C.border}`, padding: 28, boxShadow: '0 32px 80px rgba(244,63,94,0.12)' }}>

        {step === 0 && (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✨</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: C.text }}>What should we call you?</h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 22px' }}>Let's personalize your journey</p>
            <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Name</label>
            <input autoFocus type="text" placeholder="e.g. Priya, Kashish…"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(244,114,182,0.08)', border: `1.5px solid ${form.name ? C.hotPink + '88' : C.border}`, borderRadius: 16, color: C.text, fontSize: 16, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🗓️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: C.text }}>When did your last period start?</h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 22px' }}>This helps us track your cycle accurately</p>
            <label style={{ display: 'block', fontSize: 11, color: C.textMid, marginBottom: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Start Date</label>
            <input type="date" value={form.lastPeriod} max={today}
              onChange={e => setForm({ ...form, lastPeriod: e.target.value })}
              style={{ width: '100%', padding: '14px 18px', background: 'rgba(244,114,182,0.08)', border: `1.5px solid ${form.lastPeriod ? C.hotPink + '88' : C.border}`, borderRadius: 16, color: C.text, fontSize: 16, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark', transition: 'border 0.2s' }}
            />
            <p style={{ fontSize: 11, color: C.textMuted, marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              🔒 Your data stays private on this device
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🩺</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: C.text }}>Your PCOS Profile</h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 18px' }}>This helps us personalize your daily plan</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PCOS_TYPES.map(type => (
                <button key={type.id} onClick={() => setForm({ ...form, pcosType: type.id })}
                  style={{
                    padding: '14px 16px', borderRadius: 16, border: `2px solid ${form.pcosType === type.id ? C.pink : C.border}`,
                    background: form.pcosType === type.id ? 'rgba(236,72,153,0.14)' : 'rgba(255,192,203,0.04)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, transition: 'all 0.2s', textAlign: 'left',
                  }}>
                  <span style={{ fontSize: 24 }}>{type.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{type.label}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{type.desc}</div>
                  </div>
                  {form.pcosType === type.id && (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ padding: '14px 18px', borderRadius: 16, border: `1.5px solid ${C.border}`, background: 'rgba(255,192,203,0.05)', color: C.textTint, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
              <ChevronLeft size={18} /> Back
            </button>
          )}
          <button disabled={!canNext}
            onClick={() => step < 2 ? setStep(s => s + 1) : onComplete(form)}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: 16, border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
              background: canNext ? C.grad : C.borderSoft,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, fontSize: 15,
              boxShadow: canNext ? '0 8px 24px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s',
            }}>
            {step === 2 ? '🌸 Begin My Journey' : <>Continue <ChevronRight size={18} /></>}
          </button>
        </div>
      </div>

      {/* Tagline */}
      <p style={{ color: C.textMuted, fontSize: 12, marginTop: 24, textAlign: 'center' }}>
        🪶 Track · Understand · Flourish
      </p>
    </div>
  );
}
