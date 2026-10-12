import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CheckCircle,
  Scan
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import SmartCheckLogo from '../components/SmartCheckLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('admin@smartcheck.edu');
  const [password, setPassword] = useState('Admin@123');
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Login Form */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <SmartCheckLogo size="md" />
              <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
                SmartCheck
              </span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Smart Attendance System
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Face recognition based attendance for a smarter tomorrow.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smartcheck.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

              <div className="flex items-center justify-end pt-1">
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert("Please contact your system administrator."); }}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Demo Access:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@smartcheck.edu', 'Admin@123')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('prof.john@smartcheck.edu', 'Prof@123')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Professor
                </button>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-8 pt-4 text-left">
            <p className="text-[11px] text-slate-400">
              © 2025 SmartCheck. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Column: Visual Brand Illustration matching reference Screen 1 */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-b from-[#EEF6FF] via-[#E6F0FA] to-[#F0F7FF] dark:from-slate-800/40 dark:to-slate-800/80 relative overflow-hidden border-l border-slate-100 dark:border-slate-800/80">
          {/* Subtle curved background wave */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="none">
              <path d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z" fill="#DBEAFE" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            {/* Student Portrait with Biometric Face Scan Reticle */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden bg-white shadow-xl mb-8 border-2 border-white">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                alt="Student face recognition"
                className="w-full h-full object-cover"
              />

              {/* Blue Face Reticle */}
              <div className="absolute inset-4 rounded-2xl border-2 border-blue-500/80 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-600" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-600" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-600" />
              </div>

              {/* Subtle Laser scan bar */}
              <div className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-sm shadow-blue-500 animate-scan pointer-events-none" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Advanced Face Recognition for Accurate Attendance
            </h2>

            {/* 3 feature badges */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Fast & Accurate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Easy To Use</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
