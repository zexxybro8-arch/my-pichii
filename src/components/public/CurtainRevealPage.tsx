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

  // Generate floating gold dust & sparkle particles
  const goldDust = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  // Generate floating elements for dreamy background
  const floatingElements = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.6 + 0.7,
      rotate: Math.random() * 360,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 3,
      symbol: i % 4 === 0 ? '🌸' : i % 4 === 1 ? '💖' : i % 4 === 2 ? '✨' : '🌹',
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
    }, 8000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-[#FFDCE8] to-[#EBDCFF] text-slate-800 select-none">
      {/* Soft Romantic Frame Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_80px_rgba(255,182,193,0.35)]" />

      {/* Top Dreamy Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-radial from-[#FFF8F0]/90 via-[#FFD6C2]/40 to-transparent blur-3xl pointer-events-none z-10" />

      {/* Floating Gold & Sparkle Particles */}
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
            className="absolute rounded-full bg-gradient-to-r from-[#FFD76A] to-[#FF7BA9] shadow-[0_0_10px_#FFD76A]"
          />
        ))}
      </div>

      {/* LUXURIOUS BLUSH PINK VELVET CURTAINS CONTAINER */}
      <div className="absolute inset-0 pointer-events-none flex z-20 overflow-hidden">
        {/* LEFT VELVET CURTAIN */}
        <motion.div
          animate={
            isOpen
              ? { x: '-102%', rotateY: -10 }
              : { x: '0%', rotateY: 0 }
          }
          transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
          className="w-1/2 h-full bg-gradient-to-r from-[#FF9EAF] via-[#FF7BA9] to-[#FFB3C6] border-r-4 border-[#FFD76A] shadow-[20px_0_40px_rgba(255,123,169,0.35)] relative overflow-hidden flex flex-col justify-between"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(215, 95, 135, 0.45) 0px,
                rgba(255, 220, 232, 0.7) 25px,
                rgba(255, 215, 106, 0.3) 45px,
                rgba(255, 123, 169, 0.6) 70px,
                rgba(200, 85, 125, 0.45) 100px
              )
            `,
          }}
        >
          {/* Silky Reflection Sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          />

          {/* Golden Embroidered Top Border */}
          <div className="w-full h-8 bg-gradient-to-r from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] border-b-2 border-amber-200/80 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 12 }).map((_, i) => (
              <Crown key={i} className="w-3.5 h-3.5 text-[#B8860B]" />
            ))}
          </div>

          {/* Satin Rose-Gold Rope with Tassel on Left Curtain */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* Hanging Rope */}
            <div className="w-2.5 h-32 bg-gradient-to-b from-[#FFD76A] via-[#FFF8F0] to-[#FF7BA9] rounded-full shadow-md border border-amber-300/80" />
            {/* Tassel Knot */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFD76A] to-[#FF7BA9] border-2 border-white shadow-md flex items-center justify-center -mt-2">
              <Crown className="w-3 h-3 text-[#B8860B]" />
            </div>
            {/* Tassel Fringe */}
            <div className="w-5 h-12 bg-gradient-to-b from-[#FF7BA9] via-[#FFD76A] to-[#FFD6C2] rounded-b-xl shadow-md border-t border-amber-200/80" />
          </div>

          {/* Golden Embroidered Inside Vertical Ribbon Border */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] shadow-[0_0_12px_rgba(255,215,106,0.7)]" />

          {/* Golden Bottom Border */}
          <div className="w-full h-6 bg-gradient-to-r from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] border-t-2 border-amber-200/80 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkles key={i} className="w-3 h-3 text-[#B8860B]" />
            ))}
          </div>
        </motion.div>

        {/* RIGHT VELVET CURTAIN */}
        <motion.div
          animate={
            isOpen
              ? { x: '102%', rotateY: 10 }
              : { x: '0%', rotateY: 0 }
          }
          transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
          className="w-1/2 h-full bg-gradient-to-l from-[#FF9EAF] via-[#FF7BA9] to-[#FFB3C6] border-l-4 border-[#FFD76A] shadow-[-20px_0_40px_rgba(255,123,169,0.35)] relative overflow-hidden flex flex-col justify-between"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(200, 85, 125, 0.45) 0px,
                rgba(255, 123, 169, 0.6) 25px,
                rgba(255, 215, 106, 0.3) 45px,
                rgba(255, 220, 232, 0.7) 70px,
                rgba(215, 95, 135, 0.45) 100px
              )
            `,
          }}
        >
          {/* Silky Reflection Sweep */}
          <motion.div
            animate={{ x: ['200%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          />

          {/* Golden Embroidered Top Border */}
          <div className="w-full h-8 bg-gradient-to-r from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] border-b-2 border-amber-200/80 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 12 }).map((_, i) => (
              <Crown key={i} className="w-3.5 h-3.5 text-[#B8860B]" />
            ))}
          </div>

          {/* Satin Rose-Gold Rope with Tassel on Right Curtain */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-2.5 h-32 bg-gradient-to-b from-[#FFD76A] via-[#FFF8F0] to-[#FF7BA9] rounded-full shadow-md border border-amber-300/80" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFD76A] to-[#FF7BA9] border-2 border-white shadow-md flex items-center justify-center -mt-2">
              <Crown className="w-3 h-3 text-[#B8860B]" />
            </div>
            <div className="w-5 h-12 bg-gradient-to-b from-[#FF7BA9] via-[#FFD76A] to-[#FFD6C2] rounded-b-xl shadow-md border-t border-amber-200/80" />
          </div>

          {/* Golden Embroidered Inside Vertical Ribbon Border */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] shadow-[0_0_12px_rgba(255,215,106,0.7)]" />

          {/* Golden Bottom Border */}
          <div className="w-full h-6 bg-gradient-to-r from-[#FFD76A] via-[#FFF8F0] to-[#FFD76A] border-t-2 border-amber-200/80 flex items-center justify-around px-2 shadow-md">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkles key={i} className="w-3 h-3 text-[#B8860B]" />
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
            {/* Cute 3D Heart-Shaped Golden Lock */}
            <div className="relative mb-8 group cursor-pointer" onClick={handleOpenCurtains}>
              {/* Outer Golden Sparkle Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                className="absolute -inset-6 rounded-full border-2 border-dashed border-[#FFD76A]/60 pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -inset-4 bg-gradient-to-r from-[#FF7BA9] via-[#FFD6C2] to-[#FFD76A] rounded-full blur-xl opacity-70"
              />

              {/* Heart Lock Badge */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#FFD76A] via-[#FF7BA9] to-[#FFD6C2] p-1 shadow-[0_12px_35px_rgba(255,123,169,0.45)] border-2 border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#FFF8F0] to-[#FFDCE8] backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                  <Heart className="w-14 h-14 text-[#FF7BA9] fill-[#FF7BA9]/25 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-[#D97706] drop-shadow-sm" />
                  </div>
                  <Sparkles className="w-4 h-4 text-[#FFD76A] absolute top-2 right-2 animate-bounce" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7A2846] mb-3 tracking-tight font-cute drop-shadow-sm">
              Unlock Our Love Story 🌹
            </h2>

            <p className="text-sm text-[#9E3B5E] font-semibold max-w-xs mb-8 leading-relaxed">
              A magical experience crafted with love for <span className="font-extrabold text-[#D97706]">{girlfriendName}</span>.
            </p>

            {/* Cute Rounded Pill Button with Soft Glow */}
            <motion.button
              whileHover={{ scale: 1.06, shadow: '0 12px 35px rgba(255,123,169,0.55)' }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleOpenCurtains}
              className="relative px-9 py-4 rounded-full bg-gradient-to-r from-[#FF7BA9] via-[#FF8DA1] to-[#FFD6C2] text-white font-extrabold text-base sm:text-lg shadow-[0_10px_30px_rgba(255,123,169,0.45)] transition-all flex items-center gap-3 overflow-hidden group ring-4 ring-[#FFDCE8] border-2 border-white cursor-pointer"
            >
              {/* Button Glow Sweep */}
              <motion.div
                animate={isHovered ? { x: ['-100%', '100%'] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
              />

              {/* Ripple Ring Effect on Click */}
              {isRippling && (
                <motion.span
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-full bg-white/50 pointer-events-none"
                />
              )}

              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
              <span className="tracking-wide">Open Our Love Story</span>
              <Sparkles className="w-5 h-5 text-[#FFD76A]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEALED CONTENT BEHIND THE CURTAIN */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center">
        {/* Floating background sakura, hearts, butterflies */}
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
                      opacity: [0.4, 0.95, 0.4],
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

        {/* Soft Glowing Light Rays Coming from Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[#FFDCE8] via-[#FFF8F0]/80 to-transparent blur-3xl pointer-events-none rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Glowing Rose-Gold Heart */}
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF7BA9] via-[#FFD76A] to-[#FFD6C2] flex items-center justify-center shadow-[0_12px_40px_rgba(255,123,169,0.5)] border-4 border-white"
            >
              <Heart className="w-12 h-12 text-white fill-current" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-[#9E3B5E] bg-[#FFDCE8]/80 px-4 py-1.5 rounded-full border border-[#FF7BA9]/40 mb-4 inline-block shadow-sm">
              ✨ Welcome to Our Realm of Love ✨
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FF7BA9] to-[#9E3B5E] mb-4 tracking-tight font-cute"
          >
            Step Inside Our World 🌹
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-base sm:text-lg text-[#852C4D] max-w-md mb-10 leading-relaxed font-medium"
          >
            Beyond these curtains lies our eternal love countdown, cherished memory gallery, interactive puzzles, and secret love notes dedicated to{' '}
            <span className="font-extrabold text-[#D97706]">{girlfriendName}</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReveal}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#FF7BA9] via-[#FF8DA1] to-[#FFD6C2] text-white font-extrabold text-lg shadow-[0_10px_30px_rgba(255,123,169,0.45)] hover:shadow-[#FF7BA9]/50 transition-all flex items-center gap-3 border-2 border-white ring-4 ring-[#FFDCE8] cursor-pointer"
            >
              <span>Explore Our Journey 💖</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* 8-Second Auto-Continue Progress Line */}
            {isOpen && (
              <div className="w-48 h-2 bg-[#FFDCE8] rounded-full overflow-hidden border border-[#FF7BA9]/30 mt-2 shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#FF7BA9] to-[#FFD76A] rounded-full"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};


