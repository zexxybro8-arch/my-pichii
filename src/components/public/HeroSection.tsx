import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ArrowRight, Pause, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppConfig } from '../../types';
import {
  parseRelationshipStartDate,
  getCalendarTimeTogether,
  getCalendarAnniversaryCountdown,
  formatReadableDate,
  formatReadableTime,
} from '../../utils/dateUtils';
import { Tilt3DCard } from '../3d/Tilt3DCard';

interface HeroSectionProps {
  config: AppConfig;
  onNextStep?: () => void;
}

// CUTE ANIMATED KITTEN COMPONENT MATCHING THE USER'S IMAGE
const CuteKitten: React.FC<{ hasBow?: boolean; className?: string }> = ({ hasBow = true, className = '' }) => {
  return (
    <div className={`absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center ${className}`}>
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
          rotate: [0, -3, 0, 3, 0],
          y: [0, -2, 0, -1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-24 h-20 sm:w-28 sm:h-24 filter drop-shadow-[0_8px_25px_rgba(244,114,182,0.55)]"
      >
        <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible">
          {/* Kitten Tail */}
          <motion.path
            d="M 92 70 Q 118 60 110 35 Q 102 25 106 15"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            animate={{ rotate: [-12, 14, -12] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '90px 70px' }}
          />

          {/* Left Ear */}
          <motion.g
            animate={{ rotate: [-4, 6, -4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '35px 30px' }}
          >
            <path d="M 32 38 L 20 10 L 48 26 Z" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
            <path d="M 34 35 L 25 16 L 45 25 Z" fill="#ffb6c1" opacity="0.9" />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{ rotate: [4, -6, 4] }}
            transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformOrigin: '85px 30px' }}
          >
            <path d="M 88 38 L 100 10 L 72 26 Z" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
            <path d="M 86 35 L 95 16 L 75 25 Z" fill="#ffb6c1" opacity="0.9" />
          </motion.g>

          {/* Pink Bow on Ear */}
          {hasBow && (
            <g transform="translate(22, 12) scale(0.9)">
              <path d="M 6 0 C -2 -6 -6 6 0 8 C 4 9 7 4 8 0 Z" fill="#ec4899" />
              <path d="M 10 0 C 18 -6 22 6 16 8 C 12 9 9 4 8 0 Z" fill="#ec4899" />
              <circle cx="8" cy="1" r="3.5" fill="#f472b6" />
            </g>
          )}

          {/* Kitten Head */}
          <circle cx="60" cy="45" r="28" fill="#ffffff" />

          {/* Cute Pink Blush Cheeks */}
          <ellipse cx="39" cy="52" rx="5.5" ry="3.5" fill="#f472b6" opacity="0.7" />
          <ellipse cx="81" cy="52" rx="5.5" ry="3.5" fill="#f472b6" opacity="0.7" />

          {/* Eyes - Blinking Animation */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '60px 44px' }}
          >
            {/* Left Eye */}
            <ellipse cx="44" cy="43" rx="4.5" ry="5.5" fill="#1e1b4b" />
            <circle cx="42.5" cy="41" r="1.8" fill="#ffffff" />
            <circle cx="45.5" cy="45" r="0.9" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="76" cy="43" rx="4.5" ry="5.5" fill="#1e1b4b" />
            <circle cx="74.5" cy="41" r="1.8" fill="#ffffff" />
            <circle cx="77.5" cy="45" r="0.9" fill="#ffffff" />
          </motion.g>

          {/* Nose */}
          <polygon points="60,49 57.5,46.5 62.5,46.5" fill="#ec4899" />
          {/* Mouth */}
          <path d="M 57 51 Q 60 54 63 51" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="20" y1="46" x2="34" y2="48" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="18" y1="52" x2="34" y2="51" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="100" y1="46" x2="86" y2="48" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="102" y1="52" x2="86" y2="51" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />

          {/* Kitten Paws peeking over border */}
          <g transform="translate(0, -6)">
            <ellipse cx="42" cy="80" rx="9" ry="6.5" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
            <ellipse cx="78" cy="80" rx="9" ry="6.5" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
            <ellipse cx="42" cy="81" rx="4" ry="2.5" fill="#f472b6" opacity="0.8" />
            <ellipse cx="78" cy="81" rx="4" ry="2.5" fill="#f472b6" opacity="0.8" />
          </g>
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
        opacity: [0.2, 0.8, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className="absolute pointer-events-none z-10 text-amber-300/70"
    >
      <motion.svg
        animate={{ scaleX: [1, 0.3, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        viewBox="0 0 24 24"
        className="w-6 h-6 fill-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
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
  // Extract anniversary settings & dynamic config
  const annivSettings = config.anniversarySettings || {};
  
  const titleText = annivSettings.title || 'Hey';
  const girlfriendName = config.girlfriendName || 'Picchi';
  const subtitleText = annivSettings.subtitle || 'Welcome to Our Beautiful Journey of Love & Cute Memories 💕';
  const togetherSinceLabel = annivSettings.togetherSinceLabel || 'Together Since';
  const milestoneMessage = annivSettings.milestoneMessage || '💕 Every second with you is my favorite memory. 💕';
  const cardTitle = annivSettings.cardTitle || annivSettings.titleCountdownCard || 'Until Our Next Anniversary';
  const cardBadge = annivSettings.cardBadge || 'Next Anniversary';
  const milestoneReachedTitle = annivSettings.milestoneReachedTitle || 'Happy Anniversary My Love! 🎉';
  const milestoneReachedMessage = annivSettings.milestoneReachedMessage || 'Thank you for being my soulmate, my best friend, and my greatest dream come true.';
  const progressTitle = annivSettings.progressTitle || 'Our Love Journey Progress';
  const progressSubtitle = annivSettings.progressSubtitle || 'Every heartbeat brings us closer to our special day 💕';
  const buttonText = annivSettings.buttonText || 'Continue Our Journey';

  // Unit Labels
  const labelYears = annivSettings.customLabelYears || 'YEARS';
  const labelMonths = annivSettings.customLabelMonths || 'MONTHS';
  const labelDays = annivSettings.customLabelDays || 'DAYS';
  const labelHours = annivSettings.customLabelHours || 'HOURS';
  const labelMinutes = annivSettings.customLabelMinutes || 'MINUTES';
  const labelSeconds = annivSettings.customLabelSeconds || 'SECONDS';

  // Emojis
  const emojiYears = annivSettings.emojiYears || '👑';
  const emojiMonths = annivSettings.emojiMonths || '🤍';
  const emojiDays = annivSettings.emojiDays || '⭐';
  const emojiHours = annivSettings.emojiHours || '🕐';
  const emojiMinutes = annivSettings.emojiMinutes || '⏱️';
  const emojiSeconds = annivSettings.emojiSeconds || '✨';
  const emojiCountdownCard = annivSettings.emojiCountdownCard || '💖';
  const emojiGreetingHeart = annivSettings.emojiGreetingHeart || '❤️';
  const emojiMainHeader = annivSettings.emojiMainHeader || '✨';
  const emojiButton = annivSettings.emojiButton || '💖';

  // Date Strings
  const rawStartDate = annivSettings.relationshipStartDate || config.relationshipStartDate || '2025-03-21T11:20:43';
  const rawTargetDate = annivSettings.countdownTargetDate || annivSettings.anniversaryDate || config.anniversaryDate || '2027-03-21T11:20:43';

  // Pause / Resume States
  const isPaused = annivSettings.isPaused || false;
  const pausedAt = annivSettings.pausedAt;
  const pausedRemainingSeconds = annivSettings.pausedRemainingSeconds;

  // TIME TOGETHER (6 UNITS: Years, Months, Days, Hours, Minutes, Seconds)
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // NEXT ANNIVERSARY COUNTDOWN (6 UNITS: Years, Months, Days, Hours, Minutes, Seconds)
  const [anniversaryCountdown, setAnniversaryCountdown] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReached: false,
    progressPercent: 0,
    formattedTargetDate: '',
    isPaused: false,
  });

  const confettiFiredRef = useRef(false);

  // Background Particles & Bokeh
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3.5 + 2,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 3,
    }));
  }, []);

  const floatingHearts = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
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

      // 1. Calendar-accurate time together
      const timeData = getCalendarTimeTogether(rawStartDate, now, isPaused, pausedAt);
      setTimeTogether(timeData);

      // 2. Calendar-accurate next anniversary countdown
      const countdownData = getCalendarAnniversaryCountdown(
        rawStartDate,
        rawTargetDate,
        now,
        isPaused,
        pausedAt,
        pausedRemainingSeconds
      );

      setAnniversaryCountdown({
        years: countdownData.years,
        months: countdownData.months,
        days: countdownData.days,
        hours: countdownData.hours,
        minutes: countdownData.minutes,
        seconds: countdownData.seconds,
        isReached: countdownData.isReached,
        progressPercent: countdownData.progressPercent,
        formattedTargetDate: countdownData.formattedTargetDate,
        isPaused: countdownData.isPaused,
      });

      if (countdownData.isReached && !confettiFiredRef.current) {
        confettiFiredRef.current = true;
        confetti({
          particleCount: 260,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ec4899', '#ef4444', '#fcd34d', '#ffffff', '#e11d48'],
        });
      }
    };

    calculateAllTimes();
    const timer = setInterval(calculateAllTimes, 1000);
    return () => clearInterval(timer);
  }, [rawStartDate, rawTargetDate, isPaused, pausedAt, pausedRemainingSeconds]);

  return (
    <section id="hero" className="relative pt-16 pb-20 px-4 text-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* LUXURY BACKGROUND LIGHT RAYS & AMBIENT GLOWS */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-rose-950/50 via-amber-950/20 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-rose-500/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* FLOATING GOLD PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.2, y: `${p.y}%`, x: `${p.x}%` }}
            animate={{
              y: [`${p.y}%`, `${(p.y - 20 + 100) % 100}%`],
              opacity: [0.2, 0.85, 0.2],
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
            initial={{ opacity: 0.2, y: `${h.y}%`, x: `${h.x}%` }}
            animate={{
              y: [`${h.y}%`, `${(h.y - 25 + 100) % 100}%`],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: h.delay,
            }}
            className="absolute text-rose-400/40 text-lg sm:text-xl pointer-events-none drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            ❤️
          </motion.div>
        ))}

        {/* FLOATING BUTTERFLIES */}
        <FloatingButterfly x={8} y={18} delay={0} />
        <FloatingButterfly x={88} y={28} delay={2.5} />
        <FloatingButterfly x={82} y={78} delay={4.2} />
        <FloatingButterfly x={10} y={82} delay={1.5} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* ======================================================== */}
        {/* TOP HEADER CARD WITH CUTE KITTEN ON TOP                   */}
        {/* ======================================================== */}
        <div className="relative max-w-2xl mx-auto mb-10 mt-6 z-20">
          <CuteKitten hasBow={true} />
          
          <Tilt3DCard maxTilt={8} className="p-6 sm:p-8 border-rose-500/40 shadow-[0_0_50px_rgba(244,114,182,0.3)]">
            {/* Glow background inside card */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 pointer-events-none" />
            
            <h1 className="font-cute text-[48px] sm:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300 mb-5 relative z-30 leading-tight text-center flex items-center justify-center gap-3 flex-wrap drop-shadow-[0_6px_25px_rgba(255,94,126,0.45)]">
              <span>{titleText}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300 hover:scale-105 transition-transform inline-block">
                {girlfriendName}
              </span>
              <span className="text-pink-500 inline-block animate-bounce">{emojiGreetingHeart}</span>
              <span className="text-pink-400 inline-block text-2xl sm:text-4xl animate-pulse">{emojiMainHeader}</span>
            </h1>

            <p className="text-base sm:text-xl text-rose-200 font-bold max-w-md mx-auto mb-6 leading-relaxed relative z-20 font-serif italic">
              {subtitleText}
            </p>

            <div className="flex items-center justify-center gap-2 text-rose-300/90 font-bold text-xs sm:text-sm tracking-widest uppercase mb-3">
              <span>💕</span>
              <span>{togetherSinceLabel}</span>
              <span>💕</span>
            </div>

            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/90 border border-amber-400/50 text-amber-300 font-mono text-xs sm:text-sm font-bold shadow-lg">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{formatReadableDate(rawStartDate)}</span>
              <span className="text-rose-400">•</span>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatReadableTime(rawStartDate)}</span>
            </div>
          </Tilt3DCard>
        </div>

        {/* ======================================================== */}
        {/* RELATIONSHIP TIMER CARDS (3x2 GRID WITH 3D SPATIAL TILT) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-5 z-20">
          {[
            { label: labelYears, val: timeTogether.years, icon: emojiYears },
            { label: labelMonths, val: timeTogether.months, icon: emojiMonths },
            { label: labelDays, val: timeTogether.days, icon: emojiDays },
            { label: labelHours, val: timeTogether.hours, icon: emojiHours },
            { label: labelMinutes, val: timeTogether.minutes, icon: emojiMinutes },
            { label: labelSeconds, val: timeTogether.seconds, icon: emojiSeconds },
          ].map((unit, idx) => {
            const valStr = String(unit.val).padStart(2, '0');
            return (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Tilt3DCard maxTilt={15} scaleOnHover={1.05} className="p-3.5 sm:p-5 flex flex-col items-center justify-center border-rose-500/40">
                  {/* Top Gold Foil Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 opacity-80" />
                  
                  {/* Top Icon */}
                  <div className="text-base sm:text-lg mb-0.5 filter drop-shadow">
                    {unit.icon}
                  </div>

                  {/* Animated Number with Smooth Flip Transition */}
                  <div className="relative h-9 sm:h-12 flex items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={valStr}
                        initial={{ y: -18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 18, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="inline-block font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-100 via-rose-200 to-amber-200 tracking-tight drop-shadow-[0_0_14px_rgba(244,114,182,0.6)]"
                      >
                        {valStr}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Unit Label */}
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-rose-300/90 font-mono mt-0.5">
                    {unit.label}
                  </span>
                </Tilt3DCard>
              </motion.div>
            );
          })}
        </div>

        {/* Subtext under timer */}
        <p className="text-xs sm:text-sm font-bold text-rose-200/90 mb-14 tracking-wide">
          {milestoneMessage}
        </p>

        {/* ======================================================== */}
        {/* NEXT ANNIVERSARY CARD WITH KITTEN ON TOP                  */}
        {/* ======================================================== */}
        <div className="relative max-w-3xl mx-auto mt-16">
          <CuteKitten hasBow={false} />
          
          <div className="bg-slate-950/95 backdrop-blur-3xl rounded-[36px] p-6 sm:p-10 border border-rose-500/50 shadow-[0_0_65px_rgba(244,114,182,0.35)] relative overflow-hidden">
            {/* Inner Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent pointer-events-none" />

            {/* Paused Badge Banner */}
            {isPaused && (
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 font-mono text-xs font-bold animate-pulse">
                <Pause className="w-3.5 h-3.5 fill-amber-300" />
                <span>TIMER PAUSED (ADMIN OVERRIDE)</span>
              </div>
            )}

            {/* COUNTDOWN CARDS SECTION HEADER */}
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 drop-shadow flex items-center justify-center gap-3 font-serif mb-8">
              <span>{emojiCountdownCard}</span>
              <span>{cardTitle}</span>
              <span>{emojiCountdownCard}</span>
            </h3>

            {/* MILESTONE REACHED BADGE */}
            {anniversaryCountdown.isReached && (
              <div className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/60 text-amber-200 font-bold text-xs sm:text-sm animate-pulse shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🎉 Anniversary Milestone Reached! ❤️</span>
              </div>
            )}

            {/* 6 COUNTDOWN CARDS WITH COLONS IN BETWEEN */}
            <div className="flex items-center justify-center gap-1 sm:gap-2.5 my-6 max-w-3xl mx-auto">
              {[
                { label: labelYears, val: anniversaryCountdown.years },
                { label: labelMonths, val: anniversaryCountdown.months },
                { label: labelDays, val: anniversaryCountdown.days },
                { label: labelHours, val: anniversaryCountdown.hours },
                { label: labelMinutes, val: anniversaryCountdown.minutes },
                { label: labelSeconds, val: anniversaryCountdown.seconds },
              ].map((unit, idx, arr) => {
                const valStr = String(unit.val).padStart(2, '0');
                const Icon = idx < 3 ? Calendar : Clock;
                return (
                  <React.Fragment key={unit.label}>
                    <div className="flex-1 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 sm:p-4 border border-rose-400/40 shadow-[0_4px_20px_rgba(244,114,182,0.2)] flex flex-col items-center justify-center relative group/card min-w-0">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mb-1 shrink-0" />
                      <div className="relative h-8 sm:h-12 flex items-center justify-center overflow-hidden w-full">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={valStr}
                            initial={{ y: -18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 18, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="font-mono text-xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-100 via-rose-200 to-amber-200"
                          >
                            {valStr}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <span className="text-[8px] sm:text-[11px] font-bold tracking-widest text-rose-300/80 font-mono mt-0.5 truncate max-w-full">
                        {unit.label}
                      </span>
                    </div>

                    {/* Glowing Colon Separator */}
                    {idx < arr.length - 1 && (
                      <span className="text-rose-400 text-sm sm:text-2xl font-black animate-pulse px-0.5 shrink-0">
                        :
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 border border-amber-400/50 text-amber-300 font-mono text-xs sm:text-sm font-bold shadow-lg my-4">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{cardBadge}: {anniversaryCountdown.formattedTargetDate || formatReadableDate(rawTargetDate)}</span>
            </div>

            {/* Progress Bar Header */}
            <div className="flex items-center justify-center gap-2 text-rose-300 text-xs sm:text-sm font-bold tracking-widest uppercase mt-6 mb-3">
              <span>✦</span>
              <span>💕 {progressTitle} 💕</span>
              <span>✦</span>
            </div>

            {/* Progress Bar with Floating Heart and % on the right */}
            <div className="w-full max-w-lg mx-auto flex items-center gap-3">
              <div className="flex-1 h-3.5 rounded-full bg-slate-950 border border-rose-400/40 p-0.5 overflow-visible relative shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${anniversaryCountdown.progressPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 relative"
                >
                  {/* Floating Heart Indicator at current position */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-sm filter drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]">
                    💖
                  </div>
                </motion.div>
              </div>

              <span className="text-amber-300 font-mono font-black text-xs sm:text-sm">
                {anniversaryCountdown.progressPercent.toFixed(1)}%
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-rose-200/90 mt-4 tracking-wide">
              {progressSubtitle}
            </p>

            {/* Continue Button */}
            {onNextStep && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={onNextStep}
                  className="relative group overflow-hidden px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(244,114,182,0.55)] border border-rose-300/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3"
                >
                  <span className="text-base">{emojiButton}</span>
                  <span>{buttonText}</span>
                  <span className="text-base">{emojiButton}</span>
                  <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
