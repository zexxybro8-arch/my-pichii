import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { AppConfig } from '../../types';

interface HeroSectionProps {
  config: AppConfig;
  onNextStep?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onNextStep }) => {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  const [anniversaryCountdown, setAnniversaryCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date(config.relationshipStartDate || '2022-02-14');
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();

      if (diffMs > 0) {
        const totalSecs = Math.floor(diffMs / 1000);
        const totalDays = Math.floor(totalSecs / 86400);
        const years = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setTimeTogether({
          years,
          days: remainingDays,
          hours,
          minutes,
          seconds,
          totalDays,
        });
      }

      // Calculate Anniversary Countdown
      const annivDate = new Date(config.anniversaryDate || '2026-02-14');
      const annivDiffMs = annivDate.getTime() - now.getTime();

      if (annivDiffMs > 0) {
        const totalSecs = Math.floor(annivDiffMs / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setAnniversaryCountdown({ days, hours, minutes, seconds });
      } else {
        setAnniversaryCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.relationshipStartDate, config.anniversaryDate]);

  return (
    <section id="hero" className="relative pt-12 pb-16 px-4 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Floating Heart Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200 dark:border-rose-900 shadow-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Our Special Romantic Journey
          </span>
        </motion.div>

        {/* Couple Names Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
        >
          {config.boyfriendName || 'Me'} <span className="text-rose-500 inline-block animate-pulse">❤️</span> {config.girlfriendName || 'You'}
        </motion.h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          {config.anniversarySettings.milestoneMessage ||
            'Every second with you is a timeless memory filled with love and laughter.'}
        </p>

        {/* Time Together Counter Grid */}
        <div className="mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Time We Have Been Together</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { label: 'Years', val: timeTogether.years },
              { label: 'Days', val: timeTogether.days },
              { label: 'Hours', val: timeTogether.hours },
              { label: 'Minutes', val: timeTogether.minutes },
              { label: 'Seconds', val: timeTogether.seconds },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-rose-100 dark:border-rose-950 shadow-lg"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 inline-block px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-900">
            💖 Total Days of Loving You: <span className="font-bold">{timeTogether.totalDays} Days</span>
          </div>
        </div>

        {/* Anniversary Countdown Banner */}
        {config.anniversaryDate && (
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Heart className="w-32 h-32 fill-current text-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Next Anniversary Countdown</span>
                </div>
                <h4 className="text-2xl font-extrabold text-white">
                  Target Date: {config.anniversaryDate}
                </h4>
              </div>

              <div className="flex gap-3">
                {[
                  { label: 'D', val: anniversaryCountdown.days },
                  { label: 'H', val: anniversaryCountdown.hours },
                  { label: 'M', val: anniversaryCountdown.minutes },
                  { label: 'S', val: anniversaryCountdown.seconds },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/30"
                  >
                    <span className="text-xl font-extrabold font-mono text-white leading-none">
                      {String(c.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-white/80 uppercase">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
              <span>Continue to Beautiful Memories 📸</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
