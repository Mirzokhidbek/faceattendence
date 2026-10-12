import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Camera, 
  BarChart3, 
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import FaceAttendanceLogo from './FaceAttendanceLogo';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/students',
      label: 'Employees',
      icon: Users,
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: CalendarCheck,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      to: '/camera',
      label: 'Live Camera',
      icon: Camera,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mirzohid Nurmuhammadov as shown in reference design
  const fullName = user?.full_name || 'Mirzohid Nurmuhammadov';
  const roleName = user?.role === 'super_admin' ? 'Admin' : user?.role === 'professor' ? 'Manager' : 'Employee';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Modern Light SaaS Sidebar matching reference Screen 2 */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-slate-800/80">
          <FaceAttendanceLogo size="md" />

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Profile Section: Mirzohid Nurmuhammadov / Admin */}
        <div className="p-4 m-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt={fullName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Mirzohid`;
                }}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {fullName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {roleName}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
