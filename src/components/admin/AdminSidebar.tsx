import React from 'react';
import {
  LayoutDashboard,
  Palette,
  Image,
  Sparkles,
  Settings,
  Gift,
  CircleDot,
  Puzzle,
  Ticket,
  Mail,
  Camera,
  Music,
  PartyPopper,
  Users,
  Lock,
  Heart,
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
  const cmsCoreItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'theme', label: 'Global Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'assets', label: 'Assets Manager', icon: <Image className="w-4 h-4" /> },
    { id: 'animations', label: 'Animation Editor', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const pageEditorItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'welcome', label: 'Welcome Page', icon: <Gift className="w-4 h-4" /> },
    { id: 'balloons', label: 'Balloon Section', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'puzzle', label: 'Puzzle Section', icon: <Puzzle className="w-4 h-4" /> },
    { id: 'scratch', label: 'Scratch Card', icon: <Ticket className="w-4 h-4" /> },
    { id: 'letter', label: 'Love Letter', icon: <Mail className="w-4 h-4" /> },
    { id: 'memories', label: 'Memory Gallery', icon: <Camera className="w-4 h-4" /> },
    { id: 'music', label: 'Music Player', icon: <Music className="w-4 h-4" /> },
    { id: 'celebration', label: 'Final Celebration', icon: <PartyPopper className="w-4 h-4" /> },
  ];

  const journeyItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'couple', label: 'Couple Info', icon: <Users className="w-4 h-4" /> },
    { id: 'pin', label: 'Secret PIN Lock', icon: <Lock className="w-4 h-4" /> },
    { id: 'anniversary', label: 'Anniversary Dates', icon: <Heart className="w-4 h-4" /> },
  ];

  const publishItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'preview', label: 'Live Preview', icon: <Eye className="w-4 h-4" /> },
    {
      id: 'publish',
      label: 'Publish Website',
      icon: <Rocket className="w-4 h-4" />,
      badge: isPublishedSynced ? 'Live' : 'Draft',
    },
  ];

  const renderNavGroup = (
    title: string,
    items: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[]
  ) => (
    <div className="space-y-1 mb-5">
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
                ? 'bg-rose-500/10 text-rose-400 border-l-4 border-rose-500 rounded-r-md'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white rounded-md'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={isActive ? 'text-rose-400' : 'text-slate-400'}>{item.icon}</span>
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
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <span className="text-white font-extrabold text-sm">W</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight block leading-tight">Website CMS</span>
            <span className="text-[10px] text-slate-400 font-mono">No-Code Website Editor</span>
          </div>
        </div>

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {renderNavGroup('CMS Core', cmsCoreItems)}
        {renderNavGroup('Page Editors', pageEditorItems)}
        {renderNavGroup('Journey & Security', journeyItems)}
        {renderNavGroup('Live & Deploy', publishItems)}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => {
            setActiveTab('publish');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/40"
        >
          <Rocket className="w-4 h-4" />
          <span>Publish Website</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
};
