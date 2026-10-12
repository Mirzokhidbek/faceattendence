import React, { useState } from 'react';
import { Settings, Moon, Sun, Shield, User, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [threshold, setThreshold] = useState(0.40);
  const [gracePeriod, setGracePeriod] = useState(15);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, system appearance and recognition parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Account Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Account Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Full Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{user?.full_name || 'Administrator'}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Email Address</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{user?.email || 'admin@smartcheck.edu'}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-1">Role</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Appearance & Theme
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isDark ? "Dark Mode" : "Light Mode"}
              </h4>
              <p className="text-xs text-slate-400">
                Switch between light and dark theme interface
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </div>

      {/* AI & Face Recognition Tuning */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          Face Recognition & Attendance Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Cosine Similarity Threshold ({threshold})
            </label>
            <p className="text-slate-400 text-[11px]">
              Minimum cosine similarity required to verify a student identity (SFace standard is 0.363).
            </p>
            <input
              type="range"
              min="0.30"
              max="0.60"
              step="0.02"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Late Grace Period ({gracePeriod} minutes)
            </label>
            <p className="text-slate-400 text-[11px]">
              Grace period after course start time before student is tagged as 'Late'.
            </p>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
}
