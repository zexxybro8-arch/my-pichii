import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Minus,
  Maximize2,
  Music,
  Disc,
  ListMusic,
  Heart,
  Sparkles,
  GripVertical,
} from 'lucide-react';
import { Song, MusicSettingsConfig } from '../../types';
import {
  fetchMusicPlayerPosition,
  saveMusicPlayerPosition,
  WidgetPosition,
} from '../../lib/firebase';

interface FloatingMusicPlayerProps {
  songs: Song[];
  musicSettings: MusicSettingsConfig;
  autoStartSignal?: boolean; // Triggered when Welcome Popup "Continue" is clicked
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  songs,
  musicSettings,
  autoStartSignal = false,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(musicSettings.defaultVolume ?? 0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoop, setIsLoop] = useState<boolean>(musicSettings.loop ?? true);
  const [isShuffle, setIsShuffle] = useState<boolean>(musicSettings.shuffle ?? false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);

  // Position & Drag state
  const [position, setPosition] = useState<WidgetPosition | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Prevent drag triggering on interactive elements
  const stopProp = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  // Helper to clamp position within screen boundaries
  const clampPosition = (x: number, y: number, currentMinimized = isMinimized): WidgetPosition => {
    if (typeof window === 'undefined') return { x, y };
    const margin = 12; // margin in px from screen edges
    const pWidth = playerRef.current
      ? playerRef.current.offsetWidth
      : currentMinimized
      ? 240
      : 320;
    const pHeight = playerRef.current
      ? playerRef.current.offsetHeight
      : currentMinimized
      ? 60
      : 280;

    const maxX = Math.max(margin, window.innerWidth - pWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - pHeight - margin);

    return {
      x: Math.max(margin, Math.min(x, maxX)),
      y: Math.max(margin, Math.min(y, maxY)),
    };
  };

