export interface Song {
  id: string;
  title: string;
  url: string; // Firebase Storage download URL or audio link
  duration?: number;
  fileName?: string;
  order: number;
  isDefault?: boolean;
}

export interface MemoryPhoto {
  id: string;
  image: string; // Data URL or image link
  caption: string;
  category?: string;
  order: number;
  date?: string;
}

export interface BalloonMessage {
  id: string;
  color: string;
  message: string;
  order: number;
}

export interface WelcomePopupConfig {
  girlfriendName: string;
  title: string;
  message: string;
  buttonText: string;
  backgroundStyle: 'romantic-gradient' | 'starry-night' | 'rose-petals' | 'sunset-glow' | 'deep-velvet';
  animation: 'fade-scale' | 'bounce-in' | 'slide-up' | 'heart-pulse';
  showPopup: boolean;
}

export interface SecretPinConfig {
  enabled: boolean;
  pin: string; // 4-digit numeric string
  hint: string;
  unlockedTitle: string;
  unlockedMessage: string;
}

export interface AnniversaryConfig {
  relationshipStartDate: string; // YYYY-MM-DD
  anniversaryDate: string; // YYYY-MM-DD
  milestoneMessage: string;
  displayStyle: 'detailed' | 'cards' | 'minimal';
}

export interface PuzzleConfig {
  imageUrl: string;
  gridSize: number; // 3 for 3x3, 4 for 4x4
  completionMessage: string;
  rewardTitle: string;
}

export interface ScratchCardConfig {
  hiddenMessage: string;
  voucherTitle: string;
  overlayText: string;
  overlayColor: string;
  revealPercentage: number;
}

export interface LoveLetterConfig {
  title: string;
  content: string; // HTML or Markdown formatted content
  fontStyle: 'playfair' | 'handwriting' | 'serif' | 'modern';
  paperTexture: 'vintage' | 'parchment' | 'rose' | 'clean';
  authorSignature: string;
}

export interface FinalCelebrationConfig {
  title: string;
  subtitle: string;
  message: string;
  enableConfetti: boolean;
  enableFireworks: boolean;
  enableSoundEffects: boolean;
  buttonText: string;
}

export interface ThemeSettingsConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: 'playfair' | 'inter' | 'dancing' | 'lora';
  particleEffect: 'falling-hearts' | 'floating-stars' | 'rose-petals' | 'sparkles' | 'none';
  backgroundWallpaper: string;
  darkMode: boolean;
}

export interface MusicSettingsConfig {
  autoplay: boolean;
  loop: boolean;
  shuffle: boolean;
  defaultVolume: number; // 0 to 1
  fadeInDuration: number; // in seconds
  fadeOutDuration: number; // in seconds
  defaultSongId: string;
}

export interface AppConfig {
  girlfriendName: string;
  boyfriendName: string;
  relationshipStartDate: string;
  anniversaryDate: string;
  footerText: string;
  welcomePopup: WelcomePopupConfig;
  secretPin: SecretPinConfig;
  anniversarySettings: AnniversaryConfig;
  balloonMessages: BalloonMessage[];
  puzzleConfig: PuzzleConfig;
  scratchCardConfig: ScratchCardConfig;
  loveLetter: LoveLetterConfig;
  finalCelebration: FinalCelebrationConfig;
  themeSettings: ThemeSettingsConfig;
  musicSettings: MusicSettingsConfig;
  updatedAt: string;
}

export type AdminTab =
  | 'dashboard'
  | 'couple'
  | 'popup'
  | 'pin'
  | 'anniversary'
  | 'memories'
  | 'music'
  | 'balloons'
  | 'puzzle'
  | 'scratch'
  | 'letter'
  | 'celebration'
  | 'theme'
  | 'preview'
  | 'publish';

export type JourneyStep =
  | 'welcome'
  | 'pin'
  | 'curtain'
  | 'anniversary'
  | 'memories'
  | 'wishes'
  | 'puzzle'
  | 'scratch'
  | 'letter'
  | 'celebration';

export interface JourneyStepMeta {
  id: JourneyStep;
  stepNumber: number;
  title: string;
  icon: string;
}

export const JOURNEY_STEPS: JourneyStepMeta[] = [
  { id: 'welcome', stepNumber: 1, title: 'Welcome Gift', icon: '🎁' },
  { id: 'pin', stepNumber: 2, title: 'Secret PIN', icon: '🔒' },
  { id: 'curtain', stepNumber: 3, title: 'Curtain Reveal', icon: '🎪' },
  { id: 'anniversary', stepNumber: 4, title: 'Anniversary', icon: '⏳' },
  { id: 'memories', stepNumber: 5, title: 'Memories', icon: '📸' },
  { id: 'wishes', stepNumber: 6, title: 'Love Wishes', icon: '🎈' },
  { id: 'puzzle', stepNumber: 7, title: 'Love Puzzle', icon: '🧩' },
  { id: 'scratch', stepNumber: 8, title: 'Scratch Card', icon: '🎁' },
  { id: 'letter', stepNumber: 9, title: 'Love Letter', icon: '💌' },
  { id: 'celebration', stepNumber: 10, title: 'Final Surprise', icon: '🎆' },
];
