import React, { useState, useRef, useEffect } from 'react'
import logo from './lionsib.svg'
import './Header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import heartIcon from './heart.png';
import lockIcon from './lock.png';
import profileIcon from './profile.png';
import profileIconActive  from './profile-activ.png';
import heartIconActive from './heart-hover.png';
import lockIconActive from './lock-hover.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const [buttonStates, setButtonStates] = useState({
    heart: { hover: false, focus: false },
    lock: { hover: false, focus: false },
    profile: { hover: false, focus: false }
  });

  // Загружаем количество товаров в корзине
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartItemsCount(totalItems);
    };

    updateCartCount();
    
    // Слушаем изменения в localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Также обновляем при фокусе окна
    window.addEventListener('focus', updateCartCount);
    
    // Периодически проверяем (на случай изменений в других вкладках)
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Функция для обновления состояния кнопки
  const updateButtonState = (button, updates) => {
    setButtonStates(prev => ({
      ...prev,
      [button]: { ...prev[button], ...updates }
    }));
  };

  const eventsLinkRef = useRef(null);
  const heartButtonRef = useRef(null);
  const lockButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const shopLinkRef = useRef(null);

  useEffect(() => {
    // Устанавливаем фокус на активной ссылке в зависимости от текущего пути
    const setFocusOnActiveLink = () => {
      let activeRef = null;
      
      if (location.pathname === '/' || 
          location.pathname === '/events/past' || 
          location.pathname === '/events/upcoming') {
        activeRef = eventsLinkRef;
      } else if (location.pathname === '/profile') {
        activeRef = profileButtonRef;
      } else if (location.pathname === '/favorites') {
        activeRef = heartButtonRef;
      } else if (location.pathname === '/cart') {
        activeRef = lockButtonRef;
      } else if (location.pathname === '/shop') {
        activeRef = shopLinkRef;
      }

      if (activeRef?.current) {
        setTimeout(() => {
          if (activeRef.current && typeof activeRef.current.focus === 'function') {
            activeRef.current.focus();
          }
        }, 50);
      }
    };

    setFocusOnActiveLink();
  }, [location.pathname]);

  // Функция для получения иконки
  const getIcon = (button) => {
    const state = buttonStates[button];
    const icons = {
      heart: { normal: heartIcon, active: heartIconActive },
      lock: { normal: lockIcon, active: lockIconActive },
      profile: { normal: profileIcon, active: profileIconActive }
    };

    // Определяем, активна ли кнопка (находимся на соответствующей странице)
    const isActive = () => {
      if (button === 'heart') return location.pathname === '/favorites';
      if (button === 'lock') return location.pathname === '/cart';
      if (button === 'profile') return location.pathname === '/profile';
      return false;
    };

    // Показываем активную иконку если:
    // 1. Мы на соответствующей странице
    // 2. Кнопка в фокусе
    // 3. Наведен курсор
    if (isActive() || state.focus) {
      return icons[button].active;
    }
    return icons[button].normal;
  };

  // Обработчик клавиатуры
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (typeof action === 'function') {
        action();
      }
    }
  };

  // Обработчик клика по сердечку
  const handleHeartClick = () => {
    navigate('/favorites');
  };

  // Обработчик клика по корзине
  const handleCartClick = () => {
    navigate('/cart');
  };

  // Обработчик клика по профилю
  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  // Обработчик клика по мероприятиям
  const handleEventsClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  // Обработчик клика по магазину
  const handleShopClick = (e) => {
    e.preventDefault();
    navigate('/shop');
  };

  // Функция для обновления бейджа в header
  const updateHeaderBadge = (count) => {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  };

  // Обновляем бейдж при изменении cartItemsCount
  useEffect(() => {
    updateHeaderBadge(cartItemsCount);
  }, [cartItemsCount]);

  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo'>
          <a href='/' className='logo-link'>
            <img src={logo} alt='Connections Logo' className='logo-image' />
          </a>
        </div>

        <nav className='main-nav'>
          <ul className='nav-list'>
            <li className='nav-item'>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                ref={eventsLinkRef}
                tabIndex={location.pathname === '/' ? 0 : -1}
                onClick={handleEventsClick}
                onKeyDown={(e) => handleKeyDown(e, () => navigate('/'))}
              >
                <span className="nav-text">Мероприятия</span>
              </Link>
            </li>
            
            {/* Магазин */}
            <li className='nav-item'>
              <Link 
                to="/shop" 
                className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}
                ref={shopLinkRef}
                tabIndex={location.pathname === '/shop' ? 0 : -1}
                onClick={handleShopClick}
                onKeyDown={(e) => handleKeyDown(e, () => navigate('/shop'))}
              >
                <span className="nav-text">Магазин</span>
              </Link>
            </li>
            
            <div className="header-actions">
              {/* Кнопка с сердечком */}
              <Link 
                to="/favorites" 
                className={`heart-icon-link ${location.pathname === '/favorites' ? 'active' : ''}`}
                style={{display: 'contents'}}
              >
                <button 
                  ref={heartButtonRef}
                  className={`blue-btn ${location.pathname === '/favorites' ? 'active' : ''}`}
                  aria-label="Избранное"
                  tabIndex={location.pathname === '/favorites' ? 0 : -1}
                  onClick={handleHeartClick}
                  onMouseEnter={() => updateButtonState('heart', { hover: true })}
                  onMouseLeave={() => updateButtonState('heart', { hover: false })}
                  onFocus={() => updateButtonState('heart', { focus: true })}
                  onBlur={() => updateButtonState('heart', { focus: false, hover: false })}
                  onKeyDown={(e) => handleKeyDown(e, handleHeartClick)}
                >
                  <span className="btn-icon-wrapper">
                    <img 
                      src={getIcon('heart')} 
                      alt="Избранное" 
                      className="btn-img" 
                    />
                  </span>
                </button>
              </Link>

              {/* Кнопка с корзиной */}
              <Link 
                to="/cart" 
                className={`lock-icon-link ${location.pathname === '/cart' ? 'active' : ''}`}
                style={{display: 'contents'}}
              >
                <button 
                  ref={lockButtonRef}
                  className={`blue-btn ${location.pathname === '/cart' ? 'active' : ''}`}
                  aria-label="Корзина"
                  tabIndex={location.pathname === '/cart' ? 0 : -1}
                  onClick={handleCartClick}
                  onMouseEnter={() => updateButtonState('lock', { hover: true })}
                  onMouseLeave={() => updateButtonState('lock', { hover: false })}
                  onFocus={() => updateButtonState('lock', { focus: true })}
                  onBlur={() => updateButtonState('lock', { focus: false, hover: false })}
                  onKeyDown={(e) => handleKeyDown(e, handleCartClick)}
                >
                  <span className="btn-icon-wrapper">
                    <img 
                      src={getIcon('lock')} 
                      alt="Корзина" 
                      className="btn-img" 
                    />
                  </span>
                  {/* Бейдж с количеством товаров */}
                  <span className="btn-badge cart-badge" style={{ 
                    display: cartItemsCount > 0 ? 'flex' : 'none'
                  }}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                </button>
              </Link>

              {/* Кнопка с профилем */}
              <Link 
                to="/profile" 
                className={`profile-icon-link ${location.pathname === '/profile' ? 'active' : ''}`}
                style={{display: 'contents'}}
              >
                <button 
                  ref={profileButtonRef}
                  className={`blue-btn ${location.pathname === '/profile' ? 'active' : ''}`}
                  aria-label="Профиль"
                  tabIndex={location.pathname === '/profile' ? 0 : -1}
                  onClick={handleProfileClick}
                  onMouseEnter={() => updateButtonState('profile', { hover: true })}
                  onMouseLeave={() => updateButtonState('profile', { hover: false })}
                  onFocus={() => updateButtonState('profile', { focus: true })}
                  onBlur={() => updateButtonState('profile', { focus: false, hover: false })}
                  onKeyDown={(e) => handleKeyDown(e, handleProfileClick)}
                >
                  <span className="btn-icon-wrapper">
                    <img 
                      src={getIcon('profile')} 
                      alt="Профиль" 
                      className="btn-img"
                    />
                  </span>
                  {/* <span className="btn-badge">3</span> */}
                </button>
              </Link>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header