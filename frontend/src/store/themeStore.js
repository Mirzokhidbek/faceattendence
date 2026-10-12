import { create } from 'zustand';

const initialDark = localStorage.getItem('smartcheck_theme') === 'dark' || 
  (!localStorage.getItem('smartcheck_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (initialDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export const useThemeStore = create((set) => ({
  isDark: initialDark,
  toggleTheme: () => set((state) => {
    const nextDark = !state.isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartcheck_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartcheck_theme', 'light');
    }
    return { isDark: nextDark };
  }),
}));
