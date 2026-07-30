/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppConfig, MemoryPhoto, Song, AdminTab, JourneyStep, JOURNEY_STEPS } from './types';
import {
  INITIAL_DEFAULT_CONFIG,
  INITIAL_DEFAULT_MEMORIES,
  INITIAL_DEFAULT_SONGS,
} from './data/defaultConfig';
import {
  fetchAppConfig,
  saveAppConfig,
  publishDraftToLive,
  fetchMemories,
  saveMemories,
  fetchSongs,
  saveSongs,
  subscribeToConfig,
} from './lib/firebase';

// Public Components
import { WelcomeGiftBoxPage } from './components/public/WelcomeGiftBoxPage';
import { SecretPinPage } from './components/public/SecretPinPage';
import { CurtainRevealPage } from './components/public/CurtainRevealPage';
import { WelcomePopup } from './components/public/WelcomePopup';
import { PinLockModal } from './components/public/PinLockModal';
import { PublicNavbar } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { BalloonsSection } from './components/public/BalloonsSection';
import { MemoriesSection } from './components/public/MemoriesSection';
import { PuzzleSection } from './components/public/PuzzleSection';
import { ScratchCardSection } from './components/public/ScratchCardSection';
import { LoveLetterSection } from './components/public/LoveLetterSection';
import { FinalCelebrationSection } from './components/public/FinalCelebrationSection';
import { Footer } from './components/public/Footer';

// Common Components
import { FloatingMusicPlayer } from './components/common/FloatingMusicPlayer';
import { ParticleOverlay } from './components/common/ParticleOverlay';

// Admin Components
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { DashboardTab } from './components/admin/DashboardTab';
import { CoupleInfoTab } from './components/admin/CoupleInfoTab';
import { WelcomePopupTab } from './components/admin/WelcomePopupTab';
import { SecretPinTab } from './components/admin/SecretPinTab';
import { AnniversaryTab } from './components/admin/AnniversaryTab';
import { MemoriesTab } from './components/admin/MemoriesTab';
import { MusicManagerTab } from './components/admin/MusicManagerTab';
import { BalloonsTab } from './components/admin/BalloonsTab';
import { PuzzleTab } from './components/admin/PuzzleTab';
import { ScratchCardTab } from './components/admin/ScratchCardTab';
import { LoveLetterTab } from './components/admin/LoveLetterTab';
import { FinalCelebrationTab } from './components/admin/FinalCelebrationTab';
import { ThemeSettingsTab } from './components/admin/ThemeSettingsTab';
import { LivePreviewTab } from './components/admin/LivePreviewTab';
import { PublishTab } from './components/admin/PublishTab';

