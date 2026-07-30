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
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-rose-950/60 text-white select-none">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div
          onClick={() => onSelectStep('welcome')}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-white text-sm tracking-tight block leading-tight">
              For {girlfriendName || 'My Love'} ❤️
            </span>
            <span className="text-[10px] text-pink-400 font-medium">Romantic Journey</span>
          </div>
        </div>

        {/* Step Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center max-w-md">
          {/* Prev Button */}
          <button
            disabled={!canGoPrev}
            onClick={() => onSelectStep(JOURNEY_STEPS[currentIndex - 1].id)}
            className={`p-1.5 rounded-lg border transition ${
              canGoPrev
                ? 'bg-slate-900 text-pink-400 border-pink-500/30 hover:bg-slate-800'
                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Current Step Pill */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-bold text-pink-300">
              <span>{currentMeta.icon}</span>
              <span className="hidden sm:inline">Step {currentMeta.stepNumber}/10:</span>
              <span className="truncate max-w-[100px] sm:max-w-none">{currentMeta.title}</span>
            </div>
            
            {/* Dots */}
            <div className="flex items-center gap-1 mt-1">
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
                        ? 'w-4 bg-pink-500'
                        : isUnlocked
                        ? 'w-1.5 bg-slate-500 hover:bg-pink-400'
                        : 'w-1.5 bg-slate-800 cursor-not-allowed'
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
            className={`p-1.5 rounded-lg border transition ${
              canGoNext
                ? 'bg-slate-900 text-pink-400 border-pink-500/30 hover:bg-slate-800'
                : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Login Button */}
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/20 transition shrink-0"
          title="Open Admin CMS Panel"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
};
