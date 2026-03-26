import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../authService.js';
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Состояние
      isAuthenticated: false,
      user: null,
      loading: false,        // ← меняем на false, так как загрузка только при действии
      error: null,

      // Вход через OAuth
      login: () => {
        try {
          set({ error: null, loading: true });
          authService.login(); // Редирект на OAuth страницу
        } catch (error) {
          set({ error: 'Ошибка при входе', loading: false });
          console.error('Login error:', error);
        }
      },

      // Выход
      logout: () => {
        try {
          authService.logout();
          set({
            isAuthenticated: false,
            user: null,
            error: null,
            loading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      // Обработка callback после OAuth (возвращаемся на сайт)
      handleAuthCallback: async (searchParams) => {
        set({ loading: true, error: null });
        
        try {
          const success = await authService.handleCallback(searchParams);
          
          if (success) {
            const user = authService.getUser();
            set({
              isAuthenticated: true,
              user: user,
              loading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
              error: 'Не удалось завершить авторизацию',
            });
            return false;
          }
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: error.message || 'Ошибка при авторизации',
          });
          return false;
        }
      },

      // Проверка авторизации при загрузке приложения
      checkAuth: () => {
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();
        
        set({
          isAuthenticated: isAuthenticated,
          user: isAuthenticated ? user : null,
          loading: false,
          error: null,
        });
      },

      // Очистить ошибку
      clearError: () => set({ error: null }),
      
      // Обновить данные пользователя
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        authService.setUser(updatedUser);
        set({ user: updatedUser });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Селекторы
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);

export default useAuthStore;