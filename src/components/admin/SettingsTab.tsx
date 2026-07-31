import React, { useRef } from 'react';
import { AppConfig, SiteSettingsConfig } from '../../types';
import { INITIAL_DEFAULT_CONFIG } from '../../data/defaultConfig';
import { Settings, Calendar, Clock, Download, Upload, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';

interface SettingsTabProps {
  config: AppConfig;
  onChangeConfig: (updated: Partial<AppConfig>) => void;
  onSave: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  config,
  onChangeConfig,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `romantic_ surprise_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onChangeConfig(parsed);
          onSave();
          alert('Configuration imported successfully! ✨');
        }
      } catch (err) {
        alert('Invalid JSON configuration file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset ALL website settings and copy to default romantic template?')) {
      onChangeConfig(INITIAL_DEFAULT_CONFIG);
      onSave();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-rose-400" />
            <span>System Settings & Backups</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage relationship dates, time zones, export JSON backups, or restore defaults.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Settings
        </button>
      </div>

      {/* Dates & Timezone */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Core Relationship Dates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Relationship Start Date & Time</label>
            <input
              type="text"
              value={config.relationshipStartDate}
              onChange={(e) => onChangeConfig({ relationshipStartDate: e.target.value })}
              placeholder="YYYY-MM-DDTHH:mm:ss (e.g. 2025-03-21T11:20:43)"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
            <p className="text-[10px] text-slate-500">Exact date and time when your relationship began.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Anniversary Date</label>
            <input
              type="date"
              value={config.anniversaryDate?.split('T')[0] || ''}
              onChange={(e) => onChangeConfig({ anniversaryDate: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-slate-500">Upcoming anniversary date for countdown display.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Time Zone</label>
            <select
              value={config.siteSettingsConfig?.timeZone || 'UTC'}
              onChange={(e) =>
                onChangeConfig({
                  siteSettingsConfig: { ...config.siteSettingsConfig, timeZone: e.target.value },
                })
              }
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="America/New_York">America/New_York (EST -5:00)</option>
              <option value="Europe/London">Europe/London (GMT +0:00)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Date Format</label>
            <select
              value={config.siteSettingsConfig?.dateFormat || 'YYYY-MM-DD'}
              onChange={(e) =>
                onChangeConfig({
                  siteSettingsConfig: { ...config.siteSettingsConfig, dateFormat: e.target.value },
                })
              }
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-03-21)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (21/03/2025)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (03/21/2025)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Backup & Restore (JSON Export / Import)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Export a complete JSON snapshot of all your custom text, colors, letter content, and messages to keep offline, or import a saved backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Backup JSON</span>
          </button>

          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Restore From JSON</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-rose-950/20 p-6 rounded-2xl border border-rose-900/40 space-y-3">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Danger Zone: Reset Website</span>
        </h3>
        <p className="text-xs text-slate-400">
          Reset all configuration fields back to the initial romantic default template. This will override current unsaved draft changes.
        </p>

        <button
          onClick={handleResetToDefaults}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Website to Default Template</span>
        </button>
      </div>
    </div>
  );
};
