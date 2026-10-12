import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  UserX, 
  Calendar
} from 'lucide-react';
import { studentsApi } from '../services/studentsApi';
import { attendanceApi } from '../services/attendanceApi';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'notes'

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentData = await studentsApi.getStudent(id);
        setStudent(studentData);
        const logsData = await attendanceApi.getStudentAttendance(id);
        setLogs(logsData);
      } catch (err) {
        console.error('Failed to load employee/student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  // Profile data matching Screen 5
  const fullName = student?.full_name || 'Mirzohid Nurmuhammadov';
  const email = student?.email || 'mirzohid@gmail.com';
  const phone = student?.phone || '+998 90 123 45 67';
  const department = student?.group_name || 'Development';
  const position = 'Frontend Developer';
  const joinDate = '2024-03-15';
  const photoUrl = student?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  const presentDays = logs.length > 0 ? logs.filter(l => l.status === 'present').length : 102;
  const lateDays = logs.length > 0 ? logs.filter(l => l.status === 'late').length : 5;
  const absentDays = logs.length > 0 ? logs.filter(l => l.status === 'absent').length : 3;
  const attendanceRate = '95.8';

  // Circular gauge calculations (radius 36)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (parseFloat(attendanceRate) / 100) * circumference;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Back button matching Screen 5 */}
      <button
        onClick={() => navigate('/students')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Employees</span>
      </button>

      {/* Profile Header Banner matching reference Screen 5 */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <img
          src={photoUrl}
          alt={fullName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Mirzohid`;
          }}
          className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {fullName}
            </h1>
            <span className="self-center md:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
              Present
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {position}
          </p>

          {/* Contact Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation: Overview, Attendance, Notes */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Overview</span>
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'attendance'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Attendance</span>
          {activeTab === 'attendance' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'notes'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Notes</span>
          {activeTab === 'notes' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content: Overview (Personal Information + Statistics) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Personal Information (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Full Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{phone}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{department}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Position</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{position}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Join Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{joinDate}</span>
              </div>
            </div>
          </div>

          {/* Right: Statistics & Circular Attendance Gauge (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Statistics
            </h3>

            {/* 3 Metrics: Present Days, Late Days, Absent Days */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Present Days</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{presentDays}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Late Days</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{lateDays}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Absent Days</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{absentDays}</span>
              </div>
            </div>

            {/* Circular Progress Donut: 95.8% Attendance Rate */}
            <div className="pt-2 flex items-center justify-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="9"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-emerald-500"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {attendanceRate}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Attendance Rate
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Top tier punctuality
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Attendance Records List */}
      {activeTab === 'attendance' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Attendance History
          </h3>
          {logs.length === 0 ? (
            <p className="text-xs text-slate-400">No attendance records found yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {logs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {log.course_id} — {log.date}
                    </span>
                    <span className="text-slate-400 block text-[11px]">
                      {log.check_in_time ? log.check_in_time.substring(11, 16) : '09:00'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                    log.status === 'present'
                      ? 'bg-emerald-50 text-emerald-600'
                      : log.status === 'late'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Notes */}
      {activeTab === 'notes' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Employee Notes
          </h3>
          <textarea
            placeholder="Add internal notes about this employee..."
            className="w-full h-28 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      )}
    </div>
  );
}
