import React, { useState } from 'react';
import { Rocket, CheckCircle2, Clock, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { AppConfig } from '../../types';

interface PublishTabProps {
  config: AppConfig;
  isPublishedSynced: boolean;
  onPublishNow: () => Promise<void>;
}

export const PublishTab: React.FC<PublishTabProps> = ({
  config,
  isPublishedSynced,
  onPublishNow,
}) => {
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublish = async () => {
    setPublishing(true);
    setSuccessMsg('');
    try {
      await onPublishNow();
      setSuccessMsg('🎉 Successfully published! Public website has been updated instantly.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-rose-500" />
          <span>One-Click Publish Center</span>
        </h2>
        <p className="text-xs text-slate-500">
          Sync your draft modifications to the public live website without changing the URL.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-200 dark:border-rose-900">
          <Globe className="w-10 h-10 animate-pulse" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Ready to Update Public Website?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Clicking Publish below will copy all your latest draft changes (couple info, photo memories, music playlist, love letter, PIN code, and theme) directly to Firestore for live visitors.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold font-mono">
          {isPublishedSynced ? (
            <span className="text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Live Website is Up to Date
            </span>
          ) : (
            <span className="text-amber-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> You Have Unpublished Draft Changes
            </span>
          )}
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 dark:text-emerald-300 text-sm font-bold rounded-2xl animate-fade-in">
            {successMsg}
          </div>
        )}

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-lg shadow-xl hover:opacity-95 active:scale-95 disabled:opacity-50 transition flex items-center justify-center gap-3 mx-auto"
        >
          <Rocket className="w-6 h-6" />
          <span>{publishing ? 'Publishing Changes...' : 'Publish to Public Website 🚀'}</span>
        </button>

        <div className="pt-4 text-xs text-slate-400 font-medium">
          Last Draft Saved: {new Date(config.updatedAt || Date.now()).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
