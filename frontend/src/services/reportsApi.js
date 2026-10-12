import api from './api';

export const reportsApi = {
  getAttendanceReport: async (params = {}) => {
    const res = await api.get('/reports/attendance', { params });
    return res.data;
  },
  downloadReport: async (format = 'excel', params = {}) => {
    const res = await api.get('/reports/attendance/export', {
      params: { ...params, format },
      responseType: 'blob'
    });
    
    // Create download link
    const ext = format === 'excel' ? 'xlsx' : 'pdf';
    const blob = new Blob([res.data], {
      type: format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'application/pdf'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartCheck_Report_${new Date().toISOString().slice(0, 10)}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
