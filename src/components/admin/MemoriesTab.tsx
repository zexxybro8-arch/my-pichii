import React, { useState } from 'react';
import { Camera, Plus, Trash2, ArrowUp, ArrowDown, Upload, Image, Eye, Save } from 'lucide-react';
import { MemoryPhoto } from '../../types';

interface MemoriesTabProps {
  memories: MemoryPhoto[];
  onChangeMemories: (memories: MemoryPhoto[]) => void;
  onSave: () => void;
}

export const MemoriesTab: React.FC<MemoriesTabProps> = ({ memories, onChangeMemories, onSave }) => {
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

    // re-assign order
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChangeMemories(reordered);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    const list = memories.map((m) => (m.id === id ? { ...m, caption } : m));
    onChangeMemories(list);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-500" />
            <span>Photo Memories Manager</span>
          </h2>
          <p className="text-xs text-slate-500">
            Upload unlimited photos, edit captions, reorder items, and manage gallery memories.
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

      {/* Upload New Photo Form */}
      <form
        onSubmit={handleAddPhoto}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" />
          <span>Add New Photo to Memory Album</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Select Local Image File or Paste URL
            </label>
            <div className="flex gap-2">
              <label className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 text-xs font-bold cursor-pointer hover:bg-rose-100/50 flex items-center justify-center gap-2">
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
              className="w-full mt-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Caption
              </label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Our favorite evening... ❤️"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category / Tag (Optional)
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Vacations, Favorites, Cozy"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>
        </div>

        {newImage && (
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <img
              src={newImage}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-slate-200"
            />
            <span className="text-xs text-emerald-600 font-bold">✓ Image Ready to Add</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!newImage}
          className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo to Album</span>
        </button>
      </form>

      {/* Existing Photos List & Reorder */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Current Photos ({memories.length})
        </h3>

        <div className="space-y-3">
          {memories.map((photo, index) => (
            <div
              key={photo.id || index}
              className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-rose-200 transition"
            >
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Category: {photo.category || 'General'}
                </span>
              </div>

              {/* Reorder & Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === memories.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewPhoto(photo)}
                  className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full text-center relative">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <img
              src={previewPhoto.image}
              alt={previewPhoto.caption}
              className="max-h-96 w-full object-contain rounded-2xl mb-4"
            />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {previewPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
