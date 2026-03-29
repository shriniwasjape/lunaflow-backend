// Cycle history helpers — stored in localStorage as lunaflow_cycles
// Each entry: { id, startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' | null }

export const getCycleHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('lunaflow_cycles') || '[]');
  } catch { return []; }
};

export const saveCycleHistory = (cycles) => {
  localStorage.setItem('lunaflow_cycles', JSON.stringify(cycles));
};

export const addCycleStart = (dateStr) => {
  const cycles = getCycleHistory();
  // Avoid duplicate starts on same date
  if (cycles.some(c => c.startDate === dateStr)) return cycles;
  const updated = [{ id: Date.now(), startDate: dateStr, endDate: null }, ...cycles];
  saveCycleHistory(updated);
  return updated;
};

export const updateCycleEnd = (cycleId, endDateStr) => {
  const cycles = getCycleHistory();
  const updated = cycles.map(c => c.id === cycleId ? { ...c, endDate: endDateStr } : c);
  saveCycleHistory(updated);
  return updated;
};

export const getLatestCycle = (cycles) => cycles[0] || null;

// Given a date string and cycle history, return the phase info for that day
export const getDateInfo = (dateStr, cycleHistory) => {
  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0);

  for (const cycle of cycleHistory) {
    const start = new Date(cycle.startDate);
    start.setHours(12, 0, 0, 0);
    const daysSince = Math.floor((date - start) / 86400000);
    if (daysSince < 0) continue;
    if (daysSince > 35) continue; // too far, skip

    const dayOfCycle = daysSince + 1;
    const periodEnd = cycle.endDate
      ? Math.floor((new Date(cycle.endDate) - start) / 86400000) + 1
      : 5;

    if (dayOfCycle <= periodEnd) return { phase: 'menstrual', dayOfCycle, cycleId: cycle.id };
    if (dayOfCycle <= 13)        return { phase: 'follicular', dayOfCycle, cycleId: cycle.id };
    if (dayOfCycle <= 17)        return { phase: 'ovulatory',  dayOfCycle, cycleId: cycle.id };
    if (dayOfCycle <= 32)        return { phase: 'luteal',     dayOfCycle, cycleId: cycle.id };
  }
  return null;
};

export const PHASE_STYLES = {
  menstrual:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.22)',   label: 'Menstrual',  emoji: '🌹' },
  follicular: { color: '#f472b6', bg: 'rgba(244,114,182,0.2)', label: 'Follicular', emoji: '🌸' },
  ovulatory:  { color: '#fb923c', bg: 'rgba(251,146,60,0.2)',  label: 'Fertile',    emoji: '🌼' },
  luteal:     { color: '#c084fc', bg: 'rgba(192,132,252,0.2)', label: 'Luteal',     emoji: '🌙' },
};

import { Droplet, Flower2, Sun, Moon, Activity, AlertCircle, Brain, Heart } from 'lucide-react';

export const SYMPTOMS = {
  Flow: [
    { label: "Light Spotting", emoji: "🩸" },
    { label: "Medium Flow", emoji: "💧" },
    { label: "Heavy Flow", emoji: "🌊" },
    { label: "Clotting", emoji: "🔴" },
    { label: "Irregular Bleeding", emoji: "⚠️" },
  ],
  Physical: [
    { label: "Cramps (Mild)", emoji: "😣" },
    { label: "Cramps (Severe)", emoji: "😖" },
    { label: "Bloating", emoji: "🫄" },
    { label: "Breast Tenderness", emoji: "💔" },
    { label: "Headache", emoji: "🤕" },
    { label: "Migraine", emoji: "⚡" },
    { label: "Back Pain", emoji: "🦴" },
    { label: "Acne Flare-up", emoji: "😤" },
    { label: "Fatigue", emoji: "😴" },
    { label: "Nausea", emoji: "🤢" },
    { label: "Dizziness", emoji: "💫" },
    { label: "Hot Flashes", emoji: "🔥" },
  ],
  Mood: [
    { label: "Anxious", emoji: "😰" },
    { label: "Irritable", emoji: "😤" },
    { label: "Depressed", emoji: "😞" },
    { label: "Mood Swings", emoji: "🎭" },
    { label: "Brain Fog", emoji: "🌫️" },
    { label: "Feeling Great", emoji: "🌟" },
    { label: "Stressed", emoji: "😓" },
    { label: "Calm & Centered", emoji: "🧘" },
    { label: "Energetic", emoji: "⚡" },
    { label: "Low Motivation", emoji: "😶" },
  ],
  Sleep: [
    { label: "Insomnia", emoji: "👁️" },
    { label: "Slept Well", emoji: "😴" },
    { label: "Restless Sleep", emoji: "🔄" },
    { label: "Night Sweats", emoji: "💦" },
    { label: "Woke Up Tired", emoji: "☁️" },
    { label: "Vivid Dreams", emoji: "🌙" },
    { label: "Sleeping Too Much", emoji: "⏰" },
  ],
};

export const PHASES = [
  { name: "Menstrual", icon: Droplet, color: "#f43f5e", bg: "from-rose-500 to-pink-600", days: 5, tip: "Rest & nourish yourself. Iron-rich foods help replenish energy." },
  { name: "Follicular", icon: Flower2, color: "#10b981", bg: "from-emerald-400 to-teal-500", days: 9, tip: "Energy rises! Great time for new projects and social activities." },
  { name: "Ovulatory", icon: Sun, color: "#f59e0b", bg: "from-amber-400 to-orange-500", days: 4, tip: "Peak energy & confidence. You're at your most magnetic today!" },
  { name: "Luteal", icon: Moon, color: "#8b5cf6", bg: "from-violet-500 to-purple-600", days: 14, tip: "Wind down gradually. Self-care and gentle movement are key." },
];

export const PCOS_TYPES = [
  { id: "insulin", label: "Insulin Resistant", icon: Activity, desc: "Blood sugar & metabolism focused", emoji: "🍬" },
  { id: "inflammatory", label: "Inflammatory", icon: AlertCircle, desc: "Immune & inflammation driven", emoji: "🔥" },
  { id: "adrenal", label: "Adrenal", icon: Brain, desc: "Stress hormone triggered", emoji: "⚡" },
  { id: "post-pill", label: "Post-Pill", icon: Heart, desc: "Recovering from contraceptives", emoji: "💊" },
];

export const CYCLE_LENGTH = 32;

export const calculateCycleData = (lastPeriodDate) => {
  if (!lastPeriodDate) return { phase: PHASES[0], dayOfCycle: 1, phaseIndex: 0, daysUntilNext: CYCLE_LENGTH };
  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const daysSince = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
  const dayOfCycle = (daysSince % CYCLE_LENGTH) + 1;
  let cumulativeDays = 0, phaseIndex = 0;
  for (let i = 0; i < PHASES.length; i++) {
    if (dayOfCycle <= cumulativeDays + PHASES[i].days) { phaseIndex = i; break; }
    cumulativeDays += PHASES[i].days;
  }
  const daysUntilNext = CYCLE_LENGTH - dayOfCycle + 1;
  return { phase: PHASES[phaseIndex], dayOfCycle, phaseIndex, daysUntilNext };
};
