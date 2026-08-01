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
  // Titles & Headings
  title?: string; // Greeting text e.g. "Hey"
  subtitle?: string; // Subtitle line under greeting
  togetherSinceLabel?: string; // Label for together since box
  milestoneMessage?: string; // Quote/subtext under relationship timer
  cardTitle?: string; // Next anniversary card header
  cardBadge?: string; // Badge label for next anniversary date
  milestoneReachedTitle?: string; // Title when countdown reaches 0
  milestoneReachedMessage?: string; // Message when countdown reaches 0
  progressTitle?: string; // Title for love progress bar
  progressSubtitle?: string; // Subtitle under love progress bar
  buttonText?: string; // Text for continue button

  // Dates & Timestamps
  relationshipStartDate: string; // ISO format e.g. '2025-03-21T11:20:43'
  anniversaryDate: string; // ISO format e.g. '2027-03-21T11:20:43'
  countdownTargetDate?: string; // ISO format for target countdown e.g. '2027-03-21T11:20:43'

  // Pause & Resume State
  isPaused?: boolean;
  pausedAt?: string; // ISO string timestamp when paused
  pausedRemainingSeconds?: number; // Snapshot of remaining seconds when paused

  // Unit Labels
  customLabelYears?: string;
  customLabelMonths?: string;
  customLabelDays?: string;
  customLabelHours?: string;
  customLabelMinutes?: string;
  customLabelSeconds?: string;

  // Custom Emojis
  emojiMainHeader?: string;
  emojiGreetingHeart?: string;
  emojiYears?: string;
  emojiMonths?: string;
  emojiDays?: string;
  emojiHours?: string;
  emojiMinutes?: string;
  emojiSeconds?: string;
  emojiCountdownCard?: string;
  emojiButton?: string;

  // Colors & Styling
  titleGradientFrom?: string;
  titleGradientTo?: string;

  // Display Options
  showLiveTimer?: boolean;
  timerUpdateIntervalSeconds?: number;
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
  hiddenMessage: string; // Secret coupon prize / Coupon Description
  voucherTitle: string; // Main Title (e.g. Love Voucher Certificate 🎟️)
  voucherDescription?: string; // Subtitle / Description
  voucherBadge?: string; // Top badge (e.g. Exclusive Voucher)
  couponHeader?: string; // Inside card header (e.g. Love Coupon Certificate 🎁)
  unlockedBadgeText?: string; // Unlocked badge text (e.g. Official Certificate Unlocked ❤️)
  voucherImage?: string;
  overlayText: string; // e.g. 'Rub foil with finger to unlock certificate'
  overlaySubtext?: string; // e.g. 'Scratch softly to reveal hidden voucher'
  overlayColor?: string; // Foil gold color hex
  revealPercentage?: number; // threshold to reveal, e.g. 40%
  rewardCards?: ScratchRewardCard[];
  scratchAgainButtonText?: string; // e.g. 'Scratch Foil Again'
  continueButtonText?: string; // e.g. 'Continue to Love Letter 💌'
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
  replayButtonText?: string;
  quotes?: string[];
  counterTitle?: string;
  endingMessage?: string;
  endingLine1?: string;
  endingLine2?: string;
  yearsLabel?: string;
  monthsLabel?: string;
  daysLabel?: string;
  hoursLabel?: string;
  yearsValue?: number;
  monthsValue?: number;
  daysValue?: number;
  hoursValue?: number;
  footerText?: string;
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
