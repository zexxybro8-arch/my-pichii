import React, { useState } from 'react';
import { AssetItem } from '../../types';
import { uploadAudioToStorage, storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FolderOpen, Upload, Copy, Trash2, Check, FileText, Image as ImageIcon, Music, Video, Sparkles, Link2 } from 'lucide-react';

interface AssetsManagerTabProps {
  assets: AssetItem[];
  onChangeAssets: (assets: AssetItem[]) => void;
  onSave: () => void;
}

export const AssetsManagerTab: React.FC<AssetsManagerTabProps> = ({
  assets = [],
  onChangeAssets,
  onSave,
}) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'video' | 'gif'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [customType, setCustomType] = useState<'image' | 'video' | 'gif' | 'icon' | 'audio'>('image');

  const filteredAssets = assets.filter((a) => (filter === 'all' ? true : a.type === filter));

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      let downloadUrl = '';
      if (storage) {
        const fileRef = ref(storage, `cms_assets/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
        const task = uploadBytesResumable(fileRef, file);
        
        await new Promise((resolve, reject) => {
          task.on(
            'state_changed',
            (snap) => {
              const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
              setUploadProgress(Math.round(pct));
            },
            reject,
            async () => {
              downloadUrl = await getDownloadURL(task.snapshot.ref);
              resolve(true);
            }
          );
        });
      } else {
        // Fallback convert to Data URL for small files
        downloadUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      let assetType: AssetItem['type'] = 'image';
      if (file.type.startsWith('audio/')) assetType = 'audio';
      else if (file.type.startsWith('video/')) assetType = 'video';
      else if (file.type.includes('gif')) assetType = 'gif';

      const newAsset: AssetItem = {
        id: `ast_${Date.now()}`,
        name: file.name,
        url: downloadUrl,
        type: assetType,
        createdAt: new Date().toISOString(),
      };

      onChangeAssets([newAsset, ...assets]);
      onSave();
    } catch (err) {
      console.error('Asset upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    const newAsset: AssetItem = {
      id: `ast_${Date.now()}`,
      name: customName.trim() || 'Custom Asset Link',
      url: customUrl.trim(),
      type: customType,
      createdAt: new Date().toISOString(),
    };
    onChangeAssets([newAsset, ...assets]);
    setCustomUrl('');
    setCustomName('');
    onSave();
  };

  const handleDelete = (id: string) => {
    onChangeAssets(assets.filter((a) => a.id !== id));
    onSave();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-rose-400" />
            <span>Assets Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload and manage images, audio tracks, GIFs, and videos to use anywhere across the website CMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/30 transition">
            <Upload className="w-4 h-4" />
            <span>{uploading ? `Uploading ${uploadProgress}%...` : 'Upload File'}</span>
            <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Add via URL Section */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-amber-400" />
          <span>Add Asset via External Web URL</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Asset Name (e.g., Couple Sunset Photo)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
          />
          <input
            type="text"
            placeholder="Asset URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500 sm:col-span-2"
          />
          <select
            value={customType}
            onChange={(e) => setCustomType(e.target.value as any)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
          >
            <option value="image">Image</option>
            <option value="gif">GIF</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="icon">Icon / Graphic</option>
          </select>
        </div>
        <button
          onClick={handleAddCustomUrl}
          disabled={!customUrl.trim()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-rose-400 font-semibold text-xs transition"
        >
          Add to Asset Library
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['all', 'image', 'gif', 'audio', 'video'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              filter === t
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No assets in library yet</p>
          <p className="text-xs text-slate-500 mt-1">Upload files or add web URLs to build your asset library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredAssets.map((ast) => (
            <div
              key={ast.id}
              className="group relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition"
            >
              {/* Media Preview */}
              <div className="h-32 bg-slate-950 flex items-center justify-center overflow-hidden relative">
                {ast.type === 'image' || ast.type === 'gif' || ast.type === 'icon' ? (
                  <img src={ast.url} alt={ast.name} className="w-full h-full object-cover" />
                ) : ast.type === 'audio' ? (
                  <div className="flex flex-col items-center text-rose-400">
                    <Music className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-mono text-slate-400">Audio Track</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-amber-400">
                    <Video className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-mono text-slate-400">Video</span>
                  </div>
                )}

                <span className="absolute top-2 left-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-rose-300 border border-rose-500/30 backdrop-blur-sm">
                  {ast.type}
                </span>
              </div>

              {/* Asset Info & Controls */}
              <div className="p-3 bg-slate-900 space-y-2">
                <p className="text-xs font-semibold text-slate-200 truncate" title={ast.name}>
                  {ast.name}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => handleCopy(ast.url, ast.id)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    {copiedId === ast.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(ast.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
