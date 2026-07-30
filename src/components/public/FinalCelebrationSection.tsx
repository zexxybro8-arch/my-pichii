import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PartyPopper, Heart, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { FinalCelebrationConfig } from '../../types';

interface FinalCelebrationSectionProps {
  config: FinalCelebrationConfig;
  girlfriendName: string;
  onRestart?: () => void;
}

export const FinalCelebrationSection: React.FC<FinalCelebrationSectionProps> = ({
  config,
  girlfriendName,
  onRestart,
}) => {
  const [celebrated, setCelebrated] = useState<boolean>(false);

  const triggerFireworks = () => {
    setCelebrated(true);

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#ff4d6d', '#ffb703', '#e0aaff', '#3a86ff', '#ffffff'],
      });
    }, 250);
  };

  return (
    <section id="celebration" className="py-20 px-4 max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-700 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
            <PartyPopper className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            {config.title || `Happy Anniversary, ${girlfriendName}! 🎆`}
          </h2>

          <p className="text-lg sm:text-xl text-rose-100 font-semibold mb-6 max-w-xl mx-auto">
            {config.subtitle || 'Here is to many more magical years together'}
          </p>

          <p className="text-base text-white/90 leading-relaxed max-w-2xl mx-auto mb-8 whitespace-pre-line">
            {config.message}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={triggerFireworks}
              className="px-8 py-4 rounded-2xl bg-white text-rose-600 font-extrabold text-lg shadow-2xl hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <span>{config.buttonText || 'Celebrate Our Love 🎉'}</span>
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600 group-hover:scale-125 transition-transform" />
            </button>

            {onRestart && (
              <button
                onClick={onRestart}
                className="px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-base backdrop-blur-md border border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Replay Our Journey 🔄</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
