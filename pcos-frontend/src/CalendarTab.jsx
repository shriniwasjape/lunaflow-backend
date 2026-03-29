import React, { useState } from 'react';
import { getDateInfo, PHASE_STYLES, getCycleHistory, CYCLE_LENGTH } from './constants';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['S','M','T','W','T','F','S'];

export default function CalendarTab({ cycleHistory }) {
  const today = new Date();
  const [viewed, setViewed] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null); // selected date info

  const firstDay = new Date(viewed.year, viewed.month, 1).getDay();
  const daysInMonth = new Date(viewed.year, viewed.month + 1, 0).getDate();
  const todayStr = today.toISOString().split('T')[0];

  const prevMonth = () => setViewed(v => ({ year: v.month === 0 ? v.year - 1 : v.year, month: v.month === 0 ? 11 : v.month - 1 }));
  const nextMonth = () => setViewed(v => ({ year: v.month === 11 ? v.year + 1 : v.year, month: v.month === 11 ? 0 : v.month + 1 }));

  const getDateStr = (day) => {
    const m = String(viewed.month + 1).padStart(2,'0');
    const d = String(day).padStart(2,'0');
    return `${viewed.year}-${m}-${d}`;
  };

  // Build upcoming predictions from latest cycle
  const latestCycle = cycleHistory[0];
  const getUpcoming = () => {
    if (!latestCycle) return [];
    const events = [];
    const start = new Date(latestCycle.startDate);
    for (let i = 1; i <= 3; i++) {
      const nextStart = new Date(start.getTime() + i * CYCLE_LENGTH * 86400000);
      const nextOvul  = new Date(start.getTime() + (i * CYCLE_LENGTH + 13) * 86400000);
      if (nextStart > today) events.push({ date: nextStart, label: 'Period expected', emoji: '🌸', color: '#f43f5e' });
      if (nextOvul > today && nextOvul < nextStart) events.push({ date: nextOvul, label: 'Fertile window', emoji: '☀️', color: '#f59e0b' });
    }
    return events.sort((a,b) => a.date - b.date).slice(0, 4);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: 100 }}>
      <h2 style={{ fontWeight: 800, fontSize: 22, margin: '0 0 16px', color: '#fff' }}>Cycle Calendar</h2>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {Object.entries(PHASE_STYLES).map(([key, s]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '5px 11px', border: `1px solid ${s.color}44` }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{s.emoji} {s.label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '5px 11px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Untracked</span>
        </div>
      </div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{MONTH_NAMES[viewed.month]} {viewed.year}</span>
        <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 6 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, paddingBottom: 6 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = getDateStr(day);
          const info = getDateInfo(dateStr, cycleHistory);
          const style = info ? PHASE_STYLES[info.phase] : null;
          const isToday = dateStr === todayStr;
          const isFuture = new Date(dateStr) > today;
          const isSelected = selected?.dateStr === dateStr;

          return (
            <div key={idx} onClick={() => setSelected(info && !isFuture ? { dateStr, ...info } : null)}
              style={{
                aspectRatio: '1', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: isSelected ? (style?.color || 'rgba(255,255,255,0.2)') : isToday ? 'linear-gradient(135deg,#f43f5e,#a855f7)' : style ? style.bg : 'rgba(255,255,255,0.03)',
                border: isSelected ? 'none' : isToday ? '2px solid rgba(255,255,255,0.35)' : style ? `1px solid ${style.color}44` : '1px solid rgba(255,255,255,0.06)',
                cursor: style && !isFuture ? 'pointer' : 'default',
                opacity: isFuture ? 0.4 : 1,
                boxShadow: isToday ? '0 4px 16px rgba(244,63,94,0.4)' : isSelected ? `0 4px 16px ${style?.color}66` : 'none',
                transition: 'all 0.15s',
                position: 'relative',
              }}>
              <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 600, color: isToday || isSelected ? '#fff' : style ? style.color : 'rgba(255,255,255,0.45)' }}>{day}</span>
              {style && !isToday && !isSelected && <div style={{ width: 4, height: 4, borderRadius: '50%', background: style.color, marginTop: 1 }} />}
            </div>
          );
        })}
      </div>

      {/* Selected day popup */}
      {selected && (
        <div style={{ marginTop: 16, background: `${PHASE_STYLES[selected.phase]?.bg}`, borderRadius: 18, padding: '16px 18px', border: `1.5px solid ${PHASE_STYLES[selected.phase]?.color}44`, animation: 'fadeIn 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{PHASE_STYLES[selected.phase]?.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, color: PHASE_STYLES[selected.phase]?.color, fontSize: 15 }}>{selected.dateStr}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Day {selected.dayOfCycle} · {PHASE_STYLES[selected.phase]?.label} Phase</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        </div>
      )}

      {/* Cycle History */}
      {cycleHistory.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 12px' }}>📋 Cycle History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cycleHistory.slice(0, 6).map((cycle, i) => {
              const duration = cycle.endDate
                ? Math.floor((new Date(cycle.endDate) - new Date(cycle.startDate)) / 86400000) + 1
                : null;
              return (
                <div key={cycle.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '12px 16px', border: '1px solid rgba(244,63,94,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🌸</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                      {cycle.startDate} {cycle.endDate ? `→ ${cycle.endDate}` : '(ongoing)'}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                      {duration ? `${duration} day period` : 'End date not logged'} · Cycle #{cycleHistory.length - i}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 12px' }}>🔮 Upcoming Predictions</h3>
        {!latestCycle ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Log your period to see predictions.</p>
        ) : getUpcoming().map((ev, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 8, border: `1px solid ${ev.color}33` }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${ev.color}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 9, color: ev.color, fontWeight: 700 }}>{MONTH_NAMES[ev.date.getMonth()].slice(0,3).toUpperCase()}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: ev.color, lineHeight: 1 }}>{ev.date.getDate()}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{ev.emoji} {ev.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                In {Math.max(0, Math.round((ev.date - today) / 86400000))} days
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
