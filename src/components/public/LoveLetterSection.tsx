import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Feather,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { LoveLetterConfig } from '../../types';

interface LoveLetterSectionProps {
  config: LoveLetterConfig;
  onNextStep?: () => void;
}

// Web Audio API Sound Effects
const playPaperOpenSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Ignore audio context restrictions
  }
};

const playSealBreakSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore audio context restrictions
  }
};

const playInkSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = 380 + Math.random() * 220;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio context restrictions
  }
};

const playChimeSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch {
    // Ignore audio context restrictions
  }
};

// Sakura Petal Component
const SakuraPetal: React.FC<{ x: number; delay: number; duration: number }> = ({
  x,
  delay,
  duration,
}) => {
  return (
    <motion.div
      initial={{ y: -20, x: `${x}%`, opacity: 0, rotate: 0 }}
      animate={{
        y: ['0vh', '100vh'],
        x: [`${x}%`, `${x + (Math.random() * 12 - 6)}%`],
        opacity: [0, 0.8, 0.8, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
      className="absolute top-0 pointer-events-none z-20 text-pink-300/70"
    >
      <svg viewBox="0 0 30 30" className="w-5 h-5 fill-pink-300 drop-shadow-[0_0_8px_rgba(255,182,193,0.7)]">
        <path d="M15 0 C20 10, 30 12, 25 22 C20 30, 10 30, 5 22 C0 12, 10 10, 15 0 Z" />
      </svg>
    </motion.div>
  );
};

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({ config, onNextStep }) => {
  const fullTitle = config.title || 'My Dearest Love,';
  const fullContent =
    config.content ||
    `From the moment you entered my life, everything became infinitely warmer, brighter, and more beautiful.\n\nEvery day with you feels like a sweet dream I never want to wake up from. Thank you for your kindness, your soft laughter, and the endless joy you bring into my world.\n\nYou hold my heart today, tomorrow, and forever.`;
  const fullSignature = config.authorSignature || 'Yours Forever ❤️';

  // Always reset on every visit / refresh
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSealBroken, setIsSealBroken] = useState<boolean>(false);
  const [isFlapOpen, setIsFlapOpen] = useState<boolean>(false);
  const [isLetterOut, setIsLetterOut] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [typedCharsCount, setTypedCharsCount] = useState<number>(0);

  // 3D Mouse Tilt relative state
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear legacy storage on mount
  useEffect(() => {
    try {
      localStorage.removeItem('romantic_surprise_love_letter_read');
    } catch {
      // Ignore error
    }
  }, []);

  // Generate Sakura Petals & Floating Sparkles
  const sakuraPetals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 6,
    }));
  }, []);

  const totalLength = fullContent.length;

  // Typewriting effect logic
  useEffect(() => {
    if (isWriting && !isPaused && typedCharsCount < totalLength) {
      timerRef.current = setTimeout(() => {
        setTypedCharsCount((prev) => prev + 1);

        // Play subtle ink sound every few characters
        if (typedCharsCount % 4 === 0) {
          playInkSound();
        }
      }, 36);
    } else if (isWriting && typedCharsCount >= totalLength) {
      // Writing finished!
      setIsWriting(false);
      setIsCompleted(true);
      playChimeSound();

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff7ba9', '#ffd76a', '#ffdce8', '#ffffff', '#e11d48'],
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isWriting, isPaused, typedCharsCount, totalLength]);

  // Handle 3D Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rx: -(y / rect.height) * 12,
      ry: (x / rect.width) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleOpenEnvelope = () => {
    if (isOpen) return;

    // Phase 1: Break 3D Wax Seal
    playSealBreakSound();
    setIsSealBroken(true);

    // Phase 2: Open Flap with 3D Flip
    setTimeout(() => {
      playPaperOpenSound();
      setIsFlapOpen(true);
    }, 400);

    // Phase 3: Letter slides out & unrolls
    setTimeout(() => {
      setIsOpen(true);
      setIsLetterOut(true);
    }, 900);

    // Phase 4: Start Handwriting
    setTimeout(() => {
      setIsWriting(true);
      setTypedCharsCount(0);
    }, 1600);
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsWriting(false);
    setIsPaused(false);
    setTypedCharsCount(totalLength);
    setIsCompleted(true);
    playChimeSound();

    confetti({
      particleCount: 110,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff7ba9', '#ffd76a', '#ffdce8', '#ffffff', '#e11d48'],
    });
  };

  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
    setIsSealBroken(false);
    setIsFlapOpen(false);
    setIsLetterOut(false);
    setIsWriting(false);
    setIsPaused(false);
    setTypedCharsCount(0);
    setIsCompleted(false);
  };

  return (
    <section id="letter" className="py-16 px-4 max-w-4xl mx-auto text-center relative overflow-hidden select-none">
      {/* Dynamic Font Styling Imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-dancing { font-family: 'Dancing Script', cursive; }
        .font-greatvibes { font-family: 'Great Vibes', cursive; }
        .font-serif-cute { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      {/* Background Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {sakuraPetals.map((p) => (
          <SakuraPetal key={p.id} x={p.x} delay={p.delay} duration={p.duration} />
        ))}
      </div>

      {/* Section Header */}
      <div className="mb-8 relative z-20">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#7A2846] tracking-tight font-serif-cute drop-shadow-sm">
          A Special Love Letter 💌
        </h2>
        <p className="text-sm sm:text-base text-[#9E3B5E] mt-2 max-w-lg mx-auto font-semibold">
          Tap the wax-sealed 3D envelope to reveal a handwritten message!
        </p>
      </div>

      {/* MAIN INTERACTIVE AREA WITH 3D PERSPECTIVE */}
      <div className="relative z-20 max-w-2xl mx-auto min-h-[500px] flex flex-col items-center justify-center [perspective:1200px]">
        {!isOpen ? (
          /* ======================================================== */
          /* REALISTIC 3D LUXURY ENVELOPE WITH WAX SEAL               */
          /* ======================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: isSealBroken ? 1.05 : 1,
              y: isSealBroken ? 0 : [-6, 6, -6],
              rotateX: tilt.rx,
              rotateY: tilt.ry,
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.4 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              rotateX: { duration: 0.2, ease: 'easeOut' },
              rotateY: { duration: 0.2, ease: 'easeOut' },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleOpenEnvelope}
            className="w-full max-w-lg cursor-pointer group relative select-none [transform-style:preserve-3d]"
          >
            {/* Outer Glow Ambient Light */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF7BA9]/30 via-[#FFD6C2]/40 to-[#FFD76A]/30 rounded-[40px] blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Main Envelope Body */}
            <div className="relative bg-gradient-to-br from-[#FFF8F0] via-[#FFF0F5] to-[#FFDCE8] rounded-[32px] p-8 sm:p-12 border-2 border-[#FFD76A] shadow-[0_25px_60px_rgba(255,123,169,0.35)] overflow-hidden text-center transition-all duration-300 group-hover:shadow-[0_30px_70px_rgba(255,123,169,0.5)]">
              
              {/* Gold Ribbon / Edge Trims */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#FFD76A] via-white to-[#FFD76A] opacity-90" />
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#FFD76A] via-white to-[#FFD76A] opacity-90" />

              {/* Envelope Triangular Flap Fold Overlays */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

              {/* Top Flap with 3D Flip Rotation */}
              <motion.div
                animate={{
                  rotateX: isFlapOpen ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#FFF0F5] to-[#FFDCE8] border-b-2 border-[#FFD76A]/80 shadow-md pointer-events-none z-10"
              />

              {/* Letter Sliding Out Preview */}
              <AnimatePresence>
                {isFlapOpen && (
                  <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: -80, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute top-4 left-6 right-6 h-40 bg-[#FFFDF7] rounded-2xl border-2 border-[#FFD76A] shadow-xl z-5 p-4 flex flex-col items-center justify-center text-[#7A2846] font-caveat text-xl font-bold"
                  >
                    <span>Unrolling Love Letter... 📜</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="my-10 flex flex-col items-center justify-center relative z-20">
                {/* 3D Heart-Shaped Wax Seal */}
                <motion.div
                  animate={{
                    scale: isSealBroken ? [1, 1.4, 0] : [1, 1.06, 1],
                    rotate: isSealBroken ? [0, -15, 30] : 0,
                    opacity: isSealBroken ? [1, 0.8, 0] : 1,
                  }}
                  transition={{
                    scale: isSealBroken ? { duration: 0.5 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-[#E11D48] via-[#FF4D6D] to-[#FF7BA9] border-4 border-[#FFD76A] shadow-[0_10px_30px_rgba(225,29,72,0.5)] flex items-center justify-center relative group-hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-rose-600 to-rose-800 flex items-center justify-center shadow-inner border border-rose-300/40">
                    <Heart className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFD76A] fill-[#FFD76A] drop-shadow-md animate-pulse" />
                  </div>
                  <Sparkles className="w-5 h-5 text-[#FFD76A] absolute top-1.5 right-1.5 animate-bounce" />
                </motion.div>

                <p className="mt-6 text-sm sm:text-base font-extrabold text-[#7A2846] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>Tap to Break Wax Seal & Open</span>
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                </p>
              </div>

              {/* Envelope Decorative Labels */}
              <div className="absolute bottom-4 left-6 text-xs font-serif-cute italic text-[#9E3B5E] font-bold">
                To My Soulmate ❤️
              </div>
              <div className="absolute bottom-4 right-6 text-xs font-serif-cute italic text-[#9E3B5E] font-bold">
                Sealed With Love 🌹
              </div>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* UNROLLED 3D PARCHMENT LETTER WITH REALTIME HANDWRITING    */
          /* ======================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotateX: tilt.rx * 0.5,
              rotateY: tilt.ry * 0.5,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full relative [transform-style:preserve-3d]"
          >
            {/* Control Bar (Pause, Resume, Skip, Replay) */}
            <div className="flex items-center justify-between gap-2 mb-4 px-2">
              <div className="flex items-center gap-2">
                {isWriting && (
                  <button
                    onClick={handlePauseResume}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 text-[#7A2846] text-xs font-extrabold border-2 border-[#FF7BA9]/40 hover:bg-[#FFDCE8] transition shadow-md cursor-pointer"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                )}

                {isWriting && (
                  <button
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFDCE8] to-[#FFD6C2] text-[#7A2846] text-xs font-extrabold border-2 border-[#FFD76A] hover:scale-105 transition shadow-md cursor-pointer"
                  >
                    <SkipForward className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Skip Writing</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleReplay}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 text-slate-700 text-xs font-extrabold border-2 border-slate-200 hover:bg-slate-100 transition shadow-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Replay</span>
              </button>
            </div>

            {/* Parchment Scroll Paper Card */}
            <motion.div
              initial={{ scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="bg-gradient-to-b from-[#FFFDF7] via-[#FFF8F0] to-[#FFF3E0] text-[#3D251E] rounded-3xl p-8 sm:p-12 border-2 border-[#FFD76A] shadow-[0_20px_60px_rgba(255,123,169,0.35)] relative overflow-hidden text-left"
            >
              {/* Gold Ribbon Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFD76A] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFD76A] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFD76A] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFD76A] rounded-br-2xl" />

              {/* Feather Watermark Icon */}
              <Feather className="w-20 h-20 absolute top-6 right-6 opacity-10 pointer-events-none text-[#7A2846]" />

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 font-caveat text-[#7A2846] tracking-wide border-b border-[#FFD6C2] pb-3 flex items-center justify-between">
                <span>{fullTitle}</span>
                <Sparkles className="w-5 h-5 text-[#FFD76A]" />
              </h3>

              {/* Typed Body Text */}
              <div className="text-xl sm:text-2xl font-caveat leading-relaxed whitespace-pre-line text-[#4A202D] mb-10 min-h-[160px]">
                {fullContent.substring(0, typedCharsCount)}

                {/* Blinking Ink Cursor */}
                {isWriting && (
                  <span className="inline-block w-2.5 h-6 bg-[#E11D48] ml-1 animate-pulse align-middle rounded-full shadow-[0_0_8px_#E11D48]" />
                )}
              </div>

              {/* Signature (visible when written completely) */}
              {typedCharsCount >= totalLength && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-end pt-6 border-t border-[#FFD6C2]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFDCE8] flex items-center justify-center mb-2 shadow-sm border border-[#FF7BA9]">
                    <Heart className="w-6 h-6 text-[#E11D48] fill-[#E11D48] animate-pulse" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold font-caveat text-[#7A2846]">
                    {fullSignature}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Lock Progression Status when NOT completed */}
      {!isCompleted && (
        <div className="mt-6 text-xs text-[#9E3B5E] font-bold flex items-center justify-center gap-1.5 relative z-20">
          <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>Read or skip the letter to unlock the final surprise ❤️</span>
        </div>
      )}

      {/* Next Step Action Button - ONLY ENABLED & VISIBLE WHEN COMPLETED */}
      <AnimatePresence>
        {isCompleted && onNextStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 16, stiffness: 180 }}
            className="mt-12 text-center relative z-20"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7BA9] via-[#FFD76A] to-[#FFD6C2] rounded-3xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <button
                onClick={onNextStep}
                className="relative px-9 py-4 rounded-full bg-gradient-to-r from-[#FF7BA9] via-[#FF8DA1] to-[#FFD6C2] text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 border-2 border-white cursor-pointer ring-4 ring-[#FFDCE8]"
              >
                <span>Continue to Grand Final Surprise 🎆</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
