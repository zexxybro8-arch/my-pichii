import React, { useState, useEffect, useRef } from 'react';
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

      <div
        id="floating-music-player"
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 shadow-2xl rounded-2xl border border-rose-200/40 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 dark:border-rose-900/40 text-rose-950 dark:text-rose-100 overflow-hidden"
      >
        {isMinimized ? (
          /* Minimized pill */
          <div className="flex items-center gap-3 px-4 py-2.5">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Disc className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <div className="text-xs font-semibold max-w-[140px] truncate">
              {currentSong.title}
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
              title="Expand player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded full player */
          <div className="w-80 p-4 flex flex-col gap-3">
            {/* Header / Minimize button */}
            <div className="flex items-center justify-between pb-1 border-b border-rose-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Love Melody Player
                </span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Song Info */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-md ${
                    isPlaying ? 'animate-spin [animation-duration:6s]' : ''
                  }`}
                >
                  <Disc className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentSong.title || 'Untitled Track'}
                </h4>
                <p className="text-xs text-rose-500 font-medium">
                  {isPlaying ? 'Playing Romantic Music...' : 'Paused'}
                </p>
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-rose-500 h-1.5 bg-rose-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Transport Controls */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 rounded-md transition ${
                  isShuffle ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/30"
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
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => setIsLoop(!isLoop)}
                className={`p-1.5 rounded-md transition ${
                  isLoop ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Repeat Playlist/Track"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 pt-1 border-t border-rose-50 dark:border-slate-800">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-rose-500 transition"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-rose-500 h-1 bg-rose-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
