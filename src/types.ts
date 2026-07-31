export interface WelcomePopupConfig {
  showPopup: boolean;
  girlfriendName: string;
  title: string;
  subtitle?: string;
  message: string;
  giftBoxImage?: string;
  buttonText: string;
  backgroundStyle: 'romantic-gradient' | 'starry-night' | 'rose-petals' | 'sunset-glow' | 'deep-velvet';
  animation: 'fade-scale' | 'bounce-in' | 'slide-up' | 'heart-pulse' | 'float-3d';
}

export interface SecretPinConfig {
  enabled: boolean;
  pinCode: string;
  pin?: string;
  hint: string;
  title?: string;
  subtitle?: string;
  unlockedTitle?: string;
  unlockedMessage?: string;
  maxAttempts?: number;
  lockoutTimeMinutes?: number;
}

export interface AnniversaryConfig {
  title?: string;
  subtitle?: string;
  relationshipStartDate: string; // ISO string '2025-03-21T11:20:00'
  anniversaryDate?: string;
  customLabelYears?: string;
  customLabelMonths?: string;
  customLabelDays?: string;
  customLabelHours?: string;
  customLabelMinutes?: string;
  customLabelSeconds?: string;
  showLiveTimer?: boolean;
  timerUpdateIntervalSeconds?: number;
  milestoneMessage?: string;
  displayStyle?: string;
}

export interface BalloonMessage {
  id: string;
  color: string;
  message: string;
  order: number;
}

export interface BalloonSectionConfig {
  balloonSize?: 'sm' | 'md' | 'lg';
  balloonSpeed?: 'slow' | 'normal' | 'fast';
  floatingStyle?: 'linear' | 'wobbly' | 'spiral';
  enablePopSound?: boolean;
  successAnimation?: 'confetti' | 'sparkles' | 'fireworks' | 'hearts';
}

export interface MemoryPhoto {
  id: string;
  image: string; // Base64 or URL
  caption: string;
  date?: string;
  order: number;
  category?: string;
}

export interface MemoryGalleryConfig {
  layoutStyle?: 'polaroid' | 'grid' | 'masonry' | 'carousel';
  cardStyle?: 'glass' | 'paper' | 'shadow' | 'border';
  albumCoverImage?: string;
  albumCover?: string;
}

export interface Song {
  id: string;
  title: string;
  url: string;
  fileName?: string;
  duration?: number;
  order: number;
  isDefault: boolean;
}

export interface PuzzleConfig {
  imageUrl: string;
  gridSize: number; // 3 for 3x3, 4 for 4x4, 5 for 5x5
  completionMessage: string;
  rewardTitle: string;
  solveButtonText?: string;
  enableSolveForMe?: boolean;
  enableShuffleButton?: boolean;
  enableSounds?: boolean;
}

export interface ScratchRewardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface ScratchCardConfig {
  hiddenMessage: string; // Secret coupon prize
  voucherTitle: string;
  voucherDescription?: string;
  voucherImage?: string;
  overlayText: string; // e.g. 'Scratch here for your surprise!'
  overlayColor?: string; // Foil gold color hex
  revealPercentage?: number; // threshold to reveal, e.g. 40%
  rewardCards?: ScratchRewardCard[];
  successAnimation?: string;
  enableSounds?: boolean;
}

export interface LoveLetterConfig {
  title: string;
  content: string;
  authorSignature: string;
  fontStyle: 'playfair' | 'handwriting' | 'serif' | 'modern' | 'caveat';
  paperTexture?: 'parchment' | 'vintage' | 'rose' | 'clean';
  paperStyle?: 'parchment' | 'vintage' | 'rose' | 'clean';
  envelopeColor?: string;
  waxSeal?: 'rose' | 'heart' | 'crown' | 'love';
  typingSpeed?: 'slow' | 'medium' | 'fast' | 'instant';
  openAnimation?: 'unfold' | 'slide' | 'fade';
  backgroundMusic?: string;
  enableReplayAnimation?: boolean;
}

export interface FinalCelebrationConfig {
  title: string;
  subtitle: string;
  message: string;
  buttonText: string;
  quotes?: string[];
  counterTitle?: string;
  endingMessage?: string;
  enableConfetti: boolean;
  enableFireworks: boolean;
  enableHeartRain?: boolean;
  enableSoundEffects: boolean;
}

export interface ThemeSettingsConfig {
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundWallpaper?: string;
  fontFamily: 'playfair' | 'jakarta' | 'inter' | 'dancing' | 'lora' | 'caveat';
  borderRadius?: 'none' | 'lg' | '2xl' | '3xl' | 'full';
  shadowIntensity?: 'none' | 'soft' | 'medium' | 'deep' | 'glow';
  glassmorphism?: boolean;
  glassmorphismIntensity?: number; // 0 to 100
  enableAnimations: boolean;
  darkMode: boolean;
  particleEffect: 'falling-hearts' | 'rose-petals' | 'floating-stars' | 'sparkles' | 'butterflies' | 'sakura' | 'none';
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

export interface AnimationEditorConfig {
  animationSpeed?: number; // 0.5 to 2
  enableFloatingHearts?: boolean;
  enableButterflies?: boolean;
  enableSparkles?: boolean;
  enableSakuraPetals?: boolean;
  enableParallax?: boolean;
  enable3DEffects?: boolean;
  enableCardHoverEffects?: boolean;
}

export interface SiteSettingsConfig {
  timeZone?: string;
  dateFormat?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'icon' | 'audio';
  createdAt: string;
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
  balloonSectionConfig?: BalloonSectionConfig;
  puzzleConfig: PuzzleConfig;
  scratchCardConfig: ScratchCardConfig;
  loveLetter: LoveLetterConfig;
  memoryGalleryConfig?: MemoryGalleryConfig;
  finalCelebration: FinalCelebrationConfig;
  themeSettings: ThemeSettingsConfig;
  musicSettings: MusicSettingsConfig;
  animationConfig?: AnimationEditorConfig;
  animationEditorConfig?: AnimationEditorConfig;
  siteSettingsConfig?: SiteSettingsConfig;
  assets?: AssetItem[];
  assetsLibrary?: AssetItem[];
  updatedAt: string;
}

export type AdminTab =
  | 'dashboard'
  | 'theme'
  | 'welcome'
  | 'balloons'
  | 'puzzle'
  | 'scratch'
  | 'letter'
  | 'memories'
  | 'music'
  | 'celebration'
  | 'assets'
  | 'animations'
  | 'settings'
  | 'couple'
  | 'pin'
  | 'anniversary'
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
  { id: 'celebration', stepNumber: 10, title: 'Celebration', icon: '🎉' },
];
