import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Crown, ArrowRight, Wand2 } from 'lucide-react';

interface CurtainRevealPageProps {
  girlfriendName: string;
  onReveal: () => void;
}

export const CurtainRevealPage: React.FC<CurtainRevealPageProps> = ({
  girlfriendName,
  onReveal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenCurtains = () => {
    setIsOpen(true);
    setTimeout(() => {
      onReveal();
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-slate-950 text-white">
      {/* Curtain Animations Container */}
      <div className="absolute inset-0 pointer-events-none flex z-20 overflow-hidden">
        {/* Left Curtain */}
        <motion.div
          animate={isOpen ? { x: '-105%' } : { x: '0%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full bg-gradient-to-r from-red-950 via-rose-900 to-red-900 border-r-4 border-amber-400 shadow-2xl relative flex items-center justify-end pr-4"
        >
          {/* Velvet curtain vertical fold overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />
          <div className="text-amber-300 opacity-60">
            <Crown className="w-12 h-12" />
          </div>
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          animate={isOpen ? { x: '105%' } : { x: '0%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="w-1/2 h-full bg-gradient-to-l from-red-950 via-rose-900 to-red-900 border-l-4 border-amber-400 shadow-2xl relative flex items-center justify-start pl-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />
          <div className="text-amber-300 opacity-60">
            <Crown className="w-12 h-12" />
          </div>
        </motion.div>
      </div>

      {/* Main Content behind Curtains */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/40 shadow-lg mb-8"
        >
          <Wand2 className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
            Step 3: Curtain Reveal
          </span>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-2xl mb-6 border-2 border-amber-200"
        >
          <Heart className="w-12 h-12 text-white fill-current" />
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          Step Inside Our World 🌹
        </h2>

        <p className="text-sm sm:text-base text-rose-200/90 max-w-md mb-8 leading-relaxed font-medium">
          Behind these curtains lies our beautiful story, timeless countdown, favorite memories, and secret love notes created for {girlfriendName}.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenCurtains}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-black text-base sm:text-lg shadow-2xl hover:shadow-amber-400/40 transition-all flex items-center gap-3 border border-amber-200"
        >
          <span>Reveal Our Love Journey ✨</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
