import React from 'react';
import { Save, PartyPopper, Sparkles, Volume2, Flame } from 'lucide-react';
import { FinalCelebrationConfig } from '../../types';

interface FinalCelebrationTabProps {
  config: FinalCelebrationConfig;
  onChange: (updated: Partial<FinalCelebrationConfig>) => void;
  onSave: () => void;
}

export const FinalCelebrationTab: React.FC<FinalCelebrationTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PartyPopper className="w-6 h-6 text-rose-400" />
            <span>Final Celebration & Fireworks CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure grand anniversary celebration titles, fireworks intensity, confetti cannons, cheer audio, and finale messages.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Finale Settings
        </button>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Celebration Title Header
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Happy Anniversary, My Love! 🎆"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Subtitle Wish
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="Here is to many more magical years together"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Grand Message Body
          </label>
          <textarea
            rows={4}
            value={config.message}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="Thank you for making my life so incredibly beautiful..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Celebration Trigger Button Label
          </label>
          <input
            type="text"
            value={config.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Celebrate Our Love 🎉"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Animation & Audio FX Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Confetti Burst</span>
            </span>
            <input
              type="checkbox"
              checked={config.enableConfetti}
              onChange={(e) => onChange({ enableConfetti: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Fireworks Cannon</span>
            </span>
            <input
              type="checkbox"
              checked={config.enableFireworks}
              onChange={(e) => onChange({ enableFireworks: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Cheer Sounds</span>
            </span>
            <input
              type="checkbox"
              checked={config.enableSoundEffects}
              onChange={(e) => onChange({ enableSoundEffects: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
