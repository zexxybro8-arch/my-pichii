import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  text?: string;
}

export const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="py-8 border-t border-rose-100 dark:border-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>{text || 'Made with endless love, forever and always ❤️'}</span>
      </div>
      <p className="text-[11px] opacity-75">
        © {new Date().getFullYear()} Romantic Anniversary Surprise
      </p>
    </footer>
  );
};
