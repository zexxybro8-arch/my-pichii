import React from 'react';
import { Save, PartyPopper, Sparkles, Volume2, Flame, Heart, PenTool, Type } from 'lucide-react';
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
            <span>Final Celebration & Finale Page CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fully edit and customize every title, message, button label, counter text, handwritten ending, and fireworks effect on the final celebration page.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Finale Settings</span>
        </button>
      </div>

      {/* Main Content & Titles */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Type className="w-4 h-4" />
          <span>Main Header & Messages</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Celebration Title Header
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Forever & Always ❤️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Subtitle Wish
            </label>
            <input
              type="text"
              value={config.subtitle || ''}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Happy Love Life, My Dearest! ✨"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Grand Love Letter / Message Body
          </label>
          <textarea
            rows={4}
            value={config.message || ''}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="Thank you for making my life so incredibly beautiful..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
          />
        </div>

        {/* Buttons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Celebration Button Label
            </label>
            <input
              type="text"
              value={config.buttonText || ''}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="Celebrate Our Love ❤️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Replay Journey Button Label
            </label>
            <input
              type="text"
              value={config.replayButtonText || ''}
              onChange={(e) => onChange({ replayButtonText: e.target.value })}
              placeholder="Replay Journey"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Love Counter Values & Labels */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Love Counter Values & Card Labels</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Counter Section Title Header
          </label>
          <input
            type="text"
            value={config.counterTitle || ''}
            onChange={(e) => onChange({ counterTitle: e.target.value })}
            placeholder="Time We Have Been Together"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
          />
        </div>

        {/* Counter Numbers */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider">
            1. Counter Numbers (Displayed in Statistics Cards)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Years Value
              </label>
              <input
                type="number"
                value={config.yearsValue ?? ''}
                onChange={(e) => onChange({ yearsValue: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="4"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Months Value
              </label>
              <input
                type="number"
                value={config.monthsValue ?? ''}
                onChange={(e) => onChange({ monthsValue: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="53"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Days Value
              </label>
              <input
                type="number"
                value={config.daysValue ?? ''}
                onChange={(e) => onChange({ daysValue: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="1629"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Hours Value
              </label>
              <input
                type="number"
                value={config.hoursValue ?? ''}
                onChange={(e) => onChange({ hoursValue: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="39113"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold text-amber-300"
              />
            </div>
          </div>
        </div>

        {/* Counter Labels */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Card Subtitle Labels
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Years Card Label
              </label>
              <input
                type="text"
                value={config.yearsLabel || ''}
                onChange={(e) => onChange({ yearsLabel: e.target.value })}
                placeholder="Years Together"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Months Card Label
              </label>
              <input
                type="text"
                value={config.monthsLabel || ''}
                onChange={(e) => onChange({ monthsLabel: e.target.value })}
                placeholder="Months Together"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Days Card Label
              </label>
              <input
                type="text"
                value={config.daysLabel || ''}
                onChange={(e) => onChange({ daysLabel: e.target.value })}
                placeholder="Days Together"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Hours Card Label
              </label>
              <input
                type="text"
                value={config.hoursLabel || ''}
                onChange={(e) => onChange({ hoursLabel: e.target.value })}
                placeholder="Hours Together"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Handwritten Ending Animation & Footer */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <PenTool className="w-4 h-4 text-purple-400" />
          <span>Handwritten Animated Finale Message & Footer</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Handwritten Line 1 (Typed First)
            </label>
            <input
              type="text"
              value={config.endingLine1 ?? ''}
              onChange={(e) => onChange({ endingLine1: e.target.value })}
              placeholder="Thank you for being the most beautiful part of my life."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Handwritten Line 2 (Highlighted Finale)
            </label>
            <input
              type="text"
              value={config.endingLine2 ?? ''}
              onChange={(e) => onChange({ endingLine2: e.target.value })}
              placeholder="I Love You Forever ❤️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-bold text-rose-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Bottom Footer Tagline Text
          </label>
          <input
            type="text"
            value={config.footerText || ''}
            onChange={(e) => onChange({ footerText: e.target.value })}
            placeholder="Made with endless love"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Animation & Audio FX Toggles */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Celebration Effects & Sound Toggles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
