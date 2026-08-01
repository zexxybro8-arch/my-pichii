import React from 'react';
import { Save, Users, Calendar, Heart } from 'lucide-react';
import { AppConfig } from '../../types';

interface CoupleInfoTabProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
  onSave: () => void;
}

export const CoupleInfoTab: React.FC<CoupleInfoTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            <span>Couple Information Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Edit partner names, important relationship milestones, and anniversary dates.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Girlfriend Name ❤️
            </label>
            <input
              type="text"
              value={config.girlfriendName}
              onChange={(e) => onChange({ girlfriendName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Picchi"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Boyfriend Name 💖
            </label>
            <input
              type="text"
              value={config.boyfriendName}
              onChange={(e) => onChange({ boyfriendName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Alex"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Relationship Start Date & Time</span>
            </label>
            <input
              type="datetime-local"
              step="1"
              value={config.relationshipStartDate?.substring(0, 19) || ''}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
                onChange({
                  relationshipStartDate: val,
                  anniversarySettings: {
                    ...config.anniversarySettings,
                    relationshipStartDate: val,
                  },
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Anniversary Date & Time</span>
            </label>
            <input
              type="datetime-local"
              step="1"
              value={config.anniversaryDate?.substring(0, 19) || ''}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
                onChange({
                  anniversaryDate: val,
                  anniversarySettings: {
                    ...config.anniversarySettings,
                    anniversaryDate: val,
                    countdownTargetDate: val,
                  },
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Footer Text
          </label>
          <input
            type="text"
            value={config.footerText}
            onChange={(e) => onChange({ footerText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            placeholder="e.g. Made with endless love, forever and always ❤️"
          />
        </div>
      </div>
    </div>
  );
};
