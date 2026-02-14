// src/api/loymaxApi.js
/**
 * Библиотека для взаимодействия с API Loymax
 * Версия 1.0.0
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';
const AUTH_BASE_URL = 'http://localhost:8000';

class LoymaxApi {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.authUrl = AUTH_BASE_URL;
  }

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

  /**
   * Получить cookie по имени
   * @param {string} name - имя cookie
   * @returns {string|null} значение cookie
   */
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * Установить cookie
   * @param {string} name - имя cookie
   * @param {string} value - значение
   * @param {number} days - срок жизни в днях
   */
  setCookie(name, value, days = 14) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; samesite=lax`;
  }

  /**
   * Удалить cookie
   * @param {string} name - имя cookie
   */
  deleteCookie(name) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${name}=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * Проверить статус авторизации
   * @returns {boolean} true если авторизован
   */
  isAuthenticated() {
    return !!this.getCookie('sessionid');
  }

  /**
   * Получить текущий sessionId
   * @returns {string|null} sessionId
   */
  getSessionId() {
    return this.getCookie('sessionid');
  }

  /**
   * Получить CSRF токен
   * @returns {string|null} CSRF токен
   */
  getCsrfToken() {
    return this.getCookie('csrftoken');
  }

  /**
   * Генерировать CSRF токен
   * @returns {string} CSRF токен
   */
  generateCsrfToken() {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }

  // ==================== БАЗОВЫЕ МЕТОДЫ ====================

  /**
   * Базовый метод для API запросов
   * @param {string} endpoint - endpoint API
   * @param {string} method - HTTP метод
   * @param {object} body - тело запроса
   * @param {object} options - дополнительные опции
   * @returns {Promise<Response>} ответ от сервера
   */
  async request(endpoint, method = 'GET', body = null, options = {}) {
    const sessionId = this.getCookie('sessionid');
    const csrfToken = this.getCookie('csrftoken');

    if (!sessionId && !options.skipAuthCheck) {
      throw new Error('Не авторизован');
    }

    const url = `${this.baseUrl}/${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
    
    const fetchOptions = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
        ...options.headers,
      },
      ...options,
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401 || response.status === 403) {
        this.deleteCookie('sessionid');
        this.deleteCookie('csrftoken');
        throw new Error('Сессия истекла');
      }

      return response;
    } catch (error) {
      console.error(`API Request Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * GET запрос
   * @param {string} endpoint - endpoint API
   * @param {object} params - query параметры
   * @returns {Promise<object>} данные
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const response = await this.request(url, 'GET');
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Ошибка запроса');
    }
    
    return await response.json();
  }

  /**
   * POST запрос
   * @param {string} endpoint - endpoint API
   * @param {object} data - данные для отправки
   * @returns {Promise<object>} данные ответа
   */
  async post(endpoint, data = {}) {
    const response = await this.request(endpoint, 'POST', data);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Ошибка запроса');
    }
    
    return await response.json();
  }

  // ==================== МЕТОДЫ АВТОРИЗАЦИИ ====================

  /**
   * Перенаправление на страницу входа
   */
  login() {
    window.location.href = `${this.authUrl}/`;
  }

  /**
   * Выход из системы
   * @param {boolean} redirectAfterLogout - делать ли редирект после выхода
   * @returns {Promise<void>}
   */
  async logout(redirectAfterLogout = true) {
    try {
      // Пробуем отправить POST запрос для очистки сессии
      const response = await fetch(`${this.authUrl}/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Удаляем локальные cookies
      this.deleteCookie('sessionid');
      this.deleteCookie('csrftoken');

      if (response.ok) {
        const data = await response.json();
        if (redirectAfterLogout && data.redirect_url) {
          window.location.href = data.redirect_url;
        }
      } else {
        // Если POST не сработал, используем GET редирект
        if (redirectAfterLogout) {
          window.location.href = `${this.authUrl}/logout/?next=${encodeURIComponent(window.location.origin)}`;
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // В случае ошибки всё равно пробуем редирект
      if (redirectAfterLogout) {
        window.location.href = `${this.authUrl}/logout/?next=${encodeURIComponent(window.location.origin)}`;
      }
    }
  }

  /**
   * Проверить сессию на сервере
   * @returns {Promise<boolean>} true если сессия активна
   */
  async checkSession() {
    try {
      const response = await fetch(`${this.authUrl}/check-auth/`, {
        credentials: 'include',
      });
      const data = await response.json();
      return data.authenticated || false;
    } catch {
      return false;
    }
  }

  /**
   * Установить сессию из URL параметров
   * @returns {string|null} sessionId если найден
   */
  initSessionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('sessionid');
    
    if (sessionIdFromUrl) {
      this.setCookie('sessionid', sessionIdFromUrl);
      this.setCookie('csrftoken', this.generateCsrfToken());
      
      // Очищаем URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return sessionIdFromUrl;
    }
    
    return null;
  }

  // ==================== API ПОЛЬЗОВАТЕЛЯ ====================

  /**
   * Получить информацию о пользователе
   * @returns {Promise<object>} {full_name, email}
   */
  async getUserInfo() {
    return this.get('user/info/');
  }

  /**
   * Получить достижения пользователя
   * @returns {Promise<object>} {ach1, ach2, ach3, ach4}
   */
  async getUserAchievements() {
    return this.get('user/achievements/');
  }

  /**
   * Получить регистрации пользователя
   * @param {number} page - номер страницы
   * @param {number} count - количество на странице
   * @returns {Promise<object>} {regs: [...]}
   */
  async getUserRegistrations(page = 1, count = 10) {
    return this.get('user/registrations/', { num: page, count });
  }

  /**
   * Получить информацию об уровне пользователя
   * @returns {Promise<object>} информация об уровне и баллах
   */
  async getUserLevel() {
    return this.get('user/level/');
  }

  /**
   * Получить заказы пользователя
   * @returns {Promise<object>} {orders: [...], available_points}
   */
  async getUserOrders() {
    return this.get('user/orders/');
  }

  // ==================== API ТОВАРОВ ====================

  /**
   * Получить список товаров
   * @returns {Promise<object>} {products: [...]}
   */
  async getProducts() {
    return this.get('products/');
  }

  // ==================== API МЕРОПРИЯТИЙ ====================

  /**
   * Получить прошедшие мероприятия
   * @param {number} page - номер страницы
   * @param {number} perPage - количество на странице
   * @returns {Promise<object>} {events: [...], pagination}
   */
  async getPastEvents(page = 1, perPage = 10) {
    return this.get('events/past/', { page, per_page: perPage });
  }

  /**
   * Получить предстоящие мероприятия
   * @param {number} page - номер страницы
   * @param {number} perPage - количество на странице
   * @returns {Promise<object>} {events: [...], pagination}
   */
  async getEvents(page = 1, perPage = 10) {
    return this.get('events/', { page, per_page: perPage });
  }

  /**
   * Получить детальную информацию о мероприятии
   * @param {number} eventId - ID мероприятия
   * @returns {Promise<object>} информация о мероприятии
   */
  async getEventDetails(eventId) {
    return this.get(`events/${eventId}/`);
  }

  // ==================== API РЕГИСТРАЦИЙ ====================

  /**
   * Создать регистрацию на мероприятие
   * @param {number} eventId - ID мероприятия
   * @param {string} role - роль ('participant' или 'fan')
   * @returns {Promise<object>} результат регистрации
   */
  async createRegistration(eventId, role = 'participant') {
    return this.post('registrations/', { event_id: eventId, role });
  }

  /**
   * Отменить регистрацию
   * @param {number} registrationId - ID регистрации
   * @returns {Promise<object>} результат отмены
   */
  async cancelRegistration(registrationId) {
    return this.post('registrations/cancel/', { registration_id: registrationId });
  }

  // ==================== API ЗАКАЗОВ ====================

  /**
   * Создать заказ товара
   * @param {number} productId - ID товара
   * @returns {Promise<object>} результат создания заказа
   */
  async createOrder(productId) {
    return this.post('orders/', { product_id: productId });
  }

  /**
   * Отменить заказ
   * @param {number} orderId - ID заказа
   * @returns {Promise<object>} результат отмены
   */
  async cancelOrder(orderId) {
    return this.post(`orders/${orderId}/cancel/`, {});
  }

  // ==================== УТИЛИТЫ ====================

  /**
   * Отформатировать дату из ISO строки
   * @param {string} isoString - дата в ISO формате
   * @returns {string} отформатированная дата
   */
  formatDate(isoString) {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Получить отображаемое название статуса заказа
   * @param {string} status - код статуса
   * @returns {string} отображаемое название
   */
  getOrderStatusDisplay(status) {
    const statusMap = {
      'completed': 'Выполнен',
      'cancelled': 'Отменен',
      'pending': 'В ожидании',
      'processing': 'В обработке',
    };
    return statusMap[status] || status;
  }

  /**
   * Получить отображаемое название категории товара
   * @param {string} category - код категории
   * @returns {string} отображаемое название
   */
  getCategoryDisplay(category) {
    const categoryMap = {
      'clothing': 'Одежда',
      'merch': 'Мерч',
      'electronics': 'Электроника',
      'books': 'Книги',
      'accessories': 'Аксессуары',
      'other': 'Другое',
    };
    return categoryMap[category] || category;
  }
}

// Создаем и экспортируем экземпляр класса
const loymaxApi = new LoymaxApi();

export default loymaxApi;