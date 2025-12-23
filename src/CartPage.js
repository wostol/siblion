import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Футболка с логотипом ТОМА",
      description: "Хлопковая футболка премиум качества",
      price: 1499,
      quantity: 1,
      image: null
    },
    {
      id: 2,
      title: "Стикерпак",
      description: "Набор стикеров для ноутбука",
      price: 399,
      quantity: 2,
      image: null
    },
    {
      id: 3,
      title: "Кружка ТОМА",
      description: "Керамическая кружка с логотипом",
      price: 899,
      quantity: 1,
      image: null
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Расчет итоговой суммы
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode === 'TOMA2024') {
      setDiscount(500);
      alert('Промокод применен! Скидка 500₽');
    } else if (promoCode) {
      alert('Промокод недействителен');
    }
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }
    alert(`Заказ оформлен на сумму ${total}₽`);
    // Здесь будет логика оформления заказа
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">Корзина</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#6c757d">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <h3>Корзина пуста</h3>
          <p>Добавьте товары из магазина, чтобы они появились здесь</p>
          <Link to="/shop" className="continue-shopping">
            Перейти в магазин
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <h2>Товары ({cartItems.length})</h2>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <span>🛒</span>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-price">{item.price}₽</div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <span>🗑️</span>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Итого</h2>
            
            <div className="cart-summary-item">
              <span className="summary-label">Товары ({cartItems.length})</span>
              <span className="summary-value">{subtotal}₽</span>
            </div>
            
            <div className="cart-summary-item">
              <span className="summary-label">Доставка</span>
              <span className="summary-value">Бесплатно</span>
            </div>
            
            {discount > 0 && (
              <div className="cart-summary-item">
                <span className="summary-label">Скидка</span>
                <span className="summary-value" style={{color: '#28a745'}}>
                  -{discount}₽
                </span>
              </div>
            )}
            
            <div className="cart-summary-item">
              <span className="summary-label summary-total">К оплате</span>
              <span className="summary-value summary-total">{total}₽</span>
            </div>

            <div className="promo-section">
              <input
                type="text"
                className="promo-input"
                placeholder="Промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <button 
                className="apply-promo-btn"
                onClick={applyPromoCode}
              >
                Применить промокод
              </button>
            </div>

            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              <span>💳</span>
              Перейти к оплате
            </button>

            <Link to="/shop" className="continue-shopping">
              ← Продолжить покупки
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;