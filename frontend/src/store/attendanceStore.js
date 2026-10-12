import { create } from 'zustand';

export const useAttendanceStore = create((set) => ({
  activeCourseId: 'CS101',
  recentCheckIns: [],
  lastResult: null,

  setActiveCourseId: (courseId) => set({ activeCourseId: courseId }),
  
  setLastResult: (result) => set({ lastResult: result }),
  
  addRecentCheckIn: (record) => set((state) => {
    // Keep most recent 5 records without duplicate student in ticker
    const filtered = state.recentCheckIns.filter(
      (r) => r.student_id !== record.student_id
    );
    return {
      recentCheckIns: [record, ...filtered].slice(0, 5)
    };
  }),

  setRecentCheckIns: (records) => set({ recentCheckIns: records.slice(0, 5) })
}));
