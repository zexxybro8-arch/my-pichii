import React, { useState } from 'react';
import {
  Music,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Play,
  Pause,
  Save,
  Check,
  Volume2,
  Sliders,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Song, MusicSettingsConfig } from '../../types';
import { uploadAudioToStorage } from '../../lib/firebase';

interface MusicManagerTabProps {
  songs: Song[];
  musicSettings: MusicSettingsConfig;
  onChangeSongs: (songs: Song[]) => void;
  onChangeMusicSettings: (settings: Partial<MusicSettingsConfig>) => void;
  onSave: () => void;
}

export const MusicManagerTab: React.FC<MusicManagerTabProps> = ({
  songs = [],
  musicSettings = {
    autoplay: true,
    loop: true,
    shuffle: false,
    defaultVolume: 0.7,
    fadeInDuration: 2,
    fadeOutDuration: 2,
    defaultSongId: '',
  },
  onChangeSongs,
  onChangeMusicSettings,
  onSave,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newDuration, setNewDuration] = useState<number | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseTitle = file.name.replace(/\.[^/.]+$/, '');
    if (!newTitle) {
      setNewTitle(baseTitle);
    }
    setNewFileName(file.name);

    try {
      const tempAudio = new Audio(URL.createObjectURL(file));
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setNewDuration(Math.round(tempAudio.duration));
        }
      };
    } catch {}

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const downloadUrl = await uploadAudioToStorage(file, (pct) => {
        setUploadProgress(pct);
      });
      setNewUrl(downloadUrl);
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError(err?.message || 'Failed to upload MP3 file to Firebase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || isUploading) return;

    const newSong: Song = {
      id: `s_${Date.now()}`,
      title: newTitle || 'Romantic Melody',
      url: newUrl,
      fileName: newFileName || undefined,
      duration: newDuration,
      order: songs.length + 1,
      isDefault: songs.length === 0,
    };

    const updated = [...songs, newSong];
    onChangeSongs(updated);

    if (newSong.isDefault) {
      onChangeMusicSettings({ defaultSongId: newSong.id });
    }

    setNewTitle('');
    setNewUrl('');
    setNewFileName('');
    setNewDuration(undefined);
    setUploadProgress(0);
  };

  const handleDelete = (id: string) => {
    const filtered = songs.filter((s) => s.id !== id);
    onChangeSongs(filtered);
    if (musicSettings.defaultSongId === id && filtered.length > 0) {
      onChangeMusicSettings({ defaultSongId: filtered[0].id });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= songs.length) return;

    const list = [...songs];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChangeSongs(reordered);
  };

  const handleRename = (id: string, title: string) => {
    const list = songs.map((s) => (s.id === id ? { ...s, title } : s));
    onChangeSongs(list);
  };

  const handleSetDefault = (id: string) => {
    const list = songs.map((s) => ({ ...s, isDefault: s.id === id }));
    onChangeSongs(list);
    onChangeMusicSettings({ defaultSongId: id });
  };

  const togglePreviewPlay = (song: Song) => {
    if (playingId === song.id) {
      previewAudio?.pause();
      setPlayingId(null);
    } else {
      previewAudio?.pause();
      const audio = new Audio(song.url);
      audio.volume = musicSettings.defaultVolume ?? 0.7;
      audio.play();
      setPreviewAudio(audio);
      setPlayingId(song.id);
      audio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-rose-400" />
            <span>Music Player & Audio Playlist CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom MP3 romantic background music, edit playlist order, volume, autoplay, and audio widget styles.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Music Settings
        </button>
      </div>

      {/* Playback & Volume Controls */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Playback & Audio Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200">Autoplay Music</span>
            <input
              type="checkbox"
              checked={musicSettings.autoplay}
              onChange={(e) => onChangeMusicSettings({ autoplay: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200">Loop Playlist</span>
            <input
              type="checkbox"
              checked={musicSettings.loop}
              onChange={(e) => onChangeMusicSettings({ loop: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-xs font-bold text-slate-200">Shuffle Playlist</span>
            <input
              type="checkbox"
              checked={musicSettings.shuffle}
              onChange={(e) => onChangeMusicSettings({ shuffle: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Default Volume ({Math.round((musicSettings.defaultVolume ?? 0.7) * 100)}%)</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicSettings.defaultVolume ?? 0.7}
              onChange={(e) => onChangeMusicSettings({ defaultVolume: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Fade In (Seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={musicSettings.fadeInDuration ?? 2}
              onChange={(e) => onChangeMusicSettings({ fadeInDuration: parseInt(e.target.value) })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Fade Out (Seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={musicSettings.fadeOutDuration ?? 2}
              onChange={(e) => onChangeMusicSettings({ fadeOutDuration: parseInt(e.target.value) })}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Add Song Form */}
      <form
        onSubmit={handleAddSong}
        className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Upload New MP3 Track</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Upload MP3 Audio File or Paste URL
            </label>
            <label
              className={`px-4 py-2.5 rounded-xl border border-dashed text-xs font-bold transition flex items-center justify-center gap-2 mb-2 ${
                isUploading
                  ? 'border-slate-700 bg-slate-950 text-slate-500 cursor-not-allowed'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Uploading to Firebase Storage ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Choose MP3 File</span>
                </>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Uploaded Firebase Storage Badge */}
            {newUrl && newUrl.includes('firebasestorage') && !isUploading && (
              <div className="mb-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">
                  Uploaded to Firebase Storage {newFileName ? `(${newFileName})` : ''}
                </span>
              </div>
            )}

            {uploadError && (
              <div className="mb-2 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}

            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Or paste direct MP3 link (https://...)"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Song Title / Name
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Our Special Melody"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!newUrl || isUploading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading File to Storage...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Song to Playlist</span>
            </>
          )}
        </button>
      </form>

      {/* Songs List */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">
          Playlist ({songs.length} Tracks)
        </h3>

        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={song.id || index}
              className={`flex items-center gap-4 p-3 rounded-xl border transition ${
                song.isDefault || musicSettings.defaultSongId === song.id
                  ? 'bg-rose-500/10 border-rose-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <button
                onClick={() => togglePreviewPlay(song)}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center hover:opacity-90 transition flex-shrink-0"
              >
                {playingId === song.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={song.title}
                  onChange={(e) => handleRename(song.id, e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={() => handleSetDefault(song.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                  song.isDefault || musicSettings.defaultSongId === song.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Default</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === songs.length - 1}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(song.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
