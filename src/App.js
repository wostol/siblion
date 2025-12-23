import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
 import EventsPage from './EventsPage'
 import EventDetail from './EventDetail'
 import ProfilePage from './ProfilePage';
 import FavoritesPage from './FavoritesPage'; // Создайте этот компонент
import CartPage from './CartPage'; // Создайте этот компонент
 import BackgroundLogo from './BackgroundLogo';
 import ShopPage from './ShopPage';
function App() {

  return (
    <Router>
      <div className="App">
        <BackgroundLogo /> {/* Добавляем компонент фона */}
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<EventsPage />} />

            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/shop" element={<ShopPage />} /> {/* Добавьте этот маршрут */}
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;