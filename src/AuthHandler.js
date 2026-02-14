import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Функция для получения cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // Функция для установки cookie
    const setCookie = (name, value, days = 14) => {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}; samesite=lax`;
    };

    // Проверяем sessionid в URL
    const urlParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = urlParams.get('sessionid');

    if (sessionIdFromUrl) {
      // Сохраняем sessionid в cookies
      setCookie('sessionid', sessionIdFromUrl);
      
      // Очищаем URL от параметра
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Перезагружаем страницу чтобы применить авторизацию
      window.location.reload();
      return;
    }

    // Проверяем наличие sessionid в cookies
    const sessionId = getCookie('sessionid');
    
    if (!sessionId) {
      // Если нет sessionid, редиректим на Django авторизацию
      window.location.href = 'http://localhost:8000/';
    }
  }, [location]);

  return children;
};

export default AuthHandler;