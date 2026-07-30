import React from 'react';
import {
  Home,
  Users,
  Gift,
  Lock,
  Heart,
  Camera,
  Music,
  CircleDot,
  Puzzle,
  Sparkles,
  Mail,
  PartyPopper,
  Palette,
  Eye,
  Rocket,
  X,
  LogOut,
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onCloseMobile?: () => void;
  onLogout: () => void;
  isPublishedSynced: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onCloseMobile,
  onLogout,
  isPublishedSynced,
}) => {
  const coreMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'couple', label: 'Couple Information', icon: <Users className="w-4 h-4" /> },
    { id: 'popup', label: 'Welcome Popup', icon: <Gift className="w-4 h-4" /> },
    { id: 'pin', label: 'Secret PIN', icon: <Lock className="w-4 h-4" /> },
    { id: 'anniversary', label: 'Anniversary Settings', icon: <Heart className="w-4 h-4" /> },
  ];

  const experienceMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'memories', label: 'Memories', icon: <Camera className="w-4 h-4" /> },
    { id: 'music', label: 'Music Manager', icon: <Music className="w-4 h-4" /> },
    { id: 'balloons', label: 'Balloon Messages', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'puzzle', label: 'Puzzle', icon: <Puzzle className="w-4 h-4" /> },
    { id: 'scratch', label: 'Scratch Card', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'letter', label: 'Love Letter', icon: <Mail className="w-4 h-4" /> },
    { id: 'celebration', label: 'Final Celebration', icon: <PartyPopper className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme Settings', icon: <Palette className="w-4 h-4" /> },
  ];

  const systemMenuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'preview', label: 'Live Preview', icon: <Eye className="w-4 h-4" /> },
    {
      id: 'publish',
      label: 'Publish',
      icon: <Rocket className="w-4 h-4" />,
      badge: isPublishedSynced ? 'Live' : 'Draft',
    },
  ];

  const renderNavGroup = (title: string, items: typeof coreMenuItems) => (
    <div className="space-y-1 mb-4">
      <div className="text-slate-500 text-[10px] uppercase font-extrabold tracking-widest px-3 mb-1.5">
        {title}
      </div>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-pink-500/10 text-pink-400 border-l-4 border-pink-500 rounded-r-md'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white rounded-md'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={isActive ? 'text-pink-400' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isPublishedSynced
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none shrink-0">
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-md shadow-pink-500/20">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Surprise CMS</span>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {renderNavGroup('Core System', coreMenuItems)}
        {renderNavGroup('Experience', experienceMenuItems)}
        {renderNavGroup('Publish & Live', systemMenuItems)}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-2.5">
        <button
          onClick={() => {
            setActiveTab('publish');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-900/20"
        >
          <Rocket className="w-4 h-4" />
          <span>Publish Changes</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};
