import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, XCircle, Camera } from 'lucide-react';

const STATUS = {
  safe:    { icon: CheckCircle,  label: 'PCOS-Friendly',       color: '#10b981', bg: 'rgba(16,185,129,0.15)',  emoji: '✅' },
  caution: { icon: AlertCircle, label: 'Consume Moderately',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', emoji: '⚠️' },
  avoid:   { icon: XCircle,     label: 'Not Recommended',      color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',  emoji: '🚫' },
};

export default function ScannerTab({ phase }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setLoading(true); setResult(null);
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch(`http://localhost:8000/api/scan-food?phase=${phase}`, { method: 'POST', body: fd });
      setResult(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const onInputChange = e => handleFile(e.target.files[0]);
  const onDrop = e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); };

  const status = result ? (STATUS[result.status] || STATUS.safe) : null;

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, margin: '0 0 4px', color: '#fff' }}>Food Scanner</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Check if food is safe for your {phase} phase</p>
      </div>

      {/* Phase indicator */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', marginBottom: 20 }}>
        <span>🌙</span>
        <span style={{ fontSize: 13, color: '#c084fc', fontWeight: 600 }}>Analyzing for {phase} Phase</span>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          borderRadius: 24, border: `2px dashed ${drag ? '#a855f7' : 'rgba(255,255,255,0.2)'}`,
          background: drag ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.04)',
          padding: '32px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 20
        }}>
        {preview ? (
          <img src={preview} alt="food" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 16 }} />
        ) : (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Camera size={28} color="#a855f7" />
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>Upload Food Photo</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>Tap or drag & drop · JPG, PNG, WEBP</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: 'none' }} />
      </div>

      {preview && !loading && !result && (
        <button onClick={() => inputRef.current.click()}
          style={{ width: '100%', padding: '14px', borderRadius: 18, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <Upload size={18} /> Analyze This Food
        </button>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ width: 56, height: 56, border: '4px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>AI is analyzing your food...</p>
        </div>
      )}

      {result && !loading && status && (
        <div style={{ background: status.bg, borderRadius: 24, border: `1.5px solid ${status.color}44`, overflow: 'hidden' }}>
          {/* Result header */}
          <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: `${status.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{status.emoji}</div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{result.food_name}</h3>
              <span style={{ fontSize: 13, fontWeight: 700, color: status.color, background: `${status.color}22`, padding: '3px 10px', borderRadius: 10 }}>{status.label}</span>
            </div>
          </div>
          <div style={{ padding: '0 20px 16px' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{result.reason}</p>
          </div>
          {result.nutrients && (
            <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.15)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {Object.entries(result.nutrients).map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '10px 6px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}>💡 Phase Tips</h4>
        {[
          { phase: 'Menstrual', tip: 'Favor iron-rich foods: leafy greens, lentils, dark chocolate.' },
          { phase: 'Follicular', tip: 'Light proteins & fermented foods support rising estrogen.' },
          { phase: 'Ovulatory', tip: 'Anti-inflammatory foods boost your peak energy naturally.' },
          { phase: 'Luteal', tip: 'Magnesium-rich foods reduce PMS & mood swings.' },
        ].find(t => t.phase === phase) && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
            {[
              { phase: 'Menstrual', tip: 'Favor iron-rich foods: leafy greens, lentils, dark chocolate.' },
              { phase: 'Follicular', tip: 'Light proteins & fermented foods support rising estrogen.' },
              { phase: 'Ovulatory', tip: 'Anti-inflammatory foods boost your peak energy naturally.' },
              { phase: 'Luteal', tip: 'Magnesium-rich foods reduce PMS & mood swings.' },
            ].find(t => t.phase === phase)?.tip}
          </p>
        )}
      </div>
    </div>
  );
}
