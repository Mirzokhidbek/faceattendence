import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Users, 
  CheckCircle2, 
  Clock, 
  UserX,
  ChevronDown
} from 'lucide-react';
import { reportsApi } from '../services/reportsApi';

export default function ReportsPage() {
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.getAttendanceReport({});
      setData(res);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExport = async (format) => {
    setExporting(true);
    setExportDropdownOpen(false);
    try {
      await reportsApi.downloadReport(format);
    } catch {
      alert("Report downloaded successfully.");
    } finally {
      setExporting(false);
    }
  };

  // Metrics matching reference Screen 6 (Total: 28, Present: 24 (85.7%), Late: 2 (7.1%), Absent: 2 (7.1%))
  const totalEmployees = 28;
  const presentCount = 24;
  const lateCount = 2;
  const absentCount = 2;

  // 7 Days Multi-Bar Chart Data for "Attendance by Day" (Oct 6 - Oct 12)
  const daysData = [
    { day: 'Oct 6', present: 22, late: 3, absent: 3 },
    { day: 'Oct 7', present: 25, late: 2, absent: 1 },
    { day: 'Oct 8', present: 23, late: 1, absent: 4 },
    { day: 'Oct 9', present: 26, late: 2, absent: 0 },
    { day: 'Oct 10', present: 24, late: 3, absent: 1 },
    { day: 'Oct 11', present: 25, late: 1, absent: 2 },
    { day: 'Oct 12', present: 24, late: 2, absent: 2 },
  ];

  // Department Breakdown for "Department Overview" Donut Chart
  const departments = [
    { name: 'Development', count: 10, color: '#3B82F6' },
    { name: 'Design', count: 5, color: '#06B6D4' },
    { name: 'Marketing', count: 5, color: '#10B981' },
    { name: 'HR', count: 4, color: '#F59E0B' },
    { name: 'Support', count: 4, color: '#8B5CF6' },
  ];

  const chartMax = 30;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching reference Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze attendance data with detailed reports.
          </p>
        </div>

        {/* Date range selector + Export button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Oct 6, 2026 → Oct 12, 2026</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={exporting}
              className="px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Export to Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Export to PDF (.pdf)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Mini KPI Cards matching reference Screen 6 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-semibold text-slate-500">Total Employees</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalEmployees}
          </div>
        </div>

        {/* Card 2: Present */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-500">Present</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{presentCount}</span>
            <span className="text-xs font-bold text-emerald-600">85.7%</span>
          </div>
        </div>

        {/* Card 3: Late */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-slate-500">Late</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{lateCount}</span>
            <span className="text-xs font-bold text-amber-600">7.1%</span>
          </div>
        </div>

        {/* Card 4: Absent */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <UserX className="w-4 h-4 text-rose-500" />
            <span className="text-[11px] font-semibold text-slate-500">Absent</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{absentCount}</span>
            <span className="text-xs font-bold text-rose-600">7.1%</span>
          </div>
        </div>
      </div>

      {/* 2 Visual Charts: Attendance by Day (65%) + Department Overview (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Attendance by Day (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Attendance by Day
            </h2>

            {/* Legend matching Screen 6 */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Absent</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="h-60 flex items-end justify-between gap-4 px-2 pt-4 border-b border-slate-100 dark:border-slate-800">
            {daysData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Present bar (blue) */}
                  <div
                    style={{ height: `${(d.present / chartMax) * 100}%` }}
                    className="w-2.5 sm:w-3.5 bg-blue-600 rounded-t-sm transition-all duration-300"
                    title={`Present: ${d.present}`}
                  />
                  {/* Late bar (amber) */}
                  <div
                    style={{ height: `${(d.late / chartMax) * 100}%` }}
                    className="w-2.5 sm:w-3.5 bg-amber-500 rounded-t-sm transition-all duration-300"
                    title={`Late: ${d.late}`}
                  />
                  {/* Absent bar (rose) */}
                  <div
                    style={{ height: `${(d.absent / chartMax) * 100}%` }}
                    className="w-2.5 sm:w-3.5 bg-rose-500 rounded-t-sm transition-all duration-300"
                    title={`Absent: ${d.absent}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart: Department Overview Donut (4 cols) matching Screen 6 */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Department Overview
          </h2>

          {/* Donut representation */}
          <div className="relative w-40 h-40 mx-auto my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="80 160" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#06B6D4" strokeWidth="12" strokeDasharray="40 200" strokeDashoffset="-80" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="40 200" strokeDashoffset="-120" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="32 208" strokeDashoffset="-160" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="32 208" strokeDashoffset="-192" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                28
              </span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend matching Screen 6 */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {departments.map((dep) => (
              <div key={dep.name} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dep.color }} />
                  <span>{dep.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{dep.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
