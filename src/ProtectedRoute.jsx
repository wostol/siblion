// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from './auth/authStore';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если не авторизован - сохраняем URL и редиректим на главную
  // (кнопка входа в Header, не нужна отдельная страница логина)
  if (!isAuthenticated) {
    // Сохраняем URL, куда хотел попасть пользователь
    sessionStorage.setItem('returnUrl', window.location.pathname);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;