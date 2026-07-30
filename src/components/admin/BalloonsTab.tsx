import React, { useState } from 'react';
import { CircleDot, Plus, Trash2, Save, Heart } from 'lucide-react';
import { BalloonMessage } from '../../types';

interface BalloonsTabProps {
  balloons: BalloonMessage[];
  onChangeBalloons: (balloons: BalloonMessage[]) => void;
  onSave: () => void;
}

export const BalloonsTab: React.FC<BalloonsTabProps> = ({ balloons, onChangeBalloons, onSave }) => {
  const [newMessage, setNewMessage] = useState('');
  const [newColor, setNewColor] = useState('#ff4d6d');

  const presetColors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c77dff', '#e0aaff', '#3a86ff', '#00f5d4'];

  const handleAddBalloon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;

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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-rose-500" />
            <span>Balloon Messages Manager</span>
          </h2>
          <p className="text-xs text-slate-500">
            Add floating interactive balloons containing hidden love messages.
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

      {/* Add New Balloon */}
      <form
        onSubmit={handleAddBalloon}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" />
          <span>Add New Balloon</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Secret Love Message inside Balloon
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="e.g. You make my heart skip a beat every time! 💕"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Balloon Color
          </label>
          <div className="flex items-center gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  newColor === c ? 'border-slate-900 dark:border-white scale-110 shadow-md' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 rounded-full border-0 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!newMessage}
          className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Balloon</span>
        </button>
      </form>

      {/* Existing Balloons List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Current Balloons ({balloons.length})
        </h3>

        {balloons.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700"
          >
            <div
              className="w-8 h-10 rounded-[50%] flex-shrink-0 shadow-sm"
              style={{ backgroundColor: b.color }}
            />
            <input
              type="text"
              value={b.message}
              onChange={(e) => handleUpdateMessage(b.id, e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
            />
            <input
              type="color"
              value={b.color}
              onChange={(e) => handleUpdateColor(b.id, e.target.value)}
              className="w-7 h-7 rounded-full border-0 cursor-pointer"
            />
            <button
              onClick={() => handleDelete(b.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
