import React from 'react';
import { AnimationEditorConfig } from '../../types';
import { Sparkles, Zap, Heart, Flame, Layers, Eye, Move } from 'lucide-react';

interface AnimationEditorTabProps {
  config?: AnimationEditorConfig;
  onChange: (updated: Partial<AnimationEditorConfig>) => void;
  onSave: () => void;
}

export const AnimationEditorTab: React.FC<AnimationEditorTabProps> = ({
  config = {
    animationSpeed: 1,
    enableFloatingHearts: true,
    enableButterflies: true,
    enableSparkles: true,
    enableSakuraPetals: true,
    enableParallax: true,
    enable3DEffects: true,
    enableCardHoverEffects: true,
  },
  onChange,
  onSave,
}) => {
  const currentSpeed = config.animationSpeed ?? 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Animation & Visual FX Editor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize floating elements, animation speeds, 3D tilt effects, and interactive motion across every section.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Animation Settings
        </button>
      </div>

      {/* Speed Controls */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Global Motion Speed Scale</span>
        </h3>
        <p className="text-xs text-slate-400">
          Adjust overall transition and floating element speeds (0.5x Slow Romantic to 2.0x Fast).
        </p>

        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs font-mono text-slate-400">0.5x</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={currentSpeed}
            onChange={(e) => onChange({ animationSpeed: parseFloat(e.target.value) })}
            className="flex-1 accent-rose-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
          />
          <span className="text-xs font-mono text-rose-400 font-bold">{currentSpeed}x</span>
        </div>
      </div>

      {/* Floating Particles Toggles */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Floating Atmospheric Elements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'enableFloatingHearts', label: 'Floating Glowing Hearts', desc: 'Slowly rising glowing hearts overlay' },
            { key: 'enableButterflies', label: 'Floating Butterflies', desc: 'Subtle animated flutter butterflies' },
            { key: 'enableSparkles', label: 'Golden Sparkles Trail', desc: 'Magical shimmering ambient sparkles' },
            { key: 'enableSakuraPetals', label: 'Floating Sakura Petals', desc: 'Falling cherry blossom petal breeze' },
          ].map((item) => {
            const isChecked = config[item.key as keyof AnimationEditorConfig] ?? true;
            return (
              <label
                key={item.key}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? 'bg-rose-500/10 border-rose-500/40 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onChange({ [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 3D & Depth Effects */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>3D & Depth Motion FX</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'enableParallax', label: 'Parallax Scrolling', desc: 'Background depth reaction to scroll' },
            { key: 'enable3DEffects', label: '3D Card Tilt', desc: 'Floating cards tilt on hover' },
            { key: 'enableCardHoverEffects', label: 'Glass Glow Hover', desc: 'Soft glow outline on card interaction' },
          ].map((item) => {
            const isChecked = config[item.key as keyof AnimationEditorConfig] ?? true;
            return (
              <label
                key={item.key}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isChecked
                    ? 'bg-purple-500/10 border-purple-500/40 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChange({ [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
