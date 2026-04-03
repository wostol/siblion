import React from 'react'
import './Footer.css'
import logo from './lion.png'
import VK from './VK.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      {/* Логотип по центру - перекрывает границу */}
      <div className="footer-logo-wrapper">
        <div className="footer-logo-container">
          <img src={logo} alt="Сибирские Львы" className="footer-logo" />
        </div>
      </div>

      <div className="footer-container">
        {/* Навигация и контакты */}
        <div className="footer-nav-contacts">
          {/* Мероприятия */}
          <div className="footer-nav">
            <h3 className="footer-nav-title">МЕРОПРИЯТИЯ</h3>
            <ul className="footer-nav-list">
              <li>
                <a href="/events/ski-marathon" className="footer-nav-link">
                  Лыжный марафон
                </a>
              </li>
              <li>
                <a href="/events/basketball" className="footer-nav-link">
                  Баскетбол
                </a>
              </li>
              <li>
                <a href="/events/3x3" className="footer-nav-link">
                  3 x 3
                </a>
              </li>
            </ul>
          </div>

          {/* ??? (дополнительная секция) */}
          <div className="footer-nav">
            <h3 className="footer-nav-title">О нас</h3>
            <ul className="footer-nav-list">
              <li>
                <a href="/events/ski-marathon" className="footer-nav-link">
                  Как это работает
                </a>
              </li>
              <li>
                <a href="/events/basketball" className="footer-nav-link">
                  Команда
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-nav footer-nav-center">
          </div>
          {/* Личный кабинет */}
          <div className="footer-nav">
            <h3 className="footer-nav-title">ЛИЧНЫЙ КАБИНЕТ</h3>
            <ul className="footer-nav-list">
              <li>
                <a href="/profile/points" className="footer-nav-link">
                  Мои баллы
                </a>
              </li>
              <li>
                <a href="/profile/achievements" className="footer-nav-link">
                  Достижения
                </a>
              </li>
              <li>
                <a href="/profile/statistics" className="footer-nav-link">
                  Статистика
                </a>
              </li>
            </ul>
          </div>
          
          {/* Контакты */}
          <div className="footer-nav">
            <h3 className="footer-nav-title">КОНТАКТЫ</h3>
            <ul className="footer-nav-list">
              <li className="contact-item">
                <span className="contact-label-footer">Руководитель</span>
                <a href="tel:+7xxxxxx-xx-xx" className="contact-link-footer">
                  +7 (xxxx) xx-xx-xx
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-label-footer">Пресс-служба</span>
                <a href="tel:+7xxxxxx-xx-xx" className="contact-link-footer">
                  +7 (xxxx) xx-xx-xx
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="footer-social">
          <a
            href="https://vk.com/sib_lions"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="ВКонтакте"
          >
            <img src={VK} alt="VK" className="social_img" />
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