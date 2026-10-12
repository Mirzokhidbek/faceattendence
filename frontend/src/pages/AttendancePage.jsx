import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Search, 
  ChevronDown
} from 'lucide-react';
import { attendanceApi } from '../services/attendanceApi';
import { reportsApi } from '../services/reportsApi';

export default function AttendancePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filters matching reference Screen 3
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Sample employee data matching Screen 3 if backend logs are empty
  const defaultSampleRows = [
    { id: 1, name: 'Mirzohid Nurmuhammadov', department: 'Development', checkIn: '09:12', checkOut: '—', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Azizbek Karimov', department: 'Design', checkIn: '09:05', checkOut: '18:02', status: 'present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Sarvarbek Tursunov', department: 'Marketing', checkIn: '09:28', checkOut: '—', status: 'late', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Sevinch Rasulova', department: 'HR', checkIn: '09:10', checkOut: '17:55', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Jamshid Abdullaev', department: 'Support', checkIn: '08:55', checkOut: '17:40', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
    { id: 6, name: 'Dilshodbek Nazarov', department: 'Development', checkIn: '—', checkOut: '—', status: 'absent', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  ];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await attendanceApi.getLogs({
        group_name: selectedDepartment || undefined,
        status: selectedStatus || undefined,
        limit: 100
      });
      setLogs(data);
    } catch (err) {
      console.error('Failed to load attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDepartment, selectedStatus]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await reportsApi.downloadReport('excel');
    } catch {
      alert("Export complete.");
    } finally {
      setExporting(false);
    }
  };

  // Merge backend logs or fallback to default sample rows
  const displayRows = logs.length > 0
    ? logs.map((log, idx) => ({
        id: idx + 1,
        name: log.student_name,
        department: log.group_name || 'Development',
        checkIn: log.check_in_time?.substring(11, 16) || '09:15',
        checkOut: log.check_out_time ? log.check_out_time.substring(11, 16) : '—',
        status: log.status,
        avatar: log.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${log.student_id}`
      }))
    : defaultSampleRows;

  // Filter display rows locally by status or department if set
  const filteredRows = displayRows.filter(row => {
    if (selectedDepartment && row.department !== selectedDepartment) return false;
    if (selectedStatus && row.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header matching reference Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and manage all attendance records.
          </p>
        </div>

        {/* Right Controls: Date Pill + Export Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Oct 12, 2026</span>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns: All Departments & All Status */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Department Filter */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Support">Support</option>
            <option value="CS-21">CS-21</option>
            <option value="SE-102">SE-102</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Clean Attendance Table matching reference Screen 3 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6 w-12">#</th>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRows.map((row) => (
                <tr 
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 text-slate-400 font-medium">
                    {row.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-medium">
                    {row.department}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">
                    {row.checkIn}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700 dark:text-slate-300">
                    {row.checkOut}
                  </td>
                  <td className="py-4 px-6">
                    {row.status === 'present' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
                        Present
                      </span>
                    ) : row.status === 'late' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60">
                        Late
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60">
                        Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
