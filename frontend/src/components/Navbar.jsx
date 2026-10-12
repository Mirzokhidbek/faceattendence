import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { 
  Bell, 
  Menu, 
  Sun, 
  Moon, 
  Calendar,
  Search
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();

  // Route title mapping
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/students/register')) return 'Add New Student';
    if (path.includes('/students/') && path !== '/students') return 'Student Profile';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/attendance')) return 'Attendance Records';
    if (path.includes('/camera') || path.includes('/attendance/capture')) return 'Face Recognition Attendance';
    if (path.includes('/reports')) return 'Attendance Reports';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/courses')) return 'Courses';
    return 'SmartCheck';
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const displayName = user?.full_name?.split(' ')[0] || 'Admin';

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="flex items-center justify-between h-full px-6 lg:px-10">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Date, Notifications, Theme & User Avatar */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Current Date */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{todayFormatted}</span>
          </div>

          {/* Theme Toggle (Subtle) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Notification Bell with Badge */}
          <button
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-blue-500/20">
              {displayName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
