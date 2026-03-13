export async function oauthRedirect(){
  await _generateCodeVerifier();
  const codeChallenge = await _generateCodeChallenge();
  const state = _generateState();
  const redirectUri = window.location.origin;
  const authUrl = `https://oauth.tpu.ru/authorize?client_id=${import.meta.env.VITE_TPU_OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  window.location.href = authUrl;
}

/**
 * Генерирует Code Verifier для протокола PKCE и сохраняет его в sessionStorage
 * 
 * @returns {Promise<string>} Promise, который разрешается в сгенерированный Code Verifier
 * 
 * @description
 * Метод генерирует случайную строку длиной от 43 до 128 символов, состоящую из:
 * - Заглавных и строчных латинских букв
 * - Цифр
 * - Специальных символов: -, ., _, ~
 * 
 * Сгенерированный Code Verifier сохраняется в sessionStorage под ключом 'code_verifier'
 * и автоматически удаляется после использования.
 */
async function _generateCodeVerifier() {
    // Генерируем случайную длину в диапазоне 43-128
    const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;
    
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const byteLength = Math.ceil(length * Math.log2(64) / 8);
    
    const randomBytes = await _generateRandomBytes(byteLength);
    const array = new Uint8Array(randomBytes);
    
    let codeVerifier = '';
    for (let i = 0; i < length; i++) {
        // Используем только 6 бит из каждого байта
        const randomIndex = array[i % array.length] % allowedChars.length;
        codeVerifier += allowedChars[randomIndex];
    }
    
    // Сохраняем в sessionStorage
    sessionStorage.setItem('code_verifier', codeVerifier);

}

/**
 * Получает Code Verifier из sessionStorage
 * 
 * @returns {string|null} Сохраненный Code Verifier или null, если не найден
 */
function _getCodeVerifier() {
    return sessionStorage.getItem('code_verifier');
}

/**
 * Удаляет Code Verifier из sessionStorage
 */
function _clearCodeVerifier() {
    sessionStorage.removeItem('code_verifier');
}


/**
 * Генерирует code_challenge из code_verifier по алгоритму S256
 * @param {string} codeVerifier - Исходный код верификатора
 * @returns {Promise<string>} - Сгенерированный code_challenge
 */
async function _generateCodeChallenge() {
  let codeVerifier = _getCodeVerifier();
// Проверяем корректность входных данных
    if (typeof codeVerifier !== 'string') {
        throw new Error('codeVerifier должен быть строкой');
    }

    // Проверяем доступность крипто API
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Криптографическое API недоступно в текущем браузере');
    }

    try {
        // Шаг 1: Кодируем строку в UTF-8
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);

        // Шаг 2: Генерируем SHA-256 хеш
        const digest = await window.crypto.subtle.digest('SHA-256', data);

        // Шаг 3: Преобразуем в Base64
        const arrayBuffer = new Uint8Array(digest);
        let base64String = btoa(String.fromCharCode.apply(null, arrayBuffer));

        // Шаг 4: Преобразуем в Base64URL
        const base64Url = base64String
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        return base64Url;
    } catch (error) {
        throw new Error('Ошибка при генерации code_challenge: ' + error.message);
    }
}


/**
 * Генерирует случайные байты для Code Verifier
 * @param {number} length - Длина в байтах
 * @returns {Promise<Uint8Array>}
 */
async function _generateRandomBytes(length) {
    // Вариант 1: Использование crypto.subtle, если доступно
    if (crypto.subtle && crypto.subtle.randomBytes) {
        try {
            return new Uint8Array(await crypto.subtle.randomBytes(length));
        } catch (error) {
            console.warn('crypto.subtle.randomBytes не доступен, используем альтернативный метод');
        }
    }
    
    // Вариант 2: Использование window.crypto.getRandomValues
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return array;
    }
    
    // Вариант 3: Падение с ошибкой, если ничего не доступно
    throw new Error('Не удалось найти способ генерации случайных байтов');
}



// state генерируется для проверки ответа
function _generateState() {
  try {
  // Проверяем доступность crypto API
  const crypto = window.crypto || require('crypto');
  if (!crypto) {
    throw new Error("Crypto API недоступно");
  }

  const array = new Uint8Array(48);
  crypto.getRandomValues(array);

  const state = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Сохраняем в sessionStorage
  sessionStorage.setItem('oauth_state', state);
    return state;
  } catch (error) {
    console.error("Ошибка генерации OAuth state:", error);
    return null;
  }
}

export function oauthCodeHandler(query) {
  try {
    const searchParams = new URLSearchParams(query);
    const code = searchParams.get("code");
    const state = searchParams.get("state")
    const codeVerifier = _getCodeVerifier();

    if (code && state && codeVerifier) {
      if(state === _getState()){
        _clearState();
        _clearCodeVerifier();
        
        return {
          code: code,
          codeVerifier: codeVerifier,
        }
                
      }
      throw new Error ('Некорректное состояние авторизации');
    }
  } catch (err) {
    console.error("Ошибка OAuth state:", err);
    return null;
  }
}

function _getState() {
  // Получаем state из sessionStorage
  const state = sessionStorage.getItem('oauth_state');

  return state;
}

function _clearState() {
  // Получаем state из sessionStorage
  const state = sessionStorage.getItem('oauth_state');
  
  // Удаляем из sessionStorage после получения
  if (state) {
    sessionStorage.removeItem('oauth_state');
  }
  
}