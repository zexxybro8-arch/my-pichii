import React, { useMemo } from 'react';

interface ParticleOverlayProps {
  effectType: 'falling-hearts' | 'floating-stars' | 'rose-petals' | 'sparkles' | 'none';
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ effectType }) => {
  const particles = useMemo(() => {
    if (effectType === 'none') return [];

    const symbols = {
      'falling-hearts': ['❤️', '💖', '💕', '💗', '🌸'],
      'floating-stars': ['✨', '⭐', '🌟', '💫', '✦'],
      'rose-petals': ['🌹', '🥀', '🌸', '🍃', '💖'],
      sparkles: ['✨', '❇️', '💎', '💫', '☀️'],
    };

    const currentSymbols = symbols[effectType] || symbols['falling-hearts'];

    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      symbol: currentSymbols[i % currentSymbols.length],
      left: Math.random() * 100,
      size: Math.random() * 1.2 + 0.8, // rem
      duration: Math.random() * 8 + 6, // seconds
      delay: Math.random() * 5, // seconds
      rotate: Math.random() * 360,
    }));
  }, [effectType]);

  if (effectType === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall opacity-70 hover:opacity-100 transition-opacity"
          style={{
            left: `${p.left}%`,
            top: `-5%`,
            fontSize: `${p.size}rem`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
};
