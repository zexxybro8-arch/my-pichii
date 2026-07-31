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
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mb-6"
      >
        <h1 className="font-cute text-[48px] sm:text-7xl font-extrabold tracking-wide relative z-30 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300 leading-tight text-center flex items-center justify-center gap-3 flex-wrap drop-shadow-[0_6px_25px_rgba(255,94,126,0.45)]">
          <span>Hey</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-500 to-amber-300">
            {girlfriendName || 'Picchi'}
          </span>
          <span className="text-pink-500 inline-block animate-bounce">❤️</span>
          <span className="text-pink-400 inline-block text-2xl sm:text-4xl animate-pulse">✨</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-lg mb-12 leading-relaxed"
      >
        I have created a special romantic surprise experience just for you. Tap the gift box below to open it!
      </motion.p>

      {/* Animated 3D Cute Gift Box Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
        onClick={handleBoxClick}
        className="cursor-pointer group relative my-8 select-none"
      >
        {/* Floating Sparkles & Cute Hearts around the Box */}
        <div className="absolute -top-8 -left-6 text-2xl animate-bounce duration-1000">💖</div>
        <div className="absolute -top-6 -right-6 text-2xl animate-pulse duration-700">✨</div>
        <div className="absolute -bottom-4 -left-8 text-xl animate-bounce delay-300">🌸</div>
        <div className="absolute -bottom-2 -right-8 text-2xl animate-pulse delay-500">💕</div>

        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center [perspective:1000px]">
          {/* Pulsing Aura Floor Glow */}
          <div className="absolute inset-x-4 bottom-2 h-16 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full opacity-40 group-hover:opacity-80 blur-2xl transition-all duration-500 group-hover:scale-125" />

          {/* 3D Drop Shadow on Floor */}
          <div className="absolute -bottom-4 w-48 h-8 bg-pink-950/30 dark:bg-black/60 rounded-[100%] blur-md transform scale-x-90 group-hover:scale-x-110 group-hover:opacity-70 transition-all duration-300" />

          {/* 3D Box Main Wrapper */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 transform-style-3d transition-transform duration-500 group-hover:-rotate-y-12 group-hover:rotate-x-12 group-hover:scale-105">
            
            {/* ======================================================== */}
            {/* 3D GIFT BOX LID (Separate Floating Top with Depth)       */}
            {/* ======================================================== */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[108%] h-16 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl border-2 border-white/40 shadow-[0_12px_25px_rgba(225,29,72,0.4)] z-30 transform-style-3d transition-transform duration-300 group-hover:-translate-y-6 group-hover:rotate-x-12 flex items-center justify-center">
              {/* Lid Top Bevel Shadow Line */}
              <div className="absolute bottom-0 inset-x-0 h-3 bg-rose-800/40 rounded-b-xl" />

              {/* Lid Horizontal Ribbon */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border-x border-amber-100/60 shadow-md" />

              {/* Cute 3D Golden Bow on Top */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {/* Bow Left Loop */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 border-2 border-amber-100 shadow-[0_6px_15px_rgba(217,119,6,0.5)] transform -rotate-45 origin-right" />
                {/* Bow Right Loop */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-bl from-amber-200 via-yellow-300 to-amber-500 border-2 border-amber-100 shadow-[0_6px_15px_rgba(217,119,6,0.5)] transform rotate-45 origin-left" />
                
                {/* Center Heart Gem Badge */}
                <div className="absolute z-50 w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3D GIFT BOX BODY                                         */}
            {/* ======================================================== */}
            <div className="w-full h-full bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 rounded-3xl p-6 shadow-[0_20px_50px_rgba(244,63,94,0.4)] border-2 border-white/30 relative overflow-hidden flex flex-col items-center justify-center z-20">
              
              {/* 3D Side Shading Layers */}
              <div className="absolute inset-y-0 right-0 w-4 bg-black/15 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-black/20 pointer-events-none" />

              {/* Glossy Diagonal Reflection Streak */}
              <div className="absolute -top-24 -left-24 w-48 h-96 bg-white/20 transform rotate-45 pointer-events-none blur-sm" />

              {/* Vertical Gold Ribbon */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border-x border-amber-100/60 shadow-lg flex items-center justify-center">
                <div className="w-0.5 h-full bg-amber-500/30" />
              </div>

              {/* Horizontal Gold Ribbon */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border-y border-amber-100/60 shadow-lg flex items-center justify-center">
                <div className="h-0.5 w-full bg-amber-500/30" />
              </div>

              {/* Cute Hanging Tag: "For My Picchi 🎀" */}
              <div className="absolute top-10 right-4 z-30 transform rotate-12 group-hover:rotate-6 transition-transform duration-300">
                <div className="bg-gradient-to-r from-amber-100 to-amber-200 text-rose-900 font-cute font-extrabold text-[11px] px-3 py-1 rounded-lg border border-amber-300 shadow-md flex items-center gap-1">
                  <span>For {girlfriendName || 'Picchi'}</span>
                  <span>🎀</span>
                </div>
              </div>

              {/* Center Open Badge */}
              <div className="relative z-30 mt-8">
                <div className="bg-slate-950/80 text-pink-200 font-cute text-xs sm:text-sm font-extrabold tracking-wider uppercase px-4 py-2 rounded-2xl backdrop-blur-md border border-pink-400/40 shadow-xl flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Tap to Open Surprise 🎁</span>
                </div>
              </div>
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
