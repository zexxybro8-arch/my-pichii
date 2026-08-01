import React, { useState } from 'react';
import { Save, Ticket, Plus, Trash2, Sliders, Volume2, Sparkles, Gift, Heart, Coffee, Film, UtensilsCrossed, Smile, Crown } from 'lucide-react';
import { ScratchCardConfig, ScratchRewardCard } from '../../types';

interface ScratchCardTabProps {
  config: ScratchCardConfig;
  onChange: (updated: Partial<ScratchCardConfig>) => void;
  onSave: () => void;
}

export const ScratchCardTab: React.FC<ScratchCardTabProps> = ({ config, onChange, onSave }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newIcon, setNewIcon] = useState('Gift');

  const rewardCards = config.rewardCards || [
    { id: 'r1', title: 'Unlimited Hugs', subtitle: 'Valid Anytime, Anywhere', icon: 'Heart', color: 'from-[#FF5C9A] to-[#D89CA4]' },
    { id: 'r2', title: '1000 Kisses', subtitle: 'Sweetness Guaranteed', icon: 'Sparkles', color: 'from-[#EBCB8B] to-[#FF5C9A]' },
    { id: 'r3', title: 'Date Night', subtitle: 'Your Favorite Mood', icon: 'Coffee', color: 'from-[#FFD3B6] to-[#FF5C9A]' },
    { id: 'r4', title: 'Movie Night', subtitle: 'Snacks & Cuddles', icon: 'Film', color: 'from-[#EEDCFF] to-[#D89CA4]' },
    { id: 'r5', title: 'Romantic Dinner', subtitle: 'Cooked With Love', icon: 'UtensilsCrossed', color: 'from-[#FF5C9A] to-[#EBCB8B]' },
    { id: 'r6', title: 'One Wish Coupon', subtitle: 'Command Anything', icon: 'Smile', color: 'from-[#EBCB8B] to-[#FFE4EC]' },
  ];

  const availableIcons = [
    { name: 'Heart', label: 'Heart ❤️' },
    { name: 'Sparkles', label: 'Sparkles ✨' },
    { name: 'Coffee', label: 'Coffee ☕' },
    { name: 'Film', label: 'Movie 🎬' },
    { name: 'UtensilsCrossed', label: 'Dinner 🍴' },
    { name: 'Smile', label: 'Smile 😊' },
    { name: 'Crown', label: 'Crown 👑' },
    { name: 'Gift', label: 'Gift 🎁' },
  ];

  const handleAddRewardCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCard: ScratchRewardCard = {
      id: `r_${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Special Love Voucher',
      icon: newIcon,
      color: 'from-[#FF5C9A] to-[#EBCB8B]',
    };

    onChange({ rewardCards: [...rewardCards, newCard] });
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleDeleteCard = (id: string) => {
    onChange({ rewardCards: rewardCards.filter((c) => c.id !== id) });
  };

  const handleUpdateCard = (id: string, updated: Partial<ScratchRewardCard>) => {
    onChange({
      rewardCards: rewardCards.map((c) => (c.id === id ? { ...c, ...updated } : c)),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-amber-400" />
            <span>Scratch Card & Golden Voucher CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize every title, subtitle, header, coupon card, overlay instructions, buttons, and secret reward.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Scratch Settings</span>
        </button>
      </div>

      {/* Main Voucher Info & Titles */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Gift className="w-4 h-4 text-rose-400" />
          <span>Section Header & Main Titles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Top Header Badge
            </label>
            <input
              type="text"
              value={config.voucherBadge || ''}
              onChange={(e) => onChange({ voucherBadge: e.target.value })}
              placeholder="Exclusive Voucher"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Main Section Title
            </label>
            <input
              type="text"
              value={config.voucherTitle || ''}
              onChange={(e) => onChange({ voucherTitle: e.target.value })}
              placeholder="Love Voucher Certificate 🎟️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Inner Card Coupon Title
            </label>
            <input
              type="text"
              value={config.couponHeader || ''}
              onChange={(e) => onChange({ couponHeader: e.target.value })}
              placeholder="Love Coupon Certificate 🎁"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Main Section Subtitle
          </label>
          <input
            type="text"
            value={config.voucherDescription || ''}
            onChange={(e) => onChange({ voucherDescription: e.target.value })}
            placeholder="Scratch off the rose-gold champagne foil to claim your official romantic gift certificate."
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Unlocked Badge Label
            </label>
            <input
              type="text"
              value={config.unlockedBadgeText || ''}
              onChange={(e) => onChange({ unlockedBadgeText: e.target.value })}
              placeholder="Official Certificate Unlocked ❤️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Hidden Coupon Description / Message
            </label>
            <input
              type="text"
              value={config.hiddenMessage || ''}
              onChange={(e) => onChange({ hiddenMessage: e.target.value })}
              placeholder="🎉 SPECIAL COUPON: Unlimited Warm Hugs, Late Night Ice Cream & 1000 Kisses On Demand! Valid Forever ❤️"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Foil Instructions & Buttons Config */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Foil Overlay Text & Action Buttons</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Foil Main Text Instruction
            </label>
            <input
              type="text"
              value={config.overlayText || ''}
              onChange={(e) => onChange({ overlayText: e.target.value })}
              placeholder="Rub foil with finger to unlock certificate"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Foil Subtext Instruction
            </label>
            <input
              type="text"
              value={config.overlaySubtext || ''}
              onChange={(e) => onChange({ overlaySubtext: e.target.value })}
              placeholder="Scratch softly to reveal hidden voucher"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Scratch Again Button Label
            </label>
            <input
              type="text"
              value={config.scratchAgainButtonText || ''}
              onChange={(e) => onChange({ scratchAgainButtonText: e.target.value })}
              placeholder="Scratch Foil Again"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Continue Button Label
            </label>
            <input
              type="text"
              value={config.continueButtonText || ''}
              onChange={(e) => onChange({ continueButtonText: e.target.value })}
              placeholder="Continue to Love Letter 💌"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Auto-Reveal Threshold ({config.revealPercentage || 30}%)
            </label>
            <input
              type="range"
              min="15"
              max="70"
              value={config.revealPercentage || 30}
              onChange={(e) => onChange({ revealPercentage: parseInt(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-slate-950 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* Reward Coupons List Manager */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Reward Coupon Cards ({rewardCards.length})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Edit reward title and subtitle directly below</span>
        </h3>

        {/* Add Coupon Form */}
        <form onSubmit={handleAddRewardCard} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 items-end">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. 1000 Kisses"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle</label>
            <input
              type="text"
              placeholder="e.g. Sweetness Guaranteed"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon</label>
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-rose-500"
            >
              {availableIcons.map((ic) => (
                <option key={ic.name} value={ic.name}>{ic.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </form>

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rewardCards.map((card) => (
            <div
              key={card.id}
              className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <select
                    value={card.icon || 'Gift'}
                    onChange={(e) => handleUpdateCard(card.id, { icon: e.target.value })}
                    className="bg-slate-900 text-amber-400 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic.name} value={ic.name}>{ic.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                    placeholder="Reward Title"
                    className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-md px-2 py-1 text-xs font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) => handleUpdateCard(card.id, { subtitle: e.target.value })}
                  placeholder="Reward Subtitle"
                  className="w-full bg-slate-900 text-slate-400 border border-slate-800 rounded-md px-2 py-1 text-[11px] focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={() => handleDeleteCard(card.id)}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                title="Delete reward card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
