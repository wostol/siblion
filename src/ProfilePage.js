import React, { useState } from 'react';
import './ProfilePage.css';
// import Shirt from './shirt.png'
import cap from './cap.png'
import pen from './pen.png'
function ProfilePage() {
  const [activeTab, setActiveTab] = useState('achievements');
  // Пример данных заказов в соответствии с макетом
  const orders = [
    {
      id: 1,
      image: cap,
      product: 'Кружка',
      description: 'Керамическая кружка 350мл',
      price: '90 Б',
      status: 'В работе',
      time: '16:15',
      date: '12.12.2025'
    },
    {
      id: 2,
      image: cap,
      product: 'Кружка',
      description: 'Керамическая кружка 350мл',
      price: '90 Б',
      status: 'Доставлен',
      time: '16:15',
      date: '12.12.2025'
    },
    {
      id: 3,
      image: pen,
      product: 'Ручка',
      description: 'Ручка с логотипом университета',
      price: '40 Б',
      status: 'В работе',
      time: '14:30',
      date: '10.12.2025'
    }
  ];
  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Личный кабинет</h1>
      </header>
      
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Уведомления
        </button>
        
        <button
          className={`tab-btn ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          Мои баллы
        </button>
        <button
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Достижения
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Мои заказы
        </button>
      </div>
      
      <div className="student-card">
        <div className="student-info">
          <h2 className="student-name">Шишкин Иван Иванович</h2>
          <p className="student-details">Учащийся | 8К32 | ИШИТР</p>
        </div>
      </div>
      
      {/* Содержимое вкладок */}
      <div className="tab-content">
        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <div className="no-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#6c757d">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <h3>Новых уведомлений нет</h3>
              <p>Здесь будут появляться важные уведомления и обновления</p>
            </div>
          </div>
        )}

        

       {activeTab === 'points' && (
  <div className="points-tab">
    <div className="points-card">
      <div className="points-header">
        <div className="points-title-section">
          <h3>Мои баллы</h3>
          <div className="user-level">Уровень 2</div>
        </div>
        <div className="points-total">125 баллов</div>
      </div>
      
      <div className="points-details">
        <div className="points-item">
          <span className="points-label">Активность на мероприятиях</span>
          <span className="points-value">+85 баллов</span>
        </div>
        <div className="points-item">
          <span className="points-label">Бонус</span>
          <span className="points-value">+40 баллов</span>
        </div>
        <div className="points-item total">
          <span className="points-label">Итого</span>
          <span className="points-value">125 баллов</span>
        </div>
      </div>
      
      <div className="points-progress">
        <div className="level-info">
          <span className="level-current">Уровень 2</span>
          <span className="level-next">Уровень 3</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '50%' }}></div>
        </div>
        <p className="progress-text">До следующего уровня: 75 баллов</p>
      </div>
    </div>
  </div>
)}
        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <div className="achievements-grid">
              <div className="achievement-card">
                <div className="achievement-icon">🏅</div>
                <h4>Активный участник</h4>
                <p>Посетил 10+ мероприятий</p>
              </div>
              
              <div className="achievement-card">
                <div className="achievement-icon">🎓</div>
                <h4>Отличник</h4>
                <p>Высокая успеваемость</p>
              </div>
              
              <div className="achievement-card">
                <div className="achievement-icon">🌟</div>
                <h4>Звезда месяца</h4>
                <p>Лучший студент ноября</p>
              </div>
              
              <div className="achievement-card locked">
                <div className="achievement-icon">🔒</div>
                <h4>Лидер курса</h4>
                <p>Стань лучшим на потоке</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="orders-tab">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-left">
                  <div className="order-image">
                    <img src={order.image} alt={order.product} />
                  </div>
                  <div className="order-info">
                    <h3 className="product-name">{order.product}</h3>
                    <p className="product-description">{order.description}</p>
                    <div className="product-price-profile">{order.price}</div>
                  </div>
                </div>
                
                <div className="order-right">
                  <div className="order-status">
                    <span className={`status-badge ${order.status === 'Доставлен' ? 'status-delivered' : 'status-work'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-datetime">
                    <div className="datetime-item">
                      <span className="datetime-label">Время:</span>
                      <span className="datetime-value">{order.time}</span>
                    </div>
                    <div className="datetime-item">
                      <span className="datetime-label">Дата:</span>
                      <span className="datetime-value">{order.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;