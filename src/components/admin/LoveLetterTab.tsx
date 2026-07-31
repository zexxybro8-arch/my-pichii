import React from 'react';
import { Save, Mail, Feather, Sliders, Music, Eye } from 'lucide-react';
import { LoveLetterConfig } from '../../types';

interface LoveLetterTabProps {
  config: LoveLetterConfig;
  onChange: (updated: Partial<LoveLetterConfig>) => void;
  onSave: () => void;
}

export const LoveLetterTab: React.FC<LoveLetterTabProps> = ({ config, onChange, onSave }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-rose-400" />
            <span>Love Letter Section CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Write your heartfelt romantic letter with custom typography, envelope wax seals, typewriter animations, and paper textures.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Letter Settings
        </button>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Salutation / Letter Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="My Dearest Picchi,"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Author Signature
            </label>
            <input
              type="text"
              value={config.authorSignature}
              onChange={(e) => onChange({ authorSignature: e.target.value })}
              placeholder="Your Loving Boyfriend"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Love Letter Message Content
          </label>
          <textarea
            rows={10}
            value={config.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Write your beautiful message here..."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 leading-relaxed resize-none font-serif"
          />
        </div>

        {/* Envelope & Styling Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Handwriting & Font Style
            </label>
            <select
              value={config.fontStyle}
              onChange={(e) => onChange({ fontStyle: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="handwriting">Romantic Cursive / Dancing Script</option>
              <option value="caveat">Personal Hand Cursive (Caveat)</option>
              <option value="playfair">Playfair Luxury Serif</option>
              <option value="serif">Classic Editorial Serif</option>
              <option value="modern">Clean Modern Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Paper Style & Texture
            </label>
            <select
              value={config.paperStyle || config.paperTexture || 'parchment'}
              onChange={(e) => onChange({ paperStyle: e.target.value as any, paperTexture: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="parchment">Warm Golden Parchment Paper</option>
              <option value="vintage">Vintage Antique Envelope</option>
              <option value="rose">Soft Pink Rose Cardstock</option>
              <option value="clean">Pure White Modern Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Typewriter Typing Speed
            </label>
            <select
              value={config.typingSpeed || 'medium'}
              onChange={(e) => onChange({ typingSpeed: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="slow">Slow Romantic Typewriter</option>
              <option value="medium">Medium Typewriter Speed</option>
              <option value="fast">Fast Typewriter Speed</option>
              <option value="instant">Instant Display (No Typing Effect)</option>
            </select>
          </div>
        </div>

        {/* Envelope Customizations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Envelope Color
            </label>
            <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input
                type="color"
                value={config.envelopeColor || '#ff5c9a'}
                onChange={(e) => onChange({ envelopeColor: e.target.value })}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{config.envelopeColor || '#ff5c9a'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Wax Seal Stamp Icon
            </label>
            <select
              value={config.waxSeal || 'rose'}
              onChange={(e) => onChange({ waxSeal: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="rose">Rose Flower 🌹</option>
              <option value="heart">Love Heart ❤️</option>
              <option value="crown">Royal Crown 👑</option>
              <option value="love">Cupid Bow 💘</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Envelope Open Animation
            </label>
            <select
              value={config.openAnimation || 'unfold'}
              onChange={(e) => onChange({ openAnimation: e.target.value as any })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="unfold">3D Unfold Flap</option>
              <option value="slide">Slide Out Paper</option>
              <option value="fade">Gentle Dissolve</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
