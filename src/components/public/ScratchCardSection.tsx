import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart, RefreshCw, ArrowRight } from 'lucide-react';
import { ScratchCardConfig } from '../../types';

interface ScratchCardSectionProps {
  config: ScratchCardConfig;
  onNextStep?: () => void;
}

export const ScratchCardSection: React.FC<ScratchCardSectionProps> = ({ config, onNextStep }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background metallic golden / rose gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, config.overlayColor || '#d4af37');
    gradient.addColorStop(0.5, '#f3e5ab');
    gradient.addColorStop(1, '#aa771c');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Overlay text
    ctx.fillStyle = '#4a3800';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.overlayText || 'Scratch Here to Reveal Surprise! ✨', width / 2, height / 2);

    setIsRevealed(false);
  };

  useEffect(() => {
    initCanvas();
  }, [config.overlayColor, config.overlayText]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    const threshold = config.revealPercentage || 40;

    if (percentage >= threshold) {
      setIsRevealed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsScratching(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching && e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <section id="scratch" className="py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Gift className="w-4 h-4" />
          <span>Interactive Scratch Card</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Scratch & Win My Heart Voucher ✨
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Rub off the gold layer to claim your official love coupon!
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-gradient-to-tr from-amber-500 to-rose-500 p-1 rounded-3xl shadow-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 text-center relative overflow-hidden">
          <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{config.voucherTitle || 'Golden Love Voucher 🎁'}</span>
          </h3>

          {/* Underneath Secret Voucher Content */}
          <div className="min-h-[160px] bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-6 border-2 border-dashed border-amber-300 dark:border-amber-800 flex flex-col items-center justify-center relative">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500 mb-2 animate-pulse" />
            <p className="text-base sm:text-lg font-extrabold text-rose-950 dark:text-rose-100 leading-relaxed">
              {config.hiddenMessage}
            </p>
          </div>

          {/* Scratch Canvas Overlay */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              width={440}
              height={200}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="absolute inset-x-6 top-16 bottom-6 w-[calc(100%-3rem)] h-[calc(100%-5.5rem)] rounded-2xl cursor-pointer touch-none shadow-md z-10"
            />
          )}

          {/* Reset Button */}
          <button
            onClick={initCanvas}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-rose-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scratch Again</span>
          </button>
        </div>

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
              <span>Continue to Love Letter 💌</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
