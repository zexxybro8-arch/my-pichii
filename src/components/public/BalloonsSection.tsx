import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, MessageCircleHeart, ArrowRight } from 'lucide-react';
import { BalloonMessage } from '../../types';

interface BalloonsSectionProps {
  balloons: BalloonMessage[];
  onNextStep?: () => void;
}

export const BalloonsSection: React.FC<BalloonsSectionProps> = ({ balloons, onNextStep }) => {
  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handlePop = (balloon: BalloonMessage, e: React.MouseEvent<HTMLDivElement>) => {
    if (poppedIds.includes(balloon.id)) {
      setSelectedMessage(balloon.message);
      return;
    }

    setPoppedIds((prev) => [...prev, balloon.id]);
    setSelectedMessage(balloon.message);

    // Confetti pop effect at position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: [balloon.color, '#ff4d6d', '#ffb703', '#ffffff'],
    });
  };

  return (
    <section id="balloons" className="py-16 px-4 max-w-5xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Surprise</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Pop a Balloon for Secret Messages 🎈
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Click on any floating balloon to pop it and read what my heart says for you!
        </p>
      </div>

      {/* Floating Balloons Container */}
      <div className="relative min-h-[300px] flex flex-wrap items-center justify-center gap-8 py-8">
        {balloons.map((b, idx) => {
          const isPopped = poppedIds.includes(b.id);
          return (
            <motion.div
              key={b.id}
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.4,
              }}
              onClick={(e) => handlePop(b, e)}
              className="relative cursor-pointer group select-none"
            >
              {!isPopped ? (
                /* Unpopped Balloon */
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 h-32 sm:w-28 sm:h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-xl flex items-center justify-center relative transition-transform group-hover:scale-110 active:scale-90"
                    style={{
                      backgroundColor: b.color || '#ff4d6d',
                      boxShadow: `0 10px 25px -5px ${b.color}80`,
                    }}
                  >
                    {/* Shine highlight */}
                    <div className="absolute top-3 left-4 w-6 h-10 bg-white/30 rounded-full blur-[1px] rotate-[-25deg]" />
                    <Heart className="w-8 h-8 text-white/90 fill-white/80 animate-pulse" />
                  </div>
                  {/* Balloon Knot & String */}
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <div className="w-0.5 h-12 bg-slate-300 dark:bg-slate-700 animate-pulse" />
                </div>
              ) : (
                /* Popped Balloon Badge */
                <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/60 border-2 border-dashed border-rose-400 flex flex-col items-center justify-center p-2 text-rose-500 shadow-inner">
                  <MessageCircleHeart className="w-8 h-8 text-rose-500 animate-bounce" />
                  <span className="text-[10px] font-extrabold uppercase mt-1">Popped!</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Revealed Message Modal / Banner */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mt-6 max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900 shadow-2xl relative"
          >
            <div className="w-10 h-10 mx-auto -mt-10 mb-2 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Secret Message Unlocked! 💖
            </h4>

            <p className="text-base sm:text-lg text-rose-600 dark:text-rose-400 font-semibold italic">
              "{selectedMessage}"
            </p>

            <button
              onClick={() => setSelectedMessage(null)}
              className="mt-4 px-5 py-2 text-xs font-bold text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              Close Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Step Action Button */}
      {onNextStep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onNextStep}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
          >
            <span>Continue to Memory Puzzle 🧩</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </section>
  );
};
