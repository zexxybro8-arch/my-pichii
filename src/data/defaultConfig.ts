import { AppConfig, MemoryPhoto, Song } from '../types';

export const INITIAL_DEFAULT_CONFIG: AppConfig = {
  girlfriendName: 'Picchi',
  boyfriendName: 'Your Love',
  relationshipStartDate: '2022-02-14',
  anniversaryDate: '2026-02-14',
  footerText: 'Made with endless love, forever and always ❤️',
  welcomePopup: {
    girlfriendName: 'PICCHI',
    title: '❤️ Hey PICCHI ❤️',
    message: 'I made something very special just for you...\n\nClose your eyes...\nTake a deep breath...\n\nNow press Continue ❤️',
    buttonText: 'Continue ❤️',
    backgroundStyle: 'romantic-gradient',
    animation: 'fade-scale',
    showPopup: true,
  },
  secretPin: {
    enabled: true,
    pin: '1402',
    hint: 'Hint: Our Anniversary Date (DDMM)',
    unlockedTitle: 'Surprise Unlocked! 💖',
    unlockedMessage: 'You remembered our special date! Here is your journey of love.',
  },
  anniversarySettings: {
    relationshipStartDate: '2022-02-14',
    anniversaryDate: '2026-02-14',
    milestoneMessage: 'Every single day with you is a gift I treasure forever.',
    displayStyle: 'cards',
  },
  balloonMessages: [
    { id: 'b1', color: '#ff4d6d', message: 'You make my heart smile every single day! 💕', order: 1 },
    { id: 'b2', color: '#ff758f', message: 'My favorite place in the world is right next to you. 🌹', order: 2 },
    { id: 'b3', color: '#ffb3c1', message: 'Thank you for being my sunshine on cloudy days. ✨', order: 3 },
    { id: 'b4', color: '#c77dff', message: 'I love you more than words could ever describe. 💌', order: 4 },
    { id: 'b5', color: '#e0aaff', message: 'Forever isn’t long enough with you! 💍', order: 5 },
  ],
  puzzleConfig: {
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    gridSize: 3,
    completionMessage: 'You solved our memory puzzle! You complete me in every way. ❤️',
    rewardTitle: 'Puzzle Master of My Heart 🧩',
  },
  scratchCardConfig: {
    hiddenMessage: '🎉 SPECIAL COUPON: Unlimited Warm Hugs, Late Night Ice Cream & 1000 Kisses On Demand! Valid Forever ❤️',
    voucherTitle: 'Golden Love Voucher 🎁',
    overlayText: 'Scratch Here with your finger or mouse! ✨',
    overlayColor: '#d4af37',
    revealPercentage: 40,
  },
  loveLetter: {
    title: 'My Dearest Picchi,',
    content: `From the very moment you entered my life, everything changed for the better. Your smile brightens my darkest days, and your laughter is my favorite melody.

Thank you for every shared joke, every late-night conversation, every warm embrace, and every quiet moment where we didn't even need words. You are my best friend, my soulmate, and my entire world.

I promise to stand by your side, to support your dreams, to hold your hand through every storm, and to cherish you more with every passing second.

Forever & Always Yours,
With all my love ❤️`,
    fontStyle: 'handwriting',
    paperTexture: 'parchment',
    authorSignature: 'Your Loving Boyfriend',
  },
  finalCelebration: {
    title: 'Happy Anniversary, My Love! 🎆',
    subtitle: 'Here is to many more magical years together',
    message: 'Thank you for making my life so incredibly beautiful. I love you beyond words!',
    enableConfetti: true,
    enableFireworks: true,
    enableSoundEffects: true,
    buttonText: 'Celebrate Our Love 🎉',
  },
  themeSettings: {
    primaryColor: '#e63946',
    accentColor: '#ffb703',
    backgroundColor: '#fff0f3',
    fontFamily: 'dancing',
    particleEffect: 'falling-hearts',
    backgroundWallpaper: '',
    darkMode: false,
  },
  musicSettings: {
    autoplay: true,
    loop: true,
    shuffle: false,
    defaultVolume: 0.7,
    fadeInDuration: 2,
    fadeOutDuration: 2,
    defaultSongId: 's1',
  },
  updatedAt: new Date().toISOString(),
};

export const INITIAL_DEFAULT_MEMORIES: MemoryPhoto[] = [
  {
    id: 'm1',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Our unforgettable sunset walk holding hands 🌅',
    category: 'Romantic Walks',
    order: 1,
    date: '2023-05-12',
  },
  {
    id: 'm2',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    caption: 'Laughing over hot cocoa on a cozy evening ☕❤️',
    category: 'Cozy Moments',
    order: 2,
    date: '2023-11-20',
  },
  {
    id: 'm3',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    caption: 'That radiant smile that stole my heart forever 🥰',
    category: 'Favorites',
    order: 3,
    date: '2024-02-14',
  },
  {
    id: 'm4',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    caption: 'Exploring new adventures together! 🚀✨',
    category: 'Travel & Fun',
    order: 4,
    date: '2024-07-04',
  },
];

export const INITIAL_DEFAULT_SONGS: Song[] = [
  {
    id: 's1',
    title: 'Romantic Acoustic Guitar Melody',
    // High quality royalty-free romantic MP3 stream link
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-114250.mp3',
    duration: 145,
    order: 1,
    isDefault: true,
  },
  {
    id: 's2',
    title: 'Sweet Love Story Piano',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14b7e.mp3?filename=sweet-piano-10255.mp3',
    duration: 180,
    order: 2,
    isDefault: false,
  },
  {
    id: 's3',
    title: 'Gentle Acoustic Love Song',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_971e440e2b.mp3?filename=gentle-guitar-124933.mp3',
    duration: 160,
    order: 3,
    isDefault: false,
  },
];
