import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Heart, Sparkles, Volume2 } from 'lucide-react';
import { WelcomePopupConfig } from '../../types';
import { WelcomePopup } from './WelcomePopup';

interface WelcomeGiftBoxPageProps {
  config: WelcomePopupConfig;
  girlfriendName: string;
  onOpenBox: () => void;
}

export const WelcomeGiftBoxPage: React.FC<WelcomeGiftBoxPageProps> = ({
  config,
  girlfriendName,
  onOpenBox,
}) => {
  const [showPopupModal, setShowPopupModal] = useState<boolean>(false);
  const [boxOpened, setBoxOpened] = useState<boolean>(false);

  const handleBoxClick = () => {
    setBoxOpened(true);
    if (config.showPopup) {
      setShowPopupModal(true);
    } else {
      onOpenBox();
    }
  };

  const handlePopupContinue = () => {
    setShowPopupModal(false);
    onOpenBox();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200 dark:border-rose-900/60 shadow-lg mb-8"
      >
        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Step 1: Your Magical Gift Box
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
      >
        Hey {girlfriendName || 'My Love'} <span className="text-pink-500 inline-block animate-pulse">❤️</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-lg mb-12 leading-relaxed"
      >
        I have created a special romantic surprise experience just for you. Tap the gift box below to open it!
      </motion.p>

      {/* Animated Gift Box Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
        onClick={handleBoxClick}
        className="cursor-pointer group relative my-6"
      >
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          {/* Pulsing Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-3xl opacity-30 group-hover:opacity-60 blur-xl transition-all duration-500 group-hover:scale-110" />

          {/* Gift Box Card */}
          <div className="w-full h-full bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 rounded-3xl p-6 shadow-2xl border border-white/30 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Gift Ribbon Ribbon Top/Cross */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-amber-300/80 shadow-md" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-300/80 shadow-md" />

            {/* Ribbon Bow */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300 border border-amber-200">
              <Gift className="w-10 h-10 animate-bounce" />
            </div>

            <div className="relative z-10 mt-4 text-xs font-black tracking-widest text-white uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              Tap to Open
            </div>
          </div>
        </div>
      </motion.div>

      {/* Button Action */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={handleBoxClick}
        className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
      >
        <span>Open Your Surprise 🎁</span>
        <Heart className="w-5 h-5 fill-current animate-pulse" />
      </motion.button>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1.5">
        <Volume2 className="w-3.5 h-3.5 text-pink-500" />
        <span>Background music will start automatically</span>
      </p>

      {/* Welcome Greeting Popup Modal */}
      {showPopupModal && (
        <WelcomePopup config={config} onContinue={handlePopupContinue} />
      )}
    </div>
  );
};
