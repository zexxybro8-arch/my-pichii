import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Crown, ArrowRight, Lock, KeyRound, Wand2, Star, Rose } from 'lucide-react';

interface CurtainRevealPageProps {
  girlfriendName: string;
  onReveal: () => void;
}

export const CurtainRevealPage: React.FC<CurtainRevealPageProps> = ({
  girlfriendName,
  onReveal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isRippling, setIsRippling] = useState<boolean>(false);

  // Generate floating gold dust particles
  const goldDust = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  // Generate floating roses & butterflies for behind curtain
  const floatingElements = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.6 + 0.7,
      rotate: Math.random() * 360,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 3,
      symbol: i % 3 === 0 ? '🌹' : i % 3 === 1 ? '🦋' : '✨',
    }));
  }, []);

  // Web Audio romantic whoosh & golden chime synthesizer
  const playCinematicWhoosh = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Soft wind whoosh
      const bufferSize = ctx.sampleRate * 1.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.5);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Golden chime chord sound
      const chimeFreqs = [523.25, 659.25, 783.99, 987.77, 1046.5];
      chimeFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        oscGain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        oscGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.09 + 0.04);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 1.4);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 1.5);
      });
    } catch (e) {
      // Audio fallback
    }
  };

  const handleOpenCurtains = () => {
    if (isOpen) return;
    setIsRippling(true);
    playCinematicWhoosh();
    setIsOpen(true);
    setTimeout(() => {
      onReveal();
    }, 2400);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-slate-950 text-white select-none">
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />

      {/* Top Cinematic Warm Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-radial from-amber-300/20 via-rose-500/10 to-transparent blur-3xl pointer-events-none z-10" />

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {goldDust.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: p.opacity, y: `${p.y}%`, x: `${p.x}%` }}
            animate={{
              y: [`${p.y}%`, `${(p.y - 20 + 100) % 100}%`],
              opacity: [p.opacity, 1, p.opacity],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            style={{ width: p.size, height: p.size }}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]"
          />
        ))}
      </div>

      {/* CURTAINS CONTAINER */}
      <div className="absolute inset-0 pointer-events-none flex z-20 overflow-hidden">
        {/* LEFT CURTAIN */}
        <motion.div
          animate={
            isOpen
              ? { x: '-102%', rotateY: -10 }
              : { x: '0%', rotateY: 0 }
          }
          transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
          className="w-1/2 h-full bg-gradient-to-r from-red-950 via-rose-950 to-red-900 border-r-4 border-amber-400 shadow-[20px_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col justify-between"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.75) 0px,
                rgba(136, 19, 55, 0.4) 30px,
                rgba(255, 215, 0, 0.15) 50px,
                rgba(136, 19, 55, 0.4) 70px,
                rgba(0, 0, 0, 0.8) 100px
              )
            `,
          }}
        >
          {/* Shimmer Light Reflection Sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent pointer-events-none"
          />

          {/* Golden Embroidered Top Border */}
          <div className="w-full h-8 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-500 border-b-2 border-amber-200 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 12 }).map((_, i) => (
              <Crown key={i} className="w-3.5 h-3.5 text-amber-950" />
            ))}
          </div>

          {/* Golden Rope with Tassel on Left Curtain */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* Hanging Rope */}
            <div className="w-2.5 h-32 bg-gradient-to-b from-amber-400 via-amber-200 to-amber-500 rounded-full shadow-lg border border-amber-600/60" />
            {/* Tassel Knot */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-amber-200 shadow-md flex items-center justify-center -mt-2">
              <Crown className="w-3 h-3 text-amber-950" />
            </div>
            {/* Tassel Fringe */}
            <div className="w-5 h-12 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-b-xl shadow-md border-t border-amber-200" />
          </div>

          {/* Golden Embroidered Inside Vertical Border */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_15px_#f59e0b]" />

          {/* Golden Bottom Border */}
          <div className="w-full h-6 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-500 border-t-2 border-amber-200 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkles key={i} className="w-3 h-3 text-amber-950" />
            ))}
          </div>
        </motion.div>

        {/* RIGHT CURTAIN */}
        <motion.div
          animate={
            isOpen
              ? { x: '102%', rotateY: 10 }
              : { x: '0%', rotateY: 0 }
          }
          transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
          className="w-1/2 h-full bg-gradient-to-l from-red-950 via-rose-950 to-red-900 border-l-4 border-amber-400 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col justify-between"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.8) 0px,
                rgba(136, 19, 55, 0.4) 30px,
                rgba(255, 215, 0, 0.15) 50px,
                rgba(136, 19, 55, 0.4) 70px,
                rgba(0, 0, 0, 0.75) 100px
              )
            `,
          }}
        >
          {/* Shimmer Light Reflection Sweep */}
          <motion.div
            animate={{ x: ['200%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent pointer-events-none"
          />

          {/* Golden Embroidered Top Border */}
          <div className="w-full h-8 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 border-b-2 border-amber-200 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 12 }).map((_, i) => (
              <Crown key={i} className="w-3.5 h-3.5 text-amber-950" />
            ))}
          </div>

          {/* Golden Rope with Tassel on Right Curtain */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-2.5 h-32 bg-gradient-to-b from-amber-400 via-amber-200 to-amber-500 rounded-full shadow-lg border border-amber-600/60" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-amber-200 shadow-md flex items-center justify-center -mt-2">
              <Crown className="w-3 h-3 text-amber-950" />
            </div>
            <div className="w-5 h-12 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 rounded-b-xl shadow-md border-t border-amber-200" />
          </div>

          {/* Golden Embroidered Inside Vertical Border */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_15px_#f59e0b]" />

          {/* Golden Bottom Border */}
          <div className="w-full h-6 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 border-t-2 border-amber-200 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkles key={i} className="w-3 h-3 text-amber-950" />
            ))}
          </div>
        </motion.div>
      </div>

      {/* CENTER INTERACTION (ON TOP OF CURTAINS BEFORE OPENING) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              opacity: { duration: 0.5 },
            }}
            className="absolute z-25 flex flex-col items-center max-w-md w-full px-4"
          >
            {/* Step Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/20 backdrop-blur-xl border border-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-8">
              <Wand2 className="w-4 h-4 text-amber-300 animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-200">
                Step 3: Royal Curtain Reveal
              </span>
            </div>

            {/* Premium Glowing Heart-Shaped Golden Lock */}
            <div className="relative mb-8 group cursor-pointer" onClick={handleOpenCurtains}>
              {/* Outer Golden Sparkle Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                className="absolute -inset-6 rounded-full border border-dashed border-amber-300/40 pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 rounded-full blur-xl opacity-60"
              />

              {/* Heart Lock Badge */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-300 to-rose-400 p-1 shadow-[0_0_35px_rgba(245,158,11,0.6)] border-2 border-amber-200 flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden">
                  <Heart className="w-14 h-14 text-amber-300 fill-amber-400/30 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-amber-200 drop-shadow-md" />
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-300 absolute top-2 right-2 animate-bounce" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-amber-100 mb-3 tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              Unlock Our Love Story 🌹
            </h2>

            <p className="text-sm text-rose-200/90 font-medium max-w-xs mb-8 leading-relaxed drop-shadow">
              A magical experience crafted with love for <span className="font-bold text-amber-300">{girlfriendName}</span>.
            </p>

            {/* Luxury Glassmorphism Button */}
            <motion.button
              whileHover={{ scale: 1.06, shadow: '0 0 40px rgba(244,114,182,0.6)' }}
              whileTap={{ scale: 0.94 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleOpenCurtains}
              className="relative px-8 py-4 rounded-full bg-white/10 backdrop-blur-2xl border-2 border-amber-300/80 text-amber-100 font-black text-base sm:text-lg shadow-[0_0_25px_rgba(244,114,182,0.3)] transition-all flex items-center gap-3 overflow-hidden group ring-4 ring-amber-400/20"
            >
              {/* Button Pink & Gold Glow Sweep */}
              <motion.div
                animate={isHovered ? { x: ['-100%', '100%'] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-rose-500/30 to-transparent -skew-x-12 pointer-events-none"
              />

              {/* Ripple Ring Effect on Click */}
              {isRippling && (
                <motion.span
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-full bg-amber-400/40 pointer-events-none"
                />
              )}

              <Heart className="w-5 h-5 text-rose-400 fill-rose-500 animate-pulse" />
              <span className="tracking-wide">❤️ Open Our Love Story</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEALED CONTENT BEHIND THE CURTAIN */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center">
        {/* Floating background petals & butterflies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingElements.map((el) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, y: `${el.y}%`, x: `${el.x}%` }}
              animate={
                isOpen
                  ? {
                      y: [`${el.y}%`, `${(el.y - 40 + 100) % 100}%`],
                      x: [`${el.x}%`, `${(el.x + 10 * (el.id % 2 === 0 ? 1 : -1))}%`],
                      opacity: [0.3, 0.9, 0.3],
                      rotate: [el.rotate, el.rotate + 180],
                    }
                  : {}
              }
              transition={{
                duration: el.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: el.delay,
              }}
              style={{ transform: `scale(${el.scale})` }}
              className="absolute text-xl"
            >
              {el.symbol}
            </motion.div>
          ))}
        </div>

        {/* Light Rays Coming from Behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-amber-300/30 via-rose-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Glowing Golden Heart */}
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 flex items-center justify-center shadow-[0_0_50px_rgba(244,114,182,0.8)] border-4 border-amber-200"
            >
              <Heart className="w-12 h-12 text-white fill-current" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/30 mb-4 inline-block">
              ✨ Welcome to Our Realm of Love ✨
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200 mb-4 tracking-tight"
          >
            Step Inside Our World 🌹
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-base sm:text-lg text-rose-100/90 max-w-md mb-10 leading-relaxed font-medium"
          >
            Beyond these curtains lies our eternal love countdown, cherished memory gallery, interactive puzzles, and secret love notes dedicated to{' '}
            <span className="font-extrabold text-amber-300">{girlfriendName}</span>.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReveal}
            className="px-9 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-black text-lg shadow-[0_0_30px_rgba(244,114,182,0.5)] hover:shadow-amber-400/50 transition-all flex items-center gap-3 border-2 border-amber-200 ring-4 ring-rose-500/20"
          >
            <span>Explore Our Journey 💖</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

