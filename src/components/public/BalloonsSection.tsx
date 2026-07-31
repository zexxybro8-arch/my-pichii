import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, MessageCircleHeart, ArrowRight, CheckCircle2, Lock, RefreshCw, Trophy, Sparkles } from 'lucide-react';
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

  // Clean up legacy localStorage item if present and start with empty popped state
  const [poppedIds, setPoppedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.removeItem('romantic_surprise_popped_balloons');
    } catch {
      // Ignore error
    }
  }, []);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState<boolean>(false);

  const totalBalloons = balloons.length;
  const poppedCount = balloons.filter((b) => poppedIds.includes(b.id)).length;
  const allPopped = totalBalloons > 0 && poppedCount >= totalBalloons;
  const progressPercent = totalBalloons > 0 ? (poppedCount / totalBalloons) * 100 : 0;

  // Filter only remaining unpopped balloons
  const remainingBalloons = useMemo(() => {
    return balloons.filter((b) => !poppedIds.includes(b.id));
  }, [balloons, poppedIds]);

  const handlePop = (balloon: BalloonMessage, e: React.MouseEvent<HTMLDivElement>) => {
    if (poppedIds.includes(balloon.id)) return;

    // Play pop audio effect
    playPopSound();

    // Calculate updated list of popped IDs
    const updated = [...poppedIds, balloon.id];
    setPoppedIds(updated);
    setSelectedMessage(balloon.message);

    // Confetti pop effect at balloon click location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: [balloon.color || '#ff4d6d', '#ffb703', '#ffffff', '#ec4899'],
    });

    // Check if this action pops the final balloon
    const updatedPoppedCount = balloons.filter((b) => updated.includes(b.id)).length;
    if (totalBalloons > 0 && updatedPoppedCount >= totalBalloons) {
      setShowCelebrationBanner(true);
      playSuccessSound();

      // Confetti burst for initial completion
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
  };

  const handleResetBalloons = () => {
    setPoppedIds([]);
    setSelectedMessage(null);
    setShowCelebrationBanner(false);
    try {
      localStorage.removeItem('romantic_surprise_popped_balloons');
    } catch {
      // Ignore error
    }
  };

  return (
    <section id="balloons" className="py-16 px-4 max-w-5xl mx-auto text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pop a Balloon for Secret Messages 🎈
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto font-medium">
          {allPopped
            ? 'All secret balloons have been unlocked and read! 💖'
            : 'Click on each floating balloon to reveal hidden love notes from my heart!'}
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

      {/* Celebration Banner when freshly completed */}
      <AnimatePresence>
        {showCelebrationBanner && (
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

      {/* MAIN INTERACTIVE CONTENT */}
      {allPopped ? (
        /* ALL BALLOONS COMPLETED SUCCESS CARD */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-amber-300 dark:border-amber-500/50 shadow-2xl relative z-10"
        >
          {/* Animated Trophy / Heart Icon Header */}
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            All Balloons Completed ❤️
          </h3>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-lg mx-auto mb-8 leading-relaxed">
            You popped every balloon and unlocked all secret love notes! You are my absolute favorite person in the world.
          </p>

          {/* List of Revealed Messages for Review */}
          <div className="text-left mb-8 space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Your Unlocked Secret Notes</span>
            </h4>
            {balloons.map((b, idx) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-start gap-3.5 shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md mt-0.5"
                  style={{ backgroundColor: b.color || '#ff4d6d' }}
                >
                  {idx + 1}
                </div>
                <p className="text-sm sm:text-base font-semibold text-rose-900 dark:text-rose-200 italic leading-snug">
                  "{b.message}"
                </p>
              </div>
            ))}
          </div>

          {/* Action Controls: Continue Button & Reset Option */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {onNextStep && (
              <button
                onClick={onNextStep}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Continue to Memory Puzzle 🧩</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handleResetBalloons}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Pop Balloons Again 🎈</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* UNPOPPED REMAINING BALLOONS GRID */
        <div className="relative min-h-[320px] flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6 z-10">
          <AnimatePresence>
            {remainingBalloons.map((b, idx) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -18, 0] }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                transition={{
                  y: {
                    duration: 3 + (idx % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.35,
                  },
                  scale: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                }}
                onClick={(e) => handlePop(b, e)}
                className="relative cursor-pointer group select-none"
              >
                {/* Floating Unpopped Balloon */}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Revealed Secret Message Modal for single balloon pop */}
      <AnimatePresence>
        {!allPopped && selectedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="mt-8 max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-300 dark:border-rose-800 shadow-2xl relative z-20"
          >
            <div className="w-12 h-12 mx-auto -mt-12 mb-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <MessageCircleHeart className="w-6 h-6 fill-current animate-pulse" />
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

      {/* Next Step Action Button - ONLY VISIBLE WHEN NOT IN ALL-POPPED STATE BUT SOMEHOW COMPLETED OR UNLOCKED */}
      {!allPopped && poppedCount > 0 && onNextStep && (
        <div className="mt-8 text-center text-xs text-rose-400 font-medium">
          Pop all remaining {totalBalloons - poppedCount} balloons to unlock the next page!
        </div>
      )}
    </section>
  );
};

