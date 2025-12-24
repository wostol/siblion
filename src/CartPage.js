import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const loadCartFromStorage = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
      updateHeaderBadge(savedCart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

    loadCartFromStorage();
  }, []);
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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    setCartItems(items => {
      const newItems = items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      
      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Обновляем бейдж
      const totalItems = newItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      updateHeaderBadge(totalItems);
      
      return newItems;
    });
  };

  const removeItem = (id) => {
    setCartItems(items => {
      const newItems = items.filter(item => item.id !== id);
      // Сохраняем в localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Обновляем бейдж
      const totalItems = newItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      updateHeaderBadge(totalItems);
      
      return newItems;
    });
  };

  // const clearCart = () => {
  //   if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
  //     setCartItems([]);
  //     localStorage.setItem('cart', '[]');
  //     updateHeaderBadge(0);
  //     alert('Корзина очищена');
  //   }
  // };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'TOMA2024') {
      setDiscount(500);
      alert('Промокод применен! Скидка 500₽');
    } else if (promoCode.toUpperCase() === 'BONUS100') {
      setDiscount(100);
      alert('Промокод применен! Скидка 100₽');
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
    
    // Расчет баллов за заказ
    const totalPoints = cartItems.reduce((sum, item) => 
      sum + ((item.points || 0) * (item.quantity || 1)), 0);
    
    alert(`Заказ оформлен на сумму ${total}₽!\nВы получите ${totalPoints} баллов за покупку.`);
    
    // Очищаем корзину после оформления
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    updateHeaderBadge(0);
    setDiscount(0);
  };

  // Расчет итоговой суммы
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const total = Math.max(0, subtotal - discount);

  if (loading) {
    return (
      <div className="cart-page loading">
        <div className="spinner"></div>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

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
                    <img src={item.image} alt={item.name || item.title} />
                  ) : (
                    <div className="image-placeholder">
                      <span>🛒</span>
                    </div>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name || item.title}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-info">
                    <div className="cart-item-price">{item.price}₽</div>
                    {item.points && (
                      <div className="cart-item-points" style={{
                        color: '#28a745',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '4px'
                      }}>
                        +{item.points} баллов
                      </div>
                    )}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity || 1}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    {(item.price || 0) * (item.quantity || 1)}₽
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
              <span className="summary-label">Товары ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} шт.)</span>
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

            {/* Бонусные баллы за заказ */}
            <div className="cart-summary-item">
              <span className="summary-label">Баллы за заказ</span>
              <span className="summary-value" style={{color: '#28a745'}}>
                +{cartItems.reduce((sum, item) => sum + ((item.points || 0) * (item.quantity || 1)), 0)} баллов
              </span>
            </div>
            
            <div className="cart-summary-item">
              <span className="summary-label summary-total">К оплате</span>
              <span className="summary-value summary-total">{total}₽</span>
            </div>

            <div className="promo-section">
              <input
                type="text"
                className="promo-input"
                placeholder="Промокод (например: TOMA2024)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <button 
                className="apply-promo-btn"
                onClick={applyPromoCode}
              >
                Применить
              </button>
            </div>

            <button 
              className="checkout-btn"
              onClick={handleCheckout}
            >
              <span>💳</span>
              Перейти к оплате
            </button>

            <div className="cart-actions">
              <Link to="/shop" className="continue-shopping">
                ← Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;