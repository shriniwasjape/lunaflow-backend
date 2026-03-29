import React, { useState, useEffect } from 'react';
import { calculateCycleData, getCycleHistory, getLatestCycle, addCycleStart } from './constants';
import { C, FeatherDecor } from './theme.jsx';
import Auth, { supabase } from './Auth';
import Onboarding from './Onboarding';
import HomeTab from './HomeTab';
import CalendarTab from './CalendarTab';
import LogTab from './LogTab';
import ScannerTab from './ScannerTab';
import ProfileTab from './ProfileTab';
import AITab from './AITab';
import PeriodModal from './PeriodModal';

const NAV_TABS = [
  { id: 'home',     label: 'Home',    emoji: '🏠' },
  { id: 'calendar', label: 'Cycle',   emoji: '📅' },
  { id: 'log',      label: 'Log',     emoji: '📝' },
  { id: 'ai',       label: 'Luna',    emoji: '🌙' },
  { id: 'profile',  label: 'Me',      emoji: '🌸' },
];

function BottomNav({ active, setActive }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(26,6,18,0.96)', backdropFilter: 'blur(28px)',
      borderTop: `1px solid ${C.border}`,
      display: 'flex', padding: '8px 0 max(10px,env(safe-area-inset-bottom))',
      maxWidth: 480, margin: '0 auto',
    }}>
      {NAV_TABS.map(tab => {
        const on = active === tab.id;
        return (
          <button key={tab.id} onClick={() => setActive(tab.id)} className="nav-tab"
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 3, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px 0', 
              position: 'relative', 
              WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.3s ease'
            }}>
            {on && (
              <div style={{ 
                position: 'absolute', 
                top: -8, 
                width: 32, 
                height: 3, 
                borderRadius: 2, 
                background: C.grad,
                animation: 'slideDown 0.3s ease'
              }} />
            )}
            <span style={{ 
              fontSize: 20, 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              transform: on ? 'scale(1.22)' : 'scale(1)', 
              filter: on ? 'none' : 'grayscale(70%) opacity(0.4)' 
            }}>{tab.emoji}</span>
            <span style={{ 
              fontSize: 10, 
              fontWeight: on ? 700 : 500, 
              color: on ? C.softPink : C.textMuted, 
              letterSpacing: '0.02em',
              transition: 'all 0.3s ease'
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Background({ phaseIndex }) {
  const orbColors = [C.rose, C.pink, C.hotPink, C.lavender];
  const c = orbColors[phaseIndex] || C.pink;
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Gradient orbs */}
      <div style={{ 
        position: 'absolute', 
        width: 360, 
        height: 360, 
        borderRadius: '50%', 
        background: c, 
        filter: 'blur(100px)', 
        opacity: 0.18, 
        top: '-20%', 
        left: '-15%', 
        animation: 'orb0 10s ease-in-out infinite alternate' 
      }} />
      <div style={{ 
        position: 'absolute', 
        width: 280, 
        height: 280, 
        borderRadius: '50%', 
        background: C.mauve, 
        filter: 'blur(80px)', 
        opacity: 0.14, 
        top: '30%', 
        right: '-15%', 
        animation: 'orb1 12s ease-in-out infinite alternate' 
      }} />
      <div style={{ 
        position: 'absolute', 
        width: 300, 
        height: 300, 
        borderRadius: '50%', 
        background: C.pink, 
        filter: 'blur(90px)', 
        opacity: 0.12, 
        bottom: '-15%', 
        left: '10%', 
        animation: 'orb2 9s ease-in-out infinite alternate' 
      }} />
      {/* Feather decorations */}
      <div style={{ position: 'absolute', top: '5%', right: '-2%', animation: 'float 6s ease-in-out infinite' }}>
        <FeatherDecor size={110} opacity={0.07} rotate={20} color={C.hotPink} />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-4%', animation: 'float 8s ease-in-out infinite reverse' }}>
        <FeatherDecor size={90} opacity={0.05} rotate={-15} color={C.lavender} />
      </div>
      <div style={{ position: 'absolute', top: '50%', right: '5%', animation: 'float 7s ease-in-out infinite' }}>
        <FeatherDecor size={60} opacity={0.04} rotate={30} color={C.softPink} />
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('auth'); // 'auth' | 'onboarding' | 'app'
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState({ name: '', lastPeriod: null, pcosType: null });
  const [loggedSymptoms, setLoggedSymptoms] = useState([]);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  // Check authentication state on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setScreen('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      loadUserData(session.user.id);
    }
  };

  const loadUserData = async (userId) => {
    try {
      // Load user profile from Supabase
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        setUserProfile({
          name: profile.name,
          lastPeriod: profile.last_period,
          pcosType: profile.pcos_type
        });
        
        // Load cycle history
        const { data: cycles } = await supabase
          .from('cycle_history')
          .select('*')
          .eq('user_id', userId)
          .order('start_date', { ascending: false });
        
        if (cycles) {
          const formattedCycles = cycles.map(c => ({
            id: c.id,
            startDate: c.start_date,
            endDate: c.end_date
          }));
          setCycleHistory(formattedCycles);
        }
        
        setScreen('app');
      } else {
        setScreen('onboarding');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage for offline mode
      const saved = localStorage.getItem('lunaflow_user');
      if (saved) {
        setUserProfile(JSON.parse(saved));
        setScreen('app');
      } else {
        setScreen('onboarding');
      }
    }
    
    const history = getCycleHistory();
    if (history.length > 0) setCycleHistory(history);
  };

  const saveProfile = async (profile) => {
    setUserProfile(profile);
    localStorage.setItem('lunaflow_user', JSON.stringify(profile));
    
    // Save to Supabase if authenticated
    if (user) {
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            name: profile.name,
            last_period: profile.lastPeriod,
            pcos_type: profile.pcosType,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    loadUserData(authenticatedUser.id);
  };

  const handleComplete = async (form) => {
    await saveProfile(form);
    if (form.lastPeriod) {
      const existing = getCycleHistory();
      if (!existing.some(c => c.startDate === form.lastPeriod)) {
        const cycles = addCycleStart(form.lastPeriod);
        setCycleHistory(cycles);
        
        // Save to Supabase
        if (user) {
          try {
            await supabase.from('cycle_history').insert({
              user_id: user.id,
              start_date: form.lastPeriod,
              end_date: null
            });
          } catch (error) {
            console.error('Error saving cycle:', error);
          }
        }
      }
    }
    setScreen('app');
  };

  const handleReset = async () => {
    if (user) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('lunaflow_user');
    localStorage.removeItem('lunaflow_cycles');
    setUserProfile({ name: '', lastPeriod: null, pcosType: null });
    setCycleHistory([]);
    setUser(null);
    setScreen('auth');
  };

  const handleCycleUpdated = async (newCycles, newLastPeriod) => {
    setCycleHistory(newCycles);
    await saveProfile({ ...userProfile, lastPeriod: newLastPeriod });
    
    // Update Supabase
    if (user) {
      try {
        // This would need more complex logic to handle cycle updates
        // For now, just update the profile
        await supabase
          .from('user_profiles')
          .update({ last_period: newLastPeriod })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error updating cycle:', error);
      }
    }
  };

  const cycleData = calculateCycleData(userProfile.lastPeriod);

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative', overflow: 'hidden',
      maxWidth: 480, margin: '0 auto',
    }}>
      <Background phaseIndex={cycleData.phaseIndex} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(244,114,182,0.2); border-radius: 2px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) sepia(1) saturate(5) hue-rotate(290deg); }
        
        @keyframes orb0 { 
          from { transform: translate(0,0) scale(1); } 
          to { transform: translate(35px,-45px) scale(1.12); } 
        }
        @keyframes orb1 { 
          from { transform: translate(0,0) scale(1); } 
          to { transform: translate(-40px,30px) scale(0.88); } 
        }
        @keyframes orb2 { 
          from { transform: translate(0,0) scale(1); } 
          to { transform: translate(25px,40px) scale(1.08); } 
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes tabFade { 
          from { opacity: 0; transform: translateY(12px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes shimmer { 
          0%, 100% { opacity: 0.6; } 
          50% { opacity: 1; } 
        }
        @keyframes bounce { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-5px); } 
        }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideUp { 
          from { transform: translateY(100%); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        .tab-in { animation: tabFade 0.22s ease; }
        .nav-tab:hover {
          transform: translateY(-2px);
        }
        .nav-tab:active {
          transform: translateY(0);
        }
      `}</style>

      {screen === 'auth' ? (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Auth onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : screen === 'onboarding' ? (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Onboarding onComplete={handleComplete} />
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div className="tab-in" key={activeTab} style={{ flex: 1, overflowY: 'auto', paddingBottom: activeTab === 'ai' ? 0 : 80, display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'home' && <HomeTab userProfile={userProfile} cycleData={cycleData} loggedSymptoms={loggedSymptoms} onNavigate={setActiveTab} onPeriodLog={() => setShowPeriodModal(true)} />}
            {activeTab === 'calendar' && <CalendarTab cycleHistory={cycleHistory} />}
            {activeTab === 'log' && <LogTab onSymptomsUpdate={syms => setLoggedSymptoms(syms)} initialSelected={loggedSymptoms} />}
            {activeTab === 'ai' && <AITab userProfile={userProfile} cycleData={cycleData} loggedSymptoms={loggedSymptoms} />}
            {activeTab === 'scanner' && <ScannerTab phase={cycleData.phase.name} />}
            {activeTab === 'profile' && <ProfileTab userProfile={userProfile} cycleData={cycleData} onReset={handleReset} onUpdateProfile={draft => saveProfile({ ...userProfile, ...draft })} />}
          </div>
          <BottomNav active={activeTab} setActive={setActiveTab} />
          {showPeriodModal && <PeriodModal onClose={() => setShowPeriodModal(false)} onCycleUpdated={handleCycleUpdated} />}
        </div>
      )}
    </div>
  );
}
