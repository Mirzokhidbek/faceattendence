import api from './api';

export const coursesApi = {
  getCourses: async () => {
    const res = await api.get('/courses');
    return res.data;
  },
  createCourse: async (courseData) => {
    const res = await api.post('/courses', courseData);
    return res.data;
  },
  getCourse: async (courseId) => {
    const res = await api.get(`/courses/${courseId}`);
    return res.data;
  },
  updateCourse: async (courseId, data) => {
    const res = await api.put(`/courses/${courseId}`, data);
    return res.data;
  },
  deleteCourse: async (courseId) => {
    const res = await api.delete(`/courses/${courseId}`);
    return res.data;
  }
};
