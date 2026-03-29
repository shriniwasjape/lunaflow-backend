import React, { useState, useEffect } from 'react';
import { PHASES } from './constants';
import { C, LunaFlowLogo, FeatherDecor } from './theme.jsx';
import { Droplet, RefreshCw, Sparkles } from 'lucide-react';

function DailyPlanCards({ userProfile, cycleData, loggedSymptoms }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://lunaflow-api.onrender.com/api/generate-daily-plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userProfile.name,
          phase: cycleData.phase.name,
          phaseIndex: cycleData.phaseIndex,
          dayOfCycle: cycleData.dayOfCycle,
          pcosType: userProfile.pcosType,
          symptoms: loggedSymptoms,
        })
      });
      if (!res.ok) throw new Error('Too many requests. Please wait a minute.');
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlan(); }, [cycleData.dayOfCycle, loggedSymptoms.length]);

  if (loading) {
    return (
      <div style={{ 
        padding: '28px 24px', 
        background: `linear-gradient(135deg, ${C.cardHover}, ${C.card})`, 
        borderRadius: 24, 
        border: `1px solid ${C.border}`, 
        textAlign: 'center', 
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.05 }}>
          <Sparkles size={80} color={C.hotPink} />
        </div>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: '50%', 
          background: C.grad, 
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
          margin: '0 auto 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: 700, marginBottom: 4 }}>✨ Crafting Your Daily Plan</div>
        <div style={{ fontSize: 12, color: C.textMid }}>Personalizing for your {cycleData.phase.name} Phase...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '24px', 
        background: 'rgba(244,63,94,0.08)', 
        borderRadius: 24, 
        border: `1px solid rgba(244,63,94,0.2)`, 
        textAlign: 'center', 
        marginBottom: 20,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ fontSize: 13, color: C.textMid, marginBottom: 12 }}>{error}</div>
        <button onClick={fetchPlan} 
          style={{ 
            padding: '8px 16px', 
            borderRadius: 14, 
            background: 'rgba(244,63,94,0.15)', 
            border: 'none', 
            color: C.softPink, 
            fontSize: 13, 
            fontWeight: 700, 
            cursor: 'pointer', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            transition: 'all 0.2s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  if (!plan) return null;

  const CARDS = [
    { id: 'insight', title: 'Daily Insight', emoji: '✨', color: '#c084fc', bg: 'rgba(192,132,252,0.15)', borderColor: 'rgba(192,132,252,0.3)' },
    { id: 'diet', title: 'Nutrition Tip', emoji: '🥗', color: '#fb923c', bg: 'rgba(251,146,60,0.15)', borderColor: 'rgba(251,146,60,0.3)' },
    { id: 'movement', title: 'Activity', emoji: '🧘‍♀️', color: '#f472b6', bg: 'rgba(244,114,182,0.15)', borderColor: 'rgba(244,114,182,0.3)' },
    { id: 'mindfulness', title: 'Self Care', emoji: '🌸', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', borderColor: 'rgba(244,63,94,0.3)' },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ 
        fontSize: 15, 
        fontWeight: 800, 
        color: C.text, 
        marginBottom: 12, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span className="gradient-text">Today's Daily Plan</span>
        <span style={{ 
          fontSize: 11, 
          color: C.textMuted, 
          fontWeight: 600, 
          background: C.card, 
          padding: '4px 10px', 
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <Sparkles size={10} /> Powered by Luna AI
        </span>
      </div>
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        overflowX: 'auto', 
        paddingBottom: 10, 
        scrollSnapType: 'x mandatory', 
        margin: '0 -18px', 
        paddingInline: 18 
      }}>
        {CARDS.map(c => plan[c.id] && (
          <div key={c.id} 
            className="daily-plan-card"
            style={{
              minWidth: 280, 
              flexShrink: 0, 
              scrollSnapAlign: 'start',
              background: `linear-gradient(145deg, ${c.bg}, rgba(26,6,18,0.6))`, 
              borderRadius: 24, 
              border: `1.5px solid ${c.borderColor}`, 
              padding: '22px',
              boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}40`;
              e.currentTarget.style.borderColor = c.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              e.currentTarget.style.borderColor = c.borderColor;
            }}>
            {/* Shimmer effect */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: `linear-gradient(90deg, transparent, ${c.color}15, transparent)`,
              animation: 'shimmer-slide 3s infinite',
              pointerEvents: 'none'
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: c.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 20,
                border: `2px solid ${c.borderColor}`,
                boxShadow: `0 4px 12px ${c.color}30`
              }}>{c.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: c.color }}>{c.title}</div>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: 14, 
              color: C.text, 
              lineHeight: 1.65,
              position: 'relative',
              zIndex: 1
            }}>{plan[c.id]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CycleWheel({ cycleData }) {
  const { dayOfCycle, phaseIndex } = cycleData;
  const total = 32;
  const radius = 86, cx = 106, cy = 106, sw = 13;
  const circ = 2 * Math.PI * radius;
  const progress = (dayOfCycle / total) * circ;
  const phaseColors = [C.rose, C.hotPink, C.peach, C.lavender];
  const color = phaseColors[phaseIndex];
  const phaseEmojis = ['🌹','🌸','🌼','🌙'];
  
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={212} height={212} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 18px ${color}88)` }}>
        <defs>
          <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={C.mauve} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,182,193,0.1)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="url(#wg2)" strokeWidth={sw}
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
        {PHASES.map((_, i) => {
          const ang = (PHASES.slice(0,i).reduce((a,p)=>a+p.days,0)/total)*360;
          return <circle key={i} cx={cx+radius*Math.cos(ang*Math.PI/180)} cy={cy+radius*Math.sin(ang*Math.PI/180)} r={3} fill="rgba(255,192,203,0.3)" />;
        })}
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color, textShadow: `0 0 22px ${color}` }}>{dayOfCycle}</div>
        <div style={{ fontSize: 10, color: C.textMid, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Day of cycle</div>
        <div style={{ fontSize: 22, marginTop: 6 }}>{phaseEmojis[phaseIndex]}</div>
      </div>
    </div>
  );
}

export default function HomeTab({ userProfile, cycleData, loggedSymptoms, onNavigate, onPeriodLog }) {
  const phaseColors = [C.rose, C.hotPink, C.peach, C.lavender];
  const color = phaseColors[cycleData.phaseIndex];
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '0 18px 20px', overflowY: 'auto', height: '100%', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="hover-scale">
            <LunaFlowLogo size={36} bgColor={C.bg} />
          </div>
          <div>
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>{greeting} 🌸</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '1px 0 0', background: C.gradSoft, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userProfile.name}</h1>
          </div>
        </div>
        <button onClick={onPeriodLog} className="hover-glow"
          style={{ padding: '9px 15px', borderRadius: 20, background: 'rgba(244,63,94,0.15)', border: `1.5px solid rgba(244,63,94,0.35)`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.softPink, fontWeight: 700, fontSize: 12, transition: 'all 0.3s ease' }}>
          <Droplet size={13} /> Period
        </button>
      </div>

      {/* Phase banner */}
      <div className="hover-lift" style={{ background: `linear-gradient(135deg,${color}22,${color}0a)`, borderRadius: 18, padding: '12px 16px', border: `1px solid ${color}44`, marginBottom: 18, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.1 }}>
          <FeatherDecor size={80} rotate={20} color={color} opacity={1} />
        </div>
        <div style={{ fontWeight: 700, color, fontSize: 14 }}>{cycleData.phase.name} Phase · Day {cycleData.dayOfCycle}</div>
        <div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>{cycleData.phase.tip}</div>
      </div>

      {/* Cycle wheel */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <CycleWheel cycleData={cycleData} />
      </div>

      {/* Phase bars */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
        {PHASES.map((ph, i) => (
          <div key={i} className="phase-bar" style={{ flex: ph.days, height: i === cycleData.phaseIndex ? 10 : 5, borderRadius: 5, background: i === cycleData.phaseIndex ? phaseColors[i] : 'rgba(255,182,193,0.12)', boxShadow: i === cycleData.phaseIndex ? `0 0 10px ${phaseColors[i]}` : 'none', transition: 'all 0.3s ease' }} />
        ))}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Next period', value: `~${cycleData.daysUntilNext}d`, emoji: '🔮' },
          { label: 'Cycle day', value: `${cycleData.dayOfCycle}/32`, emoji: '📅' },
          { label: 'Symptoms', value: loggedSymptoms.length, emoji: '📝' },
        ].map(s => (
          <div key={s.label} className="stat-card hover-lift" style={{ flex: 1, background: C.card, borderRadius: 18, padding: '14px 10px', border: `1px solid ${C.border}`, textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 18 }}>
        {[
          { label: 'Log Symptoms', sub: 'How are you today?', emoji: '📝', tab: 'log', grad: C.grad },
          { label: 'Chat with Luna', sub: 'Ask your AI companion', emoji: '🌙', tab: 'ai', grad: C.gradPurple },
          { label: 'Food Scanner', sub: 'PCOS-safe check', emoji: '🔍', tab: 'scanner', grad: 'linear-gradient(135deg,#fb7185,#f43f5e)' },
          { label: 'Cycle Calendar', sub: 'View your history', emoji: '📅', tab: 'calendar', grad: C.gradPeach },
        ].map(a => (
          <button key={a.tab} onClick={() => onNavigate(a.tab)} className="action-card"
            style={{ background: a.grad, borderRadius: 20, padding: '16px 14px', border: 'none', cursor: 'pointer', textAlign: 'left', boxShadow: '0 6px 18px rgba(244,63,94,0.25)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -8, bottom: -8, opacity: 0.15 }}>
              <FeatherDecor size={50} rotate={15} color="#fff" opacity={1} />
            </div>
            <div style={{ fontSize: 24, marginBottom: 7 }}>{a.emoji}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, position: 'relative' }}>{a.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 3, position: 'relative' }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Daily Flash Cards */}
      <DailyPlanCards userProfile={userProfile} cycleData={cycleData} loggedSymptoms={loggedSymptoms} />

      {/* Today's symptoms */}
      {loggedSymptoms.length > 0 && (
        <div className="hover-lift" style={{ background: C.card, borderRadius: 18, padding: '14px 16px', border: `1px solid ${C.border}`, transition: 'all 0.3s ease' }}>
          <div style={{ fontSize: 12, color: C.textMid, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>🌸 Today's Symptoms</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {loggedSymptoms.map(s => (
              <span key={s} className="symptom-badge" style={{ fontSize: 12, background: 'rgba(236,72,153,0.12)', border: `1px solid rgba(236,72,153,0.22)`, borderRadius: 10, padding: '4px 10px', color: C.hotPink, transition: 'all 0.2s ease', cursor: 'pointer' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.1); }
        .hover-glow { transition: all 0.3s ease; }
        .hover-glow:hover { box-shadow: 0 0 20px rgba(244,63,94,0.5); transform: scale(1.05); }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .action-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 28px rgba(244,63,94,0.4); }
        .stat-card:hover { background: ${C.cardHover}; border-color: ${C.hotPink}55; }
        .symptom-badge:hover { background: rgba(236,72,153,0.2); transform: scale(1.05); }
        .gradient-text {
          background: linear-gradient(135deg, #fda4af, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
