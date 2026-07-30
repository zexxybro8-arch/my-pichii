import React from 'react';
import { motion } from 'motion/react';
import { Mail, Heart, Feather, ArrowRight } from 'lucide-react';
import { LoveLetterConfig } from '../../types';

interface LoveLetterSectionProps {
  config: LoveLetterConfig;
  onNextStep?: () => void;
}

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({ config, onNextStep }) => {
  const textureStyles = {
    vintage: 'bg-[#fdf6e2] text-[#4a3b2c] border-[#e2d5b6]',
    parchment: 'bg-[#fefae0] text-[#3d312a] border-[#e9edc9]',
    rose: 'bg-rose-50 text-rose-950 border-rose-200',
    clean: 'bg-white text-slate-900 border-slate-200',
  };

  const fontStyles = {
    handwriting: 'font-serif italic',
    playfair: 'font-serif',
    serif: 'font-serif',
    modern: 'font-sans',
  };

  const currentTexture = textureStyles[config.paperTexture] || textureStyles.parchment;
  const currentFont = fontStyles[config.fontStyle] || fontStyles.handwriting;

  return (
    <section id="letter" className="py-16 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" />
          <span>Straight From My Heart</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          A Special Love Letter 💌
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-8 sm:p-12 rounded-3xl border-2 shadow-2xl relative overflow-hidden ${currentTexture}`}
      >
        {/* Decorative corner icon */}
        <Feather className="w-12 h-12 absolute top-6 right-6 opacity-15 pointer-events-none" />

        <h3 className={`text-2xl sm:text-3xl font-bold mb-6 ${currentFont}`}>
          {config.title || 'My Dearest,'}
        </h3>

        <div className={`text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8 ${currentFont}`}>
          {config.content}
        </div>

        <div className="flex flex-col items-end pt-6 border-t border-current/15">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 mb-1 animate-pulse" />
          <p className={`text-lg font-bold italic ${currentFont}`}>
            {config.authorSignature || 'Yours Forever ❤️'}
          </p>
        </div>
      </motion.div>

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
            <span>Continue to Grand Final Surprise 🎆</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </section>
  );
};
