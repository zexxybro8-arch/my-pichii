import React, { useState } from 'react';
import { Camera, Plus, Trash2, ArrowUp, ArrowDown, Upload, Eye, Save, Sliders } from 'lucide-react';
import { MemoryPhoto, MemoryGalleryConfig } from '../../types';

interface MemoriesTabProps {
  memories: MemoryPhoto[];
  config?: MemoryGalleryConfig;
  onChangeMemories: (memories: MemoryPhoto[]) => void;
  onChangeConfig?: (updated: Partial<MemoryGalleryConfig>) => void;
  onSave: () => void;
}

export const MemoriesTab: React.FC<MemoriesTabProps> = ({
  memories = [],
  config = {
    layoutStyle: 'polaroid',
    cardStyle: 'glass',
  },
  onChangeMemories,
  onChangeConfig,
  onSave,
}) => {
  const [newImage, setNewImage] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<MemoryPhoto | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;

    const newPhoto: MemoryPhoto = {
      id: `m_${Date.now()}`,
      image: newImage,
      caption: newCaption || 'Special Memory ❤️',
      category: newCategory || 'General',
      order: memories.length + 1,
      date: new Date().toISOString().split('T')[0],
    };

    onChangeMemories([...memories, newPhoto]);
    setNewImage('');
    setNewCaption('');
    setNewCategory('');
  };

  const handleDelete = (id: string) => {
    const filtered = memories.filter((m) => m.id !== id);
    onChangeMemories(filtered);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= memories.length) return;

    const list = [...memories];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChangeMemories(reordered);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    const list = memories.map((m) => (m.id === id ? { ...m, caption } : m));
    onChangeMemories(list);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-rose-400" />
            <span>Memory Gallery CMS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload photo memories, customize album gallery layout styles (polaroid, masonry, grid), card borders, and categories.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/30 transition self-start sm:self-auto"
        >
          Save Gallery Settings
        </button>
      </div>

      {/* Gallery Layout Config */}
      {onChangeConfig && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Gallery Layout & Card Aesthetics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Gallery Layout Style
              </label>
              <select
                value={config.layoutStyle || 'polaroid'}
                onChange={(e) => onChangeConfig({ layoutStyle: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="polaroid">Polaroid Snapshots (Classic Romantic)</option>
                <option value="masonry">Pinterest Masonry Grid</option>
                <option value="grid">Clean Square Grid</option>
                <option value="carousel">Interactive Slide Carousel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Card Border Style
              </label>
              <select
                value={config.cardStyle || 'glass'}
                onChange={(e) => onChangeConfig({ cardStyle: e.target.value as any })}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="glass">Frosted Glassmorphism</option>
                <option value="paper">Warm Paper Border</option>
                <option value="shadow">Deep 3D Floating Shadow</option>
                <option value="border">Rose Gold Metallic Border</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Photo Form */}
      <form
        onSubmit={handleAddPhoto}
        className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Add New Photo Memory</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Select Local Image File or Paste URL
            </label>
            <div className="flex gap-2">
              <label className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-bold cursor-pointer hover:bg-rose-500/20 flex items-center justify-center gap-2 transition">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="w-full mt-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Caption
              </label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Our favorite evening... ❤️"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category / Tag (Optional)
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Vacations, Favorites, Cozy"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {newImage && (
          <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <img
              src={newImage}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-slate-800"
            />
            <span className="text-xs text-emerald-400 font-bold">✓ Image Ready to Add</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!newImage}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo to Album</span>
        </button>
      </form>

      {/* Existing Photos List & Reorder */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">
          Current Photos ({memories.length})
        </h3>

        <div className="space-y-3">
          {memories.map((photo, index) => (
            <div
              key={photo.id || index}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800"
            >
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-3 py-1 text-xs font-semibold focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tag: {photo.category || 'General'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === memories.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewPhoto(photo)}
                  className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 p-6 rounded-3xl max-w-lg w-full text-center relative border border-slate-800">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <img
              src={previewPhoto.image}
              alt={previewPhoto.caption}
              className="max-h-96 w-full object-contain rounded-2xl mb-4"
            />
            <p className="text-sm font-bold text-white">
              {previewPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
