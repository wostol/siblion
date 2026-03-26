// hooks/useAuth.js
import useAuthStore from './authStore';

const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    updateUser,
  };
};

export default useAuth;