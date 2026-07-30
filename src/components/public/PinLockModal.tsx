import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, KeyRound, Heart, HelpCircle } from 'lucide-react';
import { SecretPinConfig } from '../../types';

interface PinLockModalProps {
  config: SecretPinConfig;
  girlfriendName: string;
  onUnlock: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ config, girlfriendName, onUnlock }) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === config.pin) {
          onUnlock();
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

  if (!config.enabled) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-950/50 text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center border border-rose-200 dark:border-rose-900">
          {error ? (
            <Lock className="w-8 h-8 animate-bounce text-red-500" />
          ) : pinInput.length === 4 ? (
            <Unlock className="w-8 h-8 text-emerald-500" />
          ) : (
            <KeyRound className="w-8 h-8 text-rose-500" />
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Secret Lock for {girlfriendName} 💖
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Enter our special 4-digit secret PIN to unlock your surprise
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                error
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
              className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-800 dark:text-slate-200 font-bold text-lg transition active:scale-95 border border-slate-200/60 dark:border-slate-700"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Hint toggle */}
        {config.hint && (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
            </button>
            {showHint && (
              <p className="mt-2 text-xs bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900 font-medium">
                {config.hint}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
