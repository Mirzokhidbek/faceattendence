import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  UserX,
  ChevronDown
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { attendanceApi } from '../services/attendanceApi';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const navigate = useNavigate();
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

  const totalStudents = stats?.total_students || 120;
  const presentToday = stats?.today_present_count || (stats ? Math.round(stats.total_students * (stats.today_attendance_rate / 100)) : 108);
  const absentToday = stats ? Math.max(0, totalStudents - (stats.today_present_count + (stats.today_late_count || 0))) : 12;
  const attendanceRate = stats ? Math.round(stats.today_attendance_rate) : 90;

  const displayName = user?.full_name?.split(' ')[0] || 'Admin';

  // Weekly Trend Chart Data
  const weeklyData = stats?.weekly_trend?.length > 0 
    ? stats.weekly_trend 
    : [
        { day: 'Apr 22', rate: 78 },
        { day: 'Apr 23', rate: 84 },
        { day: 'Apr 24', rate: 92 },
        { day: 'Apr 25', rate: 86 },
        { day: 'Apr 26', rate: 95 },
        { day: 'Apr 27', rate: 89 },
        { day: 'Apr 28', rate: 90 },
      ];

  // SVG spline path generator for smooth curve
  const getSplinePath = (data, width, height, padding = 40) => {
    if (!data || data.length === 0) return '';
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.rate || 0) / 100) * (height - padding * 2);
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return { path, points };
  };

  const chartWidth = 600;
  const chartHeight = 220;
  const { path: linePath, points: chartPoints } = getSplinePath(weeklyData, chartWidth, chartHeight);
  const areaPath = linePath ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - 40} L ${chartPoints[0].x} ${chartHeight - 40} Z` : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {displayName}!
        </p>
      </div>

      {/* 4 Stat Cards matching reference Screen 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value={loading ? '...' : totalStudents}
          color="green"
        />
        <StatCard
          title="Present Today"
          value={loading ? '...' : presentToday}
          color="blue"
        />
        <StatCard
          title="Absent Today"
          value={loading ? '...' : absentToday}
          color="amber"
        />
        <StatCard
          title="Attendance Rate"
          value={loading ? '...' : `${attendanceRate}%`}
          color="purple"
        />
      </div>

      {/* Two Column Grid: Chart (2/3) + Recent Attendance (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Attendance Overview
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <span>This Week</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Spline Area Chart */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[25, 50, 75, 100].map((level) => {
                const y = chartHeight - 40 - (level / 100) * (chartHeight - 80);
                return (
                  <g key={level}>
                    <line
                      x1="35"
                      y1={y}
                      x2={chartWidth - 35}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="25"
                      y={y + 4}
                      fontSize="9"
                      fill="currentColor"
                      className="text-slate-400"
                      textAnchor="end"
                    >
                      {level}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

              {/* Smooth spline curve line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {chartPoints?.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  className="transition-transform hover:scale-125 cursor-pointer"
                />
              ))}

              {/* X Axis Day Labels */}
              {weeklyData.map((d, i) => {
                const x = 40 + (i / (weeklyData.length - 1)) * (chartWidth - 80);
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - 15}
                    fontSize="10"
                    fill="currentColor"
                    className="text-slate-400"
                    textAnchor="middle"
                  >
                    {d.day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent Attendance List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Attendance
              </h2>
              <button
                onClick={() => navigate('/attendance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View All
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {stats?.recent_logs?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No attendance records recorded yet today.
                </div>
              ) : (
                (stats?.recent_logs || []).slice(0, 5).map((log, index) => {
                  const isPresent = log.status === 'present';
                  const isLate = log.status === 'late';
                  const timeStr = new Date(log.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });

                  return (
                    <div key={log.id || index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={log.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${log.student_id}`}
                          alt={log.student_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {log.student_name}
                          </h4>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                            isPresent
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : isLate
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}>
                            {isPresent ? 'Present' : isLate ? 'Late' : 'Absent'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {timeStr}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => navigate('/camera')}
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors"
            >
              Open Camera Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