  // Load last saved position from Firestore / LocalStorage on mount
  useEffect(() => {
    let isMounted = true;

    fetchMusicPlayerPosition().then((savedPos) => {
      if (!isMounted) return;
      if (savedPos) {
        setPosition(clampPosition(savedPos.x, savedPos.y));
      } else {
        // Default position: bottom right corner
        const pWidth = isMinimized ? 240 : 320;
        const pHeight = isMinimized ? 60 : 280;
        const margin = 20;
        const defaultX = Math.max(margin, window.innerWidth - pWidth - margin);
        const defaultY = Math.max(margin, window.innerHeight - pHeight - margin);
        setPosition({ x: defaultX, y: defaultY });
      }
    });

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return prev;
        return clampPosition(prev.x, prev.y);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Re-clamp position whenever size changes (minimized vs expanded)
  useEffect(() => {
    if (position) {
      const timer = setTimeout(() => {
        setPosition((prev) => (prev ? clampPosition(prev.x, prev.y) : prev));
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isMinimized]);

  // Synchronize default song if specified
  useEffect(() => {
    if (songs.length > 0) {
      const defaultIdx = songs.findIndex((s) => s.id === musicSettings.defaultSongId || s.isDefault);
      if (defaultIdx !== -1) {
        setCurrentSongIndex(defaultIdx);
      }
    }
  }, [songs, musicSettings.defaultSongId]);

  // Handle auto-start signal from Welcome Popup
  useEffect(() => {
    if (autoStartSignal) {
      setUserInteracted(true);
      if (audioRef.current && songs.length > 0) {
        audioRef.current.volume = volume;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Audio autoplay prevented or error:', err));
      }
    }
  }, [autoStartSignal, songs]);

  // Audio state listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, isLoop, isShuffle, songs]);

  const currentSong = songs[currentSongIndex] || songs[0] || {
    id: 'demo',
    title: 'Romantic Melody',
    url: '',
  };

  const togglePlay = () => {
    setUserInteracted(true);
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio play error:', err));
    }
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    let nextIdx = 0;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * songs.length);
    } else {
      nextIdx = (currentSongIndex + 1) % songs.length;
    }
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fallback initial position if position state is loading
  const currentPos = position || {
    x: typeof window !== 'undefined' ? Math.max(12, window.innerWidth - 340) : 20,
    y: typeof window !== 'undefined' ? Math.max(12, window.innerHeight - 300) : 20,
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.url}
        autoPlay={userInteracted && isPlaying}
        preload="auto"
      />

      <motion.div
        ref={playerRef}
        id="floating-music-player"
        drag
        dragMomentum={false}
        dragElastic={0.06}
        dragConstraints={{
          left: 12,
          top: 12,
          right: Math.max(
            12,
            (typeof window !== 'undefined' ? window.innerWidth : 1000) -
              (playerRef.current?.offsetWidth || (isMinimized ? 240 : 320)) -
              12
          ),
          bottom: Math.max(
            12,
            (typeof window !== 'undefined' ? window.innerHeight : 800) -
              (playerRef.current?.offsetHeight || (isMinimized ? 60 : 280)) -
              12
          ),
        }}
        style={{ x: currentPos.x, y: currentPos.y }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          if (!playerRef.current) return;
          const rect = playerRef.current.getBoundingClientRect();
          const clamped = clampPosition(rect.left, rect.top);
          setPosition(clamped);
          saveMusicPlayerPosition(clamped);
        }}
        className={`fixed top-0 left-0 z-[99999] shadow-2xl rounded-3xl border border-rose-300/60 dark:border-rose-900/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-rose-100 overflow-hidden ring-4 ring-rose-500/10 cursor-grab active:cursor-grabbing select-none touch-none ${
          isDragging ? 'shadow-rose-500/30 scale-[1.02] ring-rose-500/40' : 'transition-shadow duration-300'
        }`}
      >
        {isMinimized ? (
          /* Cute Minimized Floating Pill */
          <motion.div
            key="minimized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-amber-50/90 dark:from-slate-900 dark:to-rose-950/90"
          >
            <div className="flex items-center text-slate-400 dark:text-slate-500 hover:text-rose-500 transition cursor-grab">
              <GripVertical className="w-4 h-4 opacity-70" />
            </div>

            <button
              onClick={togglePlay}
              onPointerDown={stopProp}
              onTouchStart={stopProp}
              className="relative p-2 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/30 flex items-center justify-center group cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <Disc
                className={`w-5 h-5 text-white ${
                  isPlaying ? 'animate-spin [animation-duration:4s]' : ''
                }`}
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-current animate-pulse" /> Love Radio
              </span>
              <div className="text-xs font-bold max-w-[120px] truncate text-slate-900 dark:text-white">
                {currentSong.title}
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              onPointerDown={stopProp}
              onTouchStart={stopProp}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 dark:hover:bg-rose-950 transition cursor-pointer"
              title="Expand player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Cute & Professional Expanded Player */
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-80 p-4 flex flex-col gap-3 relative"
          >
            {/* Top Bar Header with Drag Grip */}
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 cursor-grab">
                <GripVertical className="w-4 h-4 text-rose-400/80 shrink-0" />
                <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  Romantic Music Box 🎵
                </span>
              </div>
              <div className="flex items-center gap-1">
                {songs.length > 1 && (
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    onPointerDown={stopProp}
                    onTouchStart={stopProp}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                      showPlaylist
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/60'
                    }`}
                    title="Playlist Tracks"
                  >
                    <ListMusic className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{songs.length}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(true)}
                  onPointerDown={stopProp}
                  onTouchStart={stopProp}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Minimize player"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Playlist Popup Drawer */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onPointerDown={stopProp}
                  onTouchStart={stopProp}
                  className="overflow-hidden bg-rose-50/70 dark:bg-slate-950/80 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-2 max-h-40 overflow-y-auto space-y-1 text-xs"
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Track ({songs.length})
                  </div>
                  {songs.map((song, idx) => {
                    const isCurrent = idx === currentSongIndex;
                    return (
                      <button
                        key={song.id}
                        onClick={() => {
                          setCurrentSongIndex(idx);
                          setIsPlaying(true);
                          setShowPlaylist(false);
                        }}
                        onPointerDown={stopProp}
                        onTouchStart={stopProp}
                        className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between font-semibold transition cursor-pointer ${
                          isCurrent
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'hover:bg-rose-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate max-w-[190px]">
                          {idx + 1}. {song.title}
                        </span>
                        {isCurrent && <Heart className="w-3 h-3 fill-current shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Song Card & Animated Vinyl Record */}
            <div className="flex items-center gap-3.5 bg-gradient-to-r from-rose-500/5 via-pink-500/10 to-amber-500/5 p-3 rounded-2xl border border-rose-200/50 dark:border-rose-900/40">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-13 h-13 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 ${
                    isPlaying ? 'animate-spin [animation-duration:5s]' : ''
                  }`}
                >
                  <Disc className="w-7 h-7" />
                  <Heart className="w-3 h-3 absolute fill-rose-500 text-rose-500 bg-white rounded-full p-0.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {currentSong.title || 'Untitled Track'}
                </h4>

                {/* Cute Animated Soundwave Bars */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-end gap-0.5 h-3">
                    {[0.4, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 bg-rose-500 rounded-full transition-all ${
                          isPlaying ? 'animate-bounce' : 'h-1 opacity-40'
                        }`}
                        style={{
                          height: isPlaying ? `${h * 100}%` : '4px',
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: '0.8s',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-rose-500 font-extrabold">
                    {isPlaying ? 'Playing Melody' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Bar */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="w-full accent-rose-500 h-1.5 bg-rose-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isShuffle
                    ? 'text-rose-600 bg-rose-100 dark:bg-rose-950 font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Shuffle playlist"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition active:scale-95 cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="p-3.5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-rose-500/40 border-2 border-white/40 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition active:scale-95 cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => setIsLoop(!isLoop)}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isLoop
                    ? 'text-rose-600 bg-rose-100 dark:bg-rose-950 font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Repeat track"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-rose-100 dark:border-slate-800/80">
              <button
                onClick={toggleMute}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-rose-500" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                onPointerDown={stopProp}
                onTouchStart={stopProp}
                className="w-full accent-rose-500 h-1.5 bg-rose-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
