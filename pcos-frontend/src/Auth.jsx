import React, { useState, useEffect } from 'react';
import { C, LunaFlowLogo, FeatherDecor } from './theme.jsx';
import { Mail, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hphhgbjlxbcpwawjaxym.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGhnYmpseGJjcHdhd2pheHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDIwODksImV4cCI6MjA5MDM3ODA4OX0.Tya-Lxt2a2uXhDuCIfOooSy-5j5BtCke6nKkWEXg14k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      onAuthSuccess(session.user);
    }
  };

  const sendOTP = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      setMode('otp');
      setSuccess('Check your email! We sent you a 6-digit code 📬');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e?.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email'
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Verification failed');
      
      setSuccess('Welcome to LunaFlow! 🌸');
      setTimeout(() => onAuthSuccess(data.user), 1000);
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    // Only allow numbers
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    
    // Auto-submit when 6 digits entered
    if (cleaned.length === 6) {
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} };
        setOtp(cleaned);
        verifyOTP(fakeEvent);
      }, 300);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '28px 20px', 
      position: 'relative' 
    }}>
      {/* Feather decorations */}
      <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.09, pointerEvents: 'none' }}>
        <FeatherDecor size={130} rotate={25} color={C.hotPink} opacity={1} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: '-10px', opacity: 0.07, pointerEvents: 'none' }}>
        <FeatherDecor size={100} rotate={-20} color={C.lavender} opacity={1} />
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div className="hover-scale" style={{ 
            padding: 16, 
            borderRadius: '50%', 
            background: 'rgba(244,114,182,0.12)', 
            border: `1.5px solid rgba(244,114,182,0.2)`, 
            boxShadow: '0 0 40px rgba(244,63,94,0.25)',
            transition: 'all 0.3s ease'
          }}>
            <LunaFlowLogo size={64} bgColor={C.bg} />
          </div>
        </div>
        <h1 style={{ 
          fontSize: 34, 
          fontWeight: 900, 
          margin: '0 0 4px', 
          background: C.gradSoft, 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          letterSpacing: '-0.5px' 
        }}>LunaFlow</h1>
        <p style={{ color: C.textMid, fontSize: 13, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          Your PCOS Cycle Companion
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 14, opacity: 0.4 }}>
          <div style={{ height: 1, width: 40, background: C.hotPink }} />
          <span style={{ fontSize: 14, color: C.hotPink }}>🪶</span>
          <div style={{ height: 1, width: 40, background: C.hotPink }} />
        </div>
      </div>

      {/* Auth Card */}
      <div style={{ 
        width: '100%', 
        maxWidth: 420, 
        background: 'rgba(255,192,203,0.07)', 
        backdropFilter: 'blur(28px)', 
        borderRadius: 28, 
        border: `1px solid ${C.border}`, 
        padding: 28, 
        boxShadow: '0 32px 80px rgba(244,63,94,0.12)' 
      }}>
        {mode === 'email' ? (
          <form onSubmit={sendOTP}>
            <div style={{ fontSize: 32, marginBottom: 10, textAlign: 'center' }}>✨</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: C.text, textAlign: 'center' }}>
              Sign in with Email
            </h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 22px', textAlign: 'center' }}>
              We'll send you a secure code
            </p>
            
            <label style={{ 
              display: 'block', 
              fontSize: 11, 
              color: C.textMid, 
              marginBottom: 8, 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase' 
            }}>Email Address</label>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Mail size={18} color={C.textMuted} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                style={{ 
                  width: '100%', 
                  padding: '14px 18px 14px 46px', 
                  background: 'rgba(244,114,182,0.08)', 
                  border: `1.5px solid ${email ? C.hotPink + '88' : C.border}`, 
                  borderRadius: 16, 
                  color: C.text, 
                  fontSize: 16, 
                  outline: 'none', 
                  boxSizing: 'border-box', 
                  transition: 'all 0.2s ease' 
                }}
              />
            </div>

            {error && (
              <div className="error-message" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 16px', 
                background: 'rgba(244,63,94,0.1)', 
                border: '1px solid rgba(244,63,94,0.3)', 
                borderRadius: 14, 
                marginBottom: 16,
                animation: 'slideIn 0.3s ease'
              }}>
                <AlertCircle size={16} color="#f43f5e" />
                <span style={{ fontSize: 13, color: '#f43f5e' }}>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 16px', 
                background: 'rgba(16,185,129,0.1)', 
                border: '1px solid rgba(16,185,129,0.3)', 
                borderRadius: 14, 
                marginBottom: 16,
                animation: 'slideIn 0.3s ease'
              }}>
                <CheckCircle size={16} color="#10b981" />
                <span style={{ fontSize: 13, color: '#10b981' }}>{success}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !email}
              className="auth-button"
              style={{
                width: '100%', 
                padding: '14px 20px', 
                borderRadius: 16, 
                border: 'none', 
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                background: loading || !email ? C.borderSoft : C.grad,
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8, 
                fontWeight: 800, 
                fontSize: 15,
                boxShadow: loading || !email ? 'none' : '0 8px 24px rgba(236,72,153,0.35)', 
                transition: 'all 0.3s ease',
                opacity: loading || !email ? 0.5 : 1
              }}>
              {loading ? (
                <>
                  <Loader size={18} className="spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail size={18} /> Send Magic Code
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <div style={{ fontSize: 32, marginBottom: 10, textAlign: 'center' }}>🔐</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: C.text, textAlign: 'center' }}>
              Enter Your Code
            </h2>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 22px', textAlign: 'center' }}>
              We sent it to <strong style={{ color: C.softPink }}>{email}</strong>
            </p>
            
            <label style={{ 
              display: 'block', 
              fontSize: 11, 
              color: C.textMid, 
              marginBottom: 8, 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase' 
            }}>6-Digit Code</label>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Lock size={18} color={C.textMuted} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                inputMode="numeric"
                placeholder="000000"
                value={otp} 
                onChange={e => handleOtpChange(e.target.value)}
                disabled={loading}
                autoFocus
                maxLength={6}
                style={{ 
                  width: '100%', 
                  padding: '14px 18px 14px 46px', 
                  background: 'rgba(244,114,182,0.08)', 
                  border: `1.5px solid ${otp.length === 6 ? C.hotPink : C.border}`, 
                  borderRadius: 16, 
                  color: C.text, 
                  fontSize: 20, 
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  outline: 'none', 
                  boxSizing: 'border-box', 
                  transition: 'all 0.2s ease' 
                }}
              />
            </div>

            {error && (
              <div className="error-message" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 16px', 
                background: 'rgba(244,63,94,0.1)', 
                border: '1px solid rgba(244,63,94,0.3)', 
                borderRadius: 14, 
                marginBottom: 16,
                animation: 'slideIn 0.3s ease'
              }}>
                <AlertCircle size={16} color="#f43f5e" />
                <span style={{ fontSize: 13, color: '#f43f5e' }}>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '12px 16px', 
                background: 'rgba(16,185,129,0.1)', 
                border: '1px solid rgba(16,185,129,0.3)', 
                borderRadius: 14, 
                marginBottom: 16,
                animation: 'slideIn 0.3s ease'
              }}>
                <CheckCircle size={16} color="#10b981" />
                <span style={{ fontSize: 13, color: '#10b981' }}>{success}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                type="button"
                onClick={() => { setMode('email'); setOtp(''); setError(''); }}
                disabled={loading}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: 14, 
                  background: 'rgba(255,255,255,0.08)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  color: 'rgba(255,255,255,0.6)', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s ease'
                }}>
                Change Email
              </button>
              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="auth-button"
                style={{
                  flex: 2, 
                  padding: '12px 20px', 
                  borderRadius: 14, 
                  border: 'none', 
                  cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  background: loading || otp.length !== 6 ? C.borderSoft : C.grad,
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 8, 
                  fontWeight: 800, 
                  fontSize: 15,
                  boxShadow: loading || otp.length !== 6 ? 'none' : '0 8px 24px rgba(236,72,153,0.35)', 
                  transition: 'all 0.3s ease',
                  opacity: loading || otp.length !== 6 ? 0.5 : 1
                }}>
                {loading ? (
                  <>
                    <Loader size={18} className="spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} /> Verify Code
                  </>
                )}
              </button>
            </div>

            <button 
              type="button"
              onClick={() => { setOtpSent(false); sendOTP(); }}
              disabled={loading}
              style={{ 
                width: '100%',
                marginTop: 12,
                padding: '8px', 
                background: 'none',
                border: 'none',
                color: C.hotPink,
                fontSize: 12,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.5 : 1
              }}>
              Didn't receive it? Resend code
            </button>
          </form>
        )}
      </div>

      {/* Tagline */}
      <p style={{ color: C.textMuted, fontSize: 12, marginTop: 24, textAlign: 'center' }}>
        🪶 Secure · Private · Encrypted
      </p>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.1); }
        .auth-button:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 12px 32px rgba(236,72,153,0.5) !important;
        }
      `}</style>
    </div>
  );
}

// Export supabase client for use in other components
export { supabase };