import { Menu, ArrowLeft, Globe, Lock } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Data state
  const [config, setConfig] = useState<AppConfig>(INITIAL_DEFAULT_CONFIG);
  const [publishedConfig, setPublishedConfig] = useState<AppConfig>(INITIAL_DEFAULT_CONFIG);
  const [memories, setMemories] = useState<MemoryPhoto[]>(INITIAL_DEFAULT_MEMORIES);
  const [songs, setSongs] = useState<Song[]>(INITIAL_DEFAULT_SONGS);
  const [isPublishedSynced, setIsPublishedSynced] = useState<boolean>(true);

  // Experience state
  const [welcomePopupDismissed, setWelcomePopupDismissed] = useState<boolean>(false);
  const [musicAutoStartSignal, setMusicAutoStartSignal] = useState<boolean>(false);
  const [pinUnlocked, setPinUnlocked] = useState<boolean>(false);

  // Multi-step Journey Navigation State
  const [currentStep, setCurrentStep] = useState<JourneyStep>('welcome');
  const [unlockedStepIndex, setUnlockedStepIndex] = useState<number>(0);

  const handleAdvanceStep = (nextStep: JourneyStep) => {
    const nextIdx = JOURNEY_STEPS.findIndex((s) => s.id === nextStep);
    if (nextIdx > unlockedStepIndex) {
      setUnlockedStepIndex(nextIdx);
    }
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Initial Data from Firestore / Local Storage
  useEffect(() => {
    async function loadData() {
      const liveConfig = await fetchAppConfig(true);
      const draftConfig = await fetchAppConfig(false);
      const loadedMemories = await fetchMemories();
      const loadedSongs = await fetchSongs();

      setPublishedConfig(liveConfig);
      setConfig(draftConfig);
      setMemories(loadedMemories);
      setSongs(loadedSongs);

      // Check sync status
      setIsPublishedSynced(JSON.stringify(draftConfig) === JSON.stringify(liveConfig));
    }
    loadData();

    // Subscribe to real-time changes
    const unsubPublished = subscribeToConfig(true, (newPub) => {
      setPublishedConfig(newPub);
    });
    const unsubDraft = subscribeToConfig(false, (newDraft) => {
      setConfig(newDraft);
    });

    return () => {
      unsubPublished();
      unsubDraft();
    };
  }, []);

  // Sync draft edits to Firestore / local state
  const handleSaveDraftConfig = async (updated: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updated };
    setConfig(newConfig);
    setIsPublishedSynced(false);
    await saveAppConfig(newConfig, false);
  };

  const handleSaveMemories = async (newMemories: MemoryPhoto[]) => {
    setMemories(newMemories);
    await saveMemories(newMemories);
  };

  const handleSaveSongs = async (newSongs: Song[]) => {
    setSongs(newSongs);
    await saveSongs(newSongs);
  };

  const handlePublishNow = async () => {
    await publishDraftToLive(config);
    setPublishedConfig(config);
    setIsPublishedSynced(true);
  };

  const handleContinueWelcomePopup = () => {
    setWelcomePopupDismissed(true);
    setMusicAutoStartSignal(true);
  };

  const activeConfig = viewMode === 'public' ? publishedConfig : config;

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative"
      style={{
        backgroundColor: activeConfig.themeSettings.backgroundColor || '#fff0f3',
        backgroundImage: activeConfig.themeSettings.backgroundWallpaper
          ? `url(${activeConfig.themeSettings.backgroundWallpaper})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Particles */}
      <ParticleOverlay effectType={activeConfig.themeSettings.particleEffect} />

      {/* Persistent Floating Music Player */}
      <FloatingMusicPlayer
        songs={songs}
        musicSettings={activeConfig.musicSettings}
        autoStartSignal={musicAutoStartSignal}
      />

      {/* VIEW MODE: PUBLIC WEBSITE */}
      {viewMode === 'public' && (
        <div className="flex flex-col min-h-screen">
          {/* Header Bar */}
          <PublicNavbar
            girlfriendName={activeConfig.girlfriendName}
            currentStep={currentStep}
            unlockedStepIndex={unlockedStepIndex}
            onSelectStep={(step) => setCurrentStep(step)}
            onOpenAdmin={() => {
              if (isAdminAuthenticated) {
                setViewMode('admin');
              } else {
                setShowAdminLoginModal(true);
              }
            }}
          />

          {/* Page-by-Page Journey Container */}
          <main className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full flex-1 flex flex-col justify-center"
              >
                {currentStep === 'welcome' && (
                  <WelcomeGiftBoxPage
                    config={activeConfig.welcomePopup}
                    girlfriendName={activeConfig.girlfriendName}
                    onOpenBox={() => {
                      setMusicAutoStartSignal(true);
                      handleAdvanceStep(
                        activeConfig.secretPin.enabled ? 'pin' : 'curtain'
                      );
                    }}
                  />
                )}

                {currentStep === 'pin' && (
                  <SecretPinPage
                    config={activeConfig.secretPin}
                    girlfriendName={activeConfig.girlfriendName}
                    onSuccess={() => handleAdvanceStep('curtain')}
                  />
                )}

                {currentStep === 'curtain' && (
                  <CurtainRevealPage
                    girlfriendName={activeConfig.girlfriendName}
                    onReveal={() => handleAdvanceStep('anniversary')}
                  />
                )}

                {currentStep === 'anniversary' && (
                  <HeroSection
                    config={activeConfig}
                    onNextStep={() => handleAdvanceStep('memories')}
                  />
                )}

                {currentStep === 'memories' && (
                  <MemoriesSection
                    memories={memories}
                    onNextStep={() => handleAdvanceStep('wishes')}
                  />
                )}

                {currentStep === 'wishes' && (
                  <BalloonsSection
                    balloons={activeConfig.balloonMessages}
                    onNextStep={() => handleAdvanceStep('puzzle')}
                  />
                )}

                {currentStep === 'puzzle' && (
                  <PuzzleSection
                    config={activeConfig.puzzleConfig}
                    onNextStep={() => handleAdvanceStep('scratch')}
                  />
                )}

                {currentStep === 'scratch' && (
                  <ScratchCardSection
                    config={activeConfig.scratchCardConfig}
                    onNextStep={() => handleAdvanceStep('letter')}
                  />
                )}

                {currentStep === 'letter' && (
                  <LoveLetterSection
                    config={activeConfig.loveLetter}
                    onNextStep={() => handleAdvanceStep('celebration')}
                  />
                )}

                {currentStep === 'celebration' && (
                  <FinalCelebrationSection
                    config={activeConfig.finalCelebration}
                    girlfriendName={activeConfig.girlfriendName}
                    onRestart={() => handleAdvanceStep('welcome')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer text={activeConfig.footerText} />
        </div>
      )}

      {/* VIEW MODE: ADMIN PANEL CMS */}
      {viewMode === 'admin' && isAdminAuthenticated && (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block h-full">
            <AdminSidebar
              activeTab={activeAdminTab}
              setActiveTab={setActiveAdminTab}
              onLogout={() => {
                setIsAdminAuthenticated(false);
                setViewMode('public');
              }}
              isPublishedSynced={isPublishedSynced}
            />
          </div>

          {/* Sidebar Mobile Overlay */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="relative z-10 w-64 h-full">
                <AdminSidebar
                  activeTab={activeAdminTab}
                  setActiveTab={setActiveAdminTab}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                  onLogout={() => {
                    setIsAdminAuthenticated(false);
                    setViewMode('public');
                  }}
                  isPublishedSynced={isPublishedSynced}
                />
              </div>
            </div>
          )}

          {/* Main Admin Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Admin Header Bar */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-bold text-white capitalize">{activeAdminTab} Editor</h1>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${
                      isPublishedSynced
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {isPublishedSynced ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-400 italic hidden sm:inline">
                  {isPublishedSynced ? 'All changes published' : 'Unpublished draft changes'}
                </span>
                <button
                  onClick={() => setViewMode('public')}
                  className="px-3.5 py-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-pink-400" />
                  <span>View Public Website</span>
                </button>
              </div>
            </header>

            {/* Tab Editor Body */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900/50">
              {activeAdminTab === 'dashboard' && (
                <DashboardTab
                  config={config}
                  memories={memories}
                  songs={songs}
                  isPublishedSynced={isPublishedSynced}
                  onNavigateTab={(tab) => setActiveAdminTab(tab)}
                  onPublishNow={handlePublishNow}
                />
              )}

              {activeAdminTab === 'couple' && (
                <CoupleInfoTab
                  config={config}
                  onChange={handleSaveDraftConfig}
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'popup' && (
                <WelcomePopupTab
                  config={config.welcomePopup}
                  onChange={(up) =>
                    handleSaveDraftConfig({ welcomePopup: { ...config.welcomePopup, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'pin' && (
                <SecretPinTab
                  config={config.secretPin}
                  onChange={(up) =>
                    handleSaveDraftConfig({ secretPin: { ...config.secretPin, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'anniversary' && (
                <AnniversaryTab
                  config={config.anniversarySettings}
                  onChange={(up) =>
                    handleSaveDraftConfig({
                      anniversarySettings: { ...config.anniversarySettings, ...up },
                    })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'memories' && (
                <MemoriesTab
                  memories={memories}
                  onChangeMemories={handleSaveMemories}
                  onSave={() => handleSaveMemories(memories)}
                />
              )}

              {activeAdminTab === 'music' && (
                <MusicManagerTab
                  songs={songs}
                  musicSettings={config.musicSettings}
                  onChangeSongs={handleSaveSongs}
                  onChangeMusicSettings={(up) =>
                    handleSaveDraftConfig({ musicSettings: { ...config.musicSettings, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'balloons' && (
                <BalloonsTab
                  balloons={config.balloonMessages}
                  onChangeBalloons={(balloonMessages) => handleSaveDraftConfig({ balloonMessages })}
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'puzzle' && (
                <PuzzleTab
                  config={config.puzzleConfig}
                  onChange={(up) =>
                    handleSaveDraftConfig({ puzzleConfig: { ...config.puzzleConfig, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'scratch' && (
                <ScratchCardTab
                  config={config.scratchCardConfig}
                  onChange={(up) =>
                    handleSaveDraftConfig({
                      scratchCardConfig: { ...config.scratchCardConfig, ...up },
                    })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'letter' && (
                <LoveLetterTab
                  config={config.loveLetter}
                  onChange={(up) =>
                    handleSaveDraftConfig({ loveLetter: { ...config.loveLetter, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'celebration' && (
                <FinalCelebrationTab
                  config={config.finalCelebration}
                  onChange={(up) =>
                    handleSaveDraftConfig({
                      finalCelebration: { ...config.finalCelebration, ...up },
                    })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'theme' && (
                <ThemeSettingsTab
                  config={config.themeSettings}
                  onChange={(up) =>
                    handleSaveDraftConfig({ themeSettings: { ...config.themeSettings, ...up } })
                  }
                  onSave={() => handleSaveDraftConfig({})}
                />
              )}

              {activeAdminTab === 'preview' && (
                <LivePreviewTab
                  config={config}
                  memories={memories}
                  songs={songs}
                  onPublishNow={handlePublishNow}
                />
              )}

              {activeAdminTab === 'publish' && (
                <PublishTab
                  config={config}
                  isPublishedSynced={isPublishedSynced}
                  onPublishNow={handlePublishNow}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Admin Authentication Modal */}
      {showAdminLoginModal && (
        <AdminAuthModal
          onAuthenticated={() => {
            setIsAdminAuthenticated(true);
            setShowAdminLoginModal(false);
            setViewMode('admin');
          }}
          onClose={() => setShowAdminLoginModal(false)}
        />
      )}
    </div>
  );
}
