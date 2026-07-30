import React from 'react';
import { Save, Gift, Sparkles, Music, CheckCircle2 } from 'lucide-react';
import { WelcomePopupConfig } from '../../types';

interface WelcomePopupTabProps {
  config: WelcomePopupConfig;
  onChange: (updated: Partial<WelcomePopupConfig>) => void;
  onSave: () => void;
}

export const WelcomePopupTab: React.FC<WelcomePopupTabProps> = ({ config, onChange, onSave }) => {
  const animOptions: { id: WelcomePopupConfig['animation']; label: string }[] = [
    { id: 'fade-scale', label: 'Fade & Zoom' },
    { id: 'slide-up', label: 'Slide Up' },
    { id: 'bounce-in', label: 'Bounce' },
    { id: 'heart-pulse', label: 'Heart Pulse' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            <span>Welcome Popup Editor</span>
          </h2>
          <p className="text-xs text-slate-400">
            Customize the romantic greeting modal that appears when visitors first open the experience.
          </p>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs rounded-lg shadow-md transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Split Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Enable Welcome Popup
              </h4>
              <p className="text-xs text-slate-500">Display modal on initial website entry</p>
            </div>
            <input
              type="checkbox"
              checked={config.showPopup}
              onChange={(e) => onChange({ showPopup: e.target.checked })}
              className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Girlfriend Name
            </label>
            <input
              type="text"
              value={config.girlfriendName}
              onChange={(e) => onChange({ girlfriendName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all text-slate-900 dark:text-white text-sm"
              placeholder="PICCHI"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Popup Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 dark:text-white text-sm"
              placeholder="Hey PICCHI ❤️"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Popup Message
            </label>
            <textarea
              rows={4}
              value={config.message}
              onChange={(e) => onChange({ message: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 dark:text-white text-sm leading-relaxed resize-none"
              placeholder={`I made something very special just for you...\n\nClose your eyes...\nTake a deep breath...\n\nNow press Continue ❤️`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => onChange({ buttonText: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
                placeholder="Continue ❤️"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Background Theme
              </label>
              <select
                value={config.backgroundStyle}
                onChange={(e) => onChange({ backgroundStyle: e.target.value as any })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white text-sm"
              >
                <option value="romantic-gradient">Dreamy Rose</option>
                <option value="starry-night">Starry Night</option>
                <option value="sunset-glow">Sunset Glow</option>
                <option value="rose-petals">Soft Rose Petals</option>
                <option value="deep-velvet">Deep Velvet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Popup Animation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {animOptions.map((opt) => {
                const isSel = config.animation === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ animation: opt.id })}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold transition-colors ${
                      isSel
                        ? 'bg-pink-500/10 text-pink-500 border-pink-400 dark:border-pink-500'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview Frame */}
        <div className="bg-slate-200 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-800 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Live Phone Preview
            </h3>
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* Device Mockup */}
          <div className="w-full max-w-[340px] h-[580px] bg-[#050505] rounded-[40px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 my-auto">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-10 left-10 w-28 h-28 bg-pink-500 rounded-full blur-[60px]" />
              <div className="absolute bottom-20 right-10 w-36 h-36 bg-purple-500 rounded-full blur-[80px]" />
            </div>

            {/* Popup Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl w-full text-center shadow-2xl relative z-10">
              <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-xl text-white shadow-md">
                ❤️
              </div>
              <h4 className="text-white font-serif text-xl font-bold mb-3">
                {config.title || `Hey ${config.girlfriendName} ❤️`}
              </h4>
              <p className="text-white/80 text-xs leading-relaxed mb-6 whitespace-pre-line font-medium">
                {config.message}
              </p>
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg text-xs">
                {config.buttonText || 'Continue ❤️'}
              </button>
            </div>

            {/* Bottom Phone Bar */}
            <div className="absolute bottom-4 w-1/3 h-1 bg-white/20 rounded-full" />
          </div>

          <div className="mt-4 flex items-center space-x-4 text-[11px] text-slate-500 dark:text-slate-400 justify-center">
            <div className="flex items-center space-x-1">
              <Music className="w-3.5 h-3.5 text-pink-500" />
              <span>Background Music Enabled</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Auto-start Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
