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
import { AssetsManagerTab } from './components/admin/AssetsManagerTab';
import { AnimationEditorTab } from './components/admin/AnimationEditorTab';
import { SettingsTab } from './components/admin/SettingsTab';
import { LivePreviewTab } from './components/admin/LivePreviewTab';
import { PublishTab } from './components/admin/PublishTab';

import { Menu, Globe, CheckCircle2, AlertCircle, Loader2, LogOut } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAdminAuthenticated(false);
    setViewMode('public');
    showToast('success', 'Logged out from Admin Panel.');
  };

  // Notification Toast State
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string;
  }>({ type: null, message: '' });

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ type, message });
    if (type !== 'loading') {
      setTimeout(() => {
        setToast((prev) => (prev.message === message ? { type: null, message: '' } : prev));
      }, 4000);
    }
  };

  // Data state
  const [config, setConfig] = useState<AppConfig>(INITIAL_DEFAULT_CONFIG);
  const [publishedConfig, setPublishedConfig] = useState<AppConfig>(INITIAL_DEFAULT_CONFIG);
  const [memories, setMemories] = useState<MemoryPhoto[]>(INITIAL_DEFAULT_MEMORIES);
  const [songs, setSongs] = useState<Song[]>(INITIAL_DEFAULT_SONGS);
  const [isPublishedSynced, setIsPublishedSynced] = useState<boolean>(true);

  // Experience state
  const [musicAutoStartSignal, setMusicAutoStartSignal] = useState<boolean>(false);

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

      setIsPublishedSynced(JSON.stringify(draftConfig) === JSON.stringify(liveConfig));
    }
    loadData();

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

  // Sync edits to Firestore / local state
  const handleSaveDraftConfig = async (updated: Partial<AppConfig>, isExplicitSave = false) => {
    const newConfig = { ...config, ...updated };
    setConfig(newConfig);
    setPublishedConfig(newConfig);
    setIsPublishedSynced(true);

    if (isExplicitSave) {
      showToast('loading', 'Saving configuration changes to Firestore...');
    }

    try {
      await saveAppConfig(newConfig, true);
      if (isExplicitSave) {
        showToast('success', 'Changes saved permanently to Firestore! ✨');
      }
    } catch (err: any) {
      console.error('Firestore save failed:', err);
      showToast('error', `Failed to save changes: ${err?.message || 'Firestore connection issue'}`);
    }
  };

  const handleSaveMemories = async (newMemories: MemoryPhoto[], isExplicitSave = false) => {
    setMemories(newMemories);
    if (isExplicitSave) {
      showToast('loading', 'Saving photo memories to Firestore...');
    }
    try {
      await saveMemories(newMemories);
      if (isExplicitSave) {
        showToast('success', 'Photo memories saved permanently to Firestore! 📸');
      }
    } catch (err: any) {
      console.error('Firestore save memories failed:', err);
      showToast('error', `Failed to save memories: ${err?.message || 'Firestore connection issue'}`);
    }
  };

  const handleSaveSongs = async (newSongs: Song[], isExplicitSave = false) => {
    setSongs(newSongs);
    if (isExplicitSave) {
      showToast('loading', 'Saving playlist to Firestore...');
    }
    try {
      await saveSongs(newSongs);
      if (isExplicitSave) {
        showToast('success', 'Music playlist saved permanently to Firestore! 🎵');
      }
    } catch (err: any) {
      console.error('Firestore save songs failed:', err);
      showToast('error', `Failed to save playlist: ${err?.message || 'Firestore connection issue'}`);
    }
  };

  const handlePublishNow = async () => {
    showToast('loading', 'Publishing changes to live website...');
    try {
      await publishDraftToLive(config);
      setPublishedConfig(config);
      setIsPublishedSynced(true);
      showToast('success', 'Published live to Firestore! 🚀');
    } catch (err: any) {
      console.error('Publish failed:', err);
      showToast('error', `Publish failed: ${err?.message || 'Firestore connection issue'}`);
    }
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
                    relationshipStartDate={activeConfig.relationshipStartDate}
                    onRestart={() => handleAdvanceStep('welcome')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer text={activeConfig.footerText} />
        </div>
      )}

      {/* VIEW MODE: ADMIN PANEL WEBSITE CMS */}
      {viewMode === 'admin' && isAdminAuthenticated && (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block h-full">
            <AdminSidebar
              activeTab={activeAdminTab}
              setActiveTab={setActiveAdminTab}
              onLogout={handleAdminLogout}
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
                  onLogout={handleAdminLogout}
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
                  <h1 className="text-base font-bold text-white capitalize">{activeAdminTab} CMS Editor</h1>
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

              <div className="flex items-center space-x-3">
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
                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-semibold transition flex items-center gap-1.5"
                  title="Logout from Admin Panel"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Logout</span>
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
                  onChange={(up) => handleSaveDraftConfig(up, false)}
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'popup' && (
                <WelcomePopupTab
                  config={config.welcomePopup}
                  onChange={(up) =>
                    handleSaveDraftConfig({ welcomePopup: { ...config.welcomePopup, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'pin' && (
                <SecretPinTab
                  config={config.secretPin}
                  onChange={(up) =>
                    handleSaveDraftConfig({ secretPin: { ...config.secretPin, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'anniversary' && (
                <AnniversaryTab
                  config={config.anniversarySettings}
                  onChange={(up) =>
                    handleSaveDraftConfig(
                      { anniversarySettings: { ...config.anniversarySettings, ...up } },
                      false
                    )
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'memories' && (
                <MemoriesTab
                  memories={memories}
                  config={config.memoryGalleryConfig}
                  onChangeMemories={(mems) => handleSaveMemories(mems, false)}
                  onChangeConfig={(up) =>
                    handleSaveDraftConfig(
                      { memoryGalleryConfig: { ...config.memoryGalleryConfig, ...up } },
                      false
                    )
                  }
                  onSave={() => handleSaveMemories(memories, true)}
                />
              )}

              {activeAdminTab === 'music' && (
                <MusicManagerTab
                  songs={songs}
                  musicSettings={config.musicSettings}
                  onChangeSongs={(sngs) => handleSaveSongs(sngs, false)}
                  onChangeMusicSettings={(up) =>
                    handleSaveDraftConfig({ musicSettings: { ...config.musicSettings, ...up } }, false)
                  }
                  onSave={async () => {
                    await handleSaveDraftConfig({}, true);
                    await handleSaveSongs(songs, true);
                  }}
                />
              )}

              {activeAdminTab === 'balloons' && (
                <BalloonsTab
                  balloons={config.balloonMessages}
                  config={config.balloonSectionConfig}
                  onChangeBalloons={(balloonMessages) => handleSaveDraftConfig({ balloonMessages }, false)}
                  onChangeConfig={(up) =>
                    handleSaveDraftConfig(
                      { balloonSectionConfig: { ...config.balloonSectionConfig, ...up } },
                      false
                    )
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'puzzle' && (
                <PuzzleTab
                  config={config.puzzleConfig}
                  onChange={(up) =>
                    handleSaveDraftConfig({ puzzleConfig: { ...config.puzzleConfig, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'scratch' && (
                <ScratchCardTab
                  config={config.scratchCardConfig}
                  onChange={(up) =>
                    handleSaveDraftConfig(
                      { scratchCardConfig: { ...config.scratchCardConfig, ...up } },
                      false
                    )
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'letter' && (
                <LoveLetterTab
                  config={config.loveLetter}
                  onChange={(up) =>
                    handleSaveDraftConfig({ loveLetter: { ...config.loveLetter, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'celebration' && (
                <FinalCelebrationTab
                  config={config.finalCelebration}
                  onChange={(up) =>
                    handleSaveDraftConfig(
                      { finalCelebration: { ...config.finalCelebration, ...up } },
                      false
                    )
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'theme' && (
                <ThemeSettingsTab
                  config={config.themeSettings}
                  onChange={(up) =>
                    handleSaveDraftConfig({ themeSettings: { ...config.themeSettings, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'assets' && (
                <AssetsManagerTab
                  assets={config.assets}
                  onChange={(up) =>
                    handleSaveDraftConfig({ assets: { ...config.assets, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'animation' && (
                <AnimationEditorTab
                  animation={config.animationConfig}
                  onChange={(up) =>
                    handleSaveDraftConfig({ animationConfig: { ...config.animationConfig, ...up } }, false)
                  }
                  onSave={() => handleSaveDraftConfig({}, true)}
                />
              )}

              {activeAdminTab === 'settings' && (
                <SettingsTab
                  config={config}
                  onUpdateConfig={(up) => handleSaveDraftConfig(up, false)}
                  onSave={() => handleSaveDraftConfig({}, true)}
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

      {/* Global Toast Notification */}
      {toast.type && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all bg-slate-900/95 text-white border-slate-700 animate-in fade-in slide-in-from-top-4">
          {toast.type === 'loading' && <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />}
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* Admin Authentication Modal */}
      {showAdminLoginModal && (
        <AdminAuthModal
          onAuthenticated={() => {
            localStorage.setItem('admin_authenticated', 'true');
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
