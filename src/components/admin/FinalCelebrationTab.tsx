import React from 'react';
import { Save, PartyPopper, Sparkles } from 'lucide-react';
import { FinalCelebrationConfig } from '../../types';

interface FinalCelebrationTabProps {
  config: FinalCelebrationConfig;
  onChange: (updated: Partial<FinalCelebrationConfig>) => void;
  onSave: () => void;
}

export const FinalCelebrationTab: React.FC<FinalCelebrationTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-rose-500" />
            <span>Final Celebration Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure fireworks, confetti, sound effects, and celebration card messages.
          </p>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Celebration Title Header
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Happy Anniversary, My Love! 🎆"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Subtitle Wish
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="Here is to many more magical years together"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Grand Message Body
          </label>
          <textarea
            rows={3}
            value={config.message}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="Thank you for making my life so incredibly beautiful..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Celebration Trigger Button Label
          </label>
          <input
            type="text"
            value={config.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Celebrate Our Love 🎉"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Confetti Burst</span>
            <input
              type="checkbox"
              checked={config.enableConfetti}
              onChange={(e) => onChange({ enableConfetti: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Fireworks Cannon</span>
            <input
              type="checkbox"
              checked={config.enableFireworks}
              onChange={(e) => onChange({ enableFireworks: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Cheer Sound Effects</span>
            <input
              type="checkbox"
              checked={config.enableSoundEffects}
              onChange={(e) => onChange({ enableSoundEffects: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
