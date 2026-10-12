import { create } from 'zustand';
import { authApi } from '../services/authApi';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('smartcheck_user') || 'null'),
  token: localStorage.getItem('smartcheck_token') || null,
  isAuthenticated: !!localStorage.getItem('smartcheck_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('smartcheck_token', data.access_token);
      localStorage.setItem('smartcheck_user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true;
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Kirishda xatolik yuz berdi';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('smartcheck_token');
    if (!token) return;
    try {
      const user = await authApi.getMe();
      localStorage.setItem('smartcheck_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('smartcheck_token');
      localStorage.removeItem('smartcheck_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));
