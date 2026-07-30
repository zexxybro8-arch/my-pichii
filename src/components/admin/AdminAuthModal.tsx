import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Key, ShieldCheck, Mail, LogIn, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

interface AdminAuthModalProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onAuthenticated, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authMethod, setAuthMethod] = useState<'passcode' | 'firebase'>('passcode');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode is 1234 or custom set
    if (passcode === '1234' || passcode === '1402' || passcode === 'admin') {
      onAuthenticated();
    } else {
      setError('Invalid Admin Passcode! Default is 1234');
    }
  };

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        onAuthenticated();
      } else {
        setError('Firebase Auth unavailable, please use Passcode login.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickAccess = async () => {
    if (auth) {
      try {
        await signInAnonymously(auth);
      } catch {}
    }
    onAuthenticated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
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
          Authenticate to access CMS and edit website content
        </p>

        {/* Method Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMethod('passcode')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMethod === 'passcode'
                ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Passcode Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('firebase')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMethod === 'firebase'
                ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Firebase Auth
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {authMethod === 'passcode' ? (
          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Admin Passcode (Default: 1234)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleFirebaseLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Firebase'}</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={handleDemoQuickAccess}
            className="text-xs text-rose-500 hover:underline font-bold"
          >
            ⚡ Quick Demo Access (1-Click Login)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
