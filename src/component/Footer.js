import React from 'react'
import './Footer.css'
import logo from './lion.png'
import VK from './VK.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Основной контент в строку */}
        <div className="footer-content">
          {/* Логотип (слева) */}
          <div className="footer-logo-container">
            <img src={logo} alt="XY Connections Logo" className="footer-logo" />
          </div>

          {/* Контейнер для меню и контактов */}
          <div className="nav-contacts-container">
            <div className="footer-nav-container">
              <div className="footer-nav-links">
                <a href="/" className="footer-nav-link">Мероприятия</a>
                <a href="/profile" className="footer-nav-link">Личный кабинет</a>
                <a href="/shop" className="footer-nav-link">Магазин</a>
              </div>
              <div className="contacts-wrapper">
              <span className="contacts-header">Контакты</span>
              <div className="footer-contacts-container">
                <div className="contact-column">
                  <p className="contact-item">
                    <span className="label">Руководитель:</span>
                    <a href="tel:+71234567890" className="contact-link-footer">+7 (123) 456-78-90</a>
                  </p>
                  <p className="contact-item">
                    <span className="label">Пресс-служба:</span>
                    <a href="tel:+79876543210" className="contact-link-footer">+7 (987) 654-32-10</a>
                  </p>
                </div>
              </div>
            </div>
            </div>

            {/* Контакты под меню */}
            
          </div>
        </div>

        {/* Соцсеть (отдельно под основной строкой) */}
        <div className="footer-social">
          <a href="https://vk.com/sib_lions" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="ВКонтакте" >
            <img 
              src={VK}
              alt="VK" 
              className="social_img" 
            />
          </a>
        </div>

        {/* Нижняя часть с копирайтом */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Национальный исследовательский Томский политехнический университет
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer