import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Heart,
  Sparkles,
  RotateCcw,
  Calendar,
  Clock,
} from 'lucide-react';
import { FinalCelebrationConfig } from '../../types';
import { parseRelationshipStartDate, getCalendarTimeTogether } from '../../utils/dateUtils';
import { Tilt3DCard } from '../3d/Tilt3DCard';

interface FinalCelebrationSectionProps {
  config: FinalCelebrationConfig;
  girlfriendName: string;
  relationshipStartDate?: string;
  onRestart?: () => void;
}

// Web Audio API Chime / Romantic Piano Fanfare Effect
const playRomanticChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C4, E4, G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });
  } catch {
    // Ignore audio context restrictions
  }
};

const playSparkleSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Ignore audio context restrictions
  }
};

// Animated Number Counter Hook with smooth cubic easing
const useAnimatedCounter = (targetValue: number, duration: number = 2000) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const isInitialMount = useRef<boolean>(true);
  const lastTarget = useRef<number>(targetValue);

  useEffect(() => {
    if (isInitialMount.current) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(easeProgress * targetValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          isInitialMount.current = false;
          lastTarget.current = targetValue;
        }
      };
      window.requestAnimationFrame(step);
    } else {
      if (lastTarget.current !== targetValue) {
        lastTarget.current = targetValue;
        setDisplayValue(targetValue);
      }
    }
  }, [targetValue, duration]);

  return displayValue;
};

