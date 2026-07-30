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
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Song, MusicSettingsConfig } from '../../types';

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.url}
        autoPlay={userInteracted && isPlaying}
        preload="auto"
      />

      <motion.div
        id="floating-music-player"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-5 right-5 z-50 transition-all duration-300 shadow-2xl rounded-3xl border border-rose-300/60 dark:border-rose-900/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-rose-100 overflow-hidden ring-4 ring-rose-500/10"
      >
        {isMinimized ? (
          /* Cute Minimized Floating Pill */
          <motion.div
            key="minimized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-rose-50/90 via-pink-50/90 to-amber-50/90 dark:from-slate-900 dark:to-rose-950/90"
          >
            <button
              onClick={togglePlay}
              className="relative p-2 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/30 flex items-center justify-center group"
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
              <div className="text-xs font-bold max-w-[130px] truncate text-slate-900 dark:text-white">
                {currentSong.title}
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 dark:hover:bg-rose-950 transition"
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
            {/* Top Bar Header */}
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center">
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
                    className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
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
                        className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between font-semibold transition ${
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
                className={`p-2 rounded-xl transition ${
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
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition active:scale-95"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3.5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-rose-500/40 border-2 border-white/40"
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
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition active:scale-95"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => setIsLoop(!isLoop)}
                className={`p-2 rounded-xl transition ${
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
                className="text-slate-400 hover:text-rose-500 transition"
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
                className="w-full accent-rose-500 h-1.5 bg-rose-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

