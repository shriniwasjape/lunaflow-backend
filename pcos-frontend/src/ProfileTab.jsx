import React, { useState } from 'react';
import { PHASES, PCOS_TYPES } from './constants';
import { LogOut, Edit3, ChevronRight } from 'lucide-react';

const phaseColors = ['#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ProfileTab({ userProfile, cycleData, onReset, onUpdateProfile, darkMode, onToggleDarkMode }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: userProfile.name, lastPeriod: userProfile.lastPeriod || '' });

  const pcosInfo = PCOS_TYPES.find(t => t.id === userProfile.pcosType);
  const phaseColor = phaseColors[cycleData.phaseIndex];

  const save = () => { onUpdateProfile(draft); setEditing(false); };

  const facts = [
    { label: 'Current Phase', value: cycleData.phase.name, emoji: ['🌸','🌿','☀️','🌙'][cycleData.phaseIndex] },
    { label: 'Cycle Day', value: `Day ${cycleData.dayOfCycle}`, emoji: '📅' },
    { label: 'PCOS Type', value: pcosInfo?.label || '—', emoji: pcosInfo?.emoji || '💊' },
    { label: 'Next Period', value: `~${cycleData.daysUntilNext} days`, emoji: '🔮' },
  ];

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Avatar & name */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 86, height: 86, borderRadius: '50%', background: `linear-gradient(135deg, ${phaseColor}, #a855f7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 38, boxShadow: `0 0 40px ${phaseColor}55`, border: '3px solid rgba(255,255,255,0.15)' }}>
          {userProfile.name?.[0]?.toUpperCase() || '🌙'}
        </div>
        {editing ? (
          <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '10px 16px', color: '#fff', fontSize: 20, fontWeight: 700, textAlign: 'center', outline: 'none', width: 200 }} />
        ) : (
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{userProfile.name}</h2>
        )}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>LunaFlow member</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {facts.map(f => (
          <div key={f.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{f.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{f.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{f.label}</div>
          </div>
        ))}
      </div>

      {/* Phase info */}
      <div style={{ background: `linear-gradient(135deg, ${phaseColor}22, ${phaseColor}11)`, borderRadius: 20, padding: '18px', border: `1px solid ${phaseColor}44`, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>{['🌸','🌿','☀️','🌙'][cycleData.phaseIndex]}</span>
          <div>
            <div style={{ fontWeight: 700, color: phaseColor, fontSize: 15 }}>{cycleData.phase.name} Phase</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{cycleData.phase.days}-day phase</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>{cycleData.phase.tip}</p>
      </div>

      {/* Edit Settings */}
      {editing ? (
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '18px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 16 }}>
          <h4 style={{ fontWeight: 700, color: '#fff', fontSize: 15, margin: '0 0 14px' }}>✏️ Edit Profile</h4>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Last Period</label>
          <input type="date" value={draft.lastPeriod} max={new Date().toISOString().split('T')[0]}
            onChange={e => setDraft({ ...draft, lastPeriod: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark', marginBottom: 14 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button onClick={save} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg,#f43f5e,#a855f7)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)}
          style={{ width: '100%', padding: '14px 18px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: '#fff' }}>
          <Edit3 size={18} color="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 14, fontWeight: 600, flex: 1, textAlign: 'left' }}>Edit Profile & Period Date</span>
          <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
        </button>
      )}

      {/* Dark Mode Toggle */}
      <button onClick={onToggleDarkMode}
        style={{ width: '100%', padding: '14px 18px', borderRadius: 18, background: 'rgba(168,85,247,0.07)', border: '1.5px solid rgba(168,85,247,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: 'inherit' }}>
        <span style={{ fontSize: 18 }}>{darkMode ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1, textAlign: 'left', color: darkMode ? 'rgba(253,164,175,0.9)' : '#1f1235' }}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </span>
        {/* Toggle pill */}
        <div style={{ width: 44, height: 24, borderRadius: 12, background: darkMode ? 'linear-gradient(135deg,#f43f5e,#a855f7)' : 'rgba(0,0,0,0.12)', position: 'relative', transition: 'background 0.3s ease', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 3, left: darkMode ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
      </button>

      {/* About PCOS type */}
      {pcosInfo && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{pcosInfo.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{pcosInfo.label} PCOS</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{pcosInfo.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Reset */}
      <button onClick={() => { if (window.confirm('Reset all data? This cannot be undone.')) onReset(); }}
        style={{ width: '100%', padding: '14px', borderRadius: 18, background: 'rgba(244,63,94,0.08)', border: '1.5px solid rgba(244,63,94,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#f43f5e', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
        <LogOut size={16} /> Reset & Start Over
      </button>
    </div>
  );
}
