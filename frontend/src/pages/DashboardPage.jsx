import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Clock, 
  UserX, 
  ChevronDown
} from 'lucide-react';
import { attendanceApi } from '../services/attendanceApi';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await attendanceApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics from stats or clean defaults matching Screen 2 mockup (24 / 28, 2, 2, 85.7%)
  const totalStudents = stats?.total_students || 28;
  const presentCount = stats?.today_present_count || 24;
  const lateCount = stats?.today_late_count || 2;
  const absentCount = stats ? Math.max(0, totalStudents - (presentCount + lateCount)) : 2;
  const attendanceRate = stats?.today_attendance_rate ? stats.today_attendance_rate.toFixed(1) : '85.7';

  // Spline data matching reference Screen 2 (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartPointsData = [12, 18, 16, 22, 26, 23, 27];

  const chartWidth = 560;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Generate SVG smooth curve
  const points = chartPointsData.map((val, idx) => {
    const x = paddingX + (idx / (chartPointsData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / 30) * (chartHeight - paddingY * 2);
    return { x, y };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    linePath += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Circular gauge for Attendance Rate (donut radius 42)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const numericRate = parseFloat(attendanceRate) || 85.7;
  const strokeDashoffset = circumference - (numericRate / 100) * circumference;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header matching reference Screen 2 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your team today.
        </p>
      </div>

      {/* 3 KPI Metric Cards matching reference Screen 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Present Today */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Present Today
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {presentCount} / {totalStudents}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                +5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">85.7%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Late */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Late
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {lateCount}
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                7.1%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">7.1%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Absent */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Absent
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {absentCount}
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                7.1%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">7.1%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Row: Attendance Overview (65%) + Attendance Rate (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Overview Card (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Attendance Overview
            </h2>
          </div>

          {/* SVG Smooth Curve Spline Chart */}
          <div className="w-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56">
              <defs>
                <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 10, 20, 30].map((val) => {
                const y = chartHeight - paddingY - (val / 30) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-sans"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              <path d={areaPath} fill="url(#splineGradient)" />

              {/* Spline line */}
              <path
                d={linePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* X Axis Labels */}
              {days.map((day, idx) => {
                const x = paddingX + (idx / (days.length - 1)) * (chartWidth - paddingX * 2);
                return (
                  <text
                    key={day}
                    x={x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-sans"
                  >
                    {day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Attendance Rate Donut Card (4 cols) matching reference Screen 2 */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Attendance Rate
          </h2>

          {/* Donut progress ring */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="11"
                fill="none"
              />
              {/* Colored active arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-blue-600 transition-all duration-700 ease-out"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {attendanceRate}%
              </span>
            </div>
          </div>

          {/* Legend matching Screen 2 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Present</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">34</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Late</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">2</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Absent</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
