import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar, Clock, Sparkles, ArrowRight, Crown, Star, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppConfig } from '../../types';

interface HeroSectionProps {
  config: AppConfig;
  onNextStep?: () => void;
}

// CUTE ANIMATED KITTEN COMPONENT
const CuteKitten: React.FC = () => {
  return (
    <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
      {/* Floating hearts above kitten */}
      <div className="absolute -top-5 inset-x-0 flex justify-between px-1 w-24">
        <motion.span
          animate={{ y: [-4, -16, -4], opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs text-rose-400 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]"
        >
          ❤️
        </motion.span>
        <motion.span
          animate={{ y: [-2, -18, -2], opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
          className="text-xs text-pink-300 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]"
        >
          💕
        </motion.span>
        <motion.span
          animate={{ y: [-5, -15, -5], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.1, ease: 'easeInOut' }}
          className="text-xs text-rose-300 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]"
        >
          💖
        </motion.span>
      </div>

      <motion.div
        animate={{
          rotate: [0, -4, 0, 4, 0],
          x: [0, -3, 0, 3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_8px_20px_rgba(244,114,182,0.45)]"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Kitten Tail */}
          <motion.path
            d="M 90 85 Q 115 72 105 45 Q 98 35 102 25"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            animate={{ rotate: [-14, 14, -14] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '88px 85px' }}
          />

          {/* Kitten Body */}
          <ellipse cx="60" cy="84" rx="30" ry="22" fill="#ffffff" />
          {/* Soft Pink Inner Chest */}
          <ellipse cx="60" cy="85" rx="16" ry="13" fill="#fff0f5" />

          {/* Left Ear */}
          <motion.g
            animate={{ rotate: [-5, 6, -5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '35px 35px' }}
          >
            <path d="M 32 40 L 20 12 L 48 30 Z" fill="#ffffff" />
            <path d="M 34 37 L 25 18 L 45 29 Z" fill="#ffb6c1" opacity="0.85" />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{ rotate: [5, -6, 5] }}
            transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformOrigin: '85px 35px' }}
          >
            <path d="M 88 40 L 100 12 L 72 30 Z" fill="#ffffff" />
            <path d="M 86 37 L 95 18 L 75 29 Z" fill="#ffb6c1" opacity="0.85" />
          </motion.g>

          {/* Kitten Head */}
          <circle cx="60" cy="48" r="27" fill="#ffffff" />

          {/* Cute Pink Cheeks */}
          <circle cx="40" cy="54" r="5" fill="#ffb6c1" opacity="0.75" />
          <circle cx="80" cy="54" r="5" fill="#ffb6c1" opacity="0.75" />

          {/* Blinking Eyes */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1, 1, 1, 0.08, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '60px 47px' }}
          >
            {/* Left Eye */}
            <ellipse cx="45" cy="46" rx="4" ry="5" fill="#0f172a" />
            <circle cx="43.5" cy="44.5" r="1.5" fill="#ffffff" />
            {/* Right Eye */}
            <ellipse cx="75" cy="46" rx="4" ry="5" fill="#0f172a" />
            <circle cx="73.5" cy="44.5" r="1.5" fill="#ffffff" />
          </motion.g>

          {/* Tiny Pink Nose */}
          <polygon points="60,51 57,48 63,48" fill="#ff69b4" />
          {/* Mouth */}
          <path d="M 57 53 Q 60 56 63 53" fill="none" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="22" y1="49" x2="36" y2="51" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="55" x2="36" y2="54" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="98" y1="49" x2="84" y2="51" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="100" y1="55" x2="84" y2="54" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cute Paws resting on top edge */}
          <ellipse cx="44" cy="98" rx="8" ry="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <ellipse cx="76" cy="98" rx="8" ry="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          {/* Toe pads */}
          <circle cx="44" cy="99" r="2.5" fill="#ffb6c1" opacity="0.8" />
          <circle cx="76" cy="99" r="2.5" fill="#ffb6c1" opacity="0.8" />
        </svg>
      </motion.div>
    </div>
  );
};

// FLOATING BUTTERFLY COMPONENT
const FloatingButterfly: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: `${x}%`, y: `${y}%` }}
      animate={{
        x: [`${x}%`, `${x + 6}%`, `${x - 4}%`, `${x}%`],
        y: [`${y}%`, `${y - 12}%`, `${y - 6}%`, `${y}%`],
        opacity: [0.2, 0.7, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className="absolute pointer-events-none z-10 text-amber-300/60"
    >
      <motion.svg
        animate={{ scaleX: [1, 0.3, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
      >
        <path d="M12 12C10 6 3 4 3 9C3 13 8 13.5 12 12Z" />
        <path d="M12 12C14 6 21 4 21 9C21 13 16 13.5 12 12Z" />
        <path d="M12 12C10 16 5 18 5 20C5 21 8 21 12 12Z" />
        <path d="M12 12C14 16 19 18 19 20C19 21 16 21 12 12Z" />
      </motion.svg>
    </motion.div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onNextStep }) => {
  // TIME TOGETHER (6 UNITS: Years, Months, Days, Hours, Minutes, Seconds)
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // NEXT ANNIVERSARY COUNTDOWN (5 UNITS: Months, Days, Hours, Minutes, Seconds)
  const [anniversaryCountdown, setAnniversaryCountdown] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReached: false,
    progressPercent: 0,
    formattedTargetDate: '',
  });

  const confettiFiredRef = useRef(false);

  // Background Particles & Bokeh
  const particles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3.5 + 2,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 3,
    }));
  }, []);

  const floatingHearts = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 85 + 5,
      scale: Math.random() * 0.5 + 0.6,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 4,
    }));
  }, []);

  useEffect(() => {
    const calculateAllTimes = () => {
      const now = new Date();

      // ==========================================
      // 1. TIME TOGETHER CALCULATIONS (Exact 21 March 2025 • 11:20:43 AM)
      // ==========================================
      const rawStart = config.relationshipStartDate || '2025-03-21T11:20:43';
      let startDate: Date;
      if (rawStart.includes('T')) {
        startDate = new Date(rawStart);
      } else {
        startDate = new Date(`${rawStart}T11:20:43`);
      }

      if (isNaN(startDate.getTime())) {
        startDate = new Date(2025, 2, 21, 11, 20, 43); // 21 March 2025 11:20:43 AM
      }

      if (now >= startDate) {
        let cursor = new Date(startDate.getTime());
        let years = 0;
        while (true) {
          const nextYear = new Date(cursor.getTime());
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          if (nextYear <= now) {
            years++;
            cursor = nextYear;
          } else {
            break;
          }
        }

        let months = 0;
        while (true) {
          const nextMonth = new Date(cursor.getTime());
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          if (nextMonth <= now) {
            months++;
            cursor = nextMonth;
          } else {
            break;
          }
        }

        const remainingMs = Math.max(0, now.getTime() - cursor.getTime());
        const totalSecs = Math.floor(remainingMs / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setTimeTogether({
          years,
          months,
          days,
          hours,
          minutes,
          seconds,
        });
      } else {
        setTimeTogether({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      // ==========================================
      // 2. NEXT ANNIVERSARY COUNTDOWN (Dynamic target: 21 March 2027)
      // ==========================================
      const rawAnniv = config.anniversaryDate || '2027-03-21';
      const cleanAnnivStr = rawAnniv.split('T')[0];
      const parts = cleanAnnivStr.split('-').map((p) => parseInt(p, 10));

      let monthIdx = 2; // March (index 2)
      let dayNum = 21;
      if (parts.length >= 3 && !isNaN(parts[1]) && !isNaN(parts[2])) {
        monthIdx = parts[1] - 1;
        dayNum = parts[2];
      }

      const currentYear = now.getFullYear();
      let targetAnniversary = new Date(currentYear, monthIdx, dayNum, 0, 0, 0, 0);

      // If today is past this year's anniversary date (more than 24h past midnight), set target to next year
      if (now.getTime() >= targetAnniversary.getTime() + 86400000) {
        targetAnniversary = new Date(currentYear + 1, monthIdx, dayNum, 0, 0, 0, 0);
      }

      const formattedTargetDate = targetAnniversary.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Progress bar calculation from Start Date (21 March 2025) to Target Date (21 March 2027)
      const journeyStart = startDate.getTime();
      const journeyTarget = targetAnniversary.getTime();
      const totalSpan = journeyTarget - journeyStart;
      const elapsedSpan = now.getTime() - journeyStart;
      const progressPercent = Math.min(100, Math.max(0, (elapsedSpan / totalSpan) * 100));

      const annivDiffMs = targetAnniversary.getTime() - now.getTime();

      if (annivDiffMs <= 0 && annivDiffMs > -86400000) {
        setAnniversaryCountdown({
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isReached: true,
          progressPercent: 100,
          formattedTargetDate,
        });

        if (!confettiFiredRef.current) {
          confettiFiredRef.current = true;
          confetti({
            particleCount: 260,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#ec4899', '#ef4444', '#fcd34d', '#ffffff', '#e11d48'],
          });
        }
      } else {
        let cursor = new Date(now.getTime());
        let months = 0;

        while (true) {
          const nextMonth = new Date(cursor.getTime());
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          if (nextMonth <= targetAnniversary) {
            months++;
            cursor = nextMonth;
          } else {
            break;
          }
        }

        const remainingMs = Math.max(0, targetAnniversary.getTime() - cursor.getTime());
        const totalSecs = Math.floor(remainingMs / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setAnniversaryCountdown({
          months,
          days,
          hours,
          minutes,
          seconds,
          isReached: false,
          progressPercent,
          formattedTargetDate,
        });
      }
    };

    calculateAllTimes();
    const timer = setInterval(calculateAllTimes, 1000);
    return () => clearInterval(timer);
  }, [config.relationshipStartDate, config.anniversaryDate]);

  return (
    <section id="hero" className="relative pt-10 pb-20 px-4 text-center overflow-hidden bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center">
      {/* LUXURY BACKGROUND LIGHT RAYS & AMBIENT GLOWS */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-rose-950/40 via-amber-950/20 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-500/10 via-rose-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* FLOATING GOLD PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.2, y: `${p.y}%`, x: `${p.x}%` }}
            animate={{
              y: [`${p.y}%`, `${(p.y - 20 + 100) % 100}%`],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            style={{ width: p.size, height: p.size }}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]"
          />
        ))}

        {/* FLOATING SOFT HEARTS */}
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0.15, y: `${h.y}%`, x: `${h.x}%` }}
            animate={{
              y: [`${h.y}%`, `${(h.y - 25 + 100) % 100}%`],
              opacity: [0.15, 0.45, 0.15],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: h.delay,
            }}
            className="absolute text-rose-500/30 text-lg pointer-events-none"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            ❤️
          </motion.div>
        ))}

        {/* FLOATING BUTTERFLIES */}
        <FloatingButterfly x={12} y={25} delay={0} />
        <FloatingButterfly x={84} y={35} delay={2.5} />
        <FloatingButterfly x={75} y={75} delay={4.2} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* ======================================================== */}
        {/* TOP SECTION: TIME TOGETHER (6 UNITS)                     */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-300 drop-shadow-[0_4px_20px_rgba(244,114,182,0.3)] mb-3 flex items-center justify-center gap-3">
            <span>❤️</span>
            <span>Our Beautiful Journey</span>
            <span>❤️</span>
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-base font-semibold text-rose-200/90 tracking-wide mb-8">
            Together Since <span className="text-amber-300 font-mono font-bold">21 March 2025 • 11:20:43 AM</span>
          </p>

          {/* 6 Luxury Glass Timer Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Years', val: timeTogether.years },
              { label: 'Months', val: timeTogether.months },
              { label: 'Days', val: timeTogether.days },
              { label: 'Hours', val: timeTogether.hours },
              { label: 'Minutes', val: timeTogether.minutes },
              { label: 'Seconds', val: timeTogether.seconds },
            ].map((unit, idx) => {
              const valStr = String(unit.val).padStart(2, '0');
              return (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-amber-400/40 shadow-[0_10px_30px_rgba(244,114,182,0.15)] flex flex-col items-center justify-center relative overflow-hidden group/card ring-1 ring-white/10"
                >
                  {/* Top Gold Foil Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 opacity-80 group-hover/card:opacity-100 transition" />
                  
                  {/* Animated Number with Smooth Flip Transition */}
                  <div className="relative h-10 sm:h-12 flex items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={valStr}
                        initial={{ y: -20, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="inline-block font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 tracking-tight drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      >
                        {valStr}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Unit Label */}
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-rose-300/90 mt-1 font-mono">
                    {unit.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Subtext under timer */}
          <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-5 tracking-wide">
            💕 Every second with you is my favorite memory.
          </p>
        </motion.div>

        {/* ======================================================== */}
        {/* NEXT ANNIVERSARY COUNTDOWN CARD WITH CUTE KITTEN          */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto rounded-[36px] p-1 bg-gradient-to-tr from-amber-400 via-rose-500 via-pink-500 to-amber-300 shadow-[0_0_70px_rgba(245,158,11,0.25)] group select-none mt-12"
        >
          {/* Cute Animated Kitten sitting on the top edge */}
          <CuteKitten />

          <div className="bg-slate-950/95 backdrop-blur-3xl rounded-[32px] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-amber-400/20 pt-12 sm:pt-14">
            {/* Background Ambient Glows & Bokeh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-gradient-radial from-rose-500/20 via-amber-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

            {/* Countdown Title */}
            <div className="relative z-10 flex flex-col items-center justify-center mb-6">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-300 drop-shadow flex items-center justify-center gap-2">
                {anniversaryCountdown.isReached ? (
                  <>🎉 Happy Anniversary My Love ❤️</>
                ) : (
                  <>💖 Until Our Next Anniversary 💖</>
                )}
              </h3>

              <p className="text-xs sm:text-sm text-rose-200/90 font-medium max-w-md mx-auto mt-2 leading-relaxed tracking-wide">
                Every second brings us closer to another beautiful year together.
              </p>
            </div>

            {/* 5 Glass Countdown Cards */}
            {anniversaryCountdown.isReached ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center relative z-10"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  👑🥂💖
                </motion.div>
                <h4 className="text-3xl font-black text-amber-300 mb-2">
                  Happy Anniversary My Love!
                </h4>
                <p className="text-rose-200 text-sm max-w-md mx-auto font-medium leading-relaxed">
                  Thank you for being my soulmate, my best friend, and my greatest dream come true.
                </p>
              </motion.div>
            ) : (
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4 my-6">
                {[
                  { label: 'Months', val: anniversaryCountdown.months },
                  { label: 'Days', val: anniversaryCountdown.days },
                  { label: 'Hours', val: anniversaryCountdown.hours },
                  { label: 'Minutes', val: anniversaryCountdown.minutes },
                  { label: 'Seconds', val: anniversaryCountdown.seconds },
                ].map((unit, idx) => {
                  const valStr = String(unit.val).padStart(2, '0');
                  return (
                    <motion.div
                      key={unit.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center relative overflow-hidden group/card ring-1 ring-white/10"
                    >
                      {/* Top Gold Foil Accent Bar */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 opacity-80 group-hover/card:opacity-100 transition" />

                      {/* Smooth Flip Animated Digit */}
                      <div className="relative h-11 sm:h-14 flex items-center justify-center overflow-hidden w-full">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={valStr}
                            initial={{ y: -22, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 22, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="inline-block font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 tracking-tight drop-shadow-[0_0_14px_rgba(251,191,36,0.65)]"
                          >
                            {valStr}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      {/* Unit Label */}
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-rose-300/90 mt-2 font-mono">
                        {unit.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PROGRESS BAR SECTION */}
            <div className="mt-8 pt-6 border-t border-amber-400/20 relative z-10 flex flex-col items-center">
              <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                <span>❤️</span>
                <span>Our Love Journey Progress</span>
                <span>❤️</span>
              </div>

              {/* Target Date Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-rose-200 text-xs font-bold shadow-lg mb-4">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Next Anniversary Target:</span>
                <span className="text-amber-300 font-mono font-bold">
                  {anniversaryCountdown.formattedTargetDate || '21 March 2027'}
                </span>
              </div>

              {/* Glowing Progress Bar */}
              <div className="w-full max-w-lg mx-auto">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-rose-200/90 mb-2">
                  <span>Start: 21 Mar 2025</span>
                  <span className="text-amber-300 font-mono font-bold">
                    {anniversaryCountdown.progressPercent.toFixed(1)}%
                  </span>
                  <span>Target: 21 Mar 2027</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 border border-amber-400/30 p-0.5 overflow-hidden shadow-inner relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${anniversaryCountdown.progressPercent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 shadow-[0_0_15px_#f59e0b] relative"
                  >
                    {/* Animated Shimmer Line */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-pulse" />
                  </motion.div>
                </div>

                {/* Text Under Progress Bar */}
                <p className="text-xs font-bold text-rose-200/90 mt-3 tracking-wide">
                  Every heartbeat brings us closer to our special day ❤️
                </p>
              </div>

              {/* BUTTON BELOW COUNTDOWN */}
              {onNextStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <button
                    onClick={onNextStep}
                    className="relative group overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_35px_rgba(244,114,182,0.5)] border border-amber-300 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    {/* Ripple / Aura Glow Effect */}
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>❤️</span>
                      <span>Continue Our Journey</span>
                      <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
