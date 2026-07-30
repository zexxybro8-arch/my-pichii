import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Puzzle, Trophy, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { PuzzleConfig } from '../../types';

interface PuzzleSectionProps {
  config: PuzzleConfig;
  onNextStep?: () => void;
}

export const PuzzleSection: React.FC<PuzzleSectionProps> = ({ config, onNextStep }) => {
  const gridSize = config.gridSize || 3;
  const totalTiles = gridSize * gridSize;

  // Tiles array: indices 0 to totalTiles - 1. Index (totalTiles - 1) is empty slot.
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const initBoard = () => {
    // Generate solved array
    const solved = Array.from({ length: totalTiles }, (_, i) => i);
    // Shuffle tiles safely (make sure solvable by performing random valid moves)
    let current = [...solved];
    let emptyIdx = totalTiles - 1;

    for (let i = 0; i < 60; i++) {
      const neighbors = getNeighbors(emptyIdx, gridSize);
      const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [current[emptyIdx], current[randNeighbor]] = [current[randNeighbor], current[emptyIdx]];
      emptyIdx = randNeighbor;
    }

    setTiles(current);
    setIsSolved(false);
  };

  useEffect(() => {
    initBoard();
  }, [config.imageUrl, config.gridSize]);

  const getNeighbors = (index: number, size: number) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const neighbors: number[] = [];

    if (row > 0) neighbors.push(index - size); // Top
    if (row < size - 1) neighbors.push(index + size); // Bottom
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < size - 1) neighbors.push(index + 1); // Right

    return neighbors;
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    const emptyIdx = tiles.indexOf(totalTiles - 1);
    const neighbors = getNeighbors(emptyIdx, gridSize);

    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);

      // Check if solved
      const solvedCheck = newTiles.every((val, i) => val === i);
      if (solvedCheck) {
        setIsSolved(true);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  return (
    <section id="puzzle" className="py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Puzzle className="w-4 h-4" />
          <span>Interactive Memory Puzzle</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Solve Our Memory Jigsaw 🧩
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Click adjacent tiles to slide them into place and complete our special photo!
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-purple-100 dark:border-purple-950 shadow-2xl relative">
        {/* Reset button */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Grid Size: {gridSize}x{gridSize}
          </span>
          <button
            onClick={initBoard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Shuffle / Reset</span>
          </button>
        </div>

        {/* Puzzle Board Grid */}
        <div
          className="grid gap-1.5 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl aspect-square overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {tiles.map((tileVal, idx) => {
            const isBlank = tileVal === totalTiles - 1 && !isSolved;
            const originalRow = Math.floor(tileVal / gridSize);
            const originalCol = tileVal % gridSize;

            const bgSizeX = gridSize * 100;
            const bgSizeY = gridSize * 100;
            const bgPosX = (originalCol / (gridSize - 1)) * 100;
            const bgPosY = (originalRow / (gridSize - 1)) * 100;

            return (
              <motion.div
                key={idx}
                layout
                onClick={() => handleTileClick(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm transition-transform active:scale-95 ${
                  isBlank ? 'bg-purple-100/50 dark:bg-purple-950/20 opacity-30 border-2 border-dashed border-purple-300' : ''
                }`}
                style={
                  !isBlank
                    ? {
                        backgroundImage: `url(${config.imageUrl})`,
                        backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
                        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                      }
                    : {}
                }
              />
            );
          })}
        </div>

        {/* Completion Card */}
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-purple-600 dark:text-purple-300 font-extrabold text-lg">
              <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
              <span>{config.rewardTitle || 'Puzzle Solved!'}</span>
            </div>
            <p className="text-sm font-semibold">
              {config.completionMessage || 'You solved our memory puzzle! You complete me in every way.'}
            </p>
          </motion.div>
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
              <span>Continue to Scratch Card 🎁</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
