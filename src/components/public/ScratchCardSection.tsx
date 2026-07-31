import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  RotateCcw,
  ArrowRight,
  Gift,
  Coffee,
  Film,
  UtensilsCrossed,
  Smile,
  CheckCircle2,
  Award,
  Crown,
} from 'lucide-react';
import { ScratchCardConfig } from '../../types';

interface ScratchCardSectionProps {
  config: ScratchCardConfig;
  onNextStep?: () => void;
}

// Sparkle Trail Particle Interface
interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

// Web Audio API Sound Effects (Ultra-soft & elegant)
const playScratchSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400 + Math.random() * 300;
    filter.Q.value = 4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {
    // Audio Context restricted before user gesture
  }
};

const playRevealChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    // Warm harmonic chord: F5, A5, C6, E6, A6
    const notes = [698.46, 880.0, 1046.5, 1318.51, 1760.0];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } catch {
    // Audio Context restricted before user gesture
  }
};

export const ScratchCardSection: React.FC<ScratchCardSectionProps> = ({ config, onNextStep }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [isRippling, setIsRippling] = useState<boolean>(false);

  // 3D Parallax Tilt State
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  // Luxury Background Floating Particles (Sakura, Butterflies, Sparkles, Hearts)
  const backgroundElements = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 5,
      symbol: i % 5 === 0 ? '🌸' : i % 5 === 1 ? '💖' : i % 5 === 2 ? '✨' : i % 5 === 3 ? '🦋' : '🌹',
    }));
  }, []);

  // Soft Volumetric Bokeh Ambient Lights
  const bokehLights = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      duration: Math.random() * 9 + 6,
      delay: Math.random() * 4,
    }));
  }, []);

  // Luxury Love Certificate Coupons
  const loveCoupons = [
    { icon: Heart, title: 'Unlimited Hugs', subtitle: 'Valid Anytime, Anywhere', color: 'from-[#FF5C9A] to-[#D89CA4]' },
    { icon: Sparkles, title: '1,000 Kisses', subtitle: 'Sweetness Guarantee', color: 'from-[#EBCB8B] to-[#FF5C9A]' },
    { icon: Coffee, title: 'Date Night', subtitle: 'Your Favorite Mood', color: 'from-[#FFD3B6] to-[#FF5C9A]' },
    { icon: Film, title: 'Movie Night', subtitle: 'Snacks & Cuddles', color: 'from-[#EEDCFF] to-[#D89CA4]' },
    { icon: UtensilsCrossed, title: 'Romantic Dinner', subtitle: 'Cooked With Love', color: 'from-[#FF5C9A] to-[#EBCB8B]' },
    { icon: Smile, title: 'One Wish Coupon', subtitle: 'Command Anything', color: 'from-[#EBCB8B] to-[#FFE4EC]' },
  ];

  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundTimeRef = useRef<number>(0);
  const checkThrottleRef = useRef<number>(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset composite mode
    ctx.globalCompositeOperation = 'source-over';

    // Premium Champagne & Rose Gold Foil Shimmer Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#EBCB8B'); // Champagne Gold
    gradient.addColorStop(0.2, '#FFE4EC'); // Blush Pink
    gradient.addColorStop(0.4, '#D89CA4'); // Rose Gold
    gradient.addColorStop(0.65, '#FFFDF8'); // Ivory Light Shimmer
    gradient.addColorStop(0.85, '#FF5C9A'); // Soft Rose
    gradient.addColorStop(1, '#EBCB8B'); // Champagne Gold

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Elegant Watermark Pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.font = '15px sans-serif';
    for (let x = 20; x < width; x += 45) {
      for (let y = 20; y < height; y += 45) {
        ctx.fillText((x + y) % 90 === 0 ? '✨' : '💖', x, y);
      }
    }

    // Rose Gold Double Filament Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.strokeStyle = 'rgba(216, 156, 164, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Overlay Romantic Title Text
    ctx.fillStyle = '#4A1D2E';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 2;
    ctx.font = '700 17px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      config.overlayText || 'Rub foil with finger to unlock certificate',
      width / 2,
      height / 2 - 8
    );

    // Subtitle instruction
    ctx.font = '500 12px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Scratch softly to reveal hidden voucher', width / 2, height / 2 + 16);

    // Reset shadow
    ctx.shadowBlur = 0;
    setIsRevealed(false);
    lastPosRef.current = null;
  };

  useEffect(() => {
    initCanvas();
  }, [config.overlayColor, config.overlayText]);

  // Handle 3D Parallax Tilt
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rx: -(y / rect.height) * 6,
      ry: (x / rect.width) * 6,
    });
  };

  const handleMouseLeave3D = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const spawnSparkles = (screenX: number, screenY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;

    const newParticles: SparkleParticle[] = Array.from({ length: 2 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x: x + (Math.random() * 24 - 12),
      y: y + (Math.random() * 24 - 12),
      size: Math.random() * 10 + 6,
      color: ['#EBCB8B', '#FF5C9A', '#FFFDF8', '#D89CA4'][Math.floor(Math.random() * 4)],
    }));

    setSparkles((prev) => [...prev.slice(-16), ...newParticles]);
  };

  const checkScratchPercentage = () => {
    const now = Date.now();
    if (now - checkThrottleRef.current < 120) return;
    checkThrottleRef.current = now;

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
    const threshold = config.revealPercentage || 30;

    if (percentage >= threshold) {
      setIsRevealed(true);
      playRevealChime();

      // Grand celebration confetti burst
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#ff5c9a', '#ebcb8b', '#fffdf8', '#ffe4ec', '#d89ca4'],
      });
    }
  };

  // Ultra-Smooth Scratching Path Interpolation
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = ((clientX - rect.left) / rect.width) * canvas.width;
    const currentY = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 54;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPosRef.current) {
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
      ctx.arc(currentX, currentY, 27, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = { x: currentX, y: currentY };

    const now = Date.now();
    if (now - lastSoundTimeRef.current > 50) {
      playScratchSound();
      lastSoundTimeRef.current = now;
    }

    spawnSparkles(clientX, clientY);
    checkScratchPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    lastPosRef.current = null;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    lastPosRef.current = null;
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratching && e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleNextClick = () => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);
    if (onNextStep) onNextStep();
  };

  return (
    <section
      id="scratch"
      className="py-16 px-4 max-w-4xl mx-auto text-center relative overflow-hidden select-none min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFFDF8] via-[#FFE4EC]/70 to-[#EEDCFF]/50"
    >
      {/* Import custom luxury display fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        .font-serif-luxury { font-family: 'Playfair Display', Georgia, serif; }
        .font-handwriting { font-family: 'Caveat', cursive; }
        .font-sans-ios { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
      `}</style>

      {/* Top Aurora Light Reflections & Soft Volumetric Glow (Reduced by 70%) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-[#FF5C9A]/05 via-[#EBCB8B]/05 to-transparent blur-3xl pointer-events-none z-10" />

      {/* Animated Bokeh Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {bokehLights.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.08, 0.2, 0.08],
              scale: [0.85, 1.15, 0.85],
              x: [`${b.x}%`, `${b.x + (Math.random() * 4 - 2)}%`],
              y: [`${b.y}%`, `${b.y + (Math.random() * 4 - 2)}%`],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: b.delay,
            }}
            style={{ width: b.size, height: b.size }}
            className="absolute rounded-full bg-gradient-to-tr from-[#FF5C9A]/15 via-[#EBCB8B]/15 to-white/40 blur-2xl"
          />
        ))}
      </div>

      {/* Floating Sakura Petals, Butterflies & Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        {backgroundElements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ y: `${el.y}%`, x: `${el.x}%`, opacity: 0, rotate: 0 }}
            animate={{
              y: [`${el.y}%`, `${(el.y - 30 + 100) % 100}%`],
              x: [`${el.x}%`, `${(el.x + 5 * (el.id % 2 === 0 ? 1 : -1))}%`],
              opacity: [0.25, 0.85, 0.25],
              rotate: [0, 360],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: el.delay,
            }}
            style={{ fontSize: el.size }}
            className="absolute drop-shadow-[0_4px_12px_rgba(255,92,154,0.3)]"
          >
            {el.symbol}
          </motion.div>
        ))}
      </div>

      {/* Section Header */}
      <div className="mb-8 relative z-20 font-sans-ios text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#D89CA4]/30 shadow-sm text-xs font-semibold text-[#7C2D48] tracking-[0.2px] uppercase mb-3 backdrop-blur-md">
          <Crown className="w-3.5 h-3.5 text-[#EBCB8B]" />
          <span>Exclusive Voucher</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#2D151E] tracking-[0.2px] leading-[1.25] font-sans-ios">
          Love Voucher Certificate 🎟️
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] font-medium mt-2 max-w-lg mx-auto leading-[1.3] tracking-[0.1px]">
          Scratch off the rose-gold champagne foil to claim your official romantic gift certificate.
        </p>
      </div>

      {/* MAIN THICK FROSTED GLASS 3D CARD (36px Border Radius) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove3D}
        onMouseLeave={handleMouseLeave3D}
        className="w-full max-w-xl relative z-20 [perspective:1200px]"
      >
        {/* Dynamic Sparkle Trail Particles */}
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ scale: 1, opacity: 1, y: 0 }}
            animate={{ scale: 0, opacity: 0, y: -22 }}
            transition={{ duration: 0.6 }}
            style={{
              left: sp.x,
              top: sp.y,
              width: sp.size,
              height: sp.size,
              backgroundColor: sp.color,
            }}
            className="absolute rounded-full pointer-events-none z-40 shadow-[0_0_12px_#EBCB8B]"
          />
        ))}

        <motion.div
          animate={{
            scale: isRevealed ? [1, 1.025, 1] : 1,
            rotateX: tilt.rx,
            rotateY: tilt.ry,
          }}
          transition={{
            scale: { duration: 0.5 },
            rotateX: { duration: 0.25, ease: 'easeOut' },
            rotateY: { duration: 0.25, ease: 'easeOut' },
          }}
          className="bg-[#FFFDF8]/85 backdrop-blur-2xl rounded-[36px] p-6 sm:p-10 border border-[#D89CA4]/50 shadow-[0_20px_60px_-15px_rgba(216,156,164,0.35),0_0_0_1px_rgba(255,255,255,0.8)] relative overflow-hidden text-center [transform-style:preserve-3d]"
        >
          {/* Shimmer Ambient Glass Reflection Sweep */}
          <motion.div
            animate={{ x: ['-100%', '220%'] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 pointer-events-none z-10"
          />

          {/* Title Header inside Card */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Gift className="w-5 h-5 text-[#FF5C9A] animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#2D151E] font-sans-ios tracking-[0.2px] leading-[1.25]">
              {config.voucherTitle || 'Love Coupon Certificate 🎁'}
            </h3>
            <Sparkles className="w-5 h-5 text-[#EBCB8B] animate-pulse" />
          </div>

          {/* SCRATCH BOX CONTAINER (Certificated Styling) */}
          <div className="relative w-full min-h-[230px] rounded-2xl p-6 bg-gradient-to-br from-[#FFFDF8] via-[#FFE4EC]/50 to-[#EEDCFF]/30 border border-[#D89CA4]/40 shadow-inner flex flex-col items-center justify-center overflow-hidden">
            
            {/* UNDERNEATH REVEALED CONTENT - LUXURY CERTIFICATE */}
            <div className="w-full text-center flex flex-col items-center justify-center py-2 relative z-10">
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                    className="mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF5C9A] to-[#D89CA4] text-white text-xs font-bold uppercase tracking-wider shadow-md border border-white/60"
                  >
                    <Award className="w-4 h-4 text-[#EBCB8B]" />
                    <span>Official Certificate Unlocked ❤️</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xl sm:text-2xl font-extrabold text-[#5A1D32] leading-relaxed font-handwriting text-2xl sm:text-3xl mb-4 max-w-md drop-shadow-sm">
                "{config.hiddenMessage || 'Valid for endless hugs, kisses, and romantic surprises forever!'}"
              </p>

              {/* Grid of Luxury Love Coupons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mt-2 font-sans-ios">
                {loveCoupons.map((coupon, idx) => {
                  const IconComp = coupon.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.04 }}
                      className="p-3 rounded-2xl bg-white/90 border border-[#D89CA4]/30 shadow-sm flex flex-col items-center text-center backdrop-blur-md"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${coupon.color} text-white flex items-center justify-center shadow-md mb-1.5`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#5A1D32] line-clamp-1">{coupon.title}</span>
                      <span className="text-[10px] font-medium text-[#8C3A56] line-clamp-1">{coupon.subtitle}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* SCRATCH CANVAS OVERLAY */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                width={520}
                height={230}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer touch-none shadow-md z-30 transition-all duration-300 hover:brightness-105"
              />
            )}
          </div>

          {/* Reset / Scratch Again Action */}
          <div className="mt-6 flex items-center justify-center font-sans-ios">
            <button
              onClick={initCanvas}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#5A1D32] text-xs font-bold border border-[#D89CA4]/50 hover:border-[#FF5C9A] transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#FF5C9A]" />
              <span>Scratch Foil Again</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* CONTINUE TO NEXT STEP BUTTON */}
      {onNextStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-10 text-center relative z-20 font-sans-ios"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5C9A] via-[#D89CA4] to-[#EBCB8B] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <button
              onClick={handleNextClick}
              className="relative px-9 py-4 rounded-full bg-gradient-to-r from-[#FF5C9A] via-[#D89CA4] to-[#EBCB8B] text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 border-2 border-white/80 cursor-pointer overflow-hidden before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-1000"
            >
              {isRippling && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-full bg-white/50 pointer-events-none"
                />
              )}
              <span className="relative z-10">Continue to Love Letter 💌</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};
