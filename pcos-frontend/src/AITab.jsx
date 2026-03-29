import React, { useState, useEffect, useRef } from 'react';
import { C, LunaFlowLogo } from './theme.jsx';
import { Send, RefreshCw } from 'lucide-react';

const QUICK_QUESTIONS = [
  "What should I eat today?",
  "Best workout for my phase?",
  "How to reduce cramps?",
  "Why am I so tired?",
  "Good for insulin resistance?",
  "Help me sleep better tonight",
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '12px 14px', alignItems: 'center' }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.hotPink, animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
    </div>
  );
}

export default function AITab({ userProfile, cycleData, loggedSymptoms }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    if (!init) {
      setInit(true);
      setMessages([{ role: 'assistant', content: `Hi ${userProfile.name}! 🌸 I'm Luna, your PCOS wellness companion.\n\nYou're in your **${cycleData.phase.name} Phase** (Day ${cycleData.dayOfCycle}). ${cycleData.phase.tip}\n\nAsk me anything about your cycle, diet, mood or wellness 💜` }]);
    }
  }, []);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, name: userProfile.name, phase: cycleData.phase.name, dayOfCycle: cycleData.dayOfCycle, pcosType: userProfile.pcosType, symptoms: loggedSymptoms, history: messages.slice(-10) }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.detail?.includes('429') ? "I'm receiving too many requests right now! Please wait a minute and try again 💙" : "I'm having trouble connecting right now. Please check your backend is running 💙";
        setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
        return;
      }
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I didn't quite catch that." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please check your backend is running 💙" }]);
    } finally { setLoading(false); }
  };

  const fmt = (text) => {
    if (!text) return "";
    return text.split(/\*\*(.*?)\*\*/g).map((p, i) => i % 2 === 1 ? <strong key={i} style={{ color: C.softPink }}>{p}</strong> : p);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${C.borderSoft}`, display: 'flex', alignItems: 'center', gap: 12, background: `rgba(26,6,18,0.6)`, backdropFilter: 'blur(20px)' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(244,114,182,0.15)', border: `1.5px solid rgba(244,114,182,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(236,72,153,0.3)', flexShrink: 0 }}>
          <LunaFlowLogo size={30} bgColor="transparent" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Luna AI 🌙</div>
          <div style={{ fontSize: 11, color: '#86efac', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac', animation: 'shimmer 2s infinite' }} /> Online · {cycleData.phase.name} Phase
          </div>
        </div>
        <button onClick={() => { const g = `Hi ${userProfile.name}! 🌸 I'm Luna — ask me anything! 💜`; setMessages([{ role: 'assistant', content: g }]); }}
          style={{ background: 'rgba(255,182,193,0.08)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 8, cursor: 'pointer', color: C.textMid }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 8px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 11, animation: 'fadeIn 0.2s ease' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(244,114,182,0.15)', border: `1px solid rgba(244,114,182,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 7, marginTop: 2, flexShrink: 0 }}>🌙</div>
            )}
            <div style={{ maxWidth: '76%', padding: '11px 15px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', background: msg.role === 'user' ? C.grad : 'rgba(255,192,203,0.08)', border: msg.role === 'assistant' ? `1px solid ${C.borderSoft}` : 'none', fontSize: 14, lineHeight: 1.65, color: C.text, boxShadow: msg.role === 'user' ? '0 4px 14px rgba(236,72,153,0.3)' : 'none', whiteSpace: 'pre-wrap' }}>
              {fmt(msg.content)}
            </div>
            {msg.role === 'user' && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginLeft: 7, marginTop: 2, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {userProfile.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', marginBottom: 11 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(244,114,182,0.15)', border: `1px solid rgba(244,114,182,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 7 }}>🌙</div>
            <div style={{ background: 'rgba(255,192,203,0.08)', border: `1px solid ${C.borderSoft}`, borderRadius: '20px 20px 20px 4px' }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 2 && (
        <div style={{ padding: '6px 16px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 7, paddingBottom: 4 }}>
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                style={{ whiteSpace: 'nowrap', padding: '7px 13px', borderRadius: 20, background: 'rgba(236,72,153,0.1)', border: `1px solid rgba(236,72,153,0.25)`, color: C.hotPink, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 16px 90px', borderTop: `1px solid ${C.borderSoft}`, background: `rgba(26,6,18,0.5)`, backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, background: 'rgba(255,192,203,0.07)', borderRadius: 22, border: `1.5px solid ${C.border}`, padding: '10px 15px' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask Luna about your cycle…" rows={1}
              style={{ background: 'none', border: 'none', color: C.text, fontSize: 15, outline: 'none', resize: 'none', width: '100%', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto' }} />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', background: input.trim() && !loading ? C.grad : C.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() ? '0 4px 14px rgba(236,72,153,0.35)' : 'none', transition: 'all 0.2s' }}>
            <Send size={17} color={input.trim() && !loading ? '#fff' : C.textMuted} />
          </button>
        </div>
      </div>
    </div>
  );
}
