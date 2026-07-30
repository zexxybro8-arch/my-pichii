import React from 'react';
import { Save, Palette, Sparkles } from 'lucide-react';
import { ThemeSettingsConfig } from '../../types';

interface ThemeSettingsTabProps {
  config: ThemeSettingsConfig;
  onChange: (updated: Partial<ThemeSettingsConfig>) => void;
  onSave: () => void;
}

export const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ config, onChange, onSave }) => {
  const presetPalettes = [
    { label: 'Romantic Rose Red', primary: '#e63946', bg: '#fff0f3', accent: '#ffb703' },
    { label: 'Sweet Pink Velvet', primary: '#ff4d6d', bg: '#fff0f5', accent: '#c77dff' },
    { label: 'Starry Midnight Purple', primary: '#9d4edd', bg: '#10002b', accent: '#ff9e00' },
    { label: 'Golden Romance', primary: '#d4af37', bg: '#fefae0', accent: '#e63946' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-500" />
            <span>Theme & Visual Styling Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Customize colors, particle animations (hearts, stars, rose petals), fonts, and wallpapers.
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

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {/* Preset Palettes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Preset Color Schemes
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presetPalettes.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  onChange({
                    primaryColor: p.primary,
                    backgroundColor: p.bg,
                    accentColor: p.accent,
                  })
                }
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-rose-400 text-left transition"
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.bg }} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <span className="text-xs font-mono">{config.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <span className="text-xs font-mono">{config.backgroundColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Highlight Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer"
              />
              <span className="text-xs font-mono">{config.accentColor}</span>
            </div>
          </div>
        </div>

        {/* Floating Particle Effect Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Floating Romantic Particle Animation</span>
          </label>
          <select
            value={config.particleEffect}
            onChange={(e) => onChange({ particleEffect: e.target.value as any })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="falling-hearts">Falling Hearts & Flowers ❤️🌸</option>
            <option value="rose-petals">Rose Petals Drift 🌹🍃</option>
            <option value="floating-stars">Floating Stars & Twinkles ✨⭐</option>
            <option value="sparkles">Golden Sparkles & Crystals 💎</option>
            <option value="none">Disabled (No Particles)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Background Wallpaper Image URL (Optional)
          </label>
          <input
            type="text"
            value={config.backgroundWallpaper}
            onChange={(e) => onChange({ backgroundWallpaper: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>
  );
};