export const FinalCelebrationSection: React.FC<FinalCelebrationSectionProps> = ({
  config,
  girlfriendName,
  relationshipStartDate,
  onRestart,
}) => {
  const [celebrated, setCelebrated] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);
  const [handwritingComplete, setHandwritingComplete] = useState<boolean>(false);
  const [typedMessageCount, setTypedMessageCount] = useState<number>(0);

  // Live real-time current timestamp updated dynamically using setInterval() every 1 second
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const relationshipStart = useMemo(() => {
    return parseRelationshipStartDate(relationshipStartDate);
  }, [relationshipStartDate]);

  const { yearsVal, monthsVal, daysVal, hoursVal } = useMemo(() => {
    const current = new Date(nowMs);
    const timeData = getCalendarTimeTogether(relationshipStart, current);

    // Total days and total hours elapsed for summary statistics
    const totalDiffMs = Math.max(0, current.getTime() - relationshipStart.getTime());
    const totalDays = Math.floor(totalDiffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalDiffMs / (1000 * 60 * 60));

    // Total completed months
    const totalMonths = timeData.years * 12 + timeData.months;

    const customY = config.yearsValue !== undefined && config.yearsValue !== null ? Number(config.yearsValue) : NaN;
    const customM = config.monthsValue !== undefined && config.monthsValue !== null ? Number(config.monthsValue) : NaN;
    const customD = config.daysValue !== undefined && config.daysValue !== null ? Number(config.daysValue) : NaN;
    const customH = config.hoursValue !== undefined && config.hoursValue !== null ? Number(config.hoursValue) : NaN;

    return {
      yearsVal: !isNaN(customY) ? customY : timeData.years,
      monthsVal: !isNaN(customM) ? customM : totalMonths,
      daysVal: !isNaN(customD) ? customD : totalDays,
      hoursVal: !isNaN(customH) ? customH : totalHours,
    };
  }, [nowMs, relationshipStart, config.yearsValue, config.monthsValue, config.daysValue, config.hoursValue]);

  // Animated Counter Values from 0 to target
  const animatedYears = useAnimatedCounter(yearsVal, 1800);
  const animatedMonths = useAnimatedCounter(monthsVal, 2000);
  const animatedDays = useAnimatedCounter(daysVal, 2400);
  const animatedHours = useAnimatedCounter(hoursVal, 2800);

  // Background Particles
  const backgroundElements = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 10,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 4,
      symbol: i % 4 === 0 ? '🌸' : i % 4 === 1 ? '🦋' : i % 4 === 2 ? '💖' : '✨',
    }));
  }, []);

  // Bokeh lights
  const bokehLights = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 3,
    }));
  }, []);

  const endingLine1 = config.endingLine1 ?? "Thank you for being the most beautiful part of my life.";
  const endingLine2 = config.endingLine2 ?? "I Love You Forever ❤️";
  const yearsLabel = config.yearsLabel || "Years Together";
  const monthsLabel = config.monthsLabel || "Months Together";
  const daysLabel = config.daysLabel || "Days Together";
  const hoursLabel = config.hoursLabel || "Hours Together";
  const replayButtonText = config.replayButtonText || "Replay Journey";
  const footerText = config.footerText || "Made with endless love";

  // Handwriting Animation Effect for Ending
  useEffect(() => {
    const totalChars = endingLine1.length + endingLine2.length;
    if (typedMessageCount < totalChars) {
      const timer = setTimeout(() => {
        setTypedMessageCount((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timer);
    } else {
      setHandwritingComplete(true);
    }
  }, [typedMessageCount, endingLine1, endingLine2]);

  // Initial Celebration Effect on Mount
  useEffect(() => {
    if (config.enableSoundEffects !== false) {
      playRomanticChime();
    }

    if (config.enableConfetti !== false) {
      // Small initial sparkle burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ff7ba9', '#ffd76a', '#ffffff', '#ffdce8'],
      });
    }

    // Auto launch grand romantic celebration after 3 seconds
    const timer = setTimeout(() => {
      triggerFireworks();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const triggerFireworks = () => {
    setCelebrated(true);
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 800);

    if (config.enableSoundEffects !== false) {
      playSparkleSound();
    }

    if (config.enableConfetti === false && config.enableFireworks === false) {
      return;
    }

    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;

    // Multi-stage confetti & heart rain sequence
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 60 * (timeLeft / duration);

      if (config.enableFireworks !== false) {
        // Fireworks left and right
        confetti({
          particleCount,
          startVelocity: 35,
          spread: 360,
          origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() * 0.5 + 0.1 },
          colors: ['#ff7ba9', '#ffd76a', '#e0aaff', '#ffffff', '#e11d48'],
        });

        confetti({
          particleCount,
          startVelocity: 35,
          spread: 360,
          origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() * 0.5 + 0.1 },
          colors: ['#ff7ba9', '#ffd76a', '#ffb3c6', '#ffffff', '#e11d48'],
        });
      }
    }, 300);
  };

  return (
    <section
      id="celebration"
      className="py-16 px-4 max-w-4xl mx-auto text-center relative overflow-hidden select-none min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFDCE8] to-[#EBDCFF]"
    >
      {/* Import custom display fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .font-serif-cute { font-family: 'Playfair Display', Georgia, serif; }
        .font-handwriting { font-family: 'Caveat', cursive; }
      `}</style>

      {/* Soft Romantic Frame Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_90px_rgba(255,182,193,0.4)]" />

      {/* Top Light Rays & Aurora Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#FFF8F0]/90 via-[#FFD6C2]/40 to-transparent blur-3xl pointer-events-none z-10" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Animated Bokeh Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {bokehLights.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
              x: [`${b.x}%`, `${b.x + (Math.random() * 6 - 3)}%`],
              y: [`${b.y}%`, `${b.y + (Math.random() * 6 - 3)}%`],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: b.delay,
            }}
            style={{ width: b.size, height: b.size }}
            className="absolute rounded-full bg-gradient-to-tr from-[#FF7BA9]/20 via-[#FFD76A]/20 to-white/40 blur-xl"
          />
        ))}
      </div>

      {/* Floating Sakura, Butterflies, Hearts & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        {backgroundElements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ y: `${el.y}%`, x: `${el.x}%`, opacity: 0, rotate: 0 }}
            animate={{
              y: [`${el.y}%`, `${(el.y - 30 + 100) % 100}%`],
              x: [`${el.x}%`, `${(el.x + 8 * (el.id % 2 === 0 ? 1 : -1))}%`],
              opacity: [0.3, 0.9, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: el.delay,
            }}
            style={{ fontSize: el.size }}
            className="absolute drop-shadow-[0_0_10px_rgba(255,182,193,0.8)]"
          >
            {el.symbol}
          </motion.div>
        ))}
      </div>

      {/* 3D FLOATING LUXURY GLASSMORPHISM CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [-8, 8, -8],
          rotateX: [0, 1.5, -1.5, 0],
          rotateY: [0, -1.5, 1.5, 0],
        }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          scale: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="w-full max-w-2xl bg-white/80 dark:bg-white/90 backdrop-blur-2xl rounded-[30px] p-8 sm:p-12 border-2 border-[#FFD76A] shadow-[0_25px_70px_rgba(255,123,169,0.35)] relative z-20 overflow-hidden text-center [transform-style:preserve-3d]"
      >
        {/* Animated Shimmer Light Reflection Sweep */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 pointer-events-none z-10"
        />

        {/* TOP ICON: 3D CRYSTAL HEART TROPHY */}
        <div className="relative mb-6 inline-block group">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border-2 border-dashed border-[#FFD76A]/80 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl bg-gradient-to-tr from-[#FF7BA9] via-[#FFD76A] to-[#FFD6C2] p-1 shadow-[0_12px_35px_rgba(255,123,169,0.45)] border-2 border-white flex items-center justify-center relative group-hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <Trophy className="w-11 h-11 sm:w-13 sm:h-13 text-[#E11D48] drop-shadow-md animate-bounce" />
              <Sparkles className="w-5 h-5 text-[#FFD76A] absolute top-1.5 right-1.5 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* LUXURY TITLE */}
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight font-serif-cute bg-gradient-to-r from-[#FF7BA9] via-[#E11D48] to-[#D97706] bg-clip-text text-transparent drop-shadow-sm">
          {config.title || 'Forever & Always ❤️'}
        </h2>

        <p className="text-base sm:text-lg text-[#9E3B5E] font-extrabold mb-6 max-w-lg mx-auto">
          {config.subtitle || `Happy Love Life, My Dearest ${girlfriendName}! ✨`}
        </p>

        <p className="text-sm sm:text-base text-slate-700 font-semibold leading-relaxed max-w-xl mx-auto mb-8 whitespace-pre-line bg-[#FFDCE8]/40 p-4 rounded-2xl border border-[#FF7BA9]/20 shadow-inner">
          {config.message}
        </p>

        {/* LOVE COUNTER HEADER & GRID */}
        {config.counterTitle && (
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#9E3B5E] mb-3 text-center">
            {config.counterTitle}
          </h3>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10 text-left">
          {/* 1. Years Together */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] border border-[#FFD76A]/60 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-[#E11D48] mb-1 fill-[#E11D48]/20 animate-pulse" />
            <span className="text-xl sm:text-2xl font-black text-[#7A2846]">
              {animatedYears.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#9E3B5E] uppercase tracking-wider">
              {yearsLabel}
            </span>
          </div>

          {/* 2. Months Together */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] border border-[#FFD76A]/60 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#FF7BA9] mb-1" />
            <span className="text-xl sm:text-2xl font-black text-[#7A2846]">
              {animatedMonths.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#9E3B5E] uppercase tracking-wider">
              {monthsLabel}
            </span>
          </div>

          {/* 3. Days Together */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] border border-[#FFD76A]/60 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 text-[#D97706] mb-1" />
            <span className="text-xl sm:text-2xl font-black text-[#7A2846]">
              {animatedDays.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#9E3B5E] uppercase tracking-wider">
              {daysLabel}
            </span>
          </div>

          {/* 4. Hours Together */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] border border-[#FFD76A]/60 shadow-sm flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Clock className="w-5 h-5 text-[#E11D48] mb-1" />
            <span className="text-xl sm:text-2xl font-black text-[#7A2846]">
              {animatedHours.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#9E3B5E] uppercase tracking-wider">
              {hoursLabel}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 relative z-20">
          <motion.button
            whileHover={{ scale: 1.06, shadow: '0 12px 35px rgba(255,123,169,0.55)' }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerFireworks}
            className="relative w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#FF7BA9] via-[#FF8DA1] to-[#FFD6C2] text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-3 border-2 border-white cursor-pointer ring-4 ring-[#FFDCE8]"
          >
            {/* Ripple Ring Effect on Click */}
            {isRippling && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full bg-white/50 pointer-events-none"
              />
            )}
            <Sparkles className="w-5 h-5 text-[#FFD76A] animate-spin" />
            <span>{config.buttonText || 'Celebrate Our Love ❤️'}</span>
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </motion.button>

          {onRestart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/80 hover:bg-white text-[#7A2846] font-extrabold text-sm backdrop-blur-md border-2 border-[#FF7BA9]/40 hover:border-[#FF7BA9] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-[#E11D48]" />
              <span>{replayButtonText}</span>
            </motion.button>
          )}
        </div>

        {/* HANDWRITING ENDING ANIMATION */}
        <div className="pt-6 border-t border-[#FFD6C2]/80 font-handwriting text-2xl sm:text-3xl text-[#7A2846] leading-relaxed min-h-[90px] flex flex-col items-center justify-center">
          <p className="mb-1 font-bold">
            {endingLine1.substring(0, Math.min(typedMessageCount, endingLine1.length))}
          </p>
          {typedMessageCount > endingLine1.length && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-extrabold text-[#E11D48] text-3xl sm:text-4xl mt-1 tracking-wide"
            >
              {endingLine2.substring(0, typedMessageCount - endingLine1.length)}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* BOTTOM FOOTER BRANDING */}
      <div className="mt-8 relative z-20 flex items-center justify-center gap-2 text-xs font-extrabold text-[#9E3B5E] tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
        <span>{footerText}</span>
        <Heart className="w-4 h-4 text-[#E11D48] fill-[#E11D48] animate-ping" />
        <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
      </div>
    </section>
  );
};
