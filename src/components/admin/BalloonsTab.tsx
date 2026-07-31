import React, { useState } from 'react';
import { CircleDot, Plus, Trash2, Save, Volume2, Sparkles, Sliders } from 'lucide-react';
import { BalloonMessage, BalloonSectionConfig } from '../../types';

interface BalloonsTabProps {
  balloons: BalloonMessage[];
  config?: BalloonSectionConfig;
  onChangeBalloons: (balloons: BalloonMessage[]) => void;
  onChangeConfig?: (updated: Partial<BalloonSectionConfig>) => void;
  onSave: () => void;
}

export const BalloonsTab: React.FC<BalloonsTabProps> = ({
  balloons = [],
  config = {
    balloonSize: 'md',
    balloonSpeed: 'normal',
    floatingStyle: 'wobbly',
    enablePopSound: true,
    successAnimation: 'sparkles',
  },
  onChangeBalloons,
  onChangeConfig,
  onSave,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [newColor, setNewColor] = useState('#ff4d6d');

  const presetColors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c77dff', '#e0aaff', '#3a86ff', '#00f5d4'];

  const handleAddBalloon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newB: BalloonMessage = {
      id: `b_${Date.now()}`,
      color: newColor,
      message: newMessage,
      order: balloons.length + 1,
    };

    onChangeBalloons([...balloons, newB]);
    setNewMessage('');
  };

  const handleDelete = (id: string) => {
    onChangeBalloons(balloons.filter((b) => b.id !== id));
  };

  const handleUpdateMessage = (id: string, message: string) => {
    onChangeBalloons(balloons.map((b) => (b.id === id ? { ...b, message } : b)));
  };

  const handleUpdateColor = (id: string, color: string) => {
    onChangeBalloons(balloons.map((b) => (b.id === id ? { ...b, color } : b)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-rose-400" />
            <span>Balloon Wishes & Messages CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage floating balloons, secret popping messages, balloon floating styles, speeds, and audio effects.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Balloon Settings
        </button>
      </div>

      {/* Floating Dynamics Configuration */}
      {onChangeConfig && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Floating Physics & Audio Effects</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Balloon Size</label>
              <select
                value={config.balloonSize || 'md'}
                onChange={(e) => onChangeConfig({ balloonSize: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="sm">Small Balloons</option>
                <option value="md">Medium Balloons (Default)</option>
                <option value="lg">Large Balloons</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Floating Speed</label>
              <select
                value={config.balloonSpeed || 'normal'}
                onChange={(e) => onChangeConfig({ balloonSpeed: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="slow">Gentle Drift (Slow)</option>
                <option value="normal">Normal Float</option>
                <option value="fast">Breezy Float (Fast)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Floating Motion Style</label>
              <select
                value={config.floatingStyle || 'wobbly'}
                onChange={(e) => onChangeConfig({ floatingStyle: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="linear">Straight Up</option>
                <option value="wobbly">Romantic Sway (Wobbly)</option>
                <option value="spiral">Spiral Dance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enablePopSound ?? true}
                onChange={(e) => onChangeConfig({ enablePopSound: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Pop Sound Effect</span>
                </div>
                <div className="text-[10px] text-slate-400">Play realistic pop audio on touch</div>
              </div>
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Success Pop Burst FX</label>
              <select
                value={config.successAnimation || 'sparkles'}
                onChange={(e) => onChangeConfig({ successAnimation: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="confetti">Rainbow Confetti Burst</option>
                <option value="sparkles">Golden Sparkles</option>
                <option value="fireworks">Mini Fireworks</option>
                <option value="hearts">Floating Mini Hearts</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Add New Balloon */}
      <form
        onSubmit={handleAddBalloon}
        className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Add New Love Wish Balloon</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Secret Love Message inside Balloon
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="e.g. You make my heart skip a beat every time! 💕"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Balloon Color
          </label>
          <div className="flex items-center gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  newColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 rounded-full border-0 cursor-pointer bg-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Balloon</span>
        </button>
      </form>

      {/* Existing Balloons List */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white mb-2">
          Active Balloons ({balloons.length})
        </h3>

        {balloons.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
          >
            <div
              className="w-8 h-10 rounded-[50%] flex-shrink-0 shadow-sm"
              style={{ backgroundColor: b.color }}
            />
            <input
              type="text"
              value={b.message}
              onChange={(e) => handleUpdateMessage(b.id, e.target.value)}
              className="flex-1 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-rose-500 font-medium"
            />
            <input
              type="color"
              value={b.color}
              onChange={(e) => handleUpdateColor(b.id, e.target.value)}
              className="w-7 h-7 rounded-full border-0 cursor-pointer bg-transparent"
            />
            <button
              onClick={() => handleDelete(b.id)}
              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
