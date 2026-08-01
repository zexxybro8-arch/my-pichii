import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MessageCircleHeart, ArrowRight } from 'lucide-react';
import { BalloonMessage } from '../../types';

interface BalloonsSectionProps {
  balloons?: BalloonMessage[];
  onNextStep?: () => void;
}

const DEFAULT_BALLOONS: BalloonMessage[] = [
  { id: 'b1', color: '#ff4d6d', message: 'You make my world so much brighter every single day! 💕', order: 1 },
  { id: 'b2', color: '#ff758f', message: 'My favorite place in the world is right beside you. 🌹', order: 2 },
  { id: 'b3', color: '#ffb703', message: 'Your smile is the sweetest thing I have ever seen. ✨', order: 3 },
  { id: 'b4', color: '#70e000', message: 'I love you more than words could ever describe. 💖', order: 4 },
  { id: 'b5', color: '#3a86ff', message: 'Forever isn’t long enough with you, my love! 💌', order: 5 },
];

// Web Audio API Sound Effects
const playPopSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio context autoplay restriction
  }
};

const playSuccessSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Ignore audio context restrictions
  }
};

export const BalloonsSection: React.FC<BalloonsSectionProps> = ({ balloons: rawBalloons, onNextStep }) => {
  const balloons = useMemo(() => {
    if (rawBalloons && rawBalloons.length > 0) {
      return rawBalloons;
    }
    return DEFAULT_BALLOONS;
  }, [rawBalloons]);

  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('romantic_surprise_popped_balloons');
    } catch {
      // Ignore
    }
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const totalBalloons = balloons.length;
  const allPopped = totalBalloons > 0 && poppedIds.length >= totalBalloons;

  // Filter only remaining unpopped balloons
  const remainingBalloons = useMemo(() => {
    return balloons.filter((b) => !poppedIds.includes(b.id));
  }, [balloons, poppedIds]);

  const handlePop = (balloon: BalloonMessage, e: React.MouseEvent<HTMLDivElement>) => {
    if (poppedIds.includes(balloon.id)) return;

    // Play pop audio effect
    playPopSound();

    const updated = [...poppedIds, balloon.id];
    setPoppedIds(updated);
    setSelectedMessage(balloon.message);

    // Confetti pop effect at balloon location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: [balloon.color || '#ff4d6d', '#ffb703', '#ffffff', '#ec4899'],
    });

    const isLastBalloon = totalBalloons > 0 && updated.length >= totalBalloons;

    if (isLastBalloon) {
      playSuccessSound();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb703', '#3a86ff', '#70e000', '#ffffff', '#ec4899'],
      });
    }

    // Clear existing timer if any
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    // Auto close popup after 4 seconds
    autoCloseTimerRef.current = setTimeout(() => {
      setSelectedMessage(null);

      // Automatically unlock & transition to next section after the last balloon's message closes
      if (isLastBalloon) {
        setTimeout(() => {
          onNextStep?.();
        }, 500);
      }
    }, 4000);
  };

  return (
    <section id="balloons" className="py-12 sm:py-20 px-4 max-w-5xl mx-auto text-center relative min-h-[500px] flex flex-col justify-center items-center">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-400/10 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-10 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-serif">
          Pop a Balloon for Secret Messages 🎈
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-md mx-auto font-medium leading-relaxed">
          Click on each floating balloon to reveal hidden love notes from my heart.
        </p>
      </div>

      {/* Floating 3D Balloons Container */}
      <div className="relative w-full max-w-4xl min-h-[320px] flex flex-wrap items-center justify-center gap-8 sm:gap-12 py-4 z-10">
        <AnimatePresence>
          {remainingBalloons.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -18, 0] }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{
                y: {
                  duration: 3.2 + (idx % 3) * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.3,
                },
                scale: { duration: 0.35, ease: 'backOut' },
                opacity: { duration: 0.3 },
              }}
              onClick={(e) => handlePop(b, e)}
              className="relative cursor-pointer group select-none"
            >
              {/* 3D Floating Balloon */}
              <div className="flex flex-col items-center">
                <div
                  className="w-24 h-32 sm:w-28 sm:h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-2xl flex items-center justify-center relative transition-all duration-300 group-hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: b.color || '#ff4d6d',
                    boxShadow: `0 16px 35px -8px ${b.color || '#ff4d6d'}80`,
                  }}
                >
                  {/* Glossy 3D Highlight */}
                  <div className="absolute top-3 left-4 w-6 h-10 bg-white/35 rounded-full blur-[1px] rotate-[-25deg]" />
                  <Heart className="w-8 h-8 text-white/95 fill-white/80 animate-pulse" />
                </div>
                {/* Balloon Knot & Ribbon String */}
                <div className="w-2.5 h-2.5 rounded-full -mt-0.5" style={{ backgroundColor: b.color || '#ff4d6d' }} />
                <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-700/80 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {allPopped && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 p-6 sm:p-8 bg-rose-500/10 dark:bg-rose-500/20 rounded-3xl border border-rose-300/80 dark:border-rose-800/80 my-4"
          >
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              All Balloons Popped! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-sm">
              You unlocked all secret love notes! Click below to continue your romantic journey.
            </p>
          </motion.div>
        )}
      </div>

      {/* Secret Message Popup Card */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg p-8 sm:p-10 bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-2xl relative overflow-hidden text-center"
            >
              {/* Delicate Top Icon */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                <MessageCircleHeart className="w-6 h-6 fill-current animate-pulse" />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Secret Love Note</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <p className="text-lg sm:text-2xl text-slate-800 dark:text-slate-100 font-serif font-medium italic leading-relaxed px-2 my-2">
                "{selectedMessage}"
              </p>

              {/* 4-second Auto-close progress bar indicator */}
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Next Step Action Button - ONLY shown when all balloons are popped */}
      {onNextStep && allPopped && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-8 text-center relative z-20 pointer-events-auto"
        >
          <button
            onClick={onNextStep}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            <span>Continue to Love Puzzle 🧩</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Progress hint when balloons are remaining */}
      {onNextStep && !allPopped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-100/90 dark:bg-slate-800/90 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Pop all balloons to continue ({poppedIds.length}/{totalBalloons} popped) 🎈</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};
