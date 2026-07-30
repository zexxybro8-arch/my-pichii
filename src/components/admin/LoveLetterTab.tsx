import React from 'react';
import { Save, Mail, Feather } from 'lucide-react';
import { LoveLetterConfig } from '../../types';

interface LoveLetterTabProps {
  config: LoveLetterConfig;
  onChange: (updated: Partial<LoveLetterConfig>) => void;
  onSave: () => void;
}

export const LoveLetterTab: React.FC<LoveLetterTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-500" />
            <span>Love Letter Editor</span>
          </h2>
          <p className="text-xs text-slate-500">
            Write your heartfelt message with rich styling, fonts, and paper textures.
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
            Salutation / Letter Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="My Dearest Picchi,"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Love Letter Message Content
          </label>
          <textarea
            rows={10}
            value={config.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Write your beautiful message here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Author Signature
            </label>
            <input
              type="text"
              value={config.authorSignature}
              onChange={(e) => onChange({ authorSignature: e.target.value })}
              placeholder="Your Loving Boyfriend"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Font Style
            </label>
            <select
              value={config.fontStyle}
              onChange={(e) => onChange({ fontStyle: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="handwriting">Romantic Cursive / Italic</option>
              <option value="playfair">Playfair Serif</option>
              <option value="serif">Classic Book Serif</option>
              <option value="modern">Clean Modern Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Paper Texture & Theme
            </label>
            <select
              value={config.paperTexture}
              onChange={(e) => onChange({ paperTexture: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="parchment">Warm Parchment Paper</option>
              <option value="vintage">Vintage Antique Envelope</option>
              <option value="rose">Soft Pink Rose</option>
              <option value="clean">Pure White Card</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
