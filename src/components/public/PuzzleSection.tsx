import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Puzzle, Trophy, RotateCcw, CheckCircle2, ArrowRight, Sparkles, Wand2, Lock, Heart } from 'lucide-react';
import { PuzzleConfig } from '../../types';

interface PuzzleSectionProps {
  config: PuzzleConfig;
  onNextStep?: () => void;
}

// Web Audio API Sound Effects
const playSlideSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio context restrictions
  }
};

const playSuccessSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Ignore audio context restrictions
  }
};

export const PuzzleSection: React.FC<PuzzleSectionProps> = ({ config, onNextStep }) => {
  const gridSize = config.gridSize || 3;
  const totalTiles = gridSize * gridSize;

  // Always start with unsolved state on fresh visit or refresh
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const [tiles, setTiles] = useState<number[]>([]);
  const [isAutoSolving, setIsAutoSolving] = useState<boolean>(false);
  const solveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear legacy storage if present
  useEffect(() => {
    try {
      localStorage.removeItem('romantic_surprise_puzzle_solved');
    } catch {
      // Ignore error
    }
  }, []);

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

  const initBoard = () => {
    if (solveIntervalRef.current) {
      clearInterval(solveIntervalRef.current);
    }
    setIsAutoSolving(false);

    // Generate solved array and shuffle
    const solved = Array.from({ length: totalTiles }, (_, i) => i);
    let current = [...solved];
    let emptyIdx = totalTiles - 1;

    for (let i = 0; i < 50; i++) {
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
    return () => {
      if (solveIntervalRef.current) {
        clearInterval(solveIntervalRef.current);
      }
    };
  }, [config.imageUrl, config.gridSize]);

  // Count correct tiles
  const correctTilesCount = tiles.filter((val, idx) => val === idx).length;
  const progressPercent = totalTiles > 0 ? (correctTilesCount / totalTiles) * 100 : 0;

  const triggerCelebration = () => {
    playSuccessSound();

    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#ffffff', '#ef4444'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#ec4899', '#f59e0b', '#ffffff'],
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#a855f7', '#3b82f6', '#ffffff'],
      });
    }, 500);
  };

  const handleTileClick = (index: number) => {
    if (isSolved || isAutoSolving) return;
    const emptyIdx = tiles.indexOf(totalTiles - 1);
    const neighbors = getNeighbors(emptyIdx, gridSize);

    if (neighbors.includes(index)) {
      playSlideSound();
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);

      // Check if solved
      const solvedCheck = newTiles.every((val, i) => val === i);
      if (solvedCheck) {
        setIsSolved(true);
        triggerCelebration();
      }
    }
  };

  // A* Solver algorithm for step-by-step puzzle solution
  const findSolvePath = (startTiles: number[], size: number): number[][] => {
    const target = Array.from({ length: size * size }, (_, i) => i);
    const targetStr = target.join(',');
    if (startTiles.join(',') === targetStr) return [startTiles];

    const getAdj = (index: number) => {
      const row = Math.floor(index / size);
      const col = index % size;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(index - size);
      if (row < size - 1) neighbors.push(index + size);
      if (col > 0) neighbors.push(index - 1);
      if (col < size - 1) neighbors.push(index + 1);
      return neighbors;
    };

    const manhattan = (arr: number[]) => {
      let d = 0;
      for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        if (val === size * size - 1) continue;
        const tr = Math.floor(val / size);
        const tc = val % size;
        const cr = Math.floor(i / size);
        const cc = i % size;
        d += Math.abs(tr - cr) + Math.abs(tc - cc);
      }
      return d;
    };

    interface Node {
      state: number[];
      g: number;
      h: number;
      f: number;
      parent: Node | null;
    }

    const openList: Node[] = [];
    const closedSet = new Set<string>();

    const startNode: Node = {
      state: startTiles,
      g: 0,
      h: manhattan(startTiles),
      f: manhattan(startTiles),
      parent: null,
    };

    openList.push(startNode);

    let iterations = 0;
    while (openList.length > 0 && iterations < 2500) {
      iterations++;
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift()!;
      const stateStr = current.state.join(',');

      if (stateStr === targetStr) {
        const path: number[][] = [];
        let curr: Node | null = current;
        while (curr) {
          path.unshift(curr.state);
          curr = curr.parent;
        }
        return path;
      }

      closedSet.add(stateStr);

      const emptyIdx = current.state.indexOf(size * size - 1);
      const neighbors = getAdj(emptyIdx);

      for (const nIdx of neighbors) {
        const nextState = [...current.state];
        [nextState[emptyIdx], nextState[nIdx]] = [nextState[nIdx], nextState[emptyIdx]];
        const nextStr = nextState.join(',');

        if (closedSet.has(nextStr)) continue;

        const g = current.g + 1;
        const h = manhattan(nextState);
        const f = g + h;

        const existingOpen = openList.find((n) => n.state.join(',') === nextStr);
        if (!existingOpen) {
          openList.push({ state: nextState, g, h, f, parent: current });
        } else if (g < existingOpen.g) {
          existingOpen.g = g;
          existingOpen.f = f;
          existingOpen.parent = current;
        }
      }
    }

    return [target];
  };

  const handleSolveForMe = () => {
    if (isSolved || isAutoSolving) return;

    setIsAutoSolving(true);
    const path = findSolvePath(tiles, gridSize);

    let step = 1; // path[0] is current tiles state
    solveIntervalRef.current = setInterval(() => {
      if (step < path.length) {
        setTiles(path[step]);
        playSlideSound();
        step++;
      } else {
        if (solveIntervalRef.current) {
          clearInterval(solveIntervalRef.current);
        }
        setTiles(Array.from({ length: totalTiles }, (_, i) => i));
        setIsAutoSolving(false);
        setIsSolved(true);
        triggerCelebration();
      }
    }, 180);
  };

  return (
    <section id="puzzle" className="py-16 px-4 max-w-4xl mx-auto text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Solve Our Memory Jigsaw 🧩
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto font-medium">
          Click adjacent tiles to slide them into place and complete our special photo!
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-7 rounded-3xl border border-purple-200 dark:border-purple-900/80 shadow-2xl relative z-10">
        
        {/* Progress Tracker Bar */}
        <div className="mb-5 p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
            <span className="flex items-center gap-1.5">
              <span>🧩</span>
              <span>Puzzle Progress: {correctTilesCount}/{totalTiles} Tiles Correct</span>
            </span>
            <span className="font-mono text-amber-500 font-extrabold">{progressPercent.toFixed(0)}%</span>
          </div>

          <div className="w-full h-3 bg-purple-200/60 dark:bg-purple-900/60 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 shadow-sm"
            />
          </div>
        </div>

        {/* Action Controls: Shuffle / Reset AND ✨ Solve For Me */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
            Grid: {gridSize}x{gridSize}
          </span>

          <div className="flex items-center gap-2">
            {/* ✨ Solve For Me Button */}
            <button
              onClick={handleSolveForMe}
              disabled={isSolved || isAutoSolving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 dark:from-amber-950/40 dark:to-purple-950/40 text-amber-600 dark:text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAutoSolving ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Solving...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>✨ Solve For Me</span>
                </>
              )}
            </button>

            {/* Shuffle / Reset Button */}
            <button
              onClick={initBoard}
              disabled={isAutoSolving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300/40 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/80 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
              <span>Shuffle / Reset</span>
            </button>
          </div>
        </div>

        {/* Puzzle Board Grid */}
        <div
          className="grid gap-1.5 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl aspect-square overflow-hidden shadow-inner border border-purple-200/40 dark:border-purple-900/40"
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
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                onClick={() => handleTileClick(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm transition-transform active:scale-95 ${
                  isBlank
                    ? 'bg-purple-100/50 dark:bg-purple-950/30 opacity-40 border-2 border-dashed border-purple-300/80'
                    : 'hover:opacity-95'
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

        {/* Completion Message Banner */}
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border-2 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-100 shadow-xl"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-purple-600 dark:text-purple-300 font-black text-xl font-serif">
              <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
              <span>{config.rewardTitle || 'Puzzle Solved! ❤️'}</span>
            </div>
            <p className="text-sm font-bold text-purple-700 dark:text-purple-200">
              {config.completionMessage || 'You solved our memory puzzle! You complete me in every way.'}
            </p>
          </motion.div>
        )}

        {/* Lock Status / Lock Progression Info when NOT solved */}
        {!isSolved && (
          <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Solve the puzzle to unlock the next surprise! ❤️</span>
          </div>
        )}
      </div>

      {/* Next Step Action Button - ONLY ENABLED & UNLOCKED WHEN SOLVED */}
      <AnimatePresence>
        {isSolved && onNextStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 16, stiffness: 180 }}
            className="mt-10 text-center relative z-20"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <button
                onClick={onNextStep}
                className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 border border-pink-300/50 cursor-pointer"
              >
                <span>Continue to Scratch Card 🎁</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
