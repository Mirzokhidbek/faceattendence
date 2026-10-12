import api from './api';

export const attendanceApi = {
  checkIn: async (frameBase64, courseId) => {
    const res = await api.post('/attendance/check-in', {
      frame: frameBase64,
      course_id: courseId
    });
    return res.data;
  },
  getLogs: async (params = {}) => {
    const res = await api.get('/attendance/logs', { params });
    return res.data;
  },
  getStudentAttendance: async (studentId) => {
    const res = await api.get(`/attendance/student/${studentId}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/attendance/stats');
    return res.data;
  }
};
