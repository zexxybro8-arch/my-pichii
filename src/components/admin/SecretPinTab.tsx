import React from 'react';
import { Save, Lock, KeyRound } from 'lucide-react';
import { SecretPinConfig } from '../../types';

interface SecretPinTabProps {
  config: SecretPinConfig;
  onChange: (updated: Partial<SecretPinConfig>) => void;
  onSave: () => void;
}

export const SecretPinTab: React.FC<SecretPinTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" />
            <span>Secret PIN Lock Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Require your partner to enter a secret 4-digit PIN code to unlock the surprise.
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
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enable Secret PIN Gate</h4>
            <p className="text-xs text-slate-500">Require 4-digit numeric code before opening full surprise</p>
          </div>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-rose-500" />
              <span>4-Digit Secret PIN</span>
            </label>
            <input
              type="text"
              maxLength={4}
              value={config.pin}
              onChange={(e) => onChange({ pin: e.target.value.replace(/\D/g, '') })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center text-lg font-bold focus:ring-2 focus:ring-rose-500"
              placeholder="1402"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              PIN Hint Message
            </label>
            <input
              type="text"
              value={config.hint}
              onChange={(e) => onChange({ hint: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Hint: Our Anniversary Date (DDMM)"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Unlocked Message Subtitle
          </label>
          <input
            type="text"
            value={config.unlockedMessage}
            onChange={(e) => onChange({ unlockedMessage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            placeholder="You remembered our special date! Here is your journey of love."
          />
        </div>
      </div>
    </div>
  );
};
