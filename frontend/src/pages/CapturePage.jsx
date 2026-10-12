import React, { useState, useEffect } from 'react';
import { coursesApi } from '../services/coursesApi';
import { useAttendanceStore } from '../store/attendanceStore';
import CameraScanner from '../components/CameraScanner';
import { BookOpen, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function CapturePage() {
  const { activeCourseId, setActiveCourseId, recentCheckIns, addRecentCheckIn } = useAttendanceStore();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesApi.getCourses();
        setCourses(data);
        if (data.length > 0 && !activeCourseId) {
          setActiveCourseId(data[0].course_id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [activeCourseId, setActiveCourseId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Page Title & Course Selector matching Screen 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Face Recognition Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Position your face in the frame
          </p>
        </div>

        {/* Course Dropdown */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Class:
          </label>
          <select
            value={activeCourseId}
            onChange={(e) => setActiveCourseId(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.course_id}>
                {course.course_id} — {course.course_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Camera Viewport & Recognition Result Card */}
      <CameraScanner 
        activeCourseId={activeCourseId} 
        onNewCheckIn={(record) => addRecentCheckIn(record)}
      />

      {/* Live Recent Stream */}
      {recentCheckIns.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Live Check-In Stream
            </h3>
            <span className="text-xs text-slate-400">
              Class: {activeCourseId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentCheckIns.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <img
                  src={item.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.student_id}`}
                  alt={item.student_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.student_name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {(item.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>{item.student_group}</span>
                    <span className="font-mono">
                      {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
