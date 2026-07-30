import React from 'react';
import { Save, Puzzle, Upload } from 'lucide-react';
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-purple-500" />
            <span>Interactive Memory Puzzle Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure the photo jigsaw puzzle image, difficulty grid size, and celebration messages.
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
            Puzzle Image (Upload or Paste URL)
          </label>
          <div className="flex gap-2 mb-2">
            <label className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-300 text-xs font-bold cursor-pointer hover:bg-purple-100/50 flex items-center justify-center gap-2">
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
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>

        {config.imageUrl && (
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <img
              src={config.imageUrl}
              alt="Puzzle Preview"
              className="w-20 h-20 object-cover rounded-xl border"
            />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              Puzzle Image Active
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Grid Size (Difficulty)
            </label>
            <select
              value={config.gridSize}
              onChange={(e) => onChange({ gridSize: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value={3}>3x3 (Standard - 9 Pieces)</option>
              <option value={4}>4x4 (Challenging - 16 Pieces)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Reward / Completion Title
            </label>
            <input
              type="text"
              value={config.rewardTitle}
              onChange={(e) => onChange({ rewardTitle: e.target.value })}
              placeholder="Puzzle Master of My Heart 🧩"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Completion Message
          </label>
          <textarea
            rows={3}
            value={config.completionMessage}
            onChange={(e) => onChange({ completionMessage: e.target.value })}
            placeholder="You solved our memory puzzle! You complete me in every way. ❤️"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>
  );
};
