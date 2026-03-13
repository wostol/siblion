import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from './authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUser(authService.getUser());
      }
      
      setLoading(false);
    };

    checkAuth();

    // Слушаем изменения в localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Проверяем наличие кода авторизации в URL
    const handleAuthCallback = async () => {
      const searchParams = window.location.search;
      if (searchParams && searchParams.includes('code=')) {
        setLoading(true);
        const success = await authService.handleCallback(searchParams);
        
        if (success) {
          // Убираем параметры из URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Обновляем состояние
          setIsAuthenticated(true);
          setUser(authService.getUser());
          
          // Перенаправляем в профиль
          navigate('/profile');
        } else {
          // Если ошибка, перенаправляем на главную
          navigate('/');
        }
        
        setLoading(false);
      }
    };

    handleAuthCallback();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const login = () => {
    authService.login();
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};