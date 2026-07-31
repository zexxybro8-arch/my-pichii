import React from 'react';
import { Save, Palette, Sparkles, Sliders, Type, Layout, Moon, Sun, Wand2 } from 'lucide-react';
import { ThemeSettingsConfig } from '../../types';

interface ThemeSettingsTabProps {
  config: ThemeSettingsConfig;
  onChange: (updated: Partial<ThemeSettingsConfig>) => void;
  onSave: () => void;
}

export const ThemeSettingsTab: React.FC<ThemeSettingsTabProps> = ({ config, onChange, onSave }) => {
  const presetPalettes = [
    {
      label: 'Ultra-Luxury Rose Gold & Ivory',
      primary: '#ff5c9a',
      secondary: '#ebcb8b',
      accent: '#d89ca4',
      bg: '#fffdf8',
      gradient: 'radial-gradient(ellipse at top, #FFFDF8, #FFE4EC, #EEDCFF)',
    },
    {
      label: 'Romantic Velvet Crimson',
      primary: '#e63946',
      secondary: '#ffb703',
      accent: '#f1faee',
      bg: '#1d3557',
      gradient: 'linear-gradient(to bottom right, #1d3557, #457b9d, #e63946)',
    },
    {
      label: 'Blush & Sunset Glow',
      primary: '#ff4d6d',
      secondary: '#ff758f',
      accent: '#ffb3c1',
      bg: '#fff0f3',
      gradient: 'linear-gradient(to top, #fff0f3, #ffe5ec, #ffc2d1)',
    },
    {
      label: 'Starry Midnight Amethyst',
      primary: '#c77dff',
      secondary: '#e0aaff',
      accent: '#ffd6ff',
      bg: '#10002b',
      gradient: 'radial-gradient(circle at center, #240046, #10002b, #03001e)',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-rose-400" />
            <span>Global Theme & Aesthetic CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete design freedom: modify primary/secondary/accent colors, gradients, typography, border radius, glassmorphism, and dark/light modes.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Theme Settings</span>
        </button>
      </div>

      {/* Preset Palettes */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-amber-400" />
          <span>Luxury Preset Color Themes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetPalettes.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() =>
                onChange({
                  primaryColor: p.primary,
                  secondaryColor: p.secondary,
                  accentColor: p.accent,
                  backgroundColor: p.bg,
                  backgroundGradient: p.gradient,
                })
              }
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-left transition group"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: p.secondary }} />
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white block truncate">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Palette */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-rose-400" />
          <span>Custom Color Palette</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Color</label>
            <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{config.primaryColor}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Secondary Color</label>
            <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.secondaryColor || '#ebcb8b'}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{config.secondaryColor || '#ebcb8b'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Accent Color</label>
            <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{config.accentColor}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Background Base Color</label>
            <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{config.backgroundColor}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Background Gradient CSS</label>
            <input
              type="text"
              value={config.backgroundGradient || ''}
              onChange={(e) => onChange({ backgroundGradient: e.target.value })}
              placeholder="e.g. radial-gradient(ellipse at top, #FFFDF8, #FFE4EC, #EEDCFF)"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Typography & Shape Styling */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-purple-400" />
          <span>Fonts, Borders & Glassmorphism</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary Google Font</label>
            <select
              value={config.fontFamily}
              onChange={(e) => onChange({ fontFamily: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="jakarta">Plus Jakarta Sans (Apple/Modern)</option>
              <option value="playfair">Playfair Display (Luxury Elegant)</option>
              <option value="inter">Inter (Clean Modern)</option>
              <option value="dancing">Dancing Script (Romantic Cursive)</option>
              <option value="lora">Lora (Classic Editorial)</option>
              <option value="caveat">Caveat (Personal Handwriting)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Border Radius Style</label>
            <select
              value={config.borderRadius || '3xl'}
              onChange={(e) => onChange({ borderRadius: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="none">Square (0px)</option>
              <option value="lg">Rounded (12px)</option>
              <option value="2xl">Extra Rounded (24px)</option>
              <option value="3xl">Super Rounded Pill (32px - Apple Style)</option>
              <option value="full">Capsule / Full Pill</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Shadow Depth</label>
            <select
              value={config.shadowIntensity || 'glow'}
              onChange={(e) => onChange({ shadowIntensity: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="none">Flat (No Shadows)</option>
              <option value="soft">Soft Subtle Shadow</option>
              <option value="medium">Medium Shadow</option>
              <option value="deep">Deep 3D Shadow</option>
              <option value="glow">Multi-layer Rose Gold Glow</option>
            </select>
          </div>
        </div>

        {/* Glassmorphism Slider */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Layout className="w-4 h-4 text-rose-400" />
              <span>Glassmorphism Frosting Intensity</span>
            </label>
            <span className="text-xs font-mono font-bold text-rose-400">
              {config.glassmorphismIntensity ?? 85}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={config.glassmorphismIntensity ?? 85}
            onChange={(e) => onChange({ glassmorphismIntensity: parseInt(e.target.value) })}
            className="w-full accent-rose-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
          />
        </div>

        {/* Dark Mode & Particles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Atmospheric Particles</label>
            <select
              value={config.particleEffect}
              onChange={(e) => onChange({ particleEffect: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="falling-hearts">Falling Hearts & Flowers ❤️🌸</option>
              <option value="rose-petals">Rose Petals Drift 🌹🍃</option>
              <option value="floating-stars">Floating Stars & Twinkles ✨⭐</option>
              <option value="sparkles">Golden Sparkles & Crystals 💎</option>
              <option value="butterflies">Animated Floating Butterflies 🦋</option>
              <option value="sakura">Cherry Blossom Sakura Rain 🌸</option>
              <option value="none">Disabled (No Particles)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Color Theme Mode</label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onChange({ darkMode: false })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                  !config.darkMode
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Romance</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ darkMode: true })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                  config.darkMode
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Dark Luxury</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
