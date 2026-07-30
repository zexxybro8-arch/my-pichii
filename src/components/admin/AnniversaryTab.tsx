import React from 'react';
import { Save, Heart, Calendar } from 'lucide-react';
import { AnniversaryConfig } from '../../types';

interface AnniversaryTabProps {
  config: AnniversaryConfig;
  onChange: (updated: Partial<AnniversaryConfig>) => void;
  onSave: () => void;
}

export const AnniversaryTab: React.FC<AnniversaryTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Anniversary Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure countdown timers, love milestone counters, and display layouts.
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
            Milestone Message / Quote
          </label>
          <textarea
            rows={3}
            value={config.milestoneMessage}
            onChange={(e) => onChange({ milestoneMessage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            placeholder="Every single day with you is a gift I treasure forever."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Timer Card Display Layout
          </label>
          <select
            value={config.displayStyle}
            onChange={(e) => onChange({ displayStyle: e.target.value as any })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
          >
            <option value="cards">Detailed Timer Grid Cards</option>
            <option value="minimal">Clean Minimalist Counter</option>
            <option value="detailed">Expanded Detailed Counter</option>
          </select>
        </div>
      </div>
    </div>
  );
};
