import React from 'react';
import { Heart, Lock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { JourneyStep, JOURNEY_STEPS } from '../../types';

interface PublicNavbarProps {
  girlfriendName: string;
  currentStep: JourneyStep;
  unlockedStepIndex: number;
  onSelectStep: (step: JourneyStep) => void;
  onOpenAdmin: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  girlfriendName,
  currentStep,
  unlockedStepIndex,
  onSelectStep,
  onOpenAdmin,
}) => {
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === currentStep);
  const currentMeta = JOURNEY_STEPS[currentIndex] || JOURNEY_STEPS[0];

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < unlockedStepIndex && currentIndex < JOURNEY_STEPS.length - 1;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-rose-200/60 dark:border-rose-950/60 text-slate-800 dark:text-white select-none transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div
          onClick={() => onSelectStep('welcome')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight block leading-tight flex items-center gap-1">
              For {girlfriendName || 'My Love'} <Sparkles className="w-3 h-3 text-pink-500" />
            </span>
            <span className="text-[10px] text-rose-500 dark:text-pink-400 font-extrabold uppercase tracking-wider">
              Romantic Surprise Box
            </span>
          </div>
        </div>

        {/* Step Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center max-w-md">
          {/* Prev Button */}
          <button
            disabled={!canGoPrev}
            onClick={() => onSelectStep(JOURNEY_STEPS[currentIndex - 1].id)}
            className={`p-2 rounded-xl border transition-all ${
              canGoPrev
                ? 'bg-rose-50 dark:bg-slate-900 text-rose-600 dark:text-pink-400 border-rose-200/80 dark:border-pink-500/30 hover:bg-rose-100 dark:hover:bg-slate-800 active:scale-95'
                : 'bg-slate-100/50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Current Step Pill */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60 border border-rose-300/80 dark:border-pink-500/30 px-3.5 py-1 rounded-full text-xs font-black text-rose-600 dark:text-pink-300 shadow-sm">
              <span className="text-sm">{currentMeta.icon}</span>
              <span className="hidden sm:inline">Step {currentMeta.stepNumber}/10:</span>
              <span className="truncate max-w-[110px] sm:max-w-none">{currentMeta.title}</span>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1 mt-1.5">
              {JOURNEY_STEPS.map((s, idx) => {
                const isActive = s.id === currentStep;
                const isUnlocked = idx <= unlockedStepIndex;
                return (
                  <button
                    key={s.id}
                    disabled={!isUnlocked}
                    onClick={() => onSelectStep(s.id)}
                    className={`h-1.5 rounded-full transition-all ${
                      isActive
                        ? 'w-5 bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm'
                        : isUnlocked
                        ? 'w-1.5 bg-rose-200 dark:bg-slate-700 hover:bg-pink-400'
                        : 'w-1.5 bg-slate-200 dark:bg-slate-800/80 cursor-not-allowed'
                    }`}
                    title={`Step ${s.stepNumber}: ${s.title}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            disabled={!canGoNext}
            onClick={() => onSelectStep(JOURNEY_STEPS[currentIndex + 1].id)}
            className={`p-2 rounded-xl border transition-all ${
              canGoNext
                ? 'bg-rose-50 dark:bg-slate-900 text-rose-600 dark:text-pink-400 border-rose-200/80 dark:border-pink-500/30 hover:bg-rose-100 dark:hover:bg-slate-800 active:scale-95'
                : 'bg-slate-100/50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Login Button */}
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-pink-500/10 text-rose-600 dark:text-pink-400 border border-rose-200 dark:border-pink-500/30 text-xs font-bold hover:bg-rose-100 dark:hover:bg-pink-500/20 active:scale-95 transition shrink-0 shadow-sm"
          title="Open Admin CMS Panel"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
};

