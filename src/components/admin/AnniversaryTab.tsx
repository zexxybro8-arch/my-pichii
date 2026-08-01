import React from 'react';
import {
  Save,
  Heart,
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  PartyPopper,
  Type,
  Tag,
  Smile,
  LayoutGrid,
  Zap,
} from 'lucide-react';
import { AnniversaryConfig } from '../../types';
import {
  formatForDateTimeInput,
  formatReadableDate,
  formatReadableTime,
  getCalendarTimeTogether,
  getCalendarAnniversaryCountdown,
} from '../../utils/dateUtils';

interface AnniversaryTabProps {
  config: AnniversaryConfig;
  onChange: (updated: Partial<AnniversaryConfig>) => void;
  onSave: () => void;
}

export const AnniversaryTab: React.FC<AnniversaryTabProps> = ({ config, onChange, onSave }) => {
  // Compute live calculations for preview inside the admin panel
  const now = new Date();
  const timeTogether = getCalendarTimeTogether(
    config.relationshipStartDate,
    now,
    config.isPaused,
    config.pausedAt
  );

  const countdown = getCalendarAnniversaryCountdown(
    config.relationshipStartDate,
    config.countdownTargetDate || config.anniversaryDate,
    now,
    config.isPaused,
    config.pausedAt,
    config.pausedRemainingSeconds
  );

  // Handle Pause / Resume toggle
  const handleTogglePause = () => {
    if (config.isPaused) {
      // Resume Countdown
      let updatedTarget = config.countdownTargetDate || config.anniversaryDate;
      
      // If we saved remaining seconds, extend target date by remaining seconds from now
      if (typeof config.pausedRemainingSeconds === 'number' && config.pausedRemainingSeconds > 0) {
        const newTarget = new Date(Date.now() + config.pausedRemainingSeconds * 1000);
        updatedTarget = newTarget.toISOString();
      }

      onChange({
        isPaused: false,
        pausedAt: undefined,
        pausedRemainingSeconds: undefined,
        countdownTargetDate: updatedTarget,
      });
    } else {
      // Pause Countdown
      const targetDate = new Date(config.countdownTargetDate || config.anniversaryDate || Date.now());
      const remainingSecs = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
      onChange({
        isPaused: true,
        pausedAt: new Date().toISOString(),
        pausedRemainingSeconds: remainingSecs,
      });
    }
  };

  // Handle Reset Countdown
  const handleResetCountdown = () => {
    // Reset target date to 1 year from relationship start or 1 year from today
    const startDate = new Date(config.relationshipStartDate || '2025-03-21T11:20:43');
    const resetTarget = new Date(startDate.getTime());
    resetTarget.setFullYear(resetTarget.getFullYear() + 1);

    // If already passed, set to 1 year from today
    if (resetTarget.getTime() <= Date.now()) {
      resetTarget.setTime(Date.now() + 365 * 86400 * 1000);
    }

    const isoTarget = resetTarget.toISOString();

    onChange({
      countdownTargetDate: isoTarget,
      anniversaryDate: isoTarget,
      isPaused: false,
      pausedAt: undefined,
      pausedRemainingSeconds: undefined,
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Anniversary & Countdown Settings</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fully dynamic, persistent countdown timer with Firestore integration, pause/resume, and date pickers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleTogglePause}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 border ${
              config.isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400'
            }`}
          >
            {config.isPaused ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Timer</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Timer</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetCountdown}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 border border-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          config.isPaused
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl font-bold ${
              config.isPaused ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white animate-pulse'
            }`}
          >
            {config.isPaused ? <Pause className="w-5 h-5 fill-white" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              Countdown Status: {config.isPaused ? 'PAUSED ⏸️' : 'ACTIVE & RUNNING ⚡'}
            </div>
            <div className="text-xs opacity-90 font-mono mt-0.5">
              Target Date: {formatReadableDate(config.countdownTargetDate || config.anniversaryDate)} | Progress: {countdown.progressPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-slate-800">
          <span>
            {String(countdown.years).padStart(2, '0')}y {String(countdown.months).padStart(2, '0')}m {String(countdown.days).padStart(2, '0')}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* SECTION 1: DATE & TIME PICKERS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Calendar className="w-4 h-4 text-rose-500" />
          <span>1. Date & Time Selection (100% Dynamic & Persistent)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Relationship Start Date & Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Start Date & Time</span>
              <span className="text-rose-500 text-[10px]">❤️ Mandatory</span>
            </label>
            <input
              type="datetime-local"
              step="1"
              value={formatForDateTimeInput(config.relationshipStartDate)}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
                onChange({ relationshipStartDate: val });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Starts the "Together Since" timer ({formatReadableDate(config.relationshipStartDate)} {formatReadableTime(config.relationshipStartDate)}).
            </p>
          </div>

          {/* Next Anniversary Date & Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Next Anniversary Date</span>
              <span className="text-amber-500 text-[10px]">💖 Special Day</span>
            </label>
            <input
              type="datetime-local"
              step="1"
              value={formatForDateTimeInput(config.anniversaryDate)}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
                onChange({ anniversaryDate: val, countdownTargetDate: val });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Official annual date ({formatReadableDate(config.anniversaryDate)}).
            </p>
          </div>

          {/* Countdown Target Date & Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Countdown Target Date</span>
              <span className="text-emerald-500 text-[10px]">⏱️ Live Target</span>
            </label>
            <input
              type="datetime-local"
              step="1"
              value={formatForDateTimeInput(config.countdownTargetDate || config.anniversaryDate)}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : e.target.value;
                onChange({ countdownTargetDate: val });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target for live countdown. Changing this immediately restarts the countdown.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: CUSTOM TEXTS, TITLES & MESSAGES */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Type className="w-4 h-4 text-rose-500" />
          <span>2. Customize Titles, Subtitles & Button Texts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Greeting Title
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Hey"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Together Since Label
            </label>
            <input
              type="text"
              value={config.togetherSinceLabel || ''}
              onChange={(e) => onChange({ togetherSinceLabel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Together Since"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Header Subtitle
          </label>
          <input
            type="text"
            value={config.subtitle || ''}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            placeholder="Welcome to Our Beautiful Journey of Love & Cute Memories 💕"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Timer Subtext / Milestone Quote
          </label>
          <input
            type="text"
            value={config.milestoneMessage || ''}
            onChange={(e) => onChange({ milestoneMessage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            placeholder="💕 Every second with you is my favorite memory. 💕"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Countdown Section Title</span>
              <span className="text-rose-500 font-mono text-[10px]">✨ Editable Title</span>
            </label>
            <input
              type="text"
              value={config.cardTitle || ''}
              onChange={(e) => onChange({ cardTitle: e.target.value, titleCountdownCard: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 font-bold"
              placeholder="Until Our Next Anniversary"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Title header displayed above the 6 countdown boxes ("Until Our Next Anniversary").
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Countdown Badge Text
            </label>
            <input
              type="text"
              value={config.cardBadge || ''}
              onChange={(e) => onChange({ cardBadge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Next Anniversary"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Badge subtitle displayed below the 6 countdown boxes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Love Progress Title
            </label>
            <input
              type="text"
              value={config.progressTitle || ''}
              onChange={(e) => onChange({ progressTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Our Love Journey Progress"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Love Progress Subtitle
            </label>
            <input
              type="text"
              value={config.progressSubtitle || ''}
              onChange={(e) => onChange({ progressSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
              placeholder="Celebrating every moment we spend together"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Continue Button Text
          </label>
          <input
            type="text"
            value={config.buttonText || ''}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 font-bold"
            placeholder="Continue Our Journey"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-rose-500" />
              <span>Final Celebration & Finale Page CMS</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              To edit the single Final Celebration page titles, love letter, fireworks, handwritten ending, and audio, use the <strong>Final Celebration</strong> CMS tab in the left sidebar.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: CUSTOM UNIT LABELS & EMOJIS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Smile className="w-4 h-4 text-rose-500" />
          <span>3. Unit Labels & Emojis</span>
        </h3>

        {/* Labels Row */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Timer Unit Labels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { key: 'customLabelYears', label: 'Years', defaultVal: 'YEARS' },
              { key: 'customLabelMonths', label: 'Months', defaultVal: 'MONTHS' },
              { key: 'customLabelDays', label: 'Days', defaultVal: 'DAYS' },
              { key: 'customLabelHours', label: 'Hours', defaultVal: 'HOURS' },
              { key: 'customLabelMinutes', label: 'Minutes', defaultVal: 'MINUTES' },
              { key: 'customLabelSeconds', label: 'Seconds', defaultVal: 'SECONDS' },
            ].map((unit) => (
              <div key={unit.key}>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">{unit.label}</span>
                <input
                  type="text"
                  value={(config as any)[unit.key] || ''}
                  onChange={(e) => onChange({ [unit.key]: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs text-center font-mono font-bold"
                  placeholder={unit.defaultVal}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Emojis Row */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Card Icons / Emojis
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { key: 'emojiYears', label: 'Years Emoji', defaultVal: '👑' },
              { key: 'emojiMonths', label: 'Months Emoji', defaultVal: '🤍' },
              { key: 'emojiDays', label: 'Days Emoji', defaultVal: '⭐' },
              { key: 'emojiHours', label: 'Hours Emoji', defaultVal: '🕐' },
              { key: 'emojiMinutes', label: 'Minutes Emoji', defaultVal: '⏱️' },
              { key: 'emojiSeconds', label: 'Seconds Emoji', defaultVal: '✨' },
            ].map((unit) => (
              <div key={unit.key}>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">{unit.label}</span>
                <input
                  type="text"
                  value={(config as any)[unit.key] || ''}
                  onChange={(e) => onChange({ [unit.key]: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base text-center font-bold"
                  placeholder={unit.defaultVal}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: DISPLAY STYLE & TIMER OPTIONS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <LayoutGrid className="w-4 h-4 text-rose-500" />
          <span>4. Layout Style & Options</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Timer Card Layout
            </label>
            <select
              value={config.displayStyle || 'cards'}
              onChange={(e) => onChange({ displayStyle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500"
            >
              <option value="cards">Detailed Timer Grid Cards (3x2)</option>
              <option value="minimal">Clean Minimalist Counter</option>
              <option value="detailed">Expanded Detailed Counter</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Enable Live Second Ticks
              </span>
              <span className="text-[11px] text-slate-500">
                Smooth 1-second dynamic flip animations
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.showLiveTimer !== false}
              onChange={(e) => onChange({ showLiveTimer: e.target.checked })}
              className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500 accent-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button Footer */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save All Anniversary Settings to Database</span>
        </button>
      </div>
    </div>
  );
};
