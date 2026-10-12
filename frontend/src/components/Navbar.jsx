import React from 'react';
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

  // Current formatted date like "Tue, Oct 12, 2026" in reference design
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const fullName = user?.full_name || 'Mirzohid Nurmuhammadov';

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-6 lg:px-10">
        {/* Left: Mobile Toggle & Global Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Employees Input as shown in reference Screen 2 */}
          <div className="relative w-full max-w-xs hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right: Date Pill, Notification Bell, Theme Toggle & User Avatar */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification Bell with red alert dot matching Screen 2 */}
          <button
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Date Pill: Calendar icon + Tue, Oct 12, 2026 */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/70 dark:border-slate-700/70">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{todayFormatted}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={fullName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Mirzohid`;
              }}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
