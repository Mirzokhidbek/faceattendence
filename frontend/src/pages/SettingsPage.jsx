import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'notifications'
  
  // General settings state
  const [companyName, setCompanyName] = useState('My Company');
  const [timezone, setTimezone] = useState('(GMT+9) Seoul');
  const [language, setLanguage] = useState('English');

  // Face recognition settings state
  const [threshold, setThreshold] = useState(0.65);
  const [autoAttendance, setAutoAttendance] = useState(true);

  // Success indicator
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header matching reference Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account and system preferences.
          </p>
        </div>

        {/* Save Changes button on top right */}
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          Save Changes
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {/* Tabs matching Screen 7: General, Security, Notifications */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'general'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>General</span>
          {activeTab === 'general' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'security'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Security</span>
          {activeTab === 'security' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'notifications'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Notifications</span>
          {activeTab === 'notifications' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content: General (2-Column Form matching reference Screen 7) */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
          {/* Left Column: General Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              General Settings
            </h3>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Timezone
              </label>
              <div className="relative">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="(GMT+9) Seoul">(GMT+9) Seoul</option>
                  <option value="(GMT+5) Tashkent">(GMT+5) Tashkent</option>
                  <option value="(GMT+0) London">(GMT+0) London</option>
                  <option value="(GMT-5) New York">(GMT-5) New York</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="O'zbek">O'zbek</option>
                  <option value="한국어">한국어</option>
                  <option value="Русский">Русский</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Face Recognition Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Face Recognition Settings
            </h3>

            {/* Recognition Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Recognition Threshold
                </label>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {threshold}
                </span>
              </div>

              <input
                type="range"
                min="0.30"
                max="0.95"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <p className="text-[11px] text-slate-400 pt-1">
                Higher value increases accuracy but may reduce speed.
              </p>
            </div>

            {/* Auto Attendance Toggle Switch */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Auto Attendance
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically mark attendance when face is recognized.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoAttendance(!autoAttendance)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoAttendance ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 max-w-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Security & Credentials
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 max-w-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Notification Preferences
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">Email alerts for absent employees</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">Daily summary report email</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
