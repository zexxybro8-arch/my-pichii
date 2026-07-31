import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Volume2 } from 'lucide-react';
import { WelcomePopupConfig } from '../../types';

interface WelcomePopupProps {
  config: WelcomePopupConfig;
  onContinue: () => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ config, onContinue }) => {
  if (!config.showPopup) return null;

  const bgStyles = {
    'romantic-gradient': 'bg-gradient-to-br from-rose-500 via-pink-600 to-red-700 text-white',
    'starry-night': 'bg-gradient-to-br from-slate-900 via-purple-950 to-rose-950 text-rose-100',
    'rose-petals': 'bg-gradient-to-br from-pink-400 via-rose-500 to-pink-700 text-white',
    'sunset-glow': 'bg-gradient-to-br from-amber-500 via-rose-500 to-purple-700 text-white',
    'deep-velvet': 'bg-gradient-to-br from-red-950 via-rose-900 to-slate-950 text-rose-100',
  };

  const currentBgClass = bgStyles[config.backgroundStyle] || bgStyles['romantic-gradient'];

  const animVariants = {
    'fade-scale': {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    'bounce-in': {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } },
      exit: { opacity: 0, y: -50 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 80 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -80 },
    },
    'heart-pulse': {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: [1, 1.03, 1], transition: { repeat: Infinity, duration: 3 } },
      exit: { opacity: 0, scale: 0.8 },
    },
  };

  const selectedAnim = animVariants[config.animation] || animVariants['fade-scale'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        {...selectedAnim}
        className={`w-full max-w-lg rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-white/20 text-center ${currentBgClass}`}
      >
        {/* Background Decorative Hearts */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
              <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
            </div>
            <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-1 animate-spin" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="font-cute text-[40px] sm:text-6xl font-extrabold tracking-wide relative z-30 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300 leading-tight text-center flex items-center justify-center gap-2 flex-wrap drop-shadow-[0_6px_25px_rgba(255,94,126,0.45)]">
            <span>❤️</span>
            <span>Hey</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300">
              {config.girlfriendName || 'Picchi'}
            </span>
            <span className="text-pink-500 inline-block animate-bounce">❤️</span>
          </h2>
        </div>

        <div className="text-base sm:text-lg font-medium whitespace-pre-line leading-relaxed mb-8 opacity-95">
          {config.message}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-rose-600 font-extrabold text-lg shadow-xl hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <span>{config.buttonText || 'Continue ❤️'}</span>
            <Heart className="w-5 h-5 fill-rose-600 group-hover:scale-125 transition-transform" />
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium pt-2">
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>Music will automatically start playing!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
