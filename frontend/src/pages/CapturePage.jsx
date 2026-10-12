import React, { useState, useEffect } from 'react';
import { coursesApi } from '../services/coursesApi';
import { useAttendanceStore } from '../store/attendanceStore';
import CameraScanner from '../components/CameraScanner';
import { Circle } from 'lucide-react';

export default function CapturePage() {
  const { activeCourseId, setActiveCourseId, addRecentCheckIn } = useAttendanceStore();
  const [courses, setCourses] = useState([]);

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
      }
    };
    fetchCourses();
  }, [activeCourseId, setActiveCourseId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Page Header matching reference Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Live Camera
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time face recognition and attendance.
          </p>
        </div>

        {/* Right Badge: Camera 1 - Main Office • Online */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
          <span>Camera 1 - Main Office</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Main Camera Viewport & Recent Detections List */}
      <CameraScanner 
        activeCourseId={activeCourseId || 'CS101'} 
        onNewCheckIn={(record) => addRecentCheckIn(record)}
      />
    </div>
  );
}
