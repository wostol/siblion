import { oauthRedirect, oauthCodeHandler } from './authHandler.js';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  // Запуск OAuth авторизации
  login() {
    oauthRedirect();
  }

  // Выход из системы
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    // Не очищаем sessionStorage полностью, так как там могут быть другие данные
    sessionStorage.removeItem('code_verifier');
    sessionStorage.removeItem('oauth_state');
    
    // Перенаправляем на главную
    window.location.href = '/';
  }

  // Обработка callback после авторизации
  async handleCallback(searchParams) {
    try {
      const result = oauthCodeHandler(searchParams);
      
      if (!result) {
        console.log('Нет кода авторизации или несовпадение state');
        return false;
      }

      // Отправляем код на ваш бэкенд для получения токена
      const tokenData = await this.exchangeCodeForToken(result.code, result.codeVerifier);
      
      if (tokenData && tokenData.token) {
        this.setToken(tokenData.token);
        if (tokenData.user) {
          this.setUser(tokenData.user);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Ошибка при обработке callback:', error);
      return false;
    }
  }

  // Обмен кода на токен (запрос к вашему бэкенду)
  async exchangeCodeForToken(code, codeVerifier) {
    try {
      // Здесь должен быть ваш реальный эндпоинт
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
          redirect_uri: window.location.origin
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении токена');
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка обмена кода на токен:', error);
      
      // Для тестирования без бэкенда (удалить в продакшене)
      return this.mockExchangeCode(code, codeVerifier);
    }
  }

  // Временная функция для тестирования (удалить в продакшене)
  mockExchangeCode(code, codeVerifier) {
    console.log('Обмен кода на токен:', { code, codeVerifier });
    return {
      token: 'mock_token_' + Date.now(),
      user: {
        id: 1,
        name: 'Тестовый пользователь',
        email: 'user@example.com'
      }
    };
  }

  // Получение токена
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Установка токена
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Получение данных пользователя
  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Установка данных пользователя
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Проверка авторизации
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();