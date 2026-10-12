import api from './api';

export const studentsApi = {
  register: async (studentData) => {
    const res = await api.post('/students/register', studentData);
    return res.data;
  },
  getStudents: async (params = {}) => {
    const res = await api.get('/students', { params });
    return res.data;
  },
  getStudent: async (studentId) => {
    const res = await api.get(`/students/${studentId}`);
    return res.data;
  },
  updateStudent: async (studentId, data) => {
    const res = await api.put(`/students/${studentId}`, data);
    return res.data;
  },
  deleteStudent: async (studentId) => {
    const res = await api.delete(`/students/${studentId}`);
    return res.data;
  }
};
