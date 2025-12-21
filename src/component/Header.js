import React from 'react';
import logo from './logo22.png'; 
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/" className="logo-link">
            <img 
              src={logo} 
              alt="XY Connections Logo" 
              className="logo-image"
            />
          </a>
        </div>

          <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/events" className="nav-link">
                <span className="nav-text">Мероприятия</span>
                <div className="events-submenu">
                  <a href="/events/past" className="submenu-link">Прошедшие</a>
                  <a href="/events/upcoming" className="submenu-link">Будущие</a>
                </div>
              </a>
            </li>
            <li className="nav-item">
              <a href="/shop" className="nav-link">Магазин</a>
            </li>
            <div className="header-actions">
          {/* Кнопка с сердечком */}
          <button className="icon-btn heart-btn" aria-label="Избранное">
          </button>

          {/* Кнопка с замком */}
          <button className="icon-btn lock-btn" aria-label="Безопасность">
          </button>

          {/* Кнопка с профилем */}
          <button className="icon-btn profile-btn" aria-label="Профиль">
            <span className="profile-text"></span>
          </button>
        </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;