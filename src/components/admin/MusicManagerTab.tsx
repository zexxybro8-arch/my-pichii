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
} from 'lucide-react';
import { Song, MusicSettingsConfig } from '../../types';

interface MusicManagerTabProps {
  songs: Song[];
  musicSettings: MusicSettingsConfig;
  onChangeSongs: (songs: Song[]) => void;
  onChangeMusicSettings: (settings: Partial<MusicSettingsConfig>) => void;
  onSave: () => void;
}

export const MusicManagerTab: React.FC<MusicManagerTabProps> = ({
  songs,
  musicSettings,
  onChangeSongs,
  onChangeMusicSettings,
  onSave,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newSong: Song = {
      id: `s_${Date.now()}`,
      title: newTitle || 'Romantic Melody',
      url: newUrl,
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-rose-500" />
            <span>Background Music Manager</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload MP3 songs, edit playlists, set autoplay/volume preferences, and choose default tracks.
          </p>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Global Music Controls & Settings */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-rose-500" />
          <span>Playback & Audio Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Autoplay Music</span>
            <input
              type="checkbox"
              checked={musicSettings.autoplay}
              onChange={(e) => onChangeMusicSettings({ autoplay: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Loop Playlist</span>
            <input
              type="checkbox"
              checked={musicSettings.loop}
              onChange={(e) => onChangeMusicSettings({ loop: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Shuffle Playlist</span>
            <input
              type="checkbox"
              checked={musicSettings.shuffle}
              onChange={(e) => onChangeMusicSettings({ shuffle: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Default Volume ({Math.round((musicSettings.defaultVolume ?? 0.7) * 100)}%)</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicSettings.defaultVolume ?? 0.7}
              onChange={(e) => onChangeMusicSettings({ defaultVolume: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Fade In (Seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={musicSettings.fadeInDuration ?? 2}
              onChange={(e) => onChangeMusicSettings({ fadeInDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Fade Out (Seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={musicSettings.fadeOutDuration ?? 2}
              onChange={(e) => onChangeMusicSettings({ fadeOutDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Add Song Form */}
      <form
        onSubmit={handleAddSong}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" />
          <span>Upload New MP3 Track</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Upload MP3 Audio File or Paste URL
            </label>
            <label className="px-4 py-2.5 rounded-xl border border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 text-xs font-bold cursor-pointer hover:bg-rose-100/50 flex items-center justify-center gap-2 mb-2">
              <Upload className="w-4 h-4" />
              <span>Choose MP3 File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Or paste direct MP3 link (https://...)"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Song Title / Name
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Our Special Melody"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!newUrl}
          className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Song to Playlist</span>
        </button>
      </form>

      {/* Songs List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Playlist ({songs.length} Tracks)
        </h3>

        <div className="space-y-3">
          {songs.map((song, index) => (
            <div
              key={song.id || index}
              className={`flex items-center gap-4 p-3 rounded-2xl border transition ${
                song.isDefault || musicSettings.defaultSongId === song.id
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700'
              }`}
            >
              <button
                onClick={() => togglePreviewPlay(song)}
                className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition flex-shrink-0"
              >
                {playingId === song.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={song.title}
                  onChange={(e) => handleRename(song.id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              {/* Default Song Badge / Button */}
              <button
                onClick={() => handleSetDefault(song.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                  song.isDefault || musicSettings.defaultSongId === song.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-100'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Default</span>
              </button>

              {/* Order Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === songs.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(song.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
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
