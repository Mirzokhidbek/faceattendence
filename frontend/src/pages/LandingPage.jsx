import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scan, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  X,
  Camera,
  Activity,
  Layers,
  Check,
  ChevronRight
} from 'lucide-react';
import FaceAttendanceLogo from '../components/FaceAttendanceLogo';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoScanning, setDemoScanning] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);

  const startDemo = () => {
    setDemoModalOpen(true);
    setDemoScanning(true);
    setDemoSuccess(false);

    setTimeout(() => {
      setDemoScanning(false);
      setDemoSuccess(true);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Subtle background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-50/80 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar matching Screen 1 */}
      <header className="h-20 border-b border-slate-100 dark:border-slate-800/80 px-6 sm:px-10 lg:px-16 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-30">
        <FaceAttendanceLogo size="md" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#home" className="text-blue-600 dark:text-blue-400 font-semibold transition-colors">
            Home
          </a>
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-[#0D1B2A] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Section matching Screen 1 in reference mockup */}
      <main id="home" className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex flex-col justify-between relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Hero Content */}
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
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={startDemo}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-slate-800 dark:text-slate-200" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual with Face Recognition Scanning Frame */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950 group">
              {/* High-quality portrait matching the reference image */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                alt="Face Recognition Attendance Demo"
                className="w-full h-[420px] object-cover object-center"
              />

              {/* Cyan / Blue Biometric Scan Frame on Face */}
              <div className="absolute inset-x-12 top-16 bottom-20 pointer-events-none flex items-center justify-center">
                <div className="w-52 h-56 rounded-2xl border-2 border-blue-400/90 relative shadow-xs">
                  {/* High tech corner accents */}
                  <span className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-cyan-400 rounded-tl-lg" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-cyan-400 rounded-tr-lg" />
                  <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-cyan-400 rounded-bl-lg" />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-cyan-400 rounded-br-lg" />

                  {/* Animated laser scan line */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse" style={{ top: '48%' }} />
                </div>
              </div>

              {/* Floating Bottom Card: Attendance Confirmed - 09:24 AM matching Screen 1 */}
              <div className="absolute bottom-5 inset-x-5 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-3.5 transition-transform duration-300 hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Attendance Confirmed
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    09:24 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards matching reference Screen 1 */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-16 sm:pt-20">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Face Recognition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Accurate and fast face detection
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Real-time Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Live attendance monitoring
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Detailed Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export and analyze attendance data
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
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

        {/* Pricing Section */}
        <section id="pricing" className="pt-24 sm:pt-32">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simple Pricing
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Transparent plans for any organization
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Scale seamlessly from small classrooms to multi-campus enterprise enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <p className="text-xs text-slate-500">Perfect for labs, clubs and small demo pilots.</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Up to 50 employees</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Real-time face recognition</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Standard reports export</span></div>
                </div>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 space-y-6 flex flex-col justify-between relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Professional</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-600">Popular</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-xs text-blue-200">/month</span>
                </div>
                <p className="text-xs text-blue-100">Designed for schools, university departments & growing companies.</p>
                <div className="space-y-2.5 pt-4 border-t border-blue-500/60 text-xs text-blue-50">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /><span>Unlimited employees</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /><span>Anti-spoofing liveness protection</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /><span>Advanced analytics & PDF/Excel exports</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /><span>Multi-camera synchronization</span></div>
                </div>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold shadow-md transition-colors">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$199</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <p className="text-xs text-slate-500">Dedicated cloud or on-premise infrastructure for large institutions.</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Dedicated on-premise deployment</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Custom SIS / HRIS database integration</span></div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>24/7 Priority SLA support</span></div>
                </div>
              </div>
              <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* About / Trust Section */}
        <section id="about" className="pt-24 sm:pt-32 pb-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                About FaceAttendance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Empowering organizations with contactless intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                FaceAttendance combines state-of-the-art deep neural networks (OpenCV SFace & YuNet) with sub-second vector matching to eliminate buddy-punching, manual logs, and lost ID cards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center border-l border-white/10 pl-0 md:pl-8">
              <div>
                <span className="text-3xl font-black text-blue-400">99.8%</span>
                <span className="text-xs text-slate-400 block mt-1">Accuracy</span>
              </div>
              <div>
                <span className="text-3xl font-black text-emerald-400">&lt;200ms</span>
                <span className="text-xs text-slate-400 block mt-1">Scan Latency</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 px-6 sm:px-16 text-center text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <FaceAttendanceLogo size="sm" />
          <p>© {new Date().getFullYear()} FaceAttendance. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive Watch Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Scanner Demo
                </h3>
              </div>
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated interactive camera viewport */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                alt="Demo Face"
                className="w-full h-full object-cover"
              />

              {/* Scanning state */}
              {demoScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/30">
                  <div className="w-48 h-48 rounded-2xl border-2 border-cyan-400 relative animate-pulse">
                    <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />
                  </div>
                  <span className="mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/80 text-white backdrop-blur-sm">
                    Detecting face...
                  </span>
                </div>
              )}

              {/* Success state */}
              {demoSuccess && (
                <div className="absolute inset-x-4 bottom-4 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-between animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Abdulla Karimov</h4>
                      <p className="text-[10px] text-slate-300">CS-21 • 09:24 AM</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Present
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setDemoScanning(true);
                  setDemoSuccess(false);
                  setTimeout(() => {
                    setDemoScanning(false);
                    setDemoSuccess(true);
                  }, 1800);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Scan Again
              </button>

              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  navigate('/camera');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Open Full Camera App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
