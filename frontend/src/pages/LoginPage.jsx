import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import FaceAttendanceLogo from '../components/FaceAttendanceLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('admin@smartcheck.edu');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleQuickFill = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 transition-colors">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column (5 cols): Deep Navy Brand Panel matching reference Screen 9 */}
        <div className="lg:col-span-5 bg-[#0D1B2A] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle wavy decorative background shape */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 400 600" className="w-full h-full object-cover">
              <path
                d="M0,320 C100,280 200,380 400,320 L400,600 L0,600 Z"
                fill="#1E3A8A"
              />
              <path
                d="M0,400 C150,350 250,450 400,380 L400,600 L0,600 Z"
                fill="#2563EB"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <FaceAttendanceLogo size="lg" isDarkBrand={true} textClassName="text-xl text-white" />

            <div className="mt-20 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Secure. Fast. Smart.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
                Modern face recognition attendance system for your business.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10 text-xs text-slate-400">
            © {new Date().getFullYear()} FaceAttendance. All rights reserved.
          </div>
        </div>

        {/* Right Column (7 cols): Clean Sign In Form matching reference Screen 9 */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mirzohid@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <a href="#forgot" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign in Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Quick Demo Access Pills */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Demo Access:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@smartcheck.edu', 'Admin@123')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium transition-all"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('prof.john@smartcheck.edu', 'Prof@123')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-all"
                >
                  Professor
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <a href="#contact" className="font-semibold text-blue-600 hover:text-blue-700">
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
