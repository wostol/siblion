import React, { useState, useRef, useEffect } from 'react'
import logo from './logo22.png'
import './Header.css'
import heartIcon from './heart.png';
import lockIcon from './lock.png';
import profileIcon from './profile.png';
import profileIconActive  from './profile-activ.png';
import heartIconActive from './heart-hover.png'; // создайте этот файл
import lockIconActive from './lock-hover.png'; // создайте этот файл
const Header = () => {
  const [buttonStates, setButtonStates] = useState({
    heart: { active: false, hover: false, focus: false },
    lock: { active: false, hover: false, focus: false },
    profile: { active: false, hover: false, focus: false }
  });

  // Функция для обновления состояния кнопки
  const updateButtonState = (button, updates) => {
    setButtonStates(prev => ({
      ...prev,
      [button]: { ...prev[button], ...updates }
    }));
  };
  const eventsLinkRef = useRef(null);
  const eventsSubmenuRef = useRef(null);

  useEffect(() => {
    if (eventsLinkRef.current) {
      setTimeout(() => {
        eventsLinkRef.current.focus();
      }, 100);
    }
  }, []);
  // Функция для получения иконки
  const getIcon = (button) => {
    const state = buttonStates[button];
    const icons = {
      heart: { normal: heartIcon, active: heartIconActive },
      lock: { normal: lockIcon, active: lockIconActive },
      profile: { normal: profileIcon, active: profileIconActive }
    };

 

    // Если наведен курсор или есть фокус - показываем активную иконку
    if (state.focus) {
      return icons[button].active;
    }
    // Иначе - обычную иконку
    return icons[button].normal;
  };
  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo'>
          <a href='/' className='logo-link'>
            <img src={logo} alt='XY Connections Logo' className='logo-image' />
          </a>
        </div>

        <nav className='main-nav'>
          <ul className='nav-list'>
            <li className='nav-item'>
              <a href='/' className='nav-link main' ref={eventsLinkRef}>
                <span className='nav-text'>Мероприятия</span>
              </a>
            </li>
            <li className='nav-item'>
              <a href='#' className='nav-link'>
                Магазин
              </a>
            </li>
            <div className="header-actions">
              {/* Кнопка с сердечком */}
              <button 
                className={`blue-btn ${buttonStates.heart.active ? 'active' : ''}`}
                aria-label="Избранное"
                onClick={() => updateButtonState('heart', { active: !buttonStates.heart.active })}
                onMouseEnter={() => updateButtonState('heart', { hover: true })}
                onMouseLeave={() => updateButtonState('heart', { hover: false })}
                onFocus={() => updateButtonState('heart', { focus: true })}
                onBlur={() => updateButtonState('heart', { focus: false, hover: false })}
              >
                <span className="btn-icon-wrapper">
                  <img 
                    src={getIcon('heart')} 
                    alt="Избранное" 
                    className="btn-img" 
                  />
                </span>
              </button>

              {/* Кнопка с замком */}
              <button 
                className={`blue-btn ${buttonStates.lock.active ? 'active' : ''}`}
                aria-label="Безопасность"
                onClick={() => updateButtonState('lock', { active: !buttonStates.lock.active })}
                onMouseEnter={() => updateButtonState('lock', { hover: true })}
                onMouseLeave={() => updateButtonState('lock', { hover: false })}
                onFocus={() => updateButtonState('lock', { focus: true })}
                onBlur={() => updateButtonState('lock', { focus: false, hover: false })}
              >
                <span className="btn-icon-wrapper">
                  <img 
                    src={getIcon('lock')} 
                    alt="Безопасность" 
                    className="btn-img" 
                  />
                </span>
              </button>

              {/* Кнопка с профилем */}
              <button 
                className={`blue-btn ${buttonStates.profile.active ? 'active' : ''}`}
                aria-label="Профиль"
                onClick={() => updateButtonState('profile', { active: !buttonStates.profile.active })}
                onMouseEnter={() => updateButtonState('profile', { hover: true })}
                onMouseLeave={() => updateButtonState('profile', { hover: false })}
                onFocus={() => updateButtonState('profile', { focus: true })}
                onBlur={() => updateButtonState('profile', { focus: false, hover: false })}
              >
                <span className="btn-icon-wrapper">
                  <img 
                    src={getIcon('profile')} 
                    alt="Профиль" 
                    className="btn-img"
                  />
                </span>
                <span className="btn-badge">3</span>
              </button>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
