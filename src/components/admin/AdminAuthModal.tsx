import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Key, ArrowRight, Loader2 } from 'lucide-react';
import { verifyAdminPasscode } from '../../lib/firebase';

interface AdminAuthModalProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onAuthenticated, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const isValid = await verifyAdminPasscode(passcode.trim());
      if (isValid) {
        onAuthenticated();
      } else {
        setError('Incorrect passcode. Please try again.');
      }
    } catch {
      setError('Incorrect passcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-950/50 text-slate-900 dark:text-white relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
        >
          ✕
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-200 dark:border-rose-900">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-black text-center mb-1">Admin Panel Login</h3>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
          Enter admin passcode to access CMS and edit website content
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handlePasscodeLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
                autoFocus
              />
              <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Unlock Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

