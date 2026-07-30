import React from 'react';
import { Save, Sparkles, Gift } from 'lucide-react';
import { ScratchCardConfig } from '../../types';

interface ScratchCardTabProps {
  config: ScratchCardConfig;
  onChange: (updated: Partial<ScratchCardConfig>) => void;
  onSave: () => void;
}

export const ScratchCardTab: React.FC<ScratchCardTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Scratch Card Voucher Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Edit the secret prize coupon hidden underneath the scratch layer.
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
            Hidden Secret Voucher Message / Prize
          </label>
          <textarea
            rows={3}
            value={config.hiddenMessage}
            onChange={(e) => onChange({ hiddenMessage: e.target.value })}
            placeholder="🎉 SPECIAL COUPON: Unlimited Warm Hugs, Late Night Ice Cream & 1000 Kisses On Demand!"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Voucher Header Title
            </label>
            <input
              type="text"
              value={config.voucherTitle}
              onChange={(e) => onChange({ voucherTitle: e.target.value })}
              placeholder="Golden Love Voucher 🎁"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Overlay Instruction Text
            </label>
            <input
              type="text"
              value={config.overlayText}
              onChange={(e) => onChange({ overlayText: e.target.value })}
              placeholder="Scratch Here with your finger or mouse! ✨"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Overlay Color Theme
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.overlayColor || '#d4af37'}
                onChange={(e) => onChange({ overlayColor: e.target.value })}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <span className="text-xs font-mono">{config.overlayColor || '#d4af37'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Auto-Reveal Percentage ({config.revealPercentage || 40}%)
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={config.revealPercentage || 40}
              onChange={(e) => onChange({ revealPercentage: parseInt(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
