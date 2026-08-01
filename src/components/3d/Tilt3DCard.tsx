import React, { useState, useRef } from 'react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  perspective?: number;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  glareColor = 'rgba(255, 255, 255, 0.25)',
  maxTilt = 12,
  scaleOnHover = 1.02,
  perspective = 1000,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; x: number; y: number }>({
    opacity: 0,
    x: 50,
    y: 50,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`
    );

    setGlareStyle({
      opacity: 0.85,
      x: glareX,
      y: glareY,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-pink-500/40 hover:shadow-[0_25px_60px_rgba(236,72,153,0.25)] overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic Specular Glare Reflection Line */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, ${glareColor}, transparent 60%)`,
        }}
      />

      {/* Glassmorphic Rim Accent Line */}
      <div className="pointer-events-none absolute inset-px rounded-[23px] border border-white/10 z-20" />

      {/* Card Content with 3D depth pop-out effect */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};
