import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scan, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import FaceAttendanceLogo from '../components/FaceAttendanceLogo';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-slate-100 dark:border-slate-800/80 px-6 lg:px-16 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-30">
        <FaceAttendanceLogo size="md" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#home" className="text-blue-600 font-semibold">Home</a>
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-20 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Smart Attendance <br />
              <span className="text-slate-900 dark:text-white">with Face Recognition</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Modern solution for businesses to track attendance quickly, securely and accurately using face recognition technology.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/camera')}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs transition-all flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-slate-800 dark:text-slate-200" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image with Face Recognition Scanning Overlays */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                alt="Face Recognition Demo"
                className="w-full h-96 object-cover object-center"
              />

              {/* Blue / Cyan Biometric Target Overlay on Face */}
              <div className="absolute inset-x-12 top-14 bottom-14 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 rounded-2xl border-2 border-blue-500/80 relative animate-pulse">
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                </div>
              </div>

              {/* Floating Bottom Card: Attendance Confirmed - 09:24 AM */}
              <div className="absolute bottom-5 inset-x-5 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Attendance Confirmed
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    09:24 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards matching reference Screen 1 */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Face Recognition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Accurate and fast face detection
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Real-time Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Live attendance monitoring
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Detailed Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export and analyze attendance data
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Secure & Reliable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your data is always protected
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
