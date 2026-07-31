import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Lock, Unlock, KeyRound, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SecretPinConfig } from '../../types';

interface SecretPinPageProps {
  config: SecretPinConfig;
  girlfriendName: string;
  onSuccess: () => void;
}

export const SecretPinPage: React.FC<SecretPinPageProps> = ({
  config,
  girlfriendName,
  onSuccess,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === config.pin) {
          setUnlockedSuccess(true);
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ffb703', '#ffffff'],
          });
          setTimeout(() => {
            onSuccess();
          }, 800);
        } else {
          setError(true);
          setTimeout(() => setPinInput(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  // If PIN protection is disabled in Admin CMS
  if (!config.enabled) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-rose-100 dark:border-rose-950/60 shadow-2xl text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Secret Lock Cleared ✨
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            No PIN lock required! Click below to proceed to the curtain reveal stage.
          </p>

          <button
            onClick={onSuccess}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all"
          >
            <span>Proceed to Curtain Reveal</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-950/60 text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-200 dark:border-rose-900 shadow-inner">
          {unlockedSuccess ? (
            <Unlock className="w-8 h-8 text-emerald-500 animate-bounce" />
          ) : error ? (
            <Lock className="w-8 h-8 text-red-500 animate-bounce" />
          ) : (
            <KeyRound className="w-8 h-8 text-rose-500" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Secret Lock for {girlfriendName} 💖
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Enter our special 4-digit secret PIN to unlock the next romantic page
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                unlockedSuccess
                  ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-md shadow-emerald-500/50'
                  : error
                  ? 'bg-red-500 border-red-500 animate-shake'
                  : pinInput.length > idx
                  ? 'bg-rose-500 border-rose-500 scale-125 shadow-md shadow-rose-500/50'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold mb-4 animate-pulse">
            Incorrect PIN! Try again my love ❤️
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') setPinInput('');
                else if (btn === '⌫') handleDelete();
                else handleKeyPress(btn);
              }}
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-800 dark:text-slate-200 font-bold text-lg transition active:scale-95 border border-slate-200/60 dark:border-slate-700 shadow-sm"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Hint */}
        {config.hint && (
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-bold hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a Secret Hint?'}</span>
            </button>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-medium"
              >
                💡 Hint: {config.hint}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
