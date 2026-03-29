import React, { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';
import { addCycleStart, getCycleHistory, updateCycleEnd, getLatestCycle } from './constants';
import { C, LunaFlowLogo } from './theme.jsx';

export default function PeriodModal({ onClose, onCycleUpdated }) {
  const [mode, setMode] = useState(null); // 'start' | 'end'
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [done, setDone] = useState(false);

  const latestCycle = getLatestCycle(getCycleHistory());
  const today = new Date().toISOString().split('T')[0];

  const handleLogStart = () => {
    const cycles = addCycleStart(startDate);
    onCycleUpdated(cycles, startDate);
    setDone(true);
    setTimeout(() => onClose(), 1400);
  };

  const handleLogEnd = () => {
    if (!latestCycle) return;
    const cycles = updateCycleEnd(latestCycle.id, endDate);
    onCycleUpdated(cycles, latestCycle.startDate);
    setDone(true);
    setTimeout(() => onClose(), 1400);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(26,6,18,0.75)', backdropFilter: 'blur(12px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', maxWidth: 480, background: `linear-gradient(170deg,${C.bgMid},${C.bg})`,
        borderRadius: '28px 28px 0 0', padding: '28px 24px 40px',
        border: `1px solid ${C.border}`, boxShadow: '0 -32px 80px rgba(244,63,94,0.15)',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 24px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><LunaFlowLogo size={28} bgColor={C.bg} /><h2 style={{ fontWeight: 800, fontSize: 22, margin: 0, color: C.text }}>Period Tracker 🌸</h2></div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '4px 0 0' }}>Log your cycle dates</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,182,193,0.1)', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} color={C.textMid} />
          </button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <p style={{ color: C.hotPink, fontWeight: 700, fontSize: 18 }}>Saved! 🌸</p>
          </div>
        ) : mode === null ? (
          /* Mode selection */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={() => setMode('start')}
              style={{ padding: '20px', borderRadius: 20, background: 'rgba(244,63,94,0.12)', border: `2px solid rgba(244,63,94,0.35)`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
              <div style={{ fontWeight: 700, color: C.softPink, fontSize: 17 }}>Period Started 🌹</div>
              <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>Log the date your period began</div>
            </button>
            <button onClick={() => setMode('end')}
              disabled={!latestCycle}
              style={{ padding: '20px', borderRadius: 20, background: latestCycle ? 'rgba(192,132,252,0.12)' : C.card, border: `2px solid ${latestCycle ? 'rgba(192,132,252,0.35)' : C.borderSoft}`, cursor: latestCycle ? 'pointer' : 'not-allowed', textAlign: 'left', opacity: latestCycle ? 1 : 0.5, transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
              <div style={{ fontWeight: 700, color: C.lavender, fontSize: 17 }}>Period Ended ✨</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
                {latestCycle ? `Current cycle started ${latestCycle.startDate}` : 'Log a period start first'}
              </div>
            </button>
          </div>
        ) : mode === 'start' ? (
          <div>
            <button onClick={() => setMode(null)} style={{ color: C.textMid, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
              <h3 style={{ fontWeight: 700, fontSize: 19, color: '#fff', margin: '0 0 6px' }}>When did your period start?</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>This will start a new cycle in your history</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(244,114,182,0.07)', borderRadius: 16, padding: '14px 16px', border: '1.5px solid rgba(244,63,94,0.3)', marginBottom: 20 }}>
              <Calendar size={20} color="#f43f5e" />
              <input type="date" value={startDate} max={today}
                onChange={e => setStartDate(e.target.value)}
                style={{ background: 'none', border: 'none', color: C.text, fontSize: 16, fontWeight: 600, outline: 'none', flex: 1, colorScheme: 'dark' }} />
            </div>
            <button onClick={handleLogStart}
              style={{ width: '100%', padding: '16px', borderRadius: 18, background: C.grad, border: 'none', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 22px rgba(236,72,153,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CheckCircle size={20} /> Confirm Period Start
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setMode(null)} style={{ color: C.textMid, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
              <h3 style={{ fontWeight: 700, fontSize: 19, color: '#fff', margin: '0 0 6px' }}>When did your period end?</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>Started: {latestCycle?.startDate}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(192,132,252,0.07)', borderRadius: 16, padding: '14px 16px', border: '1.5px solid rgba(192,132,252,0.3)', marginBottom: 20 }}>
              <Calendar size={20} color={C.lavender} />
              <input type="date" value={endDate} min={latestCycle?.startDate} max={today}
                onChange={e => setEndDate(e.target.value)}
                style={{ background: 'none', border: 'none', color: C.text, fontSize: 16, fontWeight: 600, outline: 'none', flex: 1, colorScheme: 'dark' }} />
            </div>
            <button onClick={handleLogEnd}
              style={{ width: '100%', padding: '16px', borderRadius: 18, background: C.gradPurple, border: 'none', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 22px rgba(192,132,252,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CheckCircle size={20} /> Confirm Period End
            </button>
          </div>
        )}
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
