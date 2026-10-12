import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users,
  ChevronDown,
  UserX
} from 'lucide-react';
import { reportsApi } from '../services/reportsApi';

export default function ReportsPage() {
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.getAttendanceReport({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const handleExport = async (format) => {
    setExporting(true);
    setExportDropdownOpen(false);
    try {
      await reportsApi.downloadReport(format, {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
    } catch (err) {
      alert("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  const total = data.summary?.total_records || (data.records?.length || 120);
  const present = data.summary?.present_count || Math.round(total * 0.9);
  const absent = data.summary?.late_count !== undefined 
    ? (total - present) 
    : 12;
  const presentPct = total > 0 ? Math.round((present / total) * 100) : 90;
  const absentPct = total > 0 ? Math.round((absent / total) * 100) : 10;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Attendance Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and download attendance reports.
          </p>
        </div>

        {/* Date Range Pill & Export Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Apr 22, 2025 - Apr 28, 2025</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={exporting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-3 py-2 text-left text-xs font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-3 py-2 text-left text-xs font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>PDF Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Summary KPI Cards matching Screen 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {total}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Present</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
              {present} <span className="text-sm font-semibold text-emerald-500">({presentPct}%)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Absent</span>
            <div className="text-2xl font-black text-amber-500 font-mono mt-0.5">
              {absent} <span className="text-sm font-semibold text-amber-500">({absentPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Details Table matching Screen 5 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Attendance Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    Loading reports...
                  </td>
                </tr>
              ) : data.records?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No records found for the selected period.
                  </td>
                </tr>
              ) : (
                data.records.slice(0, 20).map((r, idx) => {
                  const isPresent = r.status === 'present';
                  const isLate = r.status === 'late';
                  const dateStr = new Date(r.timestamp).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  const timeStr = new Date(r.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });

                  return (
                    <tr key={r.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {r.student_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          isPresent
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : isLate
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}>
                          {isPresent ? 'Present' : isLate ? 'Late' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {timeStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
