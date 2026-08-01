import React, { useState } from 'react';
import { Eye, Smartphone, Tablet, Monitor, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppConfig, MemoryPhoto, Song, JourneyStep, JOURNEY_STEPS } from '../../types';
import { WelcomeGiftBoxPage } from '../public/WelcomeGiftBoxPage';
import { SecretPinPage } from '../public/SecretPinPage';
import { CurtainRevealPage } from '../public/CurtainRevealPage';
import { HeroSection } from '../public/HeroSection';
import { BalloonsSection } from '../public/BalloonsSection';
import { MemoriesSection } from '../public/MemoriesSection';
import { PuzzleSection } from '../public/PuzzleSection';
import { ScratchCardSection } from '../public/ScratchCardSection';
import { LoveLetterSection } from '../public/LoveLetterSection';
import { FinalCelebrationSection } from '../public/FinalCelebrationSection';
import { Footer } from '../public/Footer';
import { ParticleOverlay } from '../common/ParticleOverlay';

interface LivePreviewTabProps {
  config: AppConfig;
  memories: MemoryPhoto[];
  songs: Song[];
  onPublishNow: () => void;
}

export const LivePreviewTab: React.FC<LivePreviewTabProps> = ({
  config,
  memories,
  songs,
  onPublishNow,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewStep, setPreviewStep] = useState<JourneyStep>('welcome');

  const stepIndex = JOURNEY_STEPS.findIndex((s) => s.id === previewStep);

  const handleNextStep = () => {
    if (stepIndex < JOURNEY_STEPS.length - 1) {
      setPreviewStep(JOURNEY_STEPS[stepIndex + 1].id);
    } else {
      setPreviewStep('welcome');
    }
  };

  const containerClasses = {
    desktop: 'w-full',
    tablet: 'w-[768px] h-[850px] overflow-y-auto rounded-3xl border-8 border-slate-800 shadow-2xl mx-auto',
    mobile: 'w-[375px] h-[750px] overflow-y-auto rounded-3xl border-8 border-slate-800 shadow-2xl mx-auto',
  };

  const renderCurrentStep = () => {
    switch (previewStep) {
      case 'welcome':
        return (
          <WelcomeGiftBoxPage
            config={config.welcomePopup}
            girlfriendName={config.girlfriendName}
            onOpenBox={handleNextStep}
          />
        );
      case 'pin':
        return (
          <SecretPinPage
            config={config.secretPin}
            girlfriendName={config.girlfriendName}
            onSuccess={handleNextStep}
          />
        );
      case 'curtain':
        return (
          <CurtainRevealPage
            girlfriendName={config.girlfriendName}
            onReveal={handleNextStep}
          />
        );
      case 'anniversary':
        return <HeroSection config={config} onNextStep={handleNextStep} />;
      case 'memories':
        return <MemoriesSection memories={memories} onNextStep={handleNextStep} />;
      case 'wishes':
        return <BalloonsSection balloons={config.balloonMessages} onNextStep={handleNextStep} />;
      case 'puzzle':
        return <PuzzleSection config={config.puzzleConfig} onNextStep={handleNextStep} />;
      case 'scratch':
        return <ScratchCardSection config={config.scratchCardConfig} onNextStep={handleNextStep} />;
      case 'letter':
        return <LoveLetterSection config={config.loveLetter} onNextStep={handleNextStep} />;
      case 'celebration':
        return (
          <FinalCelebrationSection
            config={config.finalCelebration}
            girlfriendName={config.girlfriendName}
            relationshipStartDate={config.relationshipStartDate}
            onRestart={() => setPreviewStep('welcome')}
          />
        );
      default:
        return <HeroSection config={config} onNextStep={handleNextStep} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-pink-500" />
            <span>Multi-Step Journey Live Preview</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Preview the step-by-page flow exactly as your girlfriend will experience it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Step Selector Dropdown */}
          <select
            value={previewStep}
            onChange={(e) => setPreviewStep(e.target.value as JourneyStep)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 outline-none"
          >
            {JOURNEY_STEPS.map((s) => (
              <option key={s.id} value={s.id}>
                Step {s.stepNumber}: {s.title} {s.icon}
              </option>
            ))}
          </select>

          {/* Device switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition ${
                device === 'desktop' ? 'bg-white dark:bg-slate-900 text-pink-500 shadow-sm' : 'text-slate-500'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg transition ${
                device === 'tablet' ? 'bg-white dark:bg-slate-900 text-pink-500 shadow-sm' : 'text-slate-500'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition ${
                device === 'mobile' ? 'bg-white dark:bg-slate-900 text-pink-500 shadow-sm' : 'text-slate-500'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onPublishNow}
            className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Rocket className="w-4 h-4" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Embedded Preview Box */}
      <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[600px] overflow-hidden">
        <div
          className={`${containerClasses[device]} bg-rose-50/40 dark:bg-slate-900 transition-all duration-300 relative min-h-[550px] flex flex-col justify-between`}
          style={{
            backgroundColor: config.themeSettings.backgroundColor || undefined,
            backgroundImage: config.themeSettings.backgroundWallpaper
              ? `url(${config.themeSettings.backgroundWallpaper})`
              : undefined,
            backgroundSize: 'cover',
          }}
        >
          <ParticleOverlay effectType={config.themeSettings.particleEffect} />

          <main className="flex-1 flex flex-col justify-center">
            {renderCurrentStep()}
          </main>

          <Footer text={config.footerText} />
        </div>
      </div>
    </div>
  );
};
