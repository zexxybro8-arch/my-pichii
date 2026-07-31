import React from 'react';
import { Save, Puzzle, Upload, Sliders, Volume2, Wand2 } from 'lucide-react';
import { PuzzleConfig } from '../../types';

interface PuzzleTabProps {
  config: PuzzleConfig;
  onChange: (updated: Partial<PuzzleConfig>) => void;
  onSave: () => void;
}

export const PuzzleTab: React.FC<PuzzleTabProps> = ({ config, onChange, onSave }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({ imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-purple-400" />
            <span>Memory Puzzle Section CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure puzzle images, grid dimensions (3x3, 4x4, 5x5), auto-solve toggles, and victory messages.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Puzzle Settings
        </button>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Puzzle Image (Upload or Paste URL)
          </label>
          <div className="flex gap-2 mb-2">
            <label className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-bold cursor-pointer hover:bg-purple-500/20 flex items-center justify-center gap-2 transition">
              <Upload className="w-4 h-4" />
              <span>Upload Custom Puzzle Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <input
            type="text"
            value={config.imageUrl}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
          />
        </div>

        {config.imageUrl && (
          <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <img
              src={config.imageUrl}
              alt="Puzzle Preview"
              className="w-20 h-20 object-cover rounded-xl border border-slate-700"
            />
            <div>
              <span className="text-xs font-bold text-purple-400 block">Puzzle Image Active</span>
              <span className="text-[10px] text-slate-500 font-mono break-all">{config.imageUrl.slice(0, 50)}...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Grid Size (Difficulty Level)
            </label>
            <select
              value={config.gridSize}
              onChange={(e) => onChange({ gridSize: parseInt(e.target.value) })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value={3}>3x3 (Easy - 9 Pieces)</option>
              <option value={4}>4x4 (Medium - 16 Pieces)</option>
              <option value={5}>5x5 (Hard - 25 Pieces)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Reward / Completion Title
            </label>
            <input
              type="text"
              value={config.rewardTitle}
              onChange={(e) => onChange({ rewardTitle: e.target.value })}
              placeholder="Puzzle Master of My Heart 🧩"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Completion Message
          </label>
          <textarea
            rows={3}
            value={config.completionMessage}
            onChange={(e) => onChange({ completionMessage: e.target.value })}
            placeholder="You solved our memory puzzle! You complete me in every way. ❤️"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>

        {/* Action Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableShuffleButton ?? true}
              onChange={(e) => onChange({ enableShuffleButton: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-200">Shuffle Button</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableSolveForMe ?? true}
              onChange={(e) => onChange({ enableSolveForMe: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-200">Solve For Me Button</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableSounds ?? true}
              onChange={(e) => onChange({ enableSounds: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-200">Puzzle Sounds</span>
          </label>
        </div>
      </div>
    </div>
  );
};
