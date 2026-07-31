import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, MessageCircleHeart, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { BalloonMessage } from '../../types';

interface BalloonsSectionProps {
  balloons?: BalloonMessage[];
  onNextStep?: () => void;
}

const STORAGE_KEY = 'romantic_surprise_popped_balloons';

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
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
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

  // Load saved popped IDs from localStorage
  const [poppedIds, setPoppedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore JSON error
    }
    return [];
  });

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTriggeredRef = useRef(false);

  const totalBalloons = balloons.length;
  const poppedCount = balloons.filter((b) => poppedIds.includes(b.id)).length;
  const allPopped = totalBalloons > 0 && poppedCount >= totalBalloons;
  const progressPercent = totalBalloons > 0 ? (poppedCount / totalBalloons) * 100 : 0;

  // Persist poppedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(poppedIds));
    } catch {
      // Ignore error
    }
  }, [poppedIds]);

  // Trigger celebration effects when ALL balloons are popped
  useEffect(() => {
    if (allPopped && !celebrationTriggeredRef.current) {
      celebrationTriggeredRef.current = true;
      setShowCelebration(true);

      // Play success audio fanfare
      playSuccessSound();

      // Fire festive confetti burst sequence
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb703', '#3a86ff', '#70e000', '#ffffff', '#ec4899'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#ff4d6d', '#ffb703', '#ffffff'],
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#3a86ff', '#70e000', '#ec4899'],
        });
      }, 500);
    }
  }, [allPopped]);

  const handlePop = (balloon: BalloonMessage, e: React.MouseEvent<HTMLDivElement>) => {
    // If already popped, show secret message modal again
    if (poppedIds.includes(balloon.id)) {
      setSelectedMessage(balloon.message);
      return;
    }

    // Play pop sound effect
    playPopSound();

    // Mark balloon as popped
    const updated = [...poppedIds, balloon.id];
    setPoppedIds(updated);
    setSelectedMessage(balloon.message);

    // Confetti pop effect at mouse click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: [balloon.color || '#ff4d6d', '#ffb703', '#ffffff', '#ec4899'],
    });
  };

  return (
    <section id="balloons" className="py-16 px-4 max-w-5xl mx-auto text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-pink-200/50">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
          <span>Interactive Surprise</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pop a Balloon for Secret Messages 🎈
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto font-medium">
          Click on each floating balloon to reveal hidden love notes from my heart!
        </p>
      </div>

      {/* PROGRESS TRACKER BAR */}
      <div className="max-w-md mx-auto mb-10 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-rose-200 dark:border-rose-900/80 shadow-xl relative z-10">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mb-2.5">
          <span className="flex items-center gap-2">
            <span className="text-base">🎈</span>
            <span>Balloons Popped: {poppedCount}/{totalBalloons}</span>
          </span>
          <span className="font-mono text-amber-500 font-extrabold text-sm">{progressPercent.toFixed(0)}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-rose-200/60 dark:border-rose-800/60 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-md relative"
          />
        </div>

        {/* Status Subtext */}
        <div className="mt-3 text-xs sm:text-sm font-semibold">
          {allPopped ? (
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
              <span>All surprise balloons unlocked! You did it! 🎉</span>
            </motion.p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Pop all balloons to unlock the next surprise ❤️</span>
            </p>
          )}
        </div>
      </div>

      {/* Celebration Banner when completed */}
      <AnimatePresence>
        {allPopped && showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg mx-auto mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-pink-500/20 border-2 border-amber-400/60 backdrop-blur-lg shadow-2xl flex items-center justify-center gap-3 text-rose-600 dark:text-rose-300 font-black text-sm sm:text-base"
          >
            <span className="text-2xl animate-bounce">✨</span>
            <span>Congratulations My Love! Next step unlocked! 💖</span>
            <span className="text-2xl animate-bounce">🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Balloons Grid / Container */}
      <div className="relative min-h-[320px] flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6 z-10">
        {balloons.map((b, idx) => {
          const isPopped = poppedIds.includes(b.id);
          return (
            <motion.div
              key={b.id}
              initial={{ y: 0 }}
              animate={{ y: [0, -18, 0] }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.35,
              }}
              onClick={(e) => handlePop(b, e)}
              className="relative cursor-pointer group select-none"
            >
              {!isPopped ? (
                /* Unpopped Balloon */
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 h-32 sm:w-28 sm:h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-2xl flex items-center justify-center relative transition-transform group-hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: b.color || '#ff4d6d',
                      boxShadow: `0 12px 30px -5px ${b.color || '#ff4d6d'}90`,
                    }}
                  >
                    {/* Shine highlight */}
                    <div className="absolute top-3 left-4 w-6 h-10 bg-white/35 rounded-full blur-[1px] rotate-[-25deg]" />
                    <Heart className="w-8 h-8 text-white/95 fill-white/80 animate-pulse" />
                  </div>
                  {/* Balloon Knot & String */}
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color || '#ff4d6d' }} />
                  <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-700 animate-pulse" />
                </div>
              ) : (
                /* Popped Balloon Badge */
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-50 dark:bg-rose-950/70 border-2 border-dashed border-rose-400/80 flex flex-col items-center justify-center p-2 text-rose-500 shadow-inner group-hover:scale-105 transition-transform"
                >
                  <MessageCircleHeart className="w-8 h-8 text-rose-500 animate-bounce" />
                  <span className="text-[10px] sm:text-xs font-black uppercase mt-1 tracking-wider text-rose-600 dark:text-rose-300">
                    Popped! ✨
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Revealed Secret Message Modal / Banner */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="mt-8 max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-300 dark:border-rose-800 shadow-2xl relative z-20"
          >
            <div className="w-12 h-12 mx-auto -mt-12 mb-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>

            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 font-serif">
              Secret Message Unlocked! 💖
            </h4>

            <p className="text-base sm:text-xl text-rose-600 dark:text-rose-300 font-bold italic leading-relaxed px-2">
              "{selectedMessage}"
            </p>

            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-6 px-6 py-2.5 text-xs font-black text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              Close Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Step Action Button - ONLY VISIBLE WHEN ALL BALLOONS ARE POPPED */}
      <AnimatePresence>
        {allPopped && onNextStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 16, stiffness: 180 }}
            className="mt-12 text-center relative z-20"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <button
                onClick={onNextStep}
                className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 border border-rose-300/40 cursor-pointer"
              >
                <span>Continue to Memory Puzzle 🧩</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
