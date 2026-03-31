import React, { useState, useEffect } from 'react';
import { C } from './theme.jsx';
import { supabase } from './Auth';
import { BarChart2, TrendingUp, Calendar, Activity } from 'lucide-react';

// Top symptoms to track and display  
const TRACKED_SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood Swings',
  'Acne', 'Brain Fog', 'Sugar Cravings', 'Anxiety', 'Insomnia'
];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function BarItem({ label, count, max, color }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textTint }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: color }}>{count}×</span>
      </div>
      <div style={{ height: 10, borderRadius: 10, background: C.bgMid, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 10,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
    </div>
  );
}

export default function ReportTab({ userId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (userId) fetchLogs();
  }, [userId, selectedMonth]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const start = new Date(selectedYear, selectedMonth, 1).toISOString();
      const end   = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).toISOString();

      const { data } = await supabase
        .from('symptoms_log')
        .select('symptoms, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', start)
        .lte('logged_at', end)
        .order('logged_at', { ascending: true });

      setLogs(data || []);
    } catch (e) {
      console.error('Error fetching symptom logs:', e);
    } finally {
      setLoading(false);
    }
  };

  // Count each symptom occurrence
  const symptomCounts = {};
  TRACKED_SYMPTOMS.forEach(s => { symptomCounts[s] = 0; });
  logs.forEach(log => {
    const syms = Array.isArray(log.symptoms) ? log.symptoms : JSON.parse(log.symptoms || '[]');
    syms.forEach(s => {
      if (symptomCounts[s] !== undefined) symptomCounts[s]++;
    });
  });

  const sorted = Object.entries(symptomCounts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
  const totalDaysLogged = logs.length;
  const totalSymptoms = sorted.reduce((acc, [, c]) => acc + c, 0);
  const topSymptom = sorted[0]?.[0] || '—';

  const barColors = ['#f43f5e','#ec4899','#a855f7','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316'];

  const prevMonth = () => setSelectedMonth(m => m === 0 ? 11 : m - 1);
  const nextMonth = () => setSelectedMonth(m => m === 11 ? 0 : m + 1);
  const isCurrent = selectedMonth === new Date().getMonth();

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, margin: '0 0 4px', color: C.text }}>Health Report</h2>
        <p style={{ color: C.textMid, fontSize: 13, margin: 0 }}>Your logged symptom trends & patterns</p>
      </div>

      {/* Month selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.card, borderRadius: 18, padding: '12px 16px', border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <button onClick={prevMonth} style={{ background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 10, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text, fontSize: 16 }}>‹</button>
        <span style={{ fontWeight: 700, fontSize: 17, color: C.text }}>{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
        <button onClick={nextMonth} disabled={isCurrent} style={{ background: isCurrent ? 'transparent' : C.bgMid, border: `1px solid ${isCurrent ? 'transparent' : C.border}`, borderRadius: 10, width: 34, height: 34, cursor: isCurrent ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCurrent ? C.textMuted : C.text, fontSize: 16 }}>›</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Days Logged', value: totalDaysLogged, emoji: '📅', color: '#ec4899' },
          { label: 'Total Symptoms', value: totalSymptoms, emoji: '📊', color: '#a855f7' },
          { label: 'Most Common', value: topSymptom, emoji: '🔝', color: '#f43f5e', small: true },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.card, borderRadius: 18, padding: '14px 10px', border: `1px solid ${C.border}`, textAlign: 'center', boxShadow: '0 2px 12px rgba(236,72,153,0.06)' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: stat.small ? 11 : 20, color: stat.color, lineHeight: 1.2 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: C.card, borderRadius: 20, padding: '20px', border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(236,72,153,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <BarChart2 size={18} color={C.pink} />
          <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: C.text }}>Symptom Frequency</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.pink, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: C.textMid, fontSize: 13 }}>Loading your data...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌸</div>
            <p style={{ color: C.textMid, fontSize: 14, fontWeight: 600 }}>No symptoms logged this month</p>
            <p style={{ color: C.textMuted, fontSize: 12 }}>Start logging daily to see your patterns here!</p>
          </div>
        ) : (
          sorted.map(([sym, count], i) => (
            <BarItem key={sym} label={sym} count={count} max={maxCount} color={barColors[i % barColors.length]} />
          ))
        )}
      </div>

      {/* Insight card */}
      {sorted.length > 0 && (
        <div style={{ marginTop: 16, background: `linear-gradient(135deg, rgba(244,63,94,0.08), rgba(168,85,247,0.08))`, borderRadius: 20, padding: '18px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <TrendingUp size={18} color={C.pink} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>Monthly Insight</div>
              <p style={{ fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.6 }}>
                Your most tracked symptom this month is <strong style={{ color: C.rose }}>{topSymptom}</strong>. 
                You logged symptoms on <strong style={{ color: C.pink }}>{totalDaysLogged} day{totalDaysLogged !== 1 ? 's' : ''}</strong> — 
                great consistency! Tracking patterns helps Luna give you better, more personalized advice. 🌸
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
