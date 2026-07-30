import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { MemoryPhoto } from '../../types';

interface MemoriesSectionProps {
  memories: MemoryPhoto[];
  onNextStep?: () => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories, onNextStep }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(memories.map((m) => m.category).filter(Boolean)))];

  const filteredMemories =
    activeCategory === 'All' ? memories : memories.filter((m) => m.category === activeCategory);

  const handlePrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + memories.length) % memories.length);
    }
  };

  const handleNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % memories.length);
    }
  };

  return (
    <section id="memories" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Camera className="w-4 h-4" />
          <span>Our Precious Photo Album</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Our Favorite Memories 📷
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
          Every picture holds a thousand loving words we shared together.
        </p>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat || 'All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMemories.map((photo, idx) => (
          <motion.div
            key={photo.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedIdx(memories.indexOf(photo))}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-rose-100 dark:border-slate-800 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={photo.image}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> View Photo
                </span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                {photo.caption}
              </p>
              {photo.date && (
                <span className="text-[11px] text-rose-500 font-mono mt-1 block">
                  {photo.date}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && memories[selectedIdx] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-video max-h-[70vh] bg-black flex items-center justify-center">
                <img
                  src={memories[selectedIdx].image}
                  alt={memories[selectedIdx].caption}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-rose-600 text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-rose-600 text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 bg-slate-900 text-center">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {memories[selectedIdx].caption}
                </h4>
                <p className="text-xs text-rose-400 font-mono">
                  Memory {selectedIdx + 1} of {memories.length}
                </p>
              </div>
            </motion.div>
          </div>
        )}
        {/* Next Step Action Button */}
        {onNextStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <button
              onClick={onNextStep}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
            >
              <span>Continue to Love Wishes 🎈</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
