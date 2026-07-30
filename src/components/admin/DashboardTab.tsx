import React from 'react';
import {
  Users,
  Camera,
  Music,
  CircleDot,
  Rocket,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
} from 'lucide-react';
import { AppConfig, MemoryPhoto, Song, AdminTab } from '../../types';

interface DashboardTabProps {
  config: AppConfig;
  memories: MemoryPhoto[];
  songs: Song[];
  isPublishedSynced: boolean;
  onNavigateTab: (tab: AdminTab) => void;
  onPublishNow: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  config,
  memories,
  songs,
  isPublishedSynced,
  onNavigateTab,
  onPublishNow,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CMS Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {config.boyfriendName || 'Admin'}! ❤️
            </h1>
            <p className="text-sm text-rose-100 mt-1 max-w-xl">
              You are managing the romantic surprise experience for{' '}
              <span className="font-bold underline">{config.girlfriendName}</span>. Every change
              here can be previewed live or published in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('preview')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={onPublishNow}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-extrabold text-xs shadow-lg transition flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Publish Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Couple Names
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {config.boyfriendName} & {config.girlfriendName}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Photo Memories
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {memories.length} Photos
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Playlist Songs
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {songs.length} Songs
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-500 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Publish Status
            </p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              {isPublishedSynced ? (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Live Synced
                </span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Draft Pending
                </span>
              )}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <Rocket className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Management Shortcuts */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Quick Management Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { id: 'couple', label: 'Edit Couple Info', icon: '👩' },
            { id: 'popup', label: 'Welcome Popup', icon: '🎁' },
            { id: 'music', label: 'Music Playlist', icon: '🎵' },
            { id: 'memories', label: 'Photo Album', icon: '📷' },
            { id: 'balloons', label: 'Balloons', icon: '🎈' },
            { id: 'puzzle', label: 'Photo Puzzle', icon: '🧩' },
            { id: 'scratch', label: 'Scratch Voucher', icon: '✨' },
            { id: 'letter', label: 'Love Letter', icon: '💌' },
            { id: 'theme', label: 'Theme Colors', icon: '🎨' },
            { id: 'pin', label: 'Secret PIN', icon: '🔐' },
            { id: 'celebration', label: 'Fireworks & Final', icon: '🎆' },
            { id: 'publish', label: 'One Click Publish', icon: '🚀' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigateTab(item.id as AdminTab)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/60 dark:border-slate-700 text-left transition group"
            >
              <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
